import { flowToMermaid, mermaidToFlow } from '@/lib/flowMermaid';
import type { FlowNodeData } from '@/lib/flowDocument';
import type { Edge, Node } from '@xyflow/react';

describe('flowMermaid', () => {
  it('round-trips a simple flowchart', () => {
    const mermaid = `flowchart TD
  start((Start))
  ask{Ready?}
  done((End))
  start --> ask
  ask -->|yes| done
  ask -->|no| done
`;
    const { nodes, edges } = mermaidToFlow(mermaid);
    expect(nodes.length).toBeGreaterThanOrEqual(3);
    expect(edges.length).toBe(3);
    const start = nodes.find((n) => n.data.kind === 'start');
    const decision = nodes.find((n) => n.data.kind === 'decision');
    expect(start).toBeTruthy();
    expect(decision).toBeTruthy();

    const out = flowToMermaid(nodes as Node<FlowNodeData>[], edges as Edge[]);
    expect(out).toMatch(/flowchart TD/);
    expect(out).toMatch(/-->/);
  });

  it('exports process nodes as rectangles', () => {
    const nodes: Node<FlowNodeData>[] = [
      {
        id: 'a',
        type: 'flowObject',
        position: { x: 0, y: 0 },
        data: {
          label: 'Do work',
          kind: 'process',
          inputs: [{ id: 'in', name: 'in' }],
          outputs: [{ id: 'out', name: 'out' }],
        },
      },
    ];
    expect(flowToMermaid(nodes, [])).toContain('a[Do work]');
  });
});
