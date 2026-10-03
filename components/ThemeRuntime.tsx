'use client';

import { useEffect } from 'react';
import { applyThemePreferences, getStoredThemeMode, applyThemeMode } from '@/lib/theme';

/** Keep theme in sync with localStorage and system preference changes. */
export default function ThemeRuntime() {
  useEffect(() => {
    applyThemePreferences();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (getStoredThemeMode() === 'system') applyThemeMode('system');
    };
    mq.addEventListener('change', onChange);
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'themeMode' || e.key === 'themePalette') applyThemePreferences();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      mq.removeEventListener('change', onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  return null;
}
