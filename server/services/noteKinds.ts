export type SynapseNoteKind = 'note' | 'whiteboard' | 'flow';

export function normalizeNoteKind(raw: unknown): SynapseNoteKind {
  const k = String(raw || 'note').toLowerCase();
  if (k === 'whiteboard') return 'whiteboard';
  if (k === 'flow' || k === 'reactflow') return 'flow';
  return 'note';
}

export function isCanvasKind(raw: unknown): boolean {
  const k = normalizeNoteKind(raw);
  return k === 'whiteboard' || k === 'flow';
}