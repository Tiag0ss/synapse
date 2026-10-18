import {
  applyHunkFromLeft,
  applyHunkKeepBoth,
  buildSideBySideDiff,
  groupDiffHunks,
} from '../../lib/sideBySideDiff';

describe('sideBySideDiff merge hunks', () => {
  it('pairs different lines at the same spot as replace', () => {
    const rows = buildSideBySideDiff('common\nisto é um teste\nend', 'common\ncenas maradas\nend');
    expect(rows.some((r) => r.op === 'replace')).toBe(true);
    const hunks = groupDiffHunks(rows);
    expect(hunks).toHaveLength(1);
  });

  it('replace with server drops the local line', () => {
    const rows = buildSideBySideDiff('common\nisto é um teste\nend', 'common\ncenas maradas\nend');
    const [hunk] = groupDiffHunks(rows);
    expect(applyHunkFromLeft(rows, hunk)).toBe('common\nisto é um teste\nend');
  });

  it('add from server keeps both lines', () => {
    const rows = buildSideBySideDiff('common\nisto é um teste\nend', 'common\ncenas maradas\nend');
    const [hunk] = groupDiffHunks(rows);
    expect(applyHunkKeepBoth(rows, hunk)).toBe('common\nisto é um teste\ncenas maradas\nend');
  });

  it('add from server on delete-only restores the missing line', () => {
    const rows = buildSideBySideDiff('a\nserver only\nb', 'a\nb');
    const [hunk] = groupDiffHunks(rows);
    expect(applyHunkKeepBoth(rows, hunk)).toBe('a\nserver only\nb');
  });
});
