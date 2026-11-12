// sanitize-html's htmlparser2 dependency is ESM-only; mock it out like other
// unit tests that pull in server/services/markdown.ts transitively.
jest.mock('../../server/services/sanitizeSynapseHtml', () => ({
  sanitizeSynapseHtml: (html: string) => html,
}));

import { mergeNoteTaskWithLink } from '../../server/mcp/toolHandlers';
import type { NoteTaskCandidate } from '../../server/services/noteTasks';
import type { CheckboxLinkRow } from '../../server/services/pmCheckboxSync';

function candidate(overrides: Partial<NoteTaskCandidate> = {}): NoteTaskCandidate {
  return {
    index: 0,
    checked: false,
    partial: false,
    mark: ' ',
    text: 'Write docs',
    markerId: 'c1',
    lineIndex: 0,
    rawLine: '- [ ] Write docs',
    indent: 0,
    source: 'checkbox',
    ...overrides,
  };
}

describe('mergeNoteTaskWithLink', () => {
  it('attaches the Myelin task link when the marker matches', () => {
    const links = new Map<string, CheckboxLinkRow>([
      ['c1', { MarkerId: 'c1', PmTaskId: 42, PmProjectId: 7, Checked: 0 }],
    ]);
    const merged = mergeNoteTaskWithLink(candidate(), links);
    expect(merged).toMatchObject({
      markerId: 'c1',
      text: 'Write docs',
      pmTaskId: 42,
      pmProjectId: 7,
    });
  });

  it('leaves pmTaskId/pmProjectId null when there is no link', () => {
    const merged = mergeNoteTaskWithLink(candidate({ markerId: 'other' }), new Map());
    expect(merged.pmTaskId).toBeNull();
    expect(merged.pmProjectId).toBeNull();
  });

  it('prefers taskText (estimate/category stripped) over the raw label', () => {
    const merged = mergeNoteTaskWithLink(
      candidate({ text: 'Write docs (2h, Design)', taskText: 'Write docs', category: 'Design' }),
      new Map()
    );
    expect(merged.text).toBe('Write docs');
    expect(merged.category).toBe('Design');
  });

  it('surfaces cancelled frontmatter todos', () => {
    const merged = mergeNoteTaskWithLink(
      candidate({ source: 'frontmatter', markerId: null, cancelled: true, linkedNote: 'meta/risks' }),
      new Map()
    );
    expect(merged.source).toBe('frontmatter');
    expect(merged.cancelled).toBe(true);
    expect(merged.linkedNote).toBe('meta/risks');
  });
});
