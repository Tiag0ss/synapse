import JSZip from 'jszip';
import { pool, RowDataPacket } from '../config/database';
import { readVaultMedia } from './vaultMedia';
import {
  buildNoteTree,
  safeZipEntryName,
  type NoteResolveEntry,
  type NoteTreeNode,
} from './notePaths';
import { relativeFrom, rewriteStaticWikilinks } from './vaultStaticWikiHelpers';
import { markdownToSafeHtml } from './markdown';
import logger from '../utils/logger';

const MEDIA_URL_RE = /(!?)\[([^\]]*)\]\(\/api\/vaults\/(\d+)\/media\/(\d+)\)/g;
const MEDIA_SRC_RE = /(?:src|href)="(\/api\/vaults\/(\d+)\/media\/(\d+))"/g;

export type StaticWikiExportResult = {
  buffer: Buffer;
  noteCount: number;
  imageCount: number;
  fileName: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function noteHtmlPath(path: string, title: string): string {
  const raw = safeZipEntryName(String(path || `${title}.md`));
  const withoutExt = raw.replace(/\.(md|markdown)$/i, '');
  return `pages/${withoutExt}.html`;
}

const STATIC_CSS = `
:root {
  color-scheme: dark;
  --bg: #0a0e13;
  --panel: #121820;
  --surface: #161e28;
  --surface-2: #1c2633;
  --text: #e8eef4;
  --muted: #8b9aab;
  --border: #243041;
  --border-strong: #354a60;
  --accent: #3d9b8f;
  --accent-soft: #7ec8be;
  --accent-fg: #041512;
  --link: #7ec8be;
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
* { box-sizing: border-box; }
html, body { height: 100%; }
body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  line-height: 1.55;
}
a { color: var(--link); }
.layout {
  display: grid;
  grid-template-columns: minmax(14rem, 18rem) minmax(0, 1fr);
  min-height: 100vh;
}
@media (max-width: 820px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { border-right: none; border-bottom: 1px solid var(--border); max-height: 40vh; }
}
.sidebar {
  border-right: 1px solid var(--border);
  background: var(--panel);
  padding: 0.85rem 0.75rem 1.5rem;
  overflow: auto;
  position: sticky;
  top: 0;
  max-height: 100vh;
}
.sidebar .brand {
  display: block;
  padding: 0.35rem 0.55rem 0.75rem;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
  margin-bottom: 0.65rem;
}
.sidebar .brand:hover { color: var(--accent-soft); }
.nav-folder > summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.45rem;
  border-radius: 0.4rem;
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.02em;
}
.nav-folder > summary::-webkit-details-marker { display: none; }
.nav-folder > summary::before { content: "▾"; width: 0.75rem; font-size: 0.65rem; opacity: 0.8; }
.nav-folder:not([open]) > summary::before { content: "▸"; }
.nav-folder > summary:hover { background: var(--surface-2); color: var(--text); }
.nav-folder-body { padding-left: 0.55rem; }
.nav-note {
  display: block;
  padding: 0.35rem 0.55rem;
  margin: 0.1rem 0;
  border-radius: 0.4rem;
  color: var(--text);
  text-decoration: none;
  font-size: 0.82rem;
  line-height: 1.3;
}
.nav-note:hover { background: var(--surface-2); color: var(--accent-soft); }
.nav-note.is-active {
  background: color-mix(in srgb, var(--accent) 22%, transparent);
  color: var(--accent-soft);
  font-weight: 600;
}
.nav-empty { padding: 0.5rem; font-size: 0.8rem; color: var(--muted); }
.content {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.content-header {
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--panel) 92%, transparent);
  padding: 0.75rem 1.25rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  align-items: baseline;
}
.content-header .crumb { color: var(--muted); font-size: 0.8rem; }
.content-header h1 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 650;
  letter-spacing: -0.02em;
}
article.page {
  max-width: 52rem;
  margin: 0 auto;
  padding: 1.35rem 1.25rem 3rem;
  width: 100%;
}

/* —— Markdown (aligned with .synapse-md-preview) —— */
.synapse-md-preview {
  font-family: var(--font-serif);
  color: var(--text);
}
.synapse-md-preview h1,
.synapse-md-preview h2,
.synapse-md-preview h3,
.synapse-md-preview h4 {
  font-family: var(--font-sans);
  letter-spacing: -0.02em;
  line-height: 1.25;
}
.synapse-md-preview h1 { font-size: 1.85rem; font-weight: 700; margin: 0.4rem 0 0.85rem; }
.synapse-md-preview h2 { font-size: 1.4rem; font-weight: 600; margin: 1.1rem 0 0.65rem; }
.synapse-md-preview h3 { font-size: 1.15rem; font-weight: 600; margin: 1rem 0 0.5rem; }
.synapse-md-preview h4 { font-size: 1rem; font-weight: 600; margin: 0.85rem 0 0.4rem; }
.synapse-md-preview p { margin: 0.55rem 0; }
.synapse-md-preview ul { list-style: disc; padding-left: 1.35rem; margin: 0.55rem 0; }
.synapse-md-preview ol { list-style: decimal; padding-left: 1.35rem; margin: 0.55rem 0; }
.synapse-md-preview li { margin: 0.35rem 0; }
.synapse-md-preview ul.contains-task-list,
.synapse-md-preview ul:has(> li.task-list-item),
.synapse-md-preview ul:has(> li > input[type="checkbox"]),
.synapse-md-preview ul:has(> li > p > input[type="checkbox"]) {
  list-style: none !important;
  padding-left: 0.35rem;
}
.synapse-md-preview li.task-list-item,
.synapse-md-preview li:has(> input[type="checkbox"]),
.synapse-md-preview li:has(> p > input[type="checkbox"]) {
  list-style: none !important;
  font-family: var(--font-sans);
}
.synapse-md-preview li.task-list-item > p { display: inline; margin: 0; }
.synapse-md-preview input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 1.15rem;
  height: 1.15rem;
  margin: 0.1rem 0.45rem 0 0;
  border: 1.5px solid var(--border-strong);
  border-radius: 0.3rem;
  vertical-align: text-top;
  position: relative;
}
.synapse-md-preview input[type="checkbox"]:checked {
  background: color-mix(in srgb, #10b981 25%, transparent);
  border-color: color-mix(in srgb, #34d399 60%, transparent);
}
.synapse-md-preview input[type="checkbox"]:checked::after {
  content: "✓";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -54%);
  font-size: 0.7rem;
  font-weight: 700;
  color: #a7f3d0;
}
.synapse-md-preview blockquote {
  border-left: 3px solid var(--accent);
  padding: 0.15rem 0 0.15rem 0.9rem;
  color: var(--muted);
  margin: 0.85rem 0;
  font-style: italic;
}
.synapse-md-preview code {
  font-family: var(--font-mono);
  background: var(--surface-2);
  border-radius: 0.3rem;
  padding: 0.12rem 0.4rem;
  font-size: 0.82em;
}
.synapse-md-preview pre {
  font-family: var(--font-mono);
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 0.65rem;
  padding: 0.9rem 1rem;
  overflow: auto;
  margin: 0.85rem 0;
}
.synapse-md-preview pre code { background: transparent; padding: 0; }
.synapse-md-preview .synapse-code-toolbar,
.synapse-md-preview .synapse-copy-code,
.synapse-md-preview .synapse-note-peek,
.synapse-md-preview .synapse-ask-reply-toggle,
.synapse-md-preview .synapse-ask-form,
.synapse-md-preview .synapse-ask-actions,
.synapse-md-preview .synapse-decision-vote,
.synapse-md-preview button.synapse-note-goto { display: none !important; }
.synapse-md-preview .synapse-note-ref {
  display: inline;
  color: var(--accent-soft);
  font-family: var(--font-sans);
  font-weight: 550;
}
.synapse-md-preview a.synapse-wikilink,
.synapse-md-preview a:not([class]) {
  color: var(--accent-soft);
  text-decoration: underline;
  text-underline-offset: 2px;
  font-family: var(--font-sans);
}
.synapse-md-preview .synapse-tag {
  color: var(--accent);
  font-family: var(--font-sans);
  font-weight: 550;
}
.synapse-md-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 0.75rem 0;
  border: 1px solid var(--border);
}
.synapse-md-preview table { border-collapse: collapse; width: 100%; margin: 0.85rem 0; font-family: var(--font-sans); font-size: 0.9rem; }
.synapse-md-preview th, .synapse-md-preview td { border: 1px solid var(--border); padding: 0.4rem 0.6rem; }
.synapse-md-preview th { background: var(--surface); text-align: left; }
.synapse-md-preview hr { border: none; border-top: 1px solid var(--border); margin: 1.25rem 0; }
.synapse-md-preview .synapse-frontmatter {
  margin: 0 0 1.25rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: var(--panel);
  font-family: var(--font-sans);
}
.synapse-md-preview .synapse-fm-title {
  font-size: 0.7rem;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.55rem;
}
.synapse-md-preview .synapse-fm-row {
  display: grid;
  grid-template-columns: minmax(6.5rem, 8.5rem) 1fr;
  gap: 0.5rem 0.75rem;
  align-items: start;
  font-size: 0.875rem;
  margin: 0.45rem 0;
}
.synapse-md-preview .synapse-fm-key { color: var(--muted); font-weight: 550; }
.synapse-md-preview .synapse-fm-val {
  color: var(--text);
  word-break: break-word;
  min-width: 0;
}
.synapse-md-preview .synapse-fm-tag {
  display: inline-block;
  margin: 0.1rem 0.3rem 0.1rem 0;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 18%, transparent);
  color: var(--accent-soft);
  font-size: 0.75rem;
}
.synapse-md-preview .synapse-fm-scalar {
  font-family: var(--font-mono);
  font-size: 0.8em;
  background: var(--surface-2);
  border-radius: 0.25rem;
  padding: 0.05rem 0.35rem;
}
.synapse-md-preview .synapse-fm-list {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.synapse-md-preview .synapse-fm-related {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.synapse-md-preview .synapse-fm-related .synapse-fm-item {
  display: inline-flex;
  padding: 0.2rem 0.5rem;
}
.synapse-md-preview .synapse-fm-item {
  margin: 0;
  padding: 0.5rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 0.45rem;
  background: color-mix(in srgb, var(--surface-2) 70%, transparent);
}
.synapse-md-preview .synapse-fm-object {
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
}
.synapse-md-preview .synapse-fm-kv {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.15rem 0.4rem;
  font-size: 0.82rem;
  line-height: 1.35;
}
.synapse-md-preview .synapse-fm-k {
  flex: 0 0 auto;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.78em;
}
.synapse-md-preview .synapse-fm-k::after { content: ':'; }
.synapse-md-preview .synapse-fm-v {
  flex: 1 1 12rem;
  color: var(--text);
  min-width: 0;
  word-break: break-word;
}
.synapse-md-preview .synapse-fm-empty {
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.8em;
}
.synapse-md-preview .synapse-fm-json {
  margin: 0;
  padding: 0.45rem 0.55rem;
  font-size: 0.75rem;
  border-radius: 0.4rem;
  border: 1px solid var(--border);
  background: var(--surface);
  overflow: auto;
}
.synapse-md-preview .synapse-diagram,
.synapse-md-preview .synapse-board-export {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0.85rem 0;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: #fff;
}
.synapse-md-preview details.synapse-fold {
  margin: 0.85rem 0;
  border: 1px solid var(--border);
  border-radius: 0.65rem;
  background: var(--panel);
  padding: 0.15rem 0.75rem 0.55rem;
}
.synapse-md-preview details.synapse-fold > summary.synapse-fold-title {
  cursor: pointer;
  font-family: var(--font-sans);
  font-weight: 600;
  padding: 0.55rem 0;
  list-style: none;
}
.synapse-md-preview details.synapse-fold > summary.synapse-fold-title::-webkit-details-marker { display: none; }
.synapse-md-preview .synapse-board-embed,
.synapse-md-preview .synapse-board-frame {
  border: 1px dashed var(--border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  color: var(--muted);
  background: var(--panel);
  font-family: var(--font-sans);
  margin: 0.85rem 0;
}
.board-stub {
  border: 1px dashed var(--border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  color: var(--muted);
  background: var(--panel);
  font-family: var(--font-sans);
  margin: 0.85rem 0;
}
.wiki-index { list-style: none; padding: 0; margin: 0.75rem 0 0; font-family: var(--font-sans); }
.wiki-index li { border-bottom: 1px solid var(--border); }
.wiki-index a {
  display: block;
  padding: 0.65rem 0.15rem;
  text-decoration: none;
  color: var(--text);
}
.wiki-index a:hover { color: var(--link); }
.wiki-index .path { display: block; font-size: 0.75rem; color: var(--muted); margin-top: 0.15rem; }
.muted { color: var(--muted); }
`.trim();

function renderNavTree(
  nodes: NoteTreeNode[],
  htmlPathById: Map<number, string>,
  pagePath: string,
  activeId: number | null,
  depth = 0
): string {
  return nodes
    .map((node) => {
      if (node.type === 'folder') {
        const kids = renderNavTree(node.children, htmlPathById, pagePath, activeId, depth + 1);
        return `<details class="nav-folder" open>
<summary style="padding-left:${0.45 + depth * 0.55}rem">${escapeHtml(node.name)}</summary>
<div class="nav-folder-body">${kids}</div>
</details>`;
      }
      const hrefAbs = htmlPathById.get(node.id);
      if (!hrefAbs) return '';
      const href = relativeFrom(pagePath, hrefAbs);
      const active = activeId === node.id ? ' is-active' : '';
      return `<a class="nav-note${active}" style="padding-left:${0.55 + depth * 0.55}rem" href="${escapeHtml(href)}">${escapeHtml(node.name)}</a>`;
    })
    .join('\n');
}

function wrapPage(opts: {
  vaultName: string;
  title: string;
  bodyHtml: string;
  pagePath: string;
  navHtml: string;
  activeId: number | null;
}): string {
  const indexHref = relativeFrom(opts.pagePath, 'index.html');
  const cssHref = relativeFrom(opts.pagePath, 'assets/wiki.css');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(opts.title)} · ${escapeHtml(opts.vaultName)}</title>
<link rel="stylesheet" href="${escapeHtml(cssHref)}" />
</head>
<body>
<div class="layout">
  <aside class="sidebar">
    <a class="brand" href="${escapeHtml(indexHref)}">${escapeHtml(opts.vaultName)}</a>
    <nav aria-label="Notes">
${opts.navHtml || '<p class="nav-empty">No notes</p>'}
    </nav>
  </aside>
  <div class="content">
    <header class="content-header">
      <span class="crumb"><a href="${escapeHtml(indexHref)}">Index</a></span>
      <h1>${escapeHtml(opts.title)}</h1>
    </header>
    <article class="page synapse-md-preview">
${opts.bodyHtml}
    </article>
  </div>
</div>
</body>
</html>
`;
}

function decodeBasicEntities(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function polishStaticHtml(
  html: string,
  pagePath: string,
  htmlPathById: Map<number, string>,
  boardPngRelById: Map<number, string>
): string {
  let out = html;
  // Convert leftover interactive note refs into plain anchors when possible.
  out = out.replace(
    /<span class="([^"]*\bsynapse-note-ref\b[^"]*)"[^>]*data-note-id="(\d+)"[^>]*>[\s\S]*?<button[^>]*class="synapse-note-goto"[^>]*>([\s\S]*?)<\/button>[\s\S]*?<\/span>/g,
    (_full, _classes: string, idStr: string, labelHtml: string) => {
      const id = Number(idStr);
      const target = htmlPathById.get(id);
      if (!target) return `<span class="synapse-wikilink">${labelHtml}</span>`;
      const href = relativeFrom(pagePath, target);
      return `<a class="synapse-wikilink" href="${escapeHtml(href)}">${labelHtml}</a>`;
    }
  );
  // Frontmatter / preview links use href="#note-ID" — point at static pages.
  out = out.replace(
    /<a\b([^>]*\bclass="[^"]*\bsynapse-wikilink\b[^"]*"[^>]*)\bhref="#note-(\d+)"([^>]*)>/gi,
    (_full, before: string, idStr: string, after: string) => {
      const id = Number(idStr);
      const target = htmlPathById.get(id);
      if (!target) return `<a${before}href="#note-${idStr}"${after}>`;
      const href = relativeFrom(pagePath, target);
      return `<a${before}href="${escapeHtml(href)}"${after}>`;
    }
  );
  out = out.replace(
    /<a\b([^>]*)\bhref="#note-(\d+)"([^>]*\bclass="[^"]*\bsynapse-wikilink\b[^"]*"[^>]*)>/gi,
    (_full, before: string, idStr: string, after: string) => {
      const id = Number(idStr);
      const target = htmlPathById.get(id);
      if (!target) return `<a${before}href="#note-${idStr}"${after}>`;
      const href = relativeFrom(pagePath, target);
      return `<a${before}href="${escapeHtml(href)}"${after}>`;
    }
  );
  // Board embeds → PNG when available.
  out = out.replace(
    /<div class="synapse-board-embed"[^>]*data-note-id="(\d+)"[^>]*>[\s\S]*?<\/div>/g,
    (_full, idStr: string) => {
      const id = Number(idStr);
      const pngRel = boardPngRelById.get(id);
      const target = htmlPathById.get(id);
      if (pngRel) {
        const src = relativeFrom(pagePath, pngRel);
        const pageHref = target ? relativeFrom(pagePath, target) : null;
        const caption = pageHref
          ? `<p class="muted"><a href="${escapeHtml(pageHref)}">Open whiteboard page</a></p>`
          : '';
        return `<figure><img class="synapse-board-export" src="${escapeHtml(src)}" alt="Whiteboard" />${caption}</figure>`;
      }
      if (!target) {
        return `<div class="board-stub">Whiteboard (could not render image).</div>`;
      }
      const href = relativeFrom(pagePath, target);
      return `<div class="board-stub">Whiteboard — <a href="${escapeHtml(href)}">open page</a>.</div>`;
    }
  );
  return out;
}

async function replaceMermaidWithImages(
  html: string,
  pagePath: string,
  zip: JSZip,
  counter: { n: number }
): Promise<string> {
  const { renderMermaidPngForDocx } = await import('./mermaidDocxRender');
  const re =
    /<pre class="synapse-mermaid-source">[\s\S]*?<code[^>]*>([\s\S]*?)<\/code>[\s\S]*?<\/pre>/gi;
  const matches = [...html.matchAll(re)];
  if (!matches.length) return html;

  let out = html;
  for (const match of matches) {
    const full = match[0];
    const source = decodeBasicEntities(match[1] || '').trim();
    if (!source) continue;
    const rendered = await renderMermaidPngForDocx(source);
    if (!rendered) {
      out = out.replace(
        full,
        `<div class="board-stub">Mermaid diagram (could not render).<pre>${escapeHtml(source)}</pre></div>`
      );
      continue;
    }
    counter.n += 1;
    const rel = `media/diagram-${counter.n}.png`;
    zip.file(rel, rendered.png);
    const src = relativeFrom(pagePath, rel);
    out = out.replace(
      full,
      `<img class="synapse-diagram" src="${escapeHtml(src)}" alt="Diagram" />`
    );
  }
  return out;
}

/**
 * Export vault notes as a static HTML wiki ZIP (sidebar + index + pages + media).
 */
export async function exportVaultStaticWiki(
  vaultId: number,
  vaultName: string
): Promise<StaticWikiExportResult> {
  const [notes] = await pool.execute<RowDataPacket[]>(
    `SELECT Id, Path, Title, BodyMarkdown, Kind, BoardJson
     FROM Notes
     WHERE VaultId = ? AND DeletedAt IS NULL
     ORDER BY Path ASC`,
    [vaultId]
  );

  const [mediaRows] = await pool.execute<RowDataPacket[]>(
    `SELECT Id, OriginalName, MimeType FROM VaultMedia WHERE VaultId = ? ORDER BY Id ASC`,
    [vaultId]
  );

  const mediaRelById = new Map<number, string>();
  for (const m of mediaRows) {
    const id = Number(m.Id);
    const original = m.OriginalName ? String(m.OriginalName) : `file-${id}`;
    const base = safeZipEntryName(original).replace(/\s+/g, '_');
    const leaf = base.includes('/') ? base.split('/').pop()! : base;
    mediaRelById.set(id, `media/${id}-${leaf}`);
  }

  const noteIndex: NoteResolveEntry[] = notes.map((n) => ({
    id: Number(n.Id),
    title: String(n.Title || ''),
    path: String(n.Path || ''),
    kind: String(n.Kind || 'note'),
  }));

  const htmlPathById = new Map<number, string>();
  for (const n of notes) {
    htmlPathById.set(Number(n.Id), noteHtmlPath(String(n.Path || ''), String(n.Title || '')));
  }

  const tree = buildNoteTree(
    notes.map((n) => ({
      Id: Number(n.Id),
      Title: String(n.Title || ''),
      Path: String(n.Path || ''),
      Kind: String(n.Kind || 'note'),
    }))
  );

  const zip = new JSZip();
  zip.file('assets/wiki.css', STATIC_CSS);

  let imageCount = 0;
  for (const [mediaId, relPath] of mediaRelById) {
    const file = await readVaultMedia(vaultId, mediaId);
    if (!file) continue;
    zip.file(relPath, file.buffer);
    imageCount += 1;
  }

  const { renderWhiteboardPng } = await import('./whiteboardPngRender');
  const boardPngRelById = new Map<number, string>();
  for (const note of notes) {
    if (String(note.Kind || 'note') !== 'whiteboard') continue;
    const id = Number(note.Id);
    const png = await renderWhiteboardPng(
      note.BoardJson != null ? String(note.BoardJson) : null
    );
    if (!png) continue;
    const rel = `media/board-${id}.png`;
    zip.file(rel, png);
    boardPngRelById.set(id, rel);
    imageCount += 1;
  }

  const rewriteMediaInMarkdown = (body: string) =>
    body.replace(MEDIA_URL_RE, (_full, bang: string, alt: string, vId: string, mId: string) => {
      if (Number(vId) !== vaultId) {
        return `${bang}[${alt}](/api/vaults/${vId}/media/${mId})`;
      }
      const rel = mediaRelById.get(Number(mId));
      if (!rel) return `${bang}[${alt}](/api/vaults/${vId}/media/${mId})`;
      return `${bang}[${alt}](${rel})`;
    });

  const rewriteMediaInHtml = (html: string, pagePath: string) => {
    let out = html.replace(MEDIA_SRC_RE, (_full, _url: string, vId: string, mId: string) => {
      if (Number(vId) !== vaultId) return _full;
      const rel = mediaRelById.get(Number(mId));
      if (!rel) return _full;
      const href = relativeFrom(pagePath, rel);
      return _full.replace(`/api/vaults/${vId}/media/${mId}`, href);
    });
    out = out.replace(/(src|href)="(media\/[^"]+)"/g, (_m, attr: string, rel: string) => {
      return `${attr}="${relativeFrom(pagePath, rel)}"`;
    });
    return out;
  };

  const diagramCounter = { n: 0 };

  for (const note of notes) {
    const id = Number(note.Id);
    const title = String(note.Title || 'Untitled');
    const pagePath = htmlPathById.get(id)!;
    const kind = String(note.Kind || 'note') === 'whiteboard' ? 'whiteboard' : 'note';
    const navHtml = renderNavTree(tree, htmlPathById, pagePath, id);

    let bodyHtml: string;
    if (kind === 'whiteboard') {
      const pngRel = boardPngRelById.get(id);
      if (pngRel) {
        const src = relativeFrom(pagePath, pngRel);
        bodyHtml = `<h1>${escapeHtml(title)}</h1>\n<img class="synapse-board-export" src="${escapeHtml(src)}" alt="${escapeHtml(title)}" />`;
      } else {
        bodyHtml = `<h1>${escapeHtml(title)}</h1><div class="board-stub">Whiteboard (could not render image for static export).</div>`;
      }
    } else {
      let md = rewriteMediaInMarkdown(String(note.BodyMarkdown || ''));
      md = rewriteStaticWikilinks(md, noteIndex, htmlPathById, pagePath);
      let html = markdownToSafeHtml(md, noteIndex, [], id, { wikilinks: false });
      html = rewriteMediaInHtml(html, pagePath);
      html = polishStaticHtml(html, pagePath, htmlPathById, boardPngRelById);
      const beforeDiagrams = diagramCounter.n;
      html = await replaceMermaidWithImages(html, pagePath, zip, diagramCounter);
      imageCount += diagramCounter.n - beforeDiagrams;
      bodyHtml = `<h1>${escapeHtml(title)}</h1>\n${html}`;
    }

    zip.file(
      pagePath,
      wrapPage({ vaultName, title, bodyHtml, pagePath, navHtml, activeId: id })
    );
  }

  const indexPath = 'index.html';
  const indexNav = renderNavTree(tree, htmlPathById, indexPath, null);
  const indexItems = notes
    .map((n) => {
      const id = Number(n.Id);
      const title = String(n.Title || 'Untitled');
      const path = String(n.Path || '');
      const href = htmlPathById.get(id)!;
      return `<li><a href="${escapeHtml(href)}">${escapeHtml(title)}<span class="path">${escapeHtml(path)}</span></a></li>`;
    })
    .join('\n');

  const indexBody = `<h1>${escapeHtml(vaultName)}</h1>
<p class="muted">Static wiki export · ${notes.length} note(s)</p>
<ul class="wiki-index">
${indexItems}
</ul>`;

  zip.file(
    indexPath,
    wrapPage({
      vaultName,
      title: 'Index',
      bodyHtml: indexBody,
      pagePath: indexPath,
      navHtml: indexNav,
      activeId: null,
    })
  );

  const buffer = Buffer.from(await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' }));
  const slug = safeZipEntryName(vaultName || `vault-${vaultId}`)
    .replace(/\s+/g, '-')
    .slice(0, 80);

  logger.info('Vault static wiki export ready', {
    vaultId,
    notes: notes.length,
    images: imageCount,
    bytes: buffer.length,
  });

  return {
    buffer,
    noteCount: notes.length,
    imageCount,
    fileName: `${slug || `vault-${vaultId}`}-wiki.zip`,
  };
}
