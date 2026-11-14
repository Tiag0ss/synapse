import type { Edge, Node } from '@xyflow/react';
import {
  buildSequenceParticipants,
  defaultPortsForKind,
  type FlowNodeData,
} from '@/lib/flowDocument';

export type SequenceMessage = {
  from: string;
  to: string;
  label: string;
  /** true = solid arrow (->>), false = open/dashed (-->>) */
  solid?: boolean;
};

/**
 * Parse Mermaid sequenceDiagram into participants + messages.
 * Supports: participant X / participant X as Label, and A->>B: text
 */
export function parseSequenceDiagram(mermaid: string): {
  participants: string[];
  messages: SequenceMessage[];
} {
  const lines = String(mermaid || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('%%'));

  const participants: string[] = [];
  const alias = new Map<string, string>();
  const messages: SequenceMessage[] = [];

  const ensure = (id: string, label?: string) => {
    const name = (label || alias.get(id) || id).trim() || id;
    alias.set(id, name);
    if (!participants.includes(name)) participants.push(name);
    return name;
  };

  for (const line of lines) {
    if (/^sequenceDiagram\b/i.test(line)) continue;

    const partAs = line.match(/^participant\s+(\S+)\s+as\s+(.+)$/i);
    if (partAs) {
      ensure(partAs[1], partAs[2].trim());
      continue;
    }
    const part = line.match(/^participant\s+(.+)$/i);
    if (part) {
      ensure(part[1].trim());
      continue;
    }
    const actor = line.match(/^actor\s+(.+)$/i);
    if (actor) {
      ensure(actor[1].trim());
      continue;
    }

    // A->>B: msg  /  A-->>B: msg  /  A->B: msg
    const msg = line.match(
      /^(\S+)\s*(-?->>?|-->>?)\s*(\S+)\s*:\s*(.+)$/
    );
    if (msg) {
      const from = ensure(msg[1]);
      const to = ensure(msg[3]);
      const arrow = msg[2];
      messages.push({
        from,
        to,
        label: msg[4].trim(),
        solid: !arrow.includes('--'),
      });
    }
  }

  return { participants, messages };
}

/** Convert a Mermaid sequenceDiagram into React Flow nodes/edges. */
export function sequenceToFlow(mermaid: string): {
  nodes: Node<FlowNodeData>[];
  edges: Edge[];
} {
  const { participants, messages } = parseSequenceDiagram(mermaid);
  if (!participants.length) {
    return { nodes: [], edges: [] };
  }

  const nodes = buildSequenceParticipants(participants);
  const byLabel = new Map(nodes.map((n) => [n.data.label, n]));

  const edges: Edge[] = messages.map((m, i) => {
    const src = byLabel.get(m.from);
    const tgt = byLabel.get(m.to);
    const slot = Math.min(i + 1, 6);
    return {
      id: `seq_msg_${i + 1}`,
      source: src?.id || m.from,
      target: tgt?.id || m.to,
      sourceHandle: `R${slot}`,
      targetHandle: `L${slot}`,
      label: m.label,
      style: m.solid === false ? { strokeDasharray: '6 4' } : undefined,
    };
  });

  return { nodes, edges };
}

/** Detect whether Mermaid text is a sequence diagram. */
export function isSequenceMermaid(mermaid: string): boolean {
  return /^\s*sequenceDiagram\b/im.test(String(mermaid || ''));
}

/** Export participant nodes + labeled edges as Mermaid sequenceDiagram. */
export function flowToSequenceMermaid(
  nodes: Node<FlowNodeData>[],
  edges: Edge[]
): string | null {
  const parts = nodes.filter((n) => n.data.kind === 'participant');
  if (!parts.length) return null;

  const lines = ['sequenceDiagram'];
  for (const p of parts) {
    lines.push(`  participant ${p.data.label}`);
  }

  const sorted = [...edges].sort((a, b) => {
    const sa = Number(String(a.sourceHandle || '').replace(/\D/g, '') || 0);
    const sb = Number(String(b.sourceHandle || '').replace(/\D/g, '') || 0);
    return sa - sb;
  });

  for (const e of sorted) {
    const src = nodes.find((n) => n.id === e.source);
    const tgt = nodes.find((n) => n.id === e.target);
    if (!src || !tgt) continue;
    if (src.data.kind !== 'participant' || tgt.data.kind !== 'participant') continue;
    const label = e.label != null ? String(e.label).trim() : '';
    if (!label) continue;
    const dashed = String(e.style?.strokeDasharray || '') !== '';
    lines.push(
      `  ${src.data.label}${dashed ? '-->>' : '->>'}${tgt.data.label}: ${label}`
    );
  }

  return `${lines.join('\n')}\n`;
}

export function emptyParticipant(label: string, index = 0): Node<FlowNodeData> {
  const ports = defaultPortsForKind('participant');
  return {
    id: `p_${index + 1}_${Date.now()}`,
    type: 'flowObject',
    position: { x: 80 + index * 200, y: 40 },
    data: {
      label,
      kind: 'participant',
      inputs: ports.inputs,
      outputs: ports.outputs,
      shape: 'rounded',
      inputsSide: 'left',
      outputsSide: 'right',
    },
  };
}
