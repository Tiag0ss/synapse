# Synapse MCP

HTTP MCP endpoint for Cursor (and compatible clients), mounted at `/api/mcp`.

## Auth

Use a **Synapse personal API token** (`st_…`), created under **My Profile → API tokens**.

Do **not** use Myelin `pt_…` tokens here — those belong in **My Profile → Myelin** for Synapse→Myelin calls only.

Send the token as a Bearer header:

```http
Authorization: Bearer st_…
```

Session cookies / JWT also work for browser sessions, but MCP clients should use `st_…` tokens.

## Cursor `mcp.json` example

```json
{
  "mcpServers": {
    "synapse": {
      "url": "https://synapse.example.com/api/mcp",
      "headers": {
        "Authorization": "Bearer ${env:SYNAPSE_API_TOKEN}"
      }
    }
  }
}
```

Local:

```json
{
  "mcpServers": {
    "synapse-local": {
      "url": "http://localhost:3010/api/mcp",
      "headers": {
        "Authorization": "Bearer ${env:SYNAPSE_API_TOKEN}"
      }
    }
  }
}
```

Create the token in Synapse, copy it once, then set `SYNAPSE_API_TOKEN` in your environment (or paste the value into `mcp.json` — prefer env vars).

## Tools (overview)

| Tool | Purpose |
|------|---------|
| `list_vaults` | Editable vaults |
| `list_notes` / `get_note` | Browse notes |
| `create_note` / `update_note` / `delete_note` | Note CRUD (`delete_note` soft-trashes unless `hard: true`) |
| `get_note_tasks` | Checkbox / Myelin-linked tasks on a note |
| `get_note_context` | Note + tasks + linked note bodies |
| `get_task_context` | Resolve Myelin `pmTaskId` → Synapse context |
| `list_skills` / `get_skill` / `create_skill` / `update_skill` / `delete_skill` | Vault skills |
| `list_rules` / `get_rule` / `create_rule` / `update_rule` / `delete_rule` | Vault rules |
| `create_index` | Ensure the root `index.md` exists |
| `refresh_index` | Rebuild root `index.md` from the current note list |

Skills and rules are also editable under **Vault options → Agent**.
