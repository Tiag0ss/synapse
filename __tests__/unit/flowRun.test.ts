import type { Edge, Node } from '@xyflow/react';
import type { FlowNodeData } from '@/lib/flowDocument';
import { answerFlowRun, startFlowRun } from '@/lib/flowRun';

const nodes: Node<FlowNodeData>[] = [
  {
    id: 'start',
    type: 'flowObject',
    position: { x: 0, y: 0 },
    data: {
      label: 'Start',
      kind: 'start',
      inputs: [],
      outputs: [{ id: 'out', name: 'out' }],
    },
  },
  {
    id: 'q1',
    type: 'flowObject',
    position: { x: 200, y: 0 },
    data: {
      label: 'Branch',
      kind: 'question',
      inputs: [{ id: 'in', name: 'in' }],
      outputs: [
        { id: 'yes', name: 'yes' },
        { id: 'no', name: 'no' },
      ],
      question: 'Continue?',
      options: [
        { id: 'yes', label: 'Yes', outputId: 'yes' },
        { id: 'no', label: 'No', outputId: 'no' },
      ],
    },
  },
  {
    id: 'endYes',
    type: 'flowObject',
    position: { x: 400, y: -40 },
    data: {
      label: 'Yes end',
      kind: 'end',
      inputs: [{ id: 'in', name: 'in' }],
      outputs: [],
    },
  },
  {
    id: 'endNo',
    type: 'flowObject',
    position: { x: 400, y: 40 },
    data: {
      label: 'No end',
      kind: 'end',
      inputs: [{ id: 'in', name: 'in' }],
      outputs: [],
    },
  },
];

const edges: Edge[] = [
  { id: 'e1', source: 'start', target: 'q1', sourceHandle: 'out', targetHandle: 'in' },
  { id: 'e2', source: 'q1', target: 'endYes', sourceHandle: 'yes', targetHandle: 'in' },
  { id: 'e3', source: 'q1', target: 'endNo', sourceHandle: 'no', targetHandle: 'in' },
];

describe('flowRun', () => {
  it('stops on question and follows the chosen option', () => {
    const waiting = startFlowRun(nodes, edges);
    expect(waiting.status).toBe('waiting');
    expect(waiting.prompt?.question).toBe('Continue?');

    const done = answerFlowRun(nodes, edges, waiting, 'no');
    expect(done.status).toBe('done');
    expect(done.currentNodeId).toBe('endNo');
    expect(done.path).toEqual(['start', 'q1', 'endNo']);
  });
});
