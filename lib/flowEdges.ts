import type { Edge, Node } from '@xyflow/react';
import type { FlowNodeData } from '@/lib/flowDocument';

/** Human-readable label for an edge from the source output port name. */
export function edgeOutputLabel(
  nodes: Node<FlowNodeData>[],
  edge: Pick<Edge, 'source' | 'sourceHandle' | 'label'>
): string {
  const source = nodes.find((n) => n.id === edge.source);
  if (!source) return edge.sourceHandle ? String(edge.sourceHandle) : '';
  const handle = edge.sourceHandle != null ? String(edge.sourceHandle) : '';
  if (!handle) {
    return source.data.outputs[0]?.name || '';
  }
  const port =
    source.data.outputs.find((p) => p.id === handle) ||
    source.data.outputs.find((p) => p.name === handle);
  if (!port) return handle;
  // Empty port names (sequence docks) must not become edge labels.
  return port.name || '';
}

/** Show an on-edge label for branches, sequence messages, or explicit labels. */
export function shouldShowEdgeLabel(
  nodes: Node<FlowNodeData>[],
  edge: Pick<Edge, 'source' | 'target' | 'label'>
): boolean {
  if (edge.label != null && String(edge.label).trim()) return true;
  const source = nodes.find((n) => n.id === edge.source);
  const target = nodes.find((n) => n.id === edge.target);
  if (!source) return false;
  if (source.data.kind === 'participant' || target?.data.kind === 'participant') {
    return !!(edge.label && String(edge.label).trim());
  }
  if (source.data.kind === 'decision' || source.data.kind === 'question') return true;
  return source.data.outputs.length > 1;
}

/** Ensure edges carry sourceHandle/targetHandle and a branch label when useful. */
export function decorateFlowEdges(
  nodes: Node<FlowNodeData>[],
  edges: Edge[]
): Edge[] {
  return edges.map((e) => {
    const source = nodes.find((n) => n.id === e.source);
    const target = nodes.find((n) => n.id === e.target);
    const sourceHandle =
      e.sourceHandle || source?.data.outputs[0]?.id || undefined;
    const targetHandle =
      e.targetHandle || target?.data.inputs[0]?.id || undefined;
    const explicit = e.label != null ? String(e.label).trim() : '';
    const inferred = edgeOutputLabel(nodes, { ...e, sourceHandle });
    const labelCandidate = explicit || inferred;
    const showLabel = shouldShowEdgeLabel(nodes, {
      source: e.source,
      target: e.target,
      label: labelCandidate,
    });
    const label = showLabel ? labelCandidate : undefined;
    return {
      ...e,
      sourceHandle,
      targetHandle,
      label: label || undefined,
      labelStyle: label
        ? {
            fill: 'var(--text)',
            fontSize: 10,
            fontWeight: 600,
          }
        : undefined,
      labelBgStyle: label
        ? {
            fill: 'var(--panel)',
            fillOpacity: 0.95,
          }
        : undefined,
      labelBgPadding: label ? ([3, 5] as [number, number]) : undefined,
      labelBgBorderRadius: label ? 4 : undefined,
    };
  });
}

/** When a node's outputs change, refresh labels on outgoing edges. */
export function syncOutgoingEdgeLabels(
  nodes: Node<FlowNodeData>[],
  edges: Edge[],
  nodeId: string
): Edge[] {
  return decorateFlowEdges(
    nodes,
    edges.map((e) => (e.source === nodeId ? { ...e, label: undefined } : e))
  );
}
