# What’s New changelog

Static release notes shipped with the app (`changelog.json`). Served by `GET /api/whats-new`.

## Source of truth: `package.json` version (not Git tags)

Woodpecker builds Docker images from `V*` tags **after** you bump `package.json`. Changelog entries after the hand-authored `1.0.0` are generated from commits between package.json version introductions (subjects + body bullet lines).

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
- Rebuilds each version `> 1.0.0` from commits since the previous package.json version introduction  
- If the working-tree `package.json` version is not committed yet, includes commits through `HEAD`  
- Prefer `- ` bullets in the commit body (squash commits); otherwise uses the subject line  
- After generate, curate titles/bullets in `changelog.json` as needed  

The running app reads `package.json` `version` and this JSON. Users see entries with `since < version <= current` based on `Users.LastSeenAppVersion`.
