// sanitize-html's htmlparser2 dependency is ESM-only; mock it out like other
// unit tests that pull in server/services/markdown.ts transitively.
jest.mock('../../server/services/sanitizeSynapseHtml', () => ({
  sanitizeSynapseHtml: (html: string) => html,
}));

import { buildIndexMarkdown } from '../../server/services/vaultIndexNote';

describe('buildIndexMarkdown', () => {
  it('renders a placeholder when the vault has no notes', () => {
    const body = buildIndexMarkdown('My Vault', []);
    expect(body).toContain('# My Vault');
    expect(body).toContain('_No notes yet._');
    expect(body).toContain('<!-- synapse:index-note auto-generated=true notes=0 -->');
  });

  it('lists root notes as wikilinks', () => {
    const body = buildIndexMarkdown('My Vault', [
      { Id: 1, Title: 'alpha', Path: 'alpha.md', Kind: 'note' },
      { Id: 2, Title: 'beta', Path: 'beta.md', Kind: 'note' },
    ]);
    expect(body).toContain('[[alpha|alpha]]');
    expect(body).toContain('[[beta|beta]]');
    expect(body).toContain('<!-- synapse:index-note auto-generated=true notes=2 -->');
  });

  it('groups notes under folder headings', () => {
    const body = buildIndexMarkdown('My Vault', [
      { Id: 1, Title: 'risks', Path: 'meta/risks.md', Kind: 'note' },
      { Id: 2, Title: 'glossary', Path: 'meta/glossary.md', Kind: 'note' },
      { Id: 3, Title: 'home', Path: 'home.md', Kind: 'note' },
    ]);
    const lines = body.split('\n');
    const folderIdx = lines.findIndex((l) => l.includes('**meta/**'));
    expect(folderIdx).toBeGreaterThan(-1);
    expect(lines[folderIdx + 1]).toContain('[[meta/glossary|glossary]]');
    expect(lines[folderIdx + 2]).toContain('[[meta/risks|risks]]');
    expect(body).toContain('[[home|home]]');
  });

  it('lists whiteboard notes as plain wikilinks (no emoji prefix)', () => {
    const body = buildIndexMarkdown('My Vault', [
      { Id: 1, Title: 'board', Path: 'board.md', Kind: 'whiteboard' },
    ]);
    expect(body).toContain('[[board|board]]');
    expect(body).not.toContain('🖼️');
  });
});
