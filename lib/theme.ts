export type ThemeMode = 'system' | 'light' | 'dark';

export type ThemePalette = 'synapse' | 'catppuccin' | 'ocean' | 'forest';

export const THEME_PALETTES: ThemePalette[] = ['synapse', 'catppuccin', 'ocean', 'forest'];

export const DEFAULT_THEME_PALETTE: ThemePalette = 'synapse';

export const THEME_PALETTE_META: Record<
  ThemePalette,
  { label: string; swatchLight: string; swatchDark: string }
> = {
  synapse: { label: 'Synapse', swatchLight: '#0d9488', swatchDark: '#14b8a6' },
  catppuccin: { label: 'Catppuccin', swatchLight: '#8839ef', swatchDark: '#cba6f7' },
  ocean: { label: 'Ocean', swatchLight: '#0369a1', swatchDark: '#38bdf8' },
  forest: { label: 'Forest', swatchLight: '#059669', swatchDark: '#34d399' },
};

const THEME_STORAGE_KEY = 'themeMode';
const THEME_PALETTE_STORAGE_KEY = 'themePalette';

export const isThemeMode = (value: string): value is ThemeMode =>
  value === 'system' || value === 'light' || value === 'dark';

export const isThemePalette = (value: string): value is ThemePalette =>
  THEME_PALETTES.includes(value as ThemePalette);

export const getStoredThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (!stored || !isThemeMode(stored)) return 'system';
  return stored;
};

export const getStoredThemePalette = (): ThemePalette => {
  if (typeof window === 'undefined') return DEFAULT_THEME_PALETTE;
  const stored = localStorage.getItem(THEME_PALETTE_STORAGE_KEY);
  if (!stored || !isThemePalette(stored)) return DEFAULT_THEME_PALETTE;
  return stored;
};

const getResolvedTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'dark') return 'dark';
  if (mode === 'light') return 'light';
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const applyThemePalette = (palette: ThemePalette): void => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme-palette', palette);
};

export const applyThemeMode = (mode: ThemeMode): void => {
  if (typeof document === 'undefined') return;
  const resolvedTheme = getResolvedTheme(mode);
  const root = document.documentElement;
  root.classList.toggle('dark', resolvedTheme === 'dark');
  root.classList.toggle('light', resolvedTheme === 'light');
  root.setAttribute('data-theme-mode', mode);
};

export const applyThemePreferences = (): void => {
  applyThemeMode(getStoredThemeMode());
  applyThemePalette(getStoredThemePalette());
};

export const setThemeMode = (mode: ThemeMode): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }
  applyThemeMode(mode);
};

export const setThemePalette = (palette: ThemePalette): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_PALETTE_STORAGE_KEY, palette);
  }
  applyThemePalette(palette);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('theme-palette-change', { detail: palette }));
  }
};

/** Inline script before paint (FOUC prevention). */
export const THEME_EARLY_APPLY_SCRIPT = `
(function () {
  try {
    var themeMode = localStorage.getItem('themeMode');
    var themePalette = localStorage.getItem('themePalette');
    var resolved = themeMode === 'dark' ? 'dark' : themeMode === 'light' ? 'light'
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var root = document.documentElement;
    root.classList.toggle('dark', resolved === 'dark');
    root.classList.toggle('light', resolved === 'light');
    if (themeMode === 'system' || themeMode === 'light' || themeMode === 'dark') {
      root.setAttribute('data-theme-mode', themeMode);
    } else {
      root.setAttribute('data-theme-mode', 'system');
    }
    if (themePalette === 'synapse' || themePalette === 'catppuccin' || themePalette === 'ocean' || themePalette === 'forest') {
      root.setAttribute('data-theme-palette', themePalette);
    } else {
      root.setAttribute('data-theme-palette', 'synapse');
    }
  } catch (e) {}
})();
`.trim();
