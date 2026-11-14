import type { Edge, Node } from '@xyflow/react';
import type { FlowNodeData, FlowOption } from '@/lib/flowDocument';

export type FlowRunPrompt = {
  nodeId: string;
  label: string;
  question: string;
  options: FlowOption[];
};

export type FlowRunState = {
  status: 'idle' | 'running' | 'waiting' | 'done' | 'error';
  currentNodeId: string | null;
  path: string[];
  prompt: FlowRunPrompt | null;
  message: string | null;
};

export function initialFlowRunState(): FlowRunState {
  return {
    status: 'idle',
    currentNodeId: null,
    path: [],
    prompt: null,
    message: null,
  };
}

function findStart(nodes: Node<FlowNodeData>[]): Node<FlowNodeData> | null {
  return nodes.find((n) => n.data.kind === 'start') || nodes[0] || null;
}

function outgoing(
  edges: Edge[],
  nodeId: string,
  sourceHandle?: string | null
): Edge[] {
  return edges.filter((e) => {
    if (e.source !== nodeId) return false;
    if (sourceHandle == null || sourceHandle === '') return true;
    return (e.sourceHandle || 'out') === sourceHandle;
  });
}

function optionsFor(node: Node<FlowNodeData>): FlowOption[] {
  if (node.data.options?.length) return node.data.options;
  if (node.data.kind === 'decision' || node.data.kind === 'question') {
    return node.data.outputs.map((o) => ({
      id: o.id,
      label: o.name || o.id,
      outputId: o.id,
    }));
  }
  return [];
}

/** Begin a run at the start node (or first node). */
export function startFlowRun(
  nodes: Node<FlowNodeData>[],
  edges: Edge[]
): FlowRunState {
  const start = findStart(nodes);
  if (!start) {
    return {
      ...initialFlowRunState(),
      status: 'error',
      message: 'No start node',
    };
  }
  return advanceToNode(nodes, edges, start.id, []);
}

function advanceToNode(
  nodes: Node<FlowNodeData>[],
  edges: Edge[],
  nodeId: string,
  path: string[]
): FlowRunState {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) {
    return {
      status: 'error',
      currentNodeId: nodeId,
      path,
      prompt: null,
      message: `Missing node ${nodeId}`,
    };
  }
  const nextPath = [...path, nodeId];

  if (node.data.kind === 'end') {
    return {
      status: 'done',
      currentNodeId: nodeId,
      path: nextPath,
      prompt: null,
      message: node.data.label || 'End',
    };
  }

  if (node.data.kind === 'decision' || node.data.kind === 'question') {
    const opts = optionsFor(node);
    return {
      status: 'waiting',
      currentNodeId: nodeId,
      path: nextPath,
      prompt: {
        nodeId,
        label: node.data.label,
        question: node.data.question || node.data.label || 'Choose an option',
        options: opts,
      },
      message: null,
    };
  }

  const outs = outgoing(edges, nodeId);
  if (!outs.length) {
    return {
      status: 'done',
      currentNodeId: nodeId,
      path: nextPath,
      prompt: null,
      message: node.data.label || 'Stopped (no outgoing edge)',
    };
  }
  // Auto-follow first outgoing for process/start.
  return advanceToNode(nodes, edges, outs[0].target, nextPath);
}

/** Answer a waiting prompt and continue. */
export function answerFlowRun(
  nodes: Node<FlowNodeData>[],
  edges: Edge[],
  state: FlowRunState,
  optionId: string
): FlowRunState {
  if (state.status !== 'waiting' || !state.prompt || !state.currentNodeId) {
    return state;
  }
  const opt =
    state.prompt.options.find((o) => o.id === optionId) ||
    state.prompt.options.find((o) => o.outputId === optionId);
  if (!opt) {
    return { ...state, status: 'error', message: 'Unknown option' };
  }
  const outs = outgoing(edges, state.currentNodeId, opt.outputId);
  if (!outs.length) {
    return {
      status: 'done',
      currentNodeId: state.currentNodeId,
      path: state.path,
      prompt: null,
      message: `No edge for option “${opt.label}”`,
    };
  }
  return advanceToNode(nodes, edges, outs[0].target, state.path);
}
