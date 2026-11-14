import type { Edge, Node, Viewport } from '@xyflow/react';

export const FLOW_DOC_TYPE = 'reactflow' as const;
export const FLOW_DOC_VERSION = 1;

export type FlowPort = {
  id: string;
  name: string;
};

export type FlowNodeKind =
  | 'start'
  | 'end'
  | 'process'
  | 'decision'
  | 'question'
  /** Sequence-diagram column (header + lifeline + footer). */
  | 'participant';

/** Visual shape — defaults follow kind when omitted / `auto`. */
export type FlowNodeShape = 'auto' | 'rectangle' | 'rounded' | 'pill' | 'diamond' | 'circle';

/** Which side of the node hosts input or output handles. */
export type FlowPortSide = 'left' | 'right' | 'top' | 'bottom';

export type FlowOption = {
  id: string;
  label: string;
  /** Output handle id this option follows when running the flow. */
  outputId: string;
};

export type FlowNodeData = {
  label: string;
  kind: FlowNodeKind;
  inputs: FlowPort[];
  outputs: FlowPort[];
  /** Prompt shown when running decision/question nodes. */
  question?: string;
  options?: FlowOption[];
  /** Override visual shape (default: auto from kind). */
  shape?: FlowNodeShape;
  /** Side for input handles (default: left). */
  inputsSide?: FlowPortSide;
  /** Side for output handles (default: right). */
  outputsSide?: FlowPortSide;
  /** Ephemeral: highlight during Run (not persisted). */
  runActive?: boolean;
};

export type FlowDocument = {
  type: typeof FLOW_DOC_TYPE;
  version: number;
  source: 'synapse';
  nodes: Node<FlowNodeData>[];
  edges: Edge[];
  viewport?: Viewport;
};

export const EMPTY_FLOW_DOCUMENT: FlowDocument = {
  type: FLOW_DOC_TYPE,
  version: FLOW_DOC_VERSION,
  source: 'synapse',
  nodes: [
    {
      id: 'start',
      type: 'flowObject',
      position: { x: 80, y: 120 },
      data: {
        label: 'Start',
        kind: 'start',
        inputs: [],
        outputs: [{ id: 'out', name: 'out' }],
      },
    },
    {
      id: 'end',
      type: 'flowObject',
      position: { x: 420, y: 120 },
      data: {
        label: 'End',
        kind: 'end',
        inputs: [{ id: 'in', name: 'in' }],
        outputs: [],
      },
    },
  ],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
};

export const EMPTY_FLOW_JSON = JSON.stringify(EMPTY_FLOW_DOCUMENT);

function asPorts(raw: unknown, fallback: FlowPort[]): FlowPort[] {
  if (!Array.isArray(raw)) return fallback;
  const out: FlowPort[] = [];
  for (const p of raw) {
    if (!p || typeof p !== 'object') continue;
    const id = String((p as FlowPort).id || '').trim();
    if (!id) continue;
    out.push({
      id,
      name: String((p as FlowPort).name || id).trim() || id,
    });
  }
  return out.length ? out : fallback;
}

function asOptions(raw: unknown): FlowOption[] | undefined {
  if (!Array.isArray(raw) || !raw.length) return undefined;
  const out: FlowOption[] = [];
  for (const o of raw) {
    if (!o || typeof o !== 'object') continue;
    const id = String((o as FlowOption).id || '').trim();
    const outputId = String((o as FlowOption).outputId || '').trim();
    if (!id || !outputId) continue;
    out.push({
      id,
      label: String((o as FlowOption).label || id).trim() || id,
      outputId,
    });
  }
  return out.length ? out : undefined;
}

function normalizeNodeKind(raw: unknown): FlowNodeKind {
  const k = String(raw || 'process');
  if (
    k === 'start' ||
    k === 'end' ||
    k === 'decision' ||
    k === 'question' ||
    k === 'participant'
  ) {
    return k;
  }
  return 'process';
}

export function normalizeNodeShape(raw: unknown): FlowNodeShape {
  const s = String(raw || 'auto');
  if (
    s === 'rectangle' ||
    s === 'rounded' ||
    s === 'pill' ||
    s === 'diamond' ||
    s === 'circle'
  ) {
    return s;
  }
  return 'auto';
}

export function normalizePortSide(raw: unknown, fallback: FlowPortSide): FlowPortSide {
  const s = String(raw || '');
  if (s === 'left' || s === 'right' || s === 'top' || s === 'bottom') return s;
  return fallback;
}

/** Resolved shape used for rendering. */
export function resolvedNodeShape(kind: FlowNodeKind, shape?: FlowNodeShape | null): Exclude<FlowNodeShape, 'auto'> {
  if (shape && shape !== 'auto') return shape;
  if (kind === 'start' || kind === 'end') return 'pill';
  if (kind === 'participant') return 'rounded';
  // Decision/question default to rounded — diamond reads poorly with several ports.
  if (kind === 'decision' || kind === 'question') return 'rounded';
  return 'rounded';
}

/** Message dock slots along a sequence participant lifeline. */
export const PARTICIPANT_MESSAGE_SLOTS = 6;

export function defaultPortsForKind(kind: FlowNodeKind): {
  inputs: FlowPort[];
  outputs: FlowPort[];
} {
  if (kind === 'start') return { inputs: [], outputs: [{ id: 'out', name: 'out' }] };
  if (kind === 'end') return { inputs: [{ id: 'in', name: 'in' }], outputs: [] };
  if (kind === 'participant') {
    const slots = Array.from({ length: PARTICIPANT_MESSAGE_SLOTS }, (_, i) => i + 1);
    return {
      inputs: slots.map((n) => ({ id: `L${n}`, name: '' })),
      outputs: slots.map((n) => ({ id: `R${n}`, name: '' })),
    };
  }
  if (kind === 'decision' || kind === 'question') {
    return {
      inputs: [{ id: 'in', name: 'in' }],
      outputs: [
        { id: 'yes', name: 'yes' },
        { id: 'no', name: 'no' },
      ],
    };
  }
  return {
    inputs: [{ id: 'in', name: 'in' }],
    outputs: [{ id: 'out', name: 'out' }],
  };
}

/** Build a horizontal row of sequence participants. */
export function buildSequenceParticipants(
  names: string[],
  opts?: { startX?: number; startY?: number; gapX?: number }
): Node<FlowNodeData>[] {
  const startX = opts?.startX ?? 80;
  const startY = opts?.startY ?? 40;
  const gapX = opts?.gapX ?? 200;
  const ports = defaultPortsForKind('participant');
  return names.map((name, i) => ({
    id: `p_${safeParticipantId(name)}_${i + 1}`,
    type: 'flowObject' as const,
    position: { x: startX + i * gapX, y: startY },
    data: {
      label: name,
      kind: 'participant' as const,
      inputs: structuredClone(ports.inputs),
      outputs: structuredClone(ports.outputs),
      shape: 'rounded' as const,
      inputsSide: 'left' as const,
      outputsSide: 'right' as const,
    },
  }));
}

function safeParticipantId(name: string): string {
  const cleaned = String(name || 'actor').replace(/[^a-zA-Z0-9_]/g, '_');
  return cleaned || 'actor';
}

export function parseFlowDocument(raw: string | null | undefined): FlowDocument {
  if (!raw?.trim()) return structuredClone(EMPTY_FLOW_DOCUMENT);
  try {
    const parsed = JSON.parse(raw) as Partial<FlowDocument>;
    if (parsed?.type && parsed.type !== FLOW_DOC_TYPE) {
      return structuredClone(EMPTY_FLOW_DOCUMENT);
    }
    const nodes: Node<FlowNodeData>[] = Array.isArray(parsed.nodes)
      ? parsed.nodes.map((n, i) => {
          const kind = normalizeNodeKind((n.data as FlowNodeData | undefined)?.kind);
          const defaults = defaultPortsForKind(kind);
          const dataRaw = (n.data || {}) as Partial<FlowNodeData>;
          return {
            id: String(n.id || `n${i}`),
            type: 'flowObject',
            position: {
              x: Number(n.position?.x) || 0,
              y: Number(n.position?.y) || 0,
            },
            data: {
              label: String(dataRaw.label || `Node ${i + 1}`),
              kind,
              inputs: asPorts(dataRaw.inputs, defaults.inputs),
              outputs: asPorts(dataRaw.outputs, defaults.outputs),
              question: dataRaw.question ? String(dataRaw.question) : undefined,
              options: asOptions(dataRaw.options),
              shape: normalizeNodeShape(dataRaw.shape),
              inputsSide: normalizePortSide(dataRaw.inputsSide, 'left'),
              outputsSide: normalizePortSide(dataRaw.outputsSide, 'right'),
            },
          };
        })
      : structuredClone(EMPTY_FLOW_DOCUMENT.nodes);

    const edges: Edge[] = Array.isArray(parsed.edges)
      ? parsed.edges
          .map((e, i) => ({
            id: String(e.id || `e${i}`),
            source: String(e.source || ''),
            target: String(e.target || ''),
            sourceHandle: e.sourceHandle != null ? String(e.sourceHandle) : undefined,
            targetHandle: e.targetHandle != null ? String(e.targetHandle) : undefined,
            label: e.label != null ? String(e.label) : undefined,
          }))
          .filter((e) => e.source && e.target)
      : [];

    const viewport =
      parsed.viewport &&
      typeof parsed.viewport.x === 'number' &&
      typeof parsed.viewport.y === 'number' &&
      typeof parsed.viewport.zoom === 'number'
        ? parsed.viewport
        : { x: 0, y: 0, zoom: 1 };

    return {
      type: FLOW_DOC_TYPE,
      version: FLOW_DOC_VERSION,
      source: 'synapse',
      nodes,
      edges,
      viewport,
    };
  } catch {
    return structuredClone(EMPTY_FLOW_DOCUMENT);
  }
}

export function serializeFlowDocument(
  nodes: Node<FlowNodeData>[],
  edges: Edge[],
  viewport?: Viewport
): string {
  const doc: FlowDocument = {
    type: FLOW_DOC_TYPE,
    version: FLOW_DOC_VERSION,
    source: 'synapse',
    nodes: nodes.map((n) => ({
      id: n.id,
      type: 'flowObject',
      position: { x: n.position.x, y: n.position.y },
      data: {
        label: n.data.label,
        kind: n.data.kind,
        inputs: n.data.inputs,
        outputs: n.data.outputs,
        ...(n.data.question ? { question: n.data.question } : {}),
        ...(n.data.options?.length ? { options: n.data.options } : {}),
        ...(n.data.shape && n.data.shape !== 'auto' ? { shape: n.data.shape } : {}),
        ...(n.data.inputsSide && n.data.inputsSide !== 'left'
          ? { inputsSide: n.data.inputsSide }
          : {}),
        ...(n.data.outputsSide && n.data.outputsSide !== 'right'
          ? { outputsSide: n.data.outputsSide }
          : {}),
      },
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      ...(e.sourceHandle != null ? { sourceHandle: e.sourceHandle } : {}),
      ...(e.targetHandle != null ? { targetHandle: e.targetHandle } : {}),
      ...(e.label != null ? { label: String(e.label) } : {}),
    })),
    viewport: viewport || { x: 0, y: 0, zoom: 1 },
  };
  return JSON.stringify(doc);
}

export function newFlowNodeId(nodes: { id: string }[]): string {
  let i = nodes.length + 1;
  let id = `n${i}`;
  const used = new Set(nodes.map((n) => n.id));
  while (used.has(id)) {
    i += 1;
    id = `n${i}`;
  }
  return id;
}
