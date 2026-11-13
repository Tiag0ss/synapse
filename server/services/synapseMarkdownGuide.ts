/**
 * Compact Synapse markdown syntax reference for LLM system prompts.
 * Keep in sync with the editor legend / renderMarkdown preprocess.
 */
export const SYNAPSE_MARKDOWN_GUIDE = `## Synapse markdown dialect (must respect)

Synapse notes are Markdown with Synapse-specific extensions. When editing:

### Never invent or strip (unless the user explicitly asks)
- Keep every existing marker, id, fence, and link shape intact.
- Prefer minimal edits that satisfy the instruction over rewriting the whole note.

### Wikilinks & embeds
- \`[[Note title]]\` — link to a note (by title, folder path, or unique leaf name).
- \`[[meta/risks]]\` — link by folder path.
- \`[[Note|label]]\` — wikilink with custom label.
- \`[[@vault-slug/note]]\` — cross-vault link.
- \`![[Whiteboard]]\` — **embed** a whiteboard mid-note. Only \`![[…]]\` embeds; plain \`[[Board]]\` is a normal link, not an embed.
- Do not convert \`![[…]]\` ↔ \`[[…]]\` unless asked.
- Do not turn wikilinks into plain URLs.

### Tags & media
- \`#tag\` — inline tags (keep as written).
- Images: \`![alt](/api/vaults/:id/media/:mediaId)\` (or other vault media URLs). Keep exact URLs.
- Attachments: \`[Name](/api/vaults/:id/media/:mediaId)\`. Keep exact URLs.

### Checkboxes / Myelin-linked tasks
- Task lines: \`- [ ] …\` or \`- [x] …\`.
- Linked tasks often include an HTML comment on the same line: \`<!--synapse:cb:MARKER_ID-->\`.
- **Never remove, rewrite, or invent** \`<!--synapse:cb:…-->\` markers.
- Keep estimate suffixes like \`(2h)\`, \`(1.5h, Design)\`, \`(unscheduled)\` when present.

### YAML frontmatter
- Optional block at the very top between \`---\` fences.
- Preserve field names and structure (\`todos:\`, \`tags:\`, \`related:\`, \`note:\`, \`hours:\`, \`category:\`, \`unscheduled:\`, etc.).
- Do not move frontmatter into the body or drop the closing \`---\` unless asked.

### Callouts, folds, ask, decisions
- Obsidian-style callouts: \`> [!NOTE]\`, \`> [!WARNING]\`, foldable \`> [!NOTE]-\` / \`+\`.
- Folds / flashcards: \`:::fold Title\` … \`:::\` or \`:::fold- Title\` … \`:::\`.
- Ask blocks: \`:::ask Question\` … \`:::\`.
- Decision / fold fences: keep opening/closing \`:::\` paired; do not rename fence kinds.
- \`[[toc]]\` table of contents marker — keep if present.

### Code, math, diagrams
- Fenced code \`\`\`lang … \`\`\`, Mermaid \`\`\`mermaid … \`\`\`, KaTeX \`$…$\` / \`$$…$$\`.
- Do not unwrap fences or change language tags unless asked.

### Output discipline
- Return JSON only as instructed by the task prompt.
- Do not wrap the JSON in markdown fences.
- Keep the same human language as the note unless asked to translate.
- Soft line breaks and list indentation matter — do not reflow lists carelessly.`;
