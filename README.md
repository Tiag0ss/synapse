[![Docker Hub](https://img.shields.io/docker/pulls/tiag0ss/synapse?label=Docker%20Pulls&logo=docker)](https://hub.docker.com/r/tiag0ss/synapse)
[![Docker Image](https://img.shields.io/badge/Docker%20Hub-tiag0ss%2Fsynapse-blue?logo=docker)](https://hub.docker.com/r/tiag0ss/synapse)
[![status-badge](https://cd.tiag0ss.dev/api/badges/4/status.svg)](https://cd.tiag0ss.dev/repos/4)

# Synapse

Markdown vaults companion to [Myelin](https://github.com/tiag0ss/myelin). Notes live in MySQL; creating notes never creates PM work — push project/task is always an explicit manual action.

This project is a work in progress — bugs may still be found; please report them on GitHub.

## Features

- 📔 **Markdown vaults** — Folder paths (`meta/risks`), note tree (folders first), vault switcher
- ✏️ **Editor** — Split/edit/preview, toolbar, paste/drop images + file attachments + lightbox; **autosave** + unsaved warnings; Ctrl/Cmd+S
- 🖼️ **Whiteboards** — Excalidraw boards as first-class vault items; maximize to full page; peek / public wiki / share viewers (pan, zoom, background; drawing chrome hidden)
- 🔎 **Search** — Filter by title/path/body; **Jump to note** palette (Ctrl/Cmd+O)
- 🔗 **Wikilinks & graph** — `[[links]]` (path + unique leaf), tags, backlinks, focused + full mindmap; board→note links show as `(board)` in References
- 📎 **Inline board embeds** — `![[Whiteboard title]]` embeds a read-only board mid-note (preview, peek, wiki, password share); plain `[[Whiteboard]]` stays a link
- 🕘 **Revisions** — History with side-by-side restore
- 📦 **ZIP import / export** — Nested folders ↔ note paths; images included
- 📋 **Templates** — Blank, meeting, risk, decision when creating notes
- 🗑️ **Trash** — Soft-delete notes with restore; leave shared vaults / delete owned vaults
- ✅ **Checkbox → PM tasks** — Manual create (single or bulk with progress); Synapse pulls PM closed/cancelled status
- 📤 **Share note** — Password-protected temporary links (`/s/:token`); **Send** copy/move to another vault (same Share modal)
- 👁️ **Visibility** — Vault wiki audience (private / authenticated / unlisted / public) + per-note overrides on `/w/:slug`
- 🌐 **Wiki directory** — `/w` lists wikis you may open (not unlisted); private wikis only if shared with you
- 👥 **Vault sharing** — **Read** = wiki only; **Edit** = vault editor + wiki; invite by search or PM user id
- 🔐 **Auth** — Local username/password and optional PM SSO (linked by email); password reset via SMTP
- ⚙️ **Admin settings** — Registration toggle, SMTP, PM integration switch, user management
- 🤖 **AI todo suggestions** — Optional [Ollama](https://ollama.com/) or OpenAI (Admin → AI); analyzes a note and proposes YAML `todos:` — review/merge before save; never auto-applies
- 🔌 **Myelin bridge** — Per-user SSO token or personal `pt_…` API key (Profile); manual vault→project link; Synapse refs on Myelin tasks
- 🎨 **Theme & language** — Light/dark/system + palettes; UI chrome in Portuguese, English, Spanish, or French (picker in the user menu / Profile)

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Backend | Node.js, Express 5, TypeScript (custom server) |
| Database | MySQL 8+ |
| Auth | Local password + optional PM SSO; JWT session cookie |
| Markdown | `marked` + Synapse extras (wikilinks, `![[board]]` embeds, tags, checkboxes, Mermaid, KaTeX, highlight, callouts, footnotes, TOC) |
| Whiteboards | `@excalidraw/excalidraw` (fonts copied to `public/excalidraw` on install / Docker build) |

## Local Development

1. Create MySQL database **and user**:

```bash
mysql -u root -p < server/database/scripts/bootstrap.sql
```

That creates DB `synapse` and user `synapse` / password `change-me-synapse-db-password` (edit the SQL first if you want another password). Legacy installs may still use `pm_synapse` — set `DB_NAME` accordingly.

Or run manually:

```sql
CREATE DATABASE IF NOT EXISTS synapse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'synapse'@'localhost' IDENTIFIED BY 'your-password';
GRANT ALL PRIVILEGES ON synapse.* TO 'synapse'@'localhost';
FLUSH PRIVILEGES;
```

2. Copy env:

```bash
cp .env.example .env
```

```env
PORT=3010
JWT_SECRET=change-me-synapse-jwt-secret
DB_HOST=localhost
DB_PORT=3306
DB_USER=synapse
DB_PASSWORD=change-me-synapse-db-password
DB_NAME=synapse
PM_BASE_URL=http://localhost:3000
SSO_CLIENT_ID=synapse
SSO_CLIENT_SECRET=change-me-synapse-sso-secret
NEXT_PUBLIC_APP_URL=http://localhost:3010
```

3. On **Myelin** (only if using SSO), set:

```env
ALLOWED_SSO_REDIRECTS=http://localhost:3010/api/auth/sso/callback
SSO_CLIENT_ID=synapse
SSO_CLIENT_SECRET=change-me-synapse-sso-secret
```

4. Install and run (from this folder):

```bash
pnpm install --ignore-workspace
pnpm run dev
```

Open [http://localhost:3010](http://localhost:3010) — register a local account (first user becomes admin) and/or sign in with Myelin. Admins manage registration, SMTP, and users under **Settings**. Each user manages their personal Myelin API token under **Profile**. Local and SSO accounts with the same email are linked.

### First-run checklist

1. **Create a vault** on the home page (or open one shared with you).
2. **Optional AI** — Admin → Settings → AI: choose **Ollama** (base URL + model) or **OpenAI** (API key + model). Suggestions always go through the review modal; nothing is auto-applied.
3. **Link Myelin** — In the vault, open Myelin settings to attach a project; set your personal API token or SSO under **Profile** if needed.
4. **Checkbox tasks** — Write `- [ ] …` items, then push/link to Myelin explicitly (never auto-created on note save). Toggle syncs status; Synapse pulls closed/cancelled from Myelin.
5. **Wiki** — Enable public pages on the vault, set note visibility, browse `/w`.
6. **Theme & language** — User menu (or Profile): theme mode/palette and `pt` / `en` / `es` / `fr`. Note bodies stay in the language you write.

**Note:** TypeScript must stay on 5.x (`typescript@5.9.3`) — Next.js 16 does not support TypeScript 7.

## Docker

Build and push (same pattern as Myelin):

```bash
cp .env.docker.example .env.docker
# edit secrets + PM_BASE_URL / SSO / NEXT_PUBLIC_APP_URL

sg docker -c "./docker-build.sh"          # or: ./docker-build.sh 0.1.0
DOCKER_USERNAME=youruser docker compose up -d
curl -s http://localhost:3010/health
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for compose ports, volumes, and SSO checklist.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3010` | Synapse HTTP port |
| `JWT_SECRET` | **Yes** | — | Session JWT secret |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | **Yes** | — | MySQL connection |
| `DB_PROVIDER` | No | `mysql` | Database provider |
| `PM_BASE_URL` | **Yes** | — | Myelin base URL |
| `SSO_CLIENT_ID` | **Yes** | `synapse` | Must match PM SSO client |
| `SSO_CLIENT_SECRET` | **Yes** | — | Must match PM `SSO_CLIENT_SECRET` |
| `ENCRYPTION_KEY` | No | — | Token encryption (falls back to `JWT_SECRET`) |
| `NEXT_PUBLIC_APP_URL` | **Yes** | — | Public Synapse URL (SSO redirect) |
| `NEXT_PUBLIC_PM_BASE_URL` | No | — | Optional PM link base in the UI |

## Ports

| Port | Description |
|------|-------------|
| `3010` | Synapse (frontend + API) |
| `3000` | Myelin (SSO issuer) |
| `3306` | MySQL |

## Architecture

```
+---------------------------+          +----------------------------+
|  synapse               |  SSO +   |  myelin        |
|  Next.js + Express :3010 |  REST →  |  Next.js + Express :3000   |
|  MySQL: synapse           |          |  MySQL/MSSQL               |
+---------------------------+          +----------------------------+
```

Notes and vault ACLs live only in Synapse. Task/project create goes through Myelin’s authenticated APIs with the user’s SSO token.

### Wiki visibility

| Vault default visibility | Open `/w/:slug` | Listed on `/w` |
|--------------------------|-----------------|----------------|
| **private** | Share Read / Edit / Owner only | Only for those with access |
| **authenticated** | Any signed-in Synapse user | Yes (when signed in) |
| **unlisted** | Anyone with the link | No |
| **public** | Everyone | Yes |

Share **Read** = wiki only (no vault editor). Share **Edit** / owner = vault app + wiki. Per-note visibility filters content inside an accessible wiki; **private** notes are visible on the wiki only to Edit/Owner (not Share Read).

### Note syntax (quick)

| Syntax | Result |
|--------|--------|
| `[[Note title]]` / `[[folder/note]]` | Wikilink (open / peek) |
| `[[@vault-slug/note]]` | Cross-vault wikilink |
| `![[Whiteboard title]]` | Embed whiteboard mid-note (whiteboard kind only) |
| `#tag` | Inline tag |
| `- [ ]` / `- [x]` | Checklist (optional PM push) |
| `![alt](/api/vaults/:id/media/:id)` | Vault image |
| `[file.pdf](/api/vaults/:id/media/:id)` | Attachment link |

Password share links: **Share… → Link** creates `/s/:token` (password + expiry). Shared **notes** that embed boards include board JSON in the unlock payload so guests do not need vault API access.

## Agent docs

- [AGENTS.md](./AGENTS.md) — Cursor / agent entry
- [docs/PM_API_CONTRACT.md](./docs/PM_API_CONTRACT.md) — PM HTTP contracts Synapse depends on
- `.cursor/rules/` + `.github/prompts/` — conventions and task skills

This folder can be moved to its own git repository (`synapse`) when ready. Keep `docs/PM_API_CONTRACT.md` in sync whenever Synapse’s PM client changes.

## Related

- [Myelin](https://github.com/tiag0ss/myelin) — parent app (SSO + task APIs)
