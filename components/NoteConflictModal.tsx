'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  applyHunkFromLeft,
  applyHunkKeepBoth,
  buildSideBySideDiff,
  groupDiffHunks,
  wordHighlight,
  type DiffHunk,
} from '@/lib/sideBySideDiff';
import type { NoteConflictLocalDraft, NoteConflictServerSnapshot } from '@/lib/noteConflict';
import { useI18n } from '@/lib/i18n/provider';

export interface NoteConflictPartial {
  title?: string;
  bodyMarkdown?: string;
  visibility?: string;
}

interface NoteConflictModalProps {
  open: boolean;
  server: NoteConflictServerSnapshot | null;
  draft: NoteConflictLocalDraft | null;
  saving?: boolean;
  onClose: () => void;
  onDraftChange: (next: NoteConflictLocalDraft) => void;
  onTakeServer: () => void;
  onKeepMine: () => void;
  onSaveMerged: () => void;
}

function MetaChip({
  label,
  value,
  changed,
  onTake,
  disabled,
  takeLabel,
}: {
  label: string;
  value: string;
  changed?: boolean;
  onTake?: () => void;
  disabled?: boolean;
  takeLabel?: string;
}) {
  const clickable = Boolean(changed && onTake && takeLabel);
  return (
    <div
      className={`rounded-lg border px-2.5 py-1.5 text-xs ${
        changed
          ? 'border-amber-500/40 bg-amber-500/10 text-amber-100'
          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium uppercase tracking-wide opacity-70">{label}</div>
        {clickable && (
          <button
            type="button"
            className="text-[10px] font-medium uppercase tracking-wide text-amber-200/90 underline-offset-2 hover:underline disabled:opacity-50"
            disabled={disabled}
            onClick={onTake}
          >
            {takeLabel}
          </button>
        )}
      </div>
      <div className="mt-0.5 break-all font-mono text-[11px] text-[var(--text)]">{value || '—'}</div>
    </div>
  );
}

export default function NoteConflictModal({
  open,
  server,
  draft,
  saving,
  onClose,
  onDraftChange,
  onTakeServer,
  onKeepMine,
  onSaveMerged,
}: NoteConflictModalProps) {
  const { t } = useI18n();
  const leftScroll = useRef<HTMLDivElement>(null);
  const rightScroll = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);
  const [onlyChanges, setOnlyChanges] = useState(false);

  const busy = Boolean(saving);
  const isWhiteboard = server?.kind === 'whiteboard';

  const rows = useMemo(() => {
    if (!server || !draft || isWhiteboard) return [];
    return buildSideBySideDiff(String(server.bodyMarkdown || ''), draft.bodyMarkdown || '');
  }, [server, draft, isWhiteboard]);

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

  const takeHunk = (hunk: DiffHunk, mode: 'replace' | 'add') => {
    if (busy || !server || !draft) return;
    onDraftChange({
      ...draft,
      bodyMarkdown:
        mode === 'add' ? applyHunkKeepBoth(rows, hunk) : applyHunkFromLeft(rows, hunk),
    });
  };

  if (!open || !server || !draft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-conflict-title"
        className="flex h-[min(880px,100dvh)] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl shadow-black/50 sm:h-[min(880px,92vh)] sm:rounded-2xl pb-[env(safe-area-inset-bottom)]"
      >
        <header className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 id="note-conflict-title" className="text-lg font-semibold tracking-tight">
              {t('chrome.noteConflictTitle')}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {isWhiteboard ? t('chrome.noteConflictWhiteboardHint') : t('chrome.noteConflictIntro')}
            </p>
            {!isWhiteboard && (
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
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!isWhiteboard && (
              <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <input
                  type="checkbox"
                  checked={onlyChanges}
                  onChange={(e) => setOnlyChanges(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                {t('chrome.onlyChanges')}
              </label>
            )}
            <button type="button" className="btn-ghost" onClick={onClose} disabled={busy}>
              {t('common.close')}
            </button>
            <button type="button" className="btn-ghost" onClick={onTakeServer} disabled={busy}>
              {t('chrome.noteConflictTakeServer')}
            </button>
            <button type="button" className="btn-danger" onClick={onKeepMine} disabled={busy}>
              {busy ? t('chrome.saving') : t('chrome.noteConflictKeepMine')}
            </button>
            {!isWhiteboard && (
              <button type="button" className="btn-primary" onClick={onSaveMerged} disabled={busy}>
                {busy ? t('chrome.saving') : t('chrome.noteConflictSaveMerged')}
              </button>
            )}
          </div>
        </header>

        {isWhiteboard ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center text-sm text-[var(--muted)]">
            <p>{t('chrome.noteConflictWhiteboardHint')}</p>
            <p className="font-mono text-xs text-[var(--text)]">
              {t('chrome.noteConflictServerLabel')}: {server.updatedAt}
            </p>
          </div>
        ) : (
          <>
            <div className="grid shrink-0 grid-cols-1 gap-3 border-b border-[var(--border)] px-5 py-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  {t('chrome.noteConflictServerLabel')}
                  {server.updatedAt ? ` · ${new Date(server.updatedAt).toLocaleString()}` : ''}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <MetaChip
                    label={t('chrome.noteTitle')}
                    value={server.title}
                    changed={server.title !== draft.title}
                    disabled={busy}
                    takeLabel={t('chrome.takeFromServer')}
                    onTake={() => onDraftChange({ ...draft, title: server.title })}
                  />
                  <MetaChip label={t('chrome.pathLabel')} value={server.path} />
                  <MetaChip
                    label={t('chrome.visibility')}
                    value={server.visibility || t('chrome.defaultShort')}
                    changed={(server.visibility || '') !== (draft.visibility || '')}
                    disabled={busy}
                    takeLabel={t('chrome.takeFromServer')}
                    onTake={() =>
                      onDraftChange({ ...draft, visibility: server.visibility || '' })
                    }
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  {t('chrome.noteConflictYoursLabel')}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <MetaChip label={t('chrome.noteTitle')} value={draft.title} />
                  <MetaChip label={t('chrome.pathLabel')} value={server.path} />
                  <MetaChip
                    label={t('chrome.visibility')}
                    value={draft.visibility || t('chrome.defaultShort')}
                  />
                </div>
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2">
              <div className="flex min-h-0 flex-col border-b border-[var(--border)] md:border-b-0 md:border-r">
                <div className="shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] font-medium text-[var(--muted)]">
                  {t('chrome.noteConflictServerBody')}
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
                    const hunk = hunkByRow.get(index);
                    const isHunkStart = hunk != null && hunk.start === index;
                    return (
                      <div
                        key={`L-${index}`}
                        className={`diff-row group relative flex ${
                          row.op === 'delete' || row.op === 'replace'
                            ? 'diff-row-del'
                            : row.op === 'insert'
                              ? 'diff-row-empty'
                              : ''
                        }`}
                      >
                        <span className="diff-ln">{row.leftLine ?? ''}</span>
                        <pre className="diff-code min-w-0 flex-1">
                          {hl ? (
                            <span dangerouslySetInnerHTML={{ __html: hl }} />
                          ) : (
                            row.left ?? ''
                          )}
                        </pre>
                        {isHunkStart && (
                          <span className="diff-restore-actions">
                            <button
                              type="button"
                              className="diff-restore-btn"
                              disabled={busy}
                              title={t('chrome.addFromServer')}
                              onClick={() => takeHunk(hunk, 'add')}
                            >
                              {t('chrome.addFromServer')}
                            </button>
                            <button
                              type="button"
                              className="diff-restore-btn"
                              disabled={busy}
                              title={t('chrome.takeFromServer')}
                              onClick={() => takeHunk(hunk, 'replace')}
                            >
                              {t('chrome.takeFromServer')}
                            </button>
                          </span>
                        )}
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
                  {t('chrome.noteConflictYoursBody')}
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
                    return (
                      <div
                        key={`R-${index}`}
                        className={`diff-row flex ${
                          row.op === 'insert' || row.op === 'replace'
                            ? 'diff-row-ins'
                            : row.op === 'delete'
                              ? 'diff-row-empty'
                              : ''
                        }`}
                      >
                        <span className="diff-ln">{row.rightLine ?? ''}</span>
                        <pre className="diff-code">
                          {hl ? (
                            <span dangerouslySetInnerHTML={{ __html: hl }} />
                          ) : (
                            row.right ?? ''
                          )}
                        </pre>
                      </div>
                    );
                  })}
                  {visibleRows.length === 0 && (
                    <p className="p-4 text-sm text-[var(--muted)]">{t('chrome.noBodyDiff')}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
