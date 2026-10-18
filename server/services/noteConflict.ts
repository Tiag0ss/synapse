/** Normalise note UpdatedAt for optimistic concurrency (MySQL DATETIME = seconds). */
export function noteUpdatedAtIso(value: unknown): string | null {
  if (value == null || value === '') return null;
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return null;
  return new Date(Math.floor(d.getTime() / 1000) * 1000).toISOString();
}

export function sameNoteUpdatedAt(a: unknown, b: unknown): boolean {
  const aa = noteUpdatedAtIso(a);
  const bb = noteUpdatedAtIso(b);
  return aa != null && bb != null && aa === bb;
}
