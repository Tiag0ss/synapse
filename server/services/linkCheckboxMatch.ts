/** Pure text matching helpers for checkbox ↔ Myelin task linking. */

function stripHtmlText(raw: string): string {
  return String(raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'");
}

/** Normalize checkbox / PM task text for description matching. */
export function normalizePmMatchKey(raw: string): string {
  let s = stripHtmlText(raw);
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');
  s = s.replace(/\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]/g, '$1');
  s = s.replace(/[*_~`>#]/g, ' ');
  try {
    s = s.normalize('NFD').replace(/\p{M}/gu, '').normalize('NFC');
  } catch {
    /* older runtimes without \p{M} */
  }
  s = s.replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  return s;
}

export type MatchablePmTask = {
  id: number;
  taskName: string;
  description?: string | null;
};

/**
 * Exact normalized name match (used in unit tests and as a fast-path hint).
 * Full scoring lives in `linkCheckboxTask.suggestPmTaskForCheckbox`.
 */
export function exactPmTaskNameMatch(
  checkboxText: string,
  tasks: MatchablePmTask[]
): MatchablePmTask | null {
  const key = normalizePmMatchKey(checkboxText);
  if (!key) return null;
  const hits = tasks.filter((t) => normalizePmMatchKey(t.taskName) === key);
  return hits.length === 1 ? hits[0] : null;
}
