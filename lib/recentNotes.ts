/** Client-side last-opened note ids per vault (Jump switcher empty state). */

const PREFIX = 'synapse.recentNotes.v1';
const MAX = 40;

function storageKey(vaultId: string, userId?: number | null): string {
  const u = userId != null && Number.isFinite(userId) ? String(userId) : 'anon';
  return `${PREFIX}:${u}:${vaultId}`;
}

export function readRecentNoteIds(vaultId: string, userId?: number | null): number[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(vaultId, userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0)
      .slice(0, MAX);
  } catch {
    return [];
  }
}

export function pushRecentNoteId(
  vaultId: string,
  noteId: number,
  userId?: number | null
): void {
  if (typeof localStorage === 'undefined') return;
  if (!Number.isFinite(noteId) || noteId <= 0) return;
  const prev = readRecentNoteIds(vaultId, userId).filter((id) => id !== noteId);
  const next = [noteId, ...prev].slice(0, MAX);
  try {
    localStorage.setItem(storageKey(vaultId, userId), JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}
