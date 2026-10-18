import {
  relativeFrom,
  rewriteStaticWikilinks,
} from '../../server/services/vaultStaticWikiHelpers';

describe('vaultStaticWikiHelpers', () => {
  it('builds relative hrefs from nested pages', () => {
    expect(relativeFrom('pages/meta/risks.html', 'pages/meta/plan.html')).toBe('plan.html');
    expect(relativeFrom('pages/meta/risks.html', 'index.html')).toBe('../../index.html');
    expect(relativeFrom('index.html', 'pages/a.html')).toBe('pages/a.html');
    expect(relativeFrom('pages/a.html', 'media/1-x.png')).toBe('../media/1-x.png');
  });

  it('rewrites [[wikilinks]] to markdown links and leaves ![[embeds]]', () => {
    const notes = [
      { id: 1, title: 'meta/risks', path: 'meta/risks.md', kind: 'note' },
      { id: 2, title: 'Board', path: 'Board.md', kind: 'whiteboard' },
    ];
    const paths = new Map([
      [1, 'pages/meta/risks.html'],
      [2, 'pages/Board.html'],
    ]);
    const md = 'See [[meta/risks|Risks]] and ![[Board]] plus [[missing]].';
    const out = rewriteStaticWikilinks(md, notes, paths, 'pages/home.html');
    expect(out).toContain('[Risks](meta/risks.html)');
    expect(out).toContain('![[Board]]');
    expect(out).toContain('missing');
    expect(out).not.toMatch(/\!\[Board\]\(/);
  });
});
