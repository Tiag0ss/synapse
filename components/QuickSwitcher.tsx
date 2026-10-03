'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { readRecentNoteIds } from '@/lib/recentNotes';
import { useI18n } from '@/lib/i18n/provider';

export interface QuickSwitcherHit {
  id: number;
  title: string;
  path: string;
  snippet?: string;
  matchIn?: 'title' | 'path' | 'body' | 'tag' | 'recent';
}

interface QuickSwitcherProps {
  open: boolean;
  /** Authenticated vault search (`/api/vaults/:id/search`). Ignored when `searchUrl` is set. */
  vaultId?: string;
  /** Synapse user id for recent-notes keying (optional). */
  userId?: number | null;
  /** Full search endpoint prefix or path that accepts `?q=` and `&limit=`. */
  searchUrl?: string;
  notes: Array<{ id: number; title: string; path: string }>;
  onClose: () => void;
  onOpenNote: (id: number) => void;
}

export default function QuickSwitcher({
  open,
  vaultId,
  userId,
  searchUrl,
  notes,
  onClose,
  onOpenNote,
}: QuickSwitcherProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<QuickSwitcherHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [recentTick, setRecentTick] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setHits([]);
    setActive(0);
    setRecentTick((n) => n + 1);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const localHits: QuickSwitcherHit[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byId = new Map(notes.map((n) => [n.id, n]));
    if (!q) {
      if (vaultId) {
        const recentIds = readRecentNoteIds(vaultId, userId);
        const recentHits: QuickSwitcherHit[] = [];
        for (const id of recentIds) {
          const n = byId.get(id);
          if (!n) continue;
          recentHits.push({
            id: n.id,
            title: n.title,
            path: n.path,
            matchIn: 'recent',
          });
          if (recentHits.length >= 40) break;
        }
        if (recentHits.length) return recentHits;
      }
      return notes
        .slice()
        .sort((a, b) => a.path.localeCompare(b.path))
        .slice(0, 40)
        .map((n) => ({
          id: n.id,
          title: n.title,
          path: n.path,
          matchIn: 'title' as const,
        }));
    }
    return notes
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.path.toLowerCase().includes(q) ||
          n.title.split('/').pop()?.toLowerCase().includes(q)
      )
      .slice(0, 40)
      .map((n) => ({
        id: n.id,
        title: n.title,
        path: n.path,
        matchIn: 'title' as const,
      }));
  }, [notes, query, vaultId, userId, recentTick]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = window.setTimeout(() => {
      void (async () => {
        try {
          const endpoint =
            searchUrl ||
            (vaultId ? `/api/vaults/${vaultId}/search` : null);
          if (!endpoint) {
            setHits([]);
            return;
          }
          const sep = endpoint.includes('?') ? '&' : '?';
          const res = await fetch(
            `${endpoint}${sep}q=${encodeURIComponent(q)}&limit=40`,
            { credentials: 'include' }
          );
          const data = await res.json();
          if (res.ok) {
            setHits(
              (data.data || []).map(
                (r: {
                  id: number;
                  title: string;
                  path: string;
                  snippet?: string;
                  matchIn?: QuickSwitcherHit['matchIn'];
                }) => ({
                  id: Number(r.id),
                  title: String(r.title),
                  path: String(r.path),
                  snippet: r.snippet ? String(r.snippet) : undefined,
                  matchIn: r.matchIn,
                })
              )
            );
          }
        } finally {
          setLoading(false);
        }
      })();
    }, 200);
    return () => window.clearTimeout(t);
  }, [query, open, vaultId, searchUrl]);

  const display = query.trim().length >= 2 && hits.length ? hits : localHits;
  const emptyIsRecent =
    !query.trim() && display.length > 0 && display.every((h) => h.matchIn === 'recent');

  useEffect(() => {
    setActive(0);
  }, [display.length, query]);

  if (!open) return null;

  const choose = (id: number) => {
    onOpenNote(id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('common.jump')}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl"
      >
        <div className="border-b border-[var(--border)] px-3 py-2">
          <input
            ref={inputRef}
            className="input w-full border-0 bg-transparent py-2 shadow-none focus:ring-0"
            placeholder={t('common.jumpPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, Math.max(0, display.length - 1)));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((i) => Math.max(0, i - 1));
              } else if (e.key === 'Enter' && display[active]) {
                e.preventDefault();
                choose(display[active].id);
              }
            }}
          />
        </div>
        {emptyIsRecent && (
          <p className="border-b border-[var(--border)] px-4 py-1.5 text-[11px] text-[var(--muted)]">
            {t('common.recentNotes')}
          </p>
        )}
        <ul className="max-h-[50vh] overflow-auto py-1">
          {display.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-[var(--muted)]">
              {loading
                ? t('common.searching')
                : query.trim()
                  ? t('common.noMatches')
                  : t('common.noNotesYet')}
            </li>
          )}
          {display.map((hit, i) => (
            <li key={hit.id}>
              <button
                type="button"
                className={`flex w-full flex-col gap-0.5 px-4 py-2.5 text-left ${
                  i === active ? 'bg-[var(--surface-2)]' : 'hover:bg-[var(--surface)]/80'
                }`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(hit.id)}
              >
                <span className="truncate text-sm font-medium text-[var(--text)]">{hit.title}</span>
                <span className="truncate font-mono text-[11px] text-[var(--muted)]">
                  {hit.path.replace(/\.md$/i, '')}
                  {hit.matchIn === 'body'
                    ? ' · body'
                    : hit.matchIn === 'tag'
                      ? ' · tag'
                      : hit.matchIn === 'recent'
                        ? ' · recent'
                        : ''}
                </span>
                {hit.snippet && (
                  <span className="line-clamp-2 text-xs text-[var(--muted)]">{hit.snippet}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <footer className="border-t border-[var(--border)] px-4 py-2 text-[11px] text-[var(--muted)]">
          ↑↓ navigate · Enter open · Esc close · Ctrl/Cmd+O
        </footer>
      </div>
    </div>
  );
}
