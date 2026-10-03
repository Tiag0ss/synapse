import {
  exactPmTaskNameMatch,
  normalizePmMatchKey,
} from '../../server/services/linkCheckboxMatch';

describe('link checkbox match helpers', () => {
  it('normalizes markup and punctuation for matching', () => {
    expect(normalizePmMatchKey('  Fix [[Auth]] flow!  ')).toBe('fix auth flow');
    expect(normalizePmMatchKey('A &amp; B')).toBe('a b');
  });

  it('matches a unique normalized task name', () => {
    const tasks = [
      { id: 10, taskName: 'Ship search', description: 'FULLTEXT' },
      { id: 11, taskName: 'Other', description: '' },
    ];
    expect(exactPmTaskNameMatch('Ship search', tasks)?.id).toBe(10);
    expect(exactPmTaskNameMatch('', tasks)).toBeNull();
    expect(exactPmTaskNameMatch('Ship', tasks)).toBeNull();
  });
});
