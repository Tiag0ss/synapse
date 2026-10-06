'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/provider';

type NotifItem = {
  id: number;
  kind: string;
  title: string;
  body: string | null;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

export default function NotificationsBell({ dense = false }: { dense?: boolean }) {
  const router = useRouter();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotifItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications', { credentials: 'include' });
      const json = await res.json();
      if (res.ok) {
        setItems(json.data?.items || []);
        setUnreadCount(Number(json.data?.unreadCount || 0));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const t = window.setInterval(() => void load(), 60_000);
    return () => window.clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    void load();
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
  }, [open, load]);

  const markRead = async (id: number) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST', credentials: 'include' });
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: n.readAt || new Date().toISOString() } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAll = async () => {
    await fetch('/api/notifications/read-all', { method: 'POST', credentials: 'include' });
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={`relative inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel)]/80 text-[var(--muted)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] ${
          dense ? 'h-9 w-9' : 'h-10 w-10'
        }`}
        aria-label={
          unreadCount
            ? t('chrome.unreadNotifications', { count: unreadCount })
            : t('nav.notifications')
        }
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 9a6 6 0 1 1 12 0c0 3.5 1.5 5 2 6H4c.5-1 2-2.5 2-6Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M10 19a2 2 0 0 0 4 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-[var(--accent-fg)]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
            <p className="text-sm font-semibold text-[var(--text)]">{t('nav.notifications')}</p>
            {unreadCount > 0 && (
              <button type="button" className="btn-ghost py-0.5 text-[11px]" onClick={() => void markAll()}>
                {t('nav.markAllRead')}
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-auto">
            {loading && items.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-[var(--muted)]">{t('common.loading')}</li>
            ) : items.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-[var(--muted)]">{t('nav.noNotifications')}</li>
            ) : (
              items.map((n) => (
                <li key={n.id} className="border-b border-[var(--border)] last:border-0">
                  <button
                    type="button"
                    className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left hover:bg-[var(--surface-2)]/60 ${
                      n.readAt ? 'opacity-70' : ''
                    }`}
                    onClick={() => {
                      void markRead(n.id);
                      setOpen(false);
                      if (n.href) router.push(n.href);
                    }}
                  >
                    <span className="text-sm font-medium text-[var(--text)]">{n.title}</span>
                    {n.body ? (
                      <span className="text-[11px] text-[var(--muted)]">{n.body}</span>
                    ) : null}
                    <span className="text-[10px] text-[var(--muted)]">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
