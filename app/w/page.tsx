'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppUserMenu from '@/components/AppUserMenu';
import { useI18n } from '@/lib/i18n/provider';

interface PublicWikiItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  defaultVisibility: string;
  noteCount: number;
  hasAccess: boolean;
  canOpenVault?: boolean;
  visibilityHint: 'public' | 'authenticated' | 'private' | 'access';
}

export default function PublicWikisDirectoryPage() {
  const { t } = useI18n();

  const hintLabel = (hint: PublicWikiItem['visibilityHint']): string => {
    switch (hint) {
      case 'access':
        return t('home.roleShared');
      case 'authenticated':
        return t('chrome.signedInUsers');
      case 'private':
        return t('chrome.visPrivate');
      default:
        return t('chrome.visPublic');
    }
  };
  const [wikis, setWikis] = useState<PublicWikiItem[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/public', { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || t('status.failedToLoadWikis'));
          return;
        }
        setWikis(data.data?.wikis || []);
        setAuthenticated(Boolean(data.data?.authenticated));
      } catch {
        setError(t('status.networkError'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = wikis.filter((w) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return (
      w.name.toLowerCase().includes(needle) ||
      w.slug.toLowerCase().includes(needle) ||
      (w.description || '').toLowerCase().includes(needle)
    );
  });

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-soft)]">
            Synapse
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{t('chrome.publicWikis')}</h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
            {t('chrome.publicWikisDirHint')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {authenticated && (
            <Link href="/" className="btn-ghost no-underline hover:no-underline">
              {t('home.vaults')}
            </Link>
          )}
          <AppUserMenu dense showSignInWhenGuest />
        </div>
      </header>

      <div className="mb-6">
        <input
          className="input w-full max-w-md"
          placeholder={t('chrome.filterWikis')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading && <p className="text-sm text-[var(--muted)]">{t('common.loading')}</p>}
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-10 text-center text-sm text-[var(--muted)]">
          {q.trim()
            ? t('status.noWikisMatchFilter')
            : authenticated
              ? t('chrome.noPublicWikisVisible')
              : t('chrome.noPublicWikisSignIn')}
        </p>
      )}

      <section className="space-y-2">
        {filtered.map((w) => (
          <Link
            key={w.id}
            href={`/w/${w.slug}`}
            className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel)]/50 px-4 py-3.5 no-underline transition hover:border-[var(--accent)]/50 hover:bg-[var(--surface-2)]/80 hover:no-underline"
          >
            <div className="min-w-0">
              <div className="font-medium text-[var(--text)] group-hover:text-[var(--accent-soft)]">
                {w.name}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[var(--muted)]">
                <span className="font-mono">/w/{w.slug}</span>
                <span aria-hidden>·</span>
                <span>
                  {w.noteCount === 1
                    ? t('chrome.noteCountOne', { count: w.noteCount })
                    : t('chrome.notesCount', { count: w.noteCount })}
                </span>
                <span aria-hidden>·</span>
                <span
                  className={
                    w.visibilityHint === 'access'
                      ? 'text-[var(--accent-soft)]'
                      : w.visibilityHint === 'authenticated'
                        ? 'text-sky-300'
                        : ''
                  }
                >
                  {hintLabel(w.visibilityHint)}
                </span>
              </div>
              {w.description && (
                <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{w.description}</p>
              )}
            </div>
            <span className="text-[var(--muted)] transition group-hover:text-[var(--accent-soft)]">
              →
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
