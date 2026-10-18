#!/usr/bin/env node
/**
 * Build docs/whats-new/changelog.json from Git V* tags.
 *
 * Source of truth for released versions: annotated/lightweight tags `V*`
 * (Woodpecker builds on those). Hand-authored `1.0.0` is never overwritten.
 *
 * For the **current** package.json version:
 *   - if it matches the latest tag → that tag’s commit range
 *   - if it is newer than the latest tag → commits from latest tag → HEAD
 *     (prepare the next release before tagging)
 *
 * Typical flow for a new release:
 *   1. Bump "version" in package.json (e.g. 1.0.1 → 1.0.2)
 *   2. pnpm whats-new:generate
 *   3. Curate title/bullets in docs/whats-new/changelog.json
 *   4. Commit package.json + changelog
 *   5. Create tag V1.0.2 → Woodpecker builds
 *
 * Usage: node scripts/generate-whats-new-changelog.mjs [--keep-curated]
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CHANGELOG_PATH = path.join(ROOT, 'docs/whats-new/changelog.json');
const PACKAGE_PATH = path.join(ROOT, 'package.json');
const MAX_SUBJECTS = 100;
const KEEP_CURATED = process.argv.includes('--keep-curated');
const BASELINE = '1.0.0';

function run(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function parseSemverParts(version) {
  const cleaned = String(version || '').replace(/^v/i, '').split('-')[0];
  const parts = cleaned.split('.').map((n) => parseInt(n, 10) || 0);
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

function compareSemver(a, b) {
  const pa = parseSemverParts(a);
  const pb = parseSemverParts(b);
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

function normalizeVersion(raw) {
  return String(raw || '').replace(/^v/i, '').trim();
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function loadChangelog() {
  if (!fs.existsSync(CHANGELOG_PATH)) {
    return { versions: [] };
  }
  return JSON.parse(fs.readFileSync(CHANGELOG_PATH, 'utf8'));
}

/**
 * Released versions from local V* tags (fetch remotes first if needed).
 * Sorted ascending by semver.
 */
function collectTagVersions() {
  // Prefer tags already present; try a quiet fetch when possible.
  run('git fetch --tags --quiet origin 2>/dev/null');

  const raw = run("git tag -l 'V*'");
  if (!raw) return [];

  const byVersion = new Map();
  for (const tag of raw.split('\n')) {
    const version = normalizeVersion(tag);
    if (!version) continue;
    const hash = run(`git rev-list -n 1 ${tag}`);
    if (!hash) continue;
    const date =
      run(`git log -1 --format=%cs ${tag}`) ||
      run(`git for-each-ref --format='%(creatordate:short)' refs/tags/${tag}`) ||
      todayIsoDate();
    const prev = byVersion.get(version);
    if (!prev || compareSemver(version, prev.version) === 0) {
      byVersion.set(version, { version, tag, hash, date });
    }
  }

  return [...byVersion.values()].sort((a, b) => compareSemver(a.version, b.version));
}

/**
 * Commit subjects after olderRef up to and including newerRef.
 * olderRef may be null (all history up to newerRef).
 */
function subjectsBetween(olderRef, newerRef) {
  if (!newerRef) return [];
  const range = olderRef ? `${olderRef}..${newerRef}` : newerRef;
  const out = run(`git log --format=%s ${range}`);
  if (!out) return [];
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !/^Update version to /i.test(s))
    .filter((s) => !/^Bump version/i.test(s))
    .slice(0, MAX_SUBJECTS);
}

function summarizeItems(subjects) {
  if (subjects.length === 0) {
    return ['Maintenance and stability updates'];
  }
  return subjects.map((s) => s.replace(/\.$/, ''));
}

function defaultTitle(version, existingTitle, subjects) {
  if (existingTitle && existingTitle.trim() && !/^Version\s+/i.test(existingTitle)) {
    return existingTitle;
  }
  const first = (subjects && subjects[0]) || '';
  if (first.length > 0 && first.length <= 72) return first;
  if (first.length > 72) return `${first.slice(0, 69)}…`;
  return `Release ${version}`;
}

function main() {
  const existing = loadChangelog();
  const byVersion = new Map(
    (existing.versions || []).map((entry) => [normalizeVersion(entry.version), entry])
  );

  const baseline = byVersion.get(BASELINE);
  if (!baseline) {
    console.error(`Missing hand-authored ${BASELINE} entry in changelog.json — aborting.`);
    process.exit(1);
  }

  const currentVersion = normalizeVersion(
    JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf8')).version
  );

  const tags = collectTagVersions().filter((t) => compareSemver(t.version, BASELINE) >= 0);
  if (tags.length === 0) {
    console.error('No V* tags found at or after 1.0.0. Fetch tags (git fetch --tags) and retry.');
    process.exit(1);
  }

  const latestTag = tags[tags.length - 1];
  const head = run('git rev-parse HEAD') || null;

  /** Version points we will fill: each tag, plus working-tree current if ahead of latest tag. */
  const points = tags.map((t) => ({
    version: t.version,
    date: t.date,
    ref: t.hash,
    tag: t.tag,
    fromTag: true,
  }));

  if (compareSemver(currentVersion, latestTag.version) > 0) {
    points.push({
      version: currentVersion,
      date: todayIsoDate(),
      ref: head,
      tag: null,
      fromTag: false,
    });
  }

  let rebuilt = 0;
  let kept = 0;

  for (let i = 0; i < points.length; i += 1) {
    const point = points[i];
    if (compareSemver(point.version, BASELINE) <= 0) continue;
    if (compareSemver(point.version, currentVersion) > 0) continue;

    const existingEntry = byVersion.get(point.version);
    const isCurrent = point.version === currentVersion;
    if (
      KEEP_CURATED &&
      !isCurrent &&
      existingEntry &&
      Array.isArray(existingEntry.items) &&
      existingEntry.items.length > 0
    ) {
      if (!existingEntry.date && point.date) existingEntry.date = point.date;
      kept += 1;
      continue;
    }

    const older = points[i - 1];
    // Range: previous tag/point → this point (or HEAD for untagged current).
    const olderRef = older?.ref || older?.tag || null;
    // Prefer tag name as range end when available (matches release exactly).
    const newerRef = point.tag || point.ref;
    const subjects = subjectsBetween(olderRef, newerRef);

    byVersion.set(point.version, {
      version: point.version,
      date: point.date || existingEntry?.date || todayIsoDate(),
      title: defaultTitle(point.version, existingEntry?.title, subjects),
      items: summarizeItems(subjects),
    });
    rebuilt += 1;
  }

  for (const key of [...byVersion.keys()]) {
    if (key === BASELINE) continue;
    if (compareSemver(key, BASELINE) < 0 || compareSemver(key, currentVersion) > 0) {
      byVersion.delete(key);
    }
  }

  const versions = [...byVersion.values()]
    .filter((entry) => compareSemver(entry.version, BASELINE) >= 0)
    .filter((entry) => compareSemver(entry.version, currentVersion) <= 0)
    .sort((a, b) => compareSemver(a.version, b.version));

  const idx = versions.findIndex((v) => v.version === BASELINE);
  if (idx >= 0) versions[idx] = baseline;

  const payload = { versions };
  fs.mkdirSync(path.dirname(CHANGELOG_PATH), { recursive: true });
  fs.writeFileSync(CHANGELOG_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const current = versions.find((v) => v.version === currentVersion);
  console.log(
    `Wrote ${CHANGELOG_PATH} (${versions.length} versions; package.json=${currentVersion}; latest tag=${latestTag.tag})`
  );
  console.log(
    KEEP_CURATED
      ? `Rebuilt ${rebuilt} version(s), kept curated ${kept}`
      : `Rebuilt ${rebuilt} version(s) from V* tags (1.0.0 preserved; use --keep-curated to skip existing)`
  );
  if (current) {
    console.log(`Current ${currentVersion}: ${current.items.length} item(s)`);
  }
  if (compareSemver(currentVersion, latestTag.version) > 0) {
    console.log(
      `Note: ${currentVersion} is ahead of ${latestTag.tag} — items are commits ${latestTag.tag}..HEAD`
    );
  }
}

main();
