'use client';

import { useI18n } from '@/lib/i18n/provider';

export type NotePresencePeer = {
  userId: number;
  username: string;
  hasFocus: boolean;
  lastSeenAt: string;
};

function formatAgo(
  lastSeenAt: string,
  nowMs: number,
  t: (key: string, vars?: Record<string, string | number>) => string
): string {
  const then = new Date(lastSeenAt).getTime();
  if (!Number.isFinite(then)) return t('chrome.presenceJustNow');
  const sec = Math.max(0, Math.floor((nowMs - then) / 1000));
  if (sec < 5) return t('chrome.presenceJustNow');
  if (sec < 60) return t('chrome.presenceSecondsAgo', { n: sec });
  const min = Math.floor(sec / 60);
  return t('chrome.presenceMinutesAgo', { n: min });
}

interface NotePresenceBannerProps {
  peers: NotePresencePeer[];
  softLock: NotePresencePeer | null;
  nowMs?: number;
}

export default function NotePresenceBanner({
  peers,
  softLock,
  nowMs = Date.now(),
}: NotePresenceBannerProps) {
  const { t } = useI18n();
  if (!peers.length && !softLock) return null;

  const primary = softLock || peers[0];
  if (!primary) return null;

  const ago = formatAgo(primary.lastSeenAt, nowMs, t);
  const line = softLock
    ? t('chrome.presenceEditing', { name: softLock.username, ago })
    : t('chrome.presenceViewing', { name: primary.username, ago });

  const extras = peers.filter((p) => p.userId !== primary.userId);
  const extraLabel =
    extras.length === 0
      ? null
      : extras.length === 1
        ? t('chrome.presenceAlsoOne', { name: extras[0].username })
        : t('chrome.presenceAlsoMany', { count: extras.length });

  return (
    <div
      className="flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-md border border-[var(--border)] bg-[var(--panel)]/80 px-2.5 py-1.5 text-[11px] text-[var(--muted)]"
      role="status"
      aria-live="polite"
    >
      <span
        className={
          softLock
            ? 'font-medium text-amber-200/90'
            : 'text-[var(--muted)]'
        }
      >
        {line}
      </span>
      {extraLabel ? <span className="opacity-80">· {extraLabel}</span> : null}
    </div>
  );
}
