/** Note kinds that store canvas JSON in BoardJson. */
export type CanvasNoteKind = 'whiteboard' | 'flow';

export type SynapseNoteKind = 'note' | CanvasNoteKind;

export function normalizeNoteKind(raw: unknown): SynapseNoteKind {
  const k = String(raw || 'note').toLowerCase();
  if (k === 'whiteboard') return 'whiteboard';
  if (k === 'flow' || k === 'reactflow') return 'flow';
  return 'note';
}

export function isWhiteboardKind(raw: unknown): boolean {
  return normalizeNoteKind(raw) === 'whiteboard';
}

export function isFlowKind(raw: unknown): boolean {
  return normalizeNoteKind(raw) === 'flow';
}

export function isCanvasKind(raw: unknown): boolean {
  const k = normalizeNoteKind(raw);
  return k === 'whiteboard' || k === 'flow';
}
