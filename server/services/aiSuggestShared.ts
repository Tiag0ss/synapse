const MAX_PROPOSED = 30;

export type ProposedTodoSuggestion = {
  content: string;
  hours?: number | null;
  category?: string | null;
  status?: string;
  rationale?: string | null;
};

export class AiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'AiError';
    this.status = status;
  }
}

/** @deprecated Use AiError — kept for route compatibility. */
export class OllamaError extends AiError {
  constructor(message: string, status = 400) {
    super(message, status);
    this.name = 'OllamaError';
  }
}

function stripJsonFence(text: string): string {
  const trimmed = String(text || '').trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

export function parseJsonContent(raw: string): unknown {
  const text = stripJsonFence(raw);
  try {
    return JSON.parse(text);
  } catch {
    const objStart = text.indexOf('{');
    const objEnd = text.lastIndexOf('}');
    if (objStart >= 0 && objEnd > objStart) {
      try {
        return JSON.parse(text.slice(objStart, objEnd + 1));
      } catch {
        /* continue */
      }
    }
    const arrStart = text.indexOf('[');
    const arrEnd = text.lastIndexOf(']');
    if (arrStart >= 0 && arrEnd > arrStart) {
      try {
        return JSON.parse(text.slice(arrStart, arrEnd + 1));
      } catch {
        /* continue */
      }
    }
    throw new AiError('AI returned invalid JSON', 502);
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function coerceHours(raw: unknown): number | null {
  if (raw == null || raw === '') return null;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) return raw;
  if (typeof raw === 'boolean') return null;
  const s = String(raw).trim().toLowerCase().replace(',', '.');
  const match = s.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function pickString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const v = obj[key];
    if (v == null) continue;
    if (typeof v === 'string' || typeof v === 'number') {
      const s = String(v).trim();
      if (s) return s;
    }
  }
  return '';
}

function normalizeOneItem(raw: unknown): ProposedTodoSuggestion | null {
  if (typeof raw === 'string') {
    const content = raw.trim();
    return content
      ? { content, hours: null, category: null, status: 'pending', rationale: null }
      : null;
  }
  if (!isPlainObject(raw)) return null;

  const content = pickString(raw, [
    'content',
    'title',
    'task',
    'name',
    'summary',
    'description',
    'text',
    'todo',
  ]).slice(0, 500);
  if (!content) return null;

  const category =
    pickString(raw, ['category', 'categoria', 'cat', 'type', 'label']).slice(0, 128) || null;
  const status = pickString(raw, ['status', 'state']).slice(0, 64) || 'pending';
  const rationale =
    pickString(raw, ['rationale', 'reason', 'why', 'note', 'explanation']).slice(0, 500) || null;
  const hours = coerceHours(raw.hours ?? raw.estimate ?? raw.estimatedHours ?? raw.effort);

  return { content, hours, category, status, rationale };
}

/** Accept common model shapes: {proposed|todos|tasks|items:[]}, bare [], or single object. */
export function normalizeProposedList(parsed: unknown): ProposedTodoSuggestion[] {
  let list: unknown[] = [];

  if (Array.isArray(parsed)) {
    list = parsed;
  } else if (isPlainObject(parsed)) {
    const candidates = [
      parsed.proposed,
      parsed.todos,
      parsed.tasks,
      parsed.items,
      parsed.suggestions,
      parsed.results,
      parsed.data,
    ];
    for (const c of candidates) {
      if (Array.isArray(c)) {
        list = c;
        break;
      }
      if (isPlainObject(c) && Array.isArray(c.proposed)) {
        list = c.proposed;
        break;
      }
    }
    if (!list.length) {
      const single = normalizeOneItem(parsed);
      if (single) return [single];
    }
  }

  const out: ProposedTodoSuggestion[] = [];
  for (const item of list) {
    const n = normalizeOneItem(item);
    if (n) out.push(n);
    if (out.length >= MAX_PROPOSED) break;
  }
  return out;
}

export const SYSTEM_INSTRUCTIONS = `You are a careful project analyst. Read the entire note and extract concrete work items for YAML frontmatter todos.

Return ONLY valid JSON with this shape:
{"proposed":[{"content":"…","hours":2,"category":"Design","status":"pending","rationale":"…"}]}

Field rules:
- content: required string (actionable task title)
- hours: number or omit (not a string)
- category, status, rationale: optional strings

Analysis (do all of these):
1. Read every section, heading, bullet, checkbox, table, and callout — not just the opening paragraph.
2. Turn open questions, risks, decisions needed, follow-ups, and unchecked boxes into actionable todos.
3. Prefer specific deliverables over vague themes (bad: "Work on project"; good: "Draft API contract for vault media upload").
4. Infer hours when the note implies effort; otherwise omit hours.
5. Use category when clear (e.g. Design, Development, Research, Documentation, Meeting, Other).
6. Write "content" in the same language as the note body.
7. Do not invent Myelin project/task IDs.
8. Skip items that duplicate existing todos (same meaning, not only same wording).
9. Propose a thorough set when the note is rich (typically 5–20); fewer only for short notes. Cap at ${MAX_PROPOSED}.
10. Each rationale must cite what in the note triggered the todo (section/phrase), one short sentence.`;

export function buildSuggestTodosUserContent(input: {
  title: string;
  path?: string | null;
  bodyMarkdown: string;
  existingTodoTitles: string[];
}): string {
  const fullMarkdown = String(input.bodyMarkdown || '');
  const markdownForModel =
    fullMarkdown.length > 200_000
      ? `${fullMarkdown.slice(0, 200_000)}\n\n[…truncated ${fullMarkdown.length - 200_000} chars…]`
      : fullMarkdown;

  const existingList =
    input.existingTodoTitles.length > 0
      ? input.existingTodoTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')
      : '(none)';

  return [
    'Analyze the FULL note below end-to-end. Do not stop after the first section.',
    '',
    `Note title: ${input.title || '(untitled)'}`,
    input.path ? `Note path: ${input.path}` : null,
    `Note length: ${fullMarkdown.length} characters`,
    '',
    'Existing frontmatter todos (do not duplicate these):',
    existingList,
    '',
    '===== BEGIN FULL NOTE MARKDOWN =====',
    markdownForModel,
    '===== END FULL NOTE MARKDOWN =====',
    '',
    'Respond with JSON only: {"proposed":[{"content":"task title","hours":2,"category":"Design","status":"pending","rationale":"from section X"}]}',
  ]
    .filter((line) => line != null)
    .join('\n');
}
