'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/lib/i18n/provider';
import type { WhatsNewEntry } from '@/lib/whatsNew';

interface WhatsNewModalProps {
  open: boolean;
  mode: 'delta' | 'full';
  currentVersion: string;
  entries: WhatsNewEntry[];
  onClose: () => void;
  /** When true, primary button acknowledges (PATCH) — used for auto delta modal. */
  acknowledgeOnClose?: boolean;
  acknowledging?: boolean;
}

function compareSemverDesc(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i += 1) {
    const d = (pb[i] || 0) - (pa[i] || 0);
    if (d !== 0) return d;
  }
  return 0;
}

export default function WhatsNewModal({
  open,
  mode,
  currentVersion,
  entries,
  onClose,
  acknowledgeOnClose = false,
  acknowledging = false,
}: WhatsNewModalProps) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !acknowledging) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, acknowledging]);

  if (!open || !mounted) return null;

  const title =
    mode === 'full' ? t('chrome.whatsNew') : t('chrome.whatsNewSinceLastVisit');
  const primaryLabel = acknowledgeOnClose ? t('chrome.whatsNewGotIt') : t('common.close');

  const sorted = [...entries].sort((a, b) => compareSemverDesc(a.version, b.version));

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !acknowledging) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="whats-new-title"
        className="my-auto flex max-h-[min(640px,calc(100dvh-2rem))] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="shrink-0 border-b border-[var(--border)] px-5 py-4">
          <h2 id="whats-new-title" className="text-lg font-semibold text-[var(--text)]">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {t('chrome.whatsNewCurrentVersion', { version: currentVersion })}
          </p>
        </header>
        <div className="min-h-0 flex-1 space-y-5 overflow-auto px-5 py-4">
          {sorted.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">{t('chrome.whatsNewEmpty')}</p>
          ) : (
            sorted.map((entry) => (
              <section key={entry.version} className="space-y-2">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    {entry.version}
                    {entry.title ? ` — ${entry.title}` : ''}
                  </h3>
                  {entry.date ? (
                    <span className="text-xs text-[var(--muted)]">{entry.date}</span>
                  ) : null}
                </div>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--text)]">
                  {(entry.items || []).map((item, index) => (
                    <li key={`${entry.version}-${index}`}>{item}</li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
        <footer className="flex shrink-0 justify-end border-t border-[var(--border)] px-5 py-3">
          <button
            type="button"
            className="btn-primary"
            disabled={acknowledging}
            onClick={onClose}
          >
            {acknowledging ? t('chrome.whatsNewSaving') : primaryLabel}
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
