---
name: git-commit
description: >-
  Create a git commit from the current diff with a clear message and no secrets.
  Use when the user asks to commit, stage and commit, or write a commit message.
---

# Git commit

1. Run in parallel: `git status`, `git diff` (staged + unstaged), `git log -5 --oneline`.
2. **PM-ACTIVE-TASK**: read `.cursorrules` `PM-ACTIVE-TASK` block and `.git/pm-active-task.json`.
   - If staged work maps to Myelin tasks missing from that list, sync via Myelin MCP
     (`repositoryUrl` / project **16**) per `.cursor/rules/synapse-pm-active-task.mdc`
     before committing.
   - Include every listed `Task #Id` in the commit message (prefer a
     `References: Task #A, Task #B, …` footer when there are several).
   - If the block says there are no active PM tasks, do **not** invent Task references.
3. Do not commit `.env`, credentials, or secret files. Warn if the user asks to include them.
4. Stage only relevant files. Follow the repo’s recent commit message style.
5. Prefer a short subject focused on **why**, then commit via HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
Short summary of why.

References: Task #N, Task #M.
EOF
)"
```

6. Run `git status` after. Do not push unless asked. Do not amend unless the user requested it and safety rules allow.
7. Never skip hooks (`--no-verify`) unless the user explicitly asks. The `post-commit` hook clears PM-ACTIVE-TASK after success.
