import { DEFAULT_THEME_PALETTE, isThemeMode, isThemePalette } from '../../lib/theme';

describe('theme palette guard', () => {
  it('accepts known modes and palettes', () => {
    expect(isThemeMode('system')).toBe(true);
    expect(isThemeMode('light')).toBe(true);
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('auto')).toBe(false);
    expect(isThemePalette('synapse')).toBe(true);
    expect(isThemePalette('catppuccin')).toBe(true);
    expect(isThemePalette('ocean')).toBe(true);
    expect(isThemePalette('forest')).toBe(true);
    expect(isThemePalette('purple')).toBe(false);
    expect(DEFAULT_THEME_PALETTE).toBe('synapse');
  });
});
