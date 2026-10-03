'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserAvatar from '@/components/UserAvatar';
import {
  THEME_PALETTE_META,
  THEME_PALETTES,
  getStoredThemeMode,
  getStoredThemePalette,
  setThemeMode,
  setThemePalette,
  type ThemeMode,
  type ThemePalette,
} from '@/lib/theme';
import { useI18n } from '@/lib/i18n/provider';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/lib/i18n/config';

export type UserMenuUser = {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
};

interface UserMenuProps {
  user: UserMenuUser;
  /** Compact header on dense layouts */
  dense?: boolean;
}

export default function UserMenu({ user, dense = false }: UserMenuProps) {
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [themePalette, setThemePaletteState] = useState<ThemePalette>('synapse');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setThemeModeState(getStoredThemeMode());
    setThemePaletteState(getStoredThemePalette());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.replace('/');
    router.refresh();
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={`flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)]/80 py-1 pl-1 pr-2.5 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] ${
          dense ? 'max-w-[11rem]' : 'max-w-[14rem]'
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <UserAvatar userId={user.userId} name={user.username} size="sm" />
        <span className="min-w-0 text-left">
          <span className="block truncate text-xs font-semibold text-[var(--text)]">
            {user.username}
          </span>
          <span className="block truncate text-[10px] text-[var(--muted)]">{t('nav.signedIn')}</span>
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl shadow-black/50"
        >
          <div className="border-b border-[var(--border)] px-3 py-2.5">
            <p className="truncate text-sm font-medium text-[var(--text)]">{user.username}</p>
            <p className="truncate text-[11px] text-[var(--muted)]">{user.email}</p>
          </div>
          <div className="p-1.5">
            <Link
              role="menuitem"
              href="/profile"
              className="block rounded-lg px-2.5 py-2 text-sm text-[var(--text)] no-underline hover:bg-[var(--surface-2)] hover:no-underline"
              onClick={() => setOpen(false)}
            >
              {t('nav.profile')}
            </Link>
            <Link
              role="menuitem"
              href="/templates"
              className="block rounded-lg px-2.5 py-2 text-sm text-[var(--text)] no-underline hover:bg-[var(--surface-2)] hover:no-underline"
              onClick={() => setOpen(false)}
            >
              {t('nav.templates')}
            </Link>
            {user.isAdmin && (
              <Link
                role="menuitem"
                href="/settings"
                className="block rounded-lg px-2.5 py-2 text-sm text-[var(--text)] no-underline hover:bg-[var(--surface-2)] hover:no-underline"
                onClick={() => setOpen(false)}
              >
                {t('nav.settings')}
              </Link>
            )}
            <Link
              role="menuitem"
              href="/w"
              className="block rounded-lg px-2.5 py-2 text-sm text-[var(--text)] no-underline hover:bg-[var(--surface-2)] hover:no-underline"
              onClick={() => setOpen(false)}
            >
              {t('nav.wikis')}
            </Link>
          </div>
          <div className="border-t border-[var(--border)] px-3 py-2.5">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
              {t('nav.language')}
            </p>
            <select
              className="input mb-3 w-full py-1 text-xs"
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              aria-label={t('nav.language')}
            >
              {LOCALES.map((l) => (
                <option key={l} value={l}>
                  {LOCALE_LABELS[l]}
                </option>
              ))}
            </select>
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
              {t('nav.theme')}
            </p>
            <div className="mb-2 flex gap-1">
              {(['system', 'light', 'dark'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`flex-1 rounded-md border px-1 py-1 text-[10px] capitalize ${
                    themeMode === mode
                      ? 'border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--text)]'
                      : 'border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]'
                  }`}
                  onClick={() => {
                    setThemeMode(mode);
                    setThemeModeState(mode);
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              {THEME_PALETTES.map((palette) => {
                const meta = THEME_PALETTE_META[palette];
                const selected = themePalette === palette;
                return (
                  <button
                    key={palette}
                    type="button"
                    title={meta.label}
                    aria-label={`Palette ${meta.label}`}
                    className={`h-6 w-6 rounded-full border-2 ${
                      selected ? 'border-[var(--text)]' : 'border-transparent'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${meta.swatchLight}, ${meta.swatchDark})`,
                    }}
                    onClick={() => {
                      setThemePalette(palette);
                      setThemePaletteState(palette);
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="border-t border-[var(--border)] p-1.5">
            <button
              type="button"
              role="menuitem"
              className="w-full rounded-lg px-2.5 py-2 text-left text-sm text-red-300 hover:bg-red-500/10"
              onClick={() => void logout()}
            >
              {t('nav.logOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
