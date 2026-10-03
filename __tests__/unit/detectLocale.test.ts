import { detectLocaleFromHints } from '../../lib/i18n/detectLocale';

describe('detectLocaleFromHints', () => {
  it('prefers cookie over Accept-Language', () => {
    expect(detectLocaleFromHints('pt', '', 'en-US,en;q=0.9')).toBe('pt');
  });

  it('uses country hints when no cookie', () => {
    expect(detectLocaleFromHints(undefined, 'ES', 'en')).toBe('es');
    expect(detectLocaleFromHints(undefined, 'PT', 'en')).toBe('pt');
    expect(detectLocaleFromHints(undefined, 'FR', 'en')).toBe('fr');
  });

  it('falls back to Accept-Language then en', () => {
    expect(detectLocaleFromHints(undefined, '', 'fr-FR,fr;q=0.9')).toBe('fr');
    expect(detectLocaleFromHints(undefined, '', 'de-DE')).toBe('en');
  });

  it('ignores invalid cookie values', () => {
    expect(detectLocaleFromHints('de', 'PT', 'en')).toBe('pt');
  });
});
