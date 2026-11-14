import type { Edge, Node } from '@xyflow/react';
import {
  defaultPortsForKind,
  type FlowNodeData,
  type FlowNodeKind,
} from '@/lib/flowDocument';
import {
  flowToSequenceMermaid,
  isSequenceMermaid,
  sequenceToFlow,
} from '@/lib/flowSequence';

function escapeMermaidLabel(label: string): string {
  return String(label || '')
    .replace(/"/g, '#quot;')
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/\n/g, ' ')
    .trim() || 'node';
}

function safeId(id: string): string {
  const cleaned = String(id || 'n').replace(/[^a-zA-Z0-9_]/g, '_');
  return /^[a-zA-Z]/.test(cleaned) ? cleaned : `n_${cleaned}`;
}

function shapeForKind(kind: FlowNodeKind, id: string, label: string): string {
  const sid = safeId(id);
  const text = escapeMermaidLabel(label);
  if (kind === 'start' || kind === 'end') return `${sid}((${text}))`;
  if (kind === 'decision' || kind === 'question') return `${sid}{${text}}`;
  return `${sid}[${text}]`;
}

/** Export React Flow graph as Mermaid flowchart (or sequenceDiagram when participants). */
export function flowToMermaid(
  nodes: Node<FlowNodeData>[],
  edges: Edge[],
  direction: 'TD' | 'LR' = 'TD'
): string {
  const asSequence = flowToSequenceMermaid(nodes, edges);
  if (asSequence) return asSequence;

  const lines: string[] = [`flowchart ${direction}`];
  for (const n of nodes) {
    lines.push(`  ${shapeForKind(n.data.kind, n.id, n.data.label)}`);
  }
  for (const e of edges) {
    const src = safeId(e.source);
    const tgt = safeId(e.target);
    const label = e.label != null && String(e.label).trim() ? String(e.label).trim() : '';
    if (label) {
      lines.push(`  ${src} -->|${escapeMermaidLabel(label)}| ${tgt}`);
    } else if (e.sourceHandle && e.sourceHandle !== 'out') {
      lines.push(`  ${src} -->|${escapeMermaidLabel(e.sourceHandle)}| ${tgt}`);
    } else {
      lines.push(`  ${src} --> ${tgt}`);
    }
  }
  return `${lines.join('\n')}\n`;
}

type ParsedEdge = {
  source: string;
  target: string;
  label?: string;
};

function parseMermaidEdge(line: string): ParsedEdge | null {
  const trimmed = line.trim();
  // A -->|label| B  /  A --> B  /  A --- B
  const withLabel = trimmed.match(
    /^([A-Za-z][\w]*)\s*--\s*>?\s*\|([^|]*)\|\s*([A-Za-z][\w]*)$/
  );
  if (withLabel) {
    return {
      source: withLabel[1],
      target: withLabel[3],
      label: withLabel[2].trim() || undefined,
    };
  }
  const plain = trimmed.match(/^([A-Za-z][\w]*)\s*--+>?\s*([A-Za-z][\w]*)$/);
  if (plain) {
    return { source: plain[1], target: plain[2] };
  }
  return null;
}

function parseMermaidNodeDecl(line: string): { id: string; label: string; kind: FlowNodeKind } | null {
  const trimmed = line.trim();
  let m = trimmed.match(/^([A-Za-z][\w]*)\(\((.+)\)\)$/);
  if (m) {
    const label = m[2];
    const kind: FlowNodeKind = /end/i.test(label) ? 'end' : 'start';
    return { id: m[1], label, kind };
  }
  m = trimmed.match(/^([A-Za-z][\w]*)\{(.+)\}$/);
  if (m) return { id: m[1], label: m[2], kind: 'decision' };
  m = trimmed.match(/^([A-Za-z][\w]*)\[(.+)\]$/);
  if (m) return { id: m[1], label: m[2], kind: 'process' };
  m = trimmed.match(/^([A-Za-z][\w]*)\((.+)\)$/);
  if (m) return { id: m[1], label: m[2], kind: 'process' };
  return null;
}

/**
 * Best-effort import of Mermaid flowchart or sequenceDiagram → React Flow.
 */
export function mermaidToFlow(mermaid: string): {
  nodes: Node<FlowNodeData>[];
  edges: Edge[];
} {
  if (isSequenceMermaid(mermaid)) {
    return sequenceToFlow(mermaid);
  }

  const lines = String(mermaid || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('%%') && !/^flowchart\b/i.test(l) && !/^graph\b/i.test(l));

  const nodeMap = new Map<string, { label: string; kind: FlowNodeKind }>();
  const parsedEdges: ParsedEdge[] = [];

  for (const line of lines) {
    const edge = parseMermaidEdge(line);
    if (edge) {
      parsedEdges.push(edge);
      if (!nodeMap.has(edge.source)) {
        nodeMap.set(edge.source, { label: edge.source, kind: 'process' });
      }
      if (!nodeMap.has(edge.target)) {
        nodeMap.set(edge.target, { label: edge.target, kind: 'process' });
      }
      continue;
    }
    const decl = parseMermaidNodeDecl(line);
    if (decl) {
      nodeMap.set(decl.id, { label: decl.label, kind: decl.kind });
    }
  }

  const ids = [...nodeMap.keys()];
  const nodes: Node<FlowNodeData>[] = ids.map((id, index) => {
    const meta = nodeMap.get(id)!;
    const ports = defaultPortsForKind(meta.kind);
    const col = index % 3;
    const row = Math.floor(index / 3);
    return {
      id,
      type: 'flowObject',
      position: { x: 80 + col * 240, y: 80 + row * 140 },
      data: {
        label: meta.label,
        kind: meta.kind,
        inputs: ports.inputs,
        outputs: ports.outputs,
        ...(meta.kind === 'decision' || meta.kind === 'question'
          ? {
              question: meta.label,
              options: [
                { id: 'yes', label: 'Yes', outputId: 'yes' },
                { id: 'no', label: 'No', outputId: 'no' },
              ],
            }
          : {}),
      },
    };
  });

  const edges: Edge[] = parsedEdges.map((e, i) => {
    const sourceNode = nodeMap.get(e.source);
    let sourceHandle = 'out';
    if (sourceNode && (sourceNode.kind === 'decision' || sourceNode.kind === 'question')) {
      const lab = (e.label || '').toLowerCase();
      sourceHandle = lab === 'no' || lab === 'n' ? 'no' : 'yes';
    }
    return {
      id: `e${i + 1}`,
      source: e.source,
      target: e.target,
      sourceHandle,
      targetHandle: 'in',
      ...(e.label ? { label: e.label } : {}),
    };
  });

  return { nodes, edges };
}
