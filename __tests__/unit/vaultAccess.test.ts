import {
  canListNoteOnWiki,
  canListVaultInWikiDirectory,
  canOpenNoteOnWiki,
  canOpenVaultApp,
  canOpenVaultWiki,
  effectiveVisibility,
  hasWikiShare,
  normalizeMemberRole,
  roleMeets,
} from '../../server/services/vaultAccess';

describe('vaultAccess visibility helpers', () => {
  it('ranks roles for vault app vs wiki share', () => {
    expect(roleMeets('owner', 'edit')).toBe(true);
    expect(roleMeets('read', 'edit')).toBe(false);
    expect(canOpenVaultApp('edit')).toBe(true);
    expect(canOpenVaultApp('read')).toBe(false);
    expect(hasWikiShare('read')).toBe(true);
    expect(hasWikiShare(null)).toBe(false);
    expect(normalizeMemberRole('EDIT')).toBe('edit');
    expect(normalizeMemberRole('owner')).toBeNull();
  });

  it('gates vault wiki by default visibility', () => {
    expect(canOpenVaultWiki('public', false, false).ok).toBe(true);
    expect(canOpenVaultWiki('unlisted', false, false).ok).toBe(true);
    expect(canOpenVaultWiki('authenticated', false, false)).toEqual({
      ok: false,
      reason: 'auth',
    });
    expect(canOpenVaultWiki('authenticated', true, false).ok).toBe(true);
    expect(canOpenVaultWiki('private', true, false)).toEqual({
      ok: false,
      reason: 'forbidden',
    });
    expect(canOpenVaultWiki('private', true, true).ok).toBe(true);
  });

  it('hides unlisted vaults from the wiki directory', () => {
    expect(canListVaultInWikiDirectory('unlisted', true, true)).toBe(false);
    expect(canListVaultInWikiDirectory('public', false, false)).toBe(true);
    expect(canListVaultInWikiDirectory('private', true, false)).toBe(false);
    expect(canListVaultInWikiDirectory('private', true, true)).toBe(true);
  });

  it('applies note visibility for list vs open (including unlisted peek)', () => {
    expect(effectiveVisibility(null, 'authenticated')).toBe('authenticated');
    expect(canListNoteOnWiki('unlisted', true, false)).toBe(false);
    expect(canListNoteOnWiki('unlisted', true, true)).toBe(true);
    expect(canOpenNoteOnWiki('unlisted', false, false)).toEqual({
      ok: true,
      robots: 'noindex,nofollow',
    });
    expect(canOpenNoteOnWiki('private', true, false)).toEqual({
      ok: false,
      robots: 'noindex,nofollow',
      reason: 'private',
    });
    expect(canOpenNoteOnWiki('private', true, true).ok).toBe(true);
    expect(canOpenNoteOnWiki('authenticated', false, false).reason).toBe('auth');
  });
});
