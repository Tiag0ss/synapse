import { mermaidToFlow } from '@/lib/flowMermaid';
import { parseSequenceDiagram, sequenceToFlow } from '@/lib/flowSequence';

describe('flowSequence', () => {
  const sample = `sequenceDiagram
  participant User
  participant Synapse
  participant PM
  User->>Synapse: toggle checkbox
  Synapse->>PM: push status
  Synapse->>PM: pull status
`;

  it('parses participants and messages', () => {
    const { participants, messages } = parseSequenceDiagram(sample);
    expect(participants).toEqual(['User', 'Synapse', 'PM']);
    expect(messages).toHaveLength(3);
    expect(messages[0]).toMatchObject({
      from: 'User',
      to: 'Synapse',
      label: 'toggle checkbox',
    });
  });

  it('builds participant nodes with lifeline docks', () => {
    const { nodes, edges } = sequenceToFlow(sample);
    expect(nodes).toHaveLength(3);
    expect(nodes.every((n) => n.data.kind === 'participant')).toBe(true);
    expect(edges).toHaveLength(3);
    expect(edges[0].label).toBe('toggle checkbox');
    expect(edges[0].sourceHandle).toMatch(/^R/);
    expect(edges[0].targetHandle).toMatch(/^L/);
  });

  it('routes sequenceDiagram through mermaidToFlow', () => {
    const { nodes, edges } = mermaidToFlow(sample);
    expect(nodes).toHaveLength(3);
    expect(edges[2].label).toBe('pull status');
  });
});
