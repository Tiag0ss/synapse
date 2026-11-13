'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  applyHunkFromRight,
  buildSideBySideDiff,
  groupDiffHunks,
  wordHighlight,
  type DiffHunk,
} from '@/lib/sideBySideDiff';
import { useI18n } from '@/lib/i18n/provider';

export type AiNoteEditMode = 'whole' | 'selection';

interface AiNoteEditDiffModalProps {
  open: boolean;
  mode: AiNoteEditMode;
  before: string;
  after: string;
  instruction?: string;
  busy?: boolean;
  onClose: () => void;
  /** Accept a region (full accepted text for the edited span / body). */
  onApply: (nextRegion: string) => void;
  /** Ask the model for another pass on the current After suggestion. */
  onRequestChanges: (followUpInstruction: string) => void;
}

export default function AiNoteEditDiffModal({
  open,
  mode,
  before: initialBefore,
  after: aiAfter,
  instruction,
  busy = false,
  onClose,
  onApply,
  onRequestChanges,
}: AiNoteEditDiffModalProps) {
  const { t } = useI18n();
  const leftScroll = useRef<HTMLDivElement>(null);
  const rightScroll = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);
  const [onlyChanges, setOnlyChanges] = useState(false);
  const [stagedBefore, setStagedBefore] = useState(initialBefore);
  const [followUp, setFollowUp] = useState('');

  useEffect(() => {
    if (open) {
      setStagedBefore(initialBefore);
      setOnlyChanges(false);
    }
  }, [open, initialBefore, aiAfter]);

  const rows = useMemo(
    () => buildSideBySideDiff(stagedBefore, aiAfter),
    [stagedBefore, aiAfter]
  );
  const hunks = useMemo(() => groupDiffHunks(rows), [rows]);
  const hunkByRow = useMemo(() => {
    const map = new Map<number, DiffHunk>();
    for (const h of hunks) {
      for (let i = h.start; i < h.end; i++) map.set(i, h);
    }
    return map;
  }, [hunks]);

  const visibleRows = useMemo(() => {
    const indexed = rows.map((row, index) => ({ row, index }));
    return onlyChanges ? indexed.filter(({ row }) => row.op !== 'equal') : indexed;
  }, [rows, onlyChanges]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let changed = 0;
    for (const r of rows) {
      if (r.op === 'insert') added++;
      else if (r.op === 'delete') removed++;
      else if (r.op === 'replace') changed++;
    }
    return { added, removed, changed, hunks: hunks.length };
  }, [rows, hunks.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, busy]);

  const syncScroll = (source: 'left' | 'right') => {
    if (syncing.current) return;
    const a = source === 'left' ? leftScroll.current : rightScroll.current;
    const b = source === 'left' ? rightScroll.current : leftScroll.current;
    if (!a || !b) return;
    syncing.current = true;
    const ratio = a.scrollTop / Math.max(1, a.scrollHeight - a.clientHeight);
    b.scrollTop = ratio * Math.max(1, b.scrollHeight - b.clientHeight);
    requestAnimationFrame(() => {
      syncing.current = false;
    });
  };

  const acceptHunk = (hunk: DiffHunk) => {
    if (busy) return;
    const next = applyHunkFromRight(rows, hunk);
    setStagedBefore(next);
    onApply(next);
  };

  const acceptAll = () => {
    if (busy) return;
    setStagedBefore(aiAfter);
    onApply(aiAfter);
    onClose();
  };

  const submitFollowUp = () => {
    const next = followUp.trim();
    if (!next || busy) return;
    setFollowUp('');
    onRequestChanges(next);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="flex h-[min(880px,100dvh)] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl shadow-black/50 sm:h-[min(880px,92vh)] sm:rounded-2xl pb-[env(safe-area-inset-bottom)]"
      >
        <header className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{t('chrome.aiEditReviewTitle')}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {mode === 'selection'
                ? t('chrome.aiEditReviewIntroSelection')
                : t('chrome.aiEditReviewIntroWhole')}
            </p>
            {instruction ? (
              <p className="mt-1 text-xs text-[var(--muted)]">
                {t('chrome.aiEditInstructionLabel')}: {instruction}
              </p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
              <span className="text-emerald-300">
                {t('chrome.diffAddedCount', { count: stats.added })}
              </span>
              <span className="text-red-300">
                {t('chrome.diffRemovedCount', { count: stats.removed })}
              </span>
              <span className="text-amber-200">
                {t('chrome.diffChangedCount', { count: stats.changed })}
              </span>
              {stats.hunks > 0 && (
                <span className="text-[var(--muted)]">
                  {t('chrome.diffChangeBlocks', { count: stats.hunks })}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <input
                type="checkbox"
                checked={onlyChanges}
                onChange={(e) => setOnlyChanges(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              {t('chrome.onlyChanges')}
            </label>
            <button type="button" className="btn-ghost" onClick={onClose} disabled={busy}>
              {t('chrome.aiEditDiscard')}
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={busy || stagedBefore === aiAfter}
              onClick={acceptAll}
            >
              {t('chrome.aiEditAcceptAll')}
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
          <div className="flex min-h-0 flex-col border-b border-[var(--border)] md:border-b-0 md:border-r">
            <div className="shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-medium text-[var(--muted)]">
              {t('chrome.aiEditBefore')}
            </div>
            <div
              ref={leftScroll}
              className="diff-pane min-h-0 flex-1 overflow-auto font-mono text-[12px] leading-5"
              onScroll={() => syncScroll('left')}
            >
              {visibleRows.map(({ row, index }) => {
                const hl =
                  row.op === 'replace' && row.left != null && row.right != null
                    ? wordHighlight(row.left, row.right).leftHtml
                    : null;
                return (
                  <div
                    key={`L-${index}`}
                    className={`diff-row flex ${
                      row.op === 'delete' || row.op === 'replace'
                        ? 'diff-row-del'
                        : row.op === 'insert'
                          ? 'diff-row-empty'
                          : ''
                    }`}
                  >
                    <span className="diff-ln">{row.leftLine ?? ''}</span>
                    <pre className="diff-code min-w-0 flex-1">
                      {hl ? <span dangerouslySetInnerHTML={{ __html: hl }} /> : (row.left ?? '')}
                    </pre>
                  </div>
                );
              })}
              {visibleRows.length === 0 && (
                <p className="p-4 text-sm text-[var(--muted)]">{t('chrome.noBodyDiff')}</p>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col">
            <div className="shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-medium text-[var(--muted)]">
              {t('chrome.aiEditAfter')}
            </div>
            <div
              ref={rightScroll}
              className="diff-pane min-h-0 flex-1 overflow-auto font-mono text-[12px] leading-5"
              onScroll={() => syncScroll('right')}
            >
              {visibleRows.map(({ row, index }) => {
                const hl =
                  row.op === 'replace' && row.left != null && row.right != null
                    ? wordHighlight(row.left, row.right).rightHtml
                    : null;
                const hunk = hunkByRow.get(index);
                const isHunkStart = hunk != null && hunk.start === index;
                return (
                  <div
                    key={`R-${index}`}
                    className={`diff-row group relative flex ${
                      row.op === 'insert' || row.op === 'replace'
                        ? 'diff-row-ins'
                        : row.op === 'delete'
                          ? 'diff-row-empty'
                          : ''
                    }`}
                  >
                    <span className="diff-ln">{row.rightLine ?? ''}</span>
                    <pre className="diff-code min-w-0 flex-1">
                      {hl ? <span dangerouslySetInnerHTML={{ __html: hl }} /> : (row.right ?? '')}
                    </pre>
                    {isHunkStart && hunk && (
                      <button
                        type="button"
                        className="diff-restore-btn"
                        disabled={busy}
                        title={t('chrome.aiEditAcceptHunk')}
                        onClick={() => acceptHunk(hunk)}
                      >
                        {t('chrome.aiEditAcceptHunk')}
                      </button>
                    )}
                  </div>
                );
              })}
              {visibleRows.length === 0 && (
                <p className="p-4 text-sm text-[var(--muted)]">{t('chrome.noBodyDiff')}</p>
              )}
            </div>
          </div>
        </div>

        <footer className="shrink-0 border-t border-[var(--border)] px-5 py-3">
          <p className="mb-2 text-xs text-[var(--muted)]">{t('chrome.aiEditRequestChangesHint')}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              {t('chrome.aiEditRequestChanges')}
              <textarea
                rows={2}
                className="input mt-1 w-full resize-y text-sm normal-case tracking-normal"
                placeholder={t('chrome.aiEditRequestChangesPlaceholder')}
                value={followUp}
                disabled={busy}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    submitFollowUp();
                  }
                }}
              />
            </label>
            <button
              type="button"
              className="btn-ghost shrink-0"
              disabled={busy || !followUp.trim()}
              onClick={submitFollowUp}
            >
              {busy ? t('chrome.aiEditGenerating') : t('chrome.aiEditRequestChangesSubmit')}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
