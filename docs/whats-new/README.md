# What’s New changelog

Static release notes shipped with the app (`changelog.json`). Served by `GET /api/whats-new`.

## Source of truth: Git `V*` tags (+ package.json for the next release)

Woodpecker builds Docker images from `V*` tags. Changelog entries after the hand-authored `1.0.0` are generated from commit subjects between tags.

Release sequence:

1. Bump `version` in root `package.json` to the version you are about to ship  
2. Refresh this changelog (`pnpm whats-new:generate`), then curate titles/bullets  
3. Commit `package.json` + `docs/whats-new/changelog.json` together  
4. Create the `V*` tag so Woodpecker builds  

## Commands

```bash
pnpm whats-new:generate
# optional: keep hand-curated bullets for older versions
pnpm whats-new:generate -- --keep-curated
```

Behaviour:

- Does **not** overwrite the hand-authored `1.0.0` entry  
- Rebuilds each tagged version `> 1.0.0` from `previousTag..thisTag` commit subjects  
- If `package.json` version is **newer** than the latest `V*` tag, builds that entry from `latestTag..HEAD` (unreleased work for the next tag)  
- Fetches tags from `origin` when possible (`git fetch --tags`)  
- After generate, curate titles/bullets in `changelog.json` as needed  

The running app reads `package.json` `version` and this JSON. Users see entries with `since < version <= current` based on `Users.LastSeenAppVersion`.
