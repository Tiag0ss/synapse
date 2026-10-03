'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n/provider';

const DURATION_SECONDS = [
  { key: 'duration1h' as const, seconds: 60 * 60 },
  { key: 'duration24h' as const, seconds: 24 * 60 * 60 },
  { key: 'duration7d' as const, seconds: 7 * 24 * 60 * 60 },
  { key: 'duration30d' as const, seconds: 30 * 24 * 60 * 60 },
  { key: 'never' as const, seconds: null },
];

type TabId = 'share' | 'send';
type TransferMode = 'copy' | 'move';

type ShareRow = {
  id: number;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  status: 'active' | 'expired' | 'revoked';
  hasPassword?: boolean;
  shareKind?: 'note' | 'flashcard';
  foldFront?: string | null;
};

type CreatedShare = {
  id: number;
  url: string;
  password: string | null;
  expiresAt: string | null;
};

interface VaultOption {
  Id: number;
  Name: string;
  slug?: string;
}

type NoteShareModalProps = {
  open: boolean;
  vaultId: string;
  noteId: number | null;
  noteTitle: string;
  /** When set, creates a flashcard share (hides Send tab). */
  foldFront?: string | null;
  /** Used to default require-password off for public/unlisted notes. */
  noteVisibility?: string | null;
  onClose: () => void;
  onStatus?: (message: string) => void;
  onTransferDone?: (result: {
    vaultId: number;
    noteId: number;
    mode: TransferMode;
    createdVault?: boolean;
  }) => void;
};

function isOpenVisibility(vis: string | null | undefined): boolean {
  const v = String(vis || '').toLowerCase();
  return v === 'public' || v === 'unlisted';
}

export default function NoteShareModal({
  open,
  vaultId,
  noteId,
  noteTitle,
  foldFront = null,
  noteVisibility = null,
  onClose,
  onStatus,
  onTransferDone,
}: NoteShareModalProps) {
  const { t } = useI18n();
  const isFlashcard = Boolean(foldFront && String(foldFront).trim());
  const [tab, setTab] = useState<TabId>('share');

  // Share tab
  const [expiresInSeconds, setExpiresInSeconds] = useState<number | null>(
    DURATION_SECONDS[1].seconds
  );
  const [requirePassword, setRequirePassword] = useState(true);
  const [list, setList] = useState<ShareRow[]>([]);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareError, setShareError] = useState('');
  const [created, setCreated] = useState<CreatedShare | null>(null);
  const [copied, setCopied] = useState<'url' | 'password' | null>(null);

  // Send tab
  const [mode, setMode] = useState<TransferMode>('copy');
  const [vaults, setVaults] = useState<VaultOption[]>([]);
  const [query, setQuery] = useState('');
  const [targetVaultId, setTargetVaultId] = useState<number | null>(null);
  const [createNew, setCreateNew] = useState(false);
  const [newVaultName, setNewVaultName] = useState('');
  const [sendBusy, setSendBusy] = useState(false);
  const [sendError, setSendError] = useState('');

  const loadList = useCallback(async () => {
    if (!noteId) return;
    setShareLoading(true);
    setShareError('');
    try {
      const qs = new URLSearchParams();
      if (isFlashcard) {
        qs.set('kind', 'flashcard');
        qs.set('foldFront', String(foldFront).trim());
      } else {
        qs.set('kind', 'note');
      }
      const res = await fetch(
        `/api/vaults/${vaultId}/notes/${noteId}/shares?${qs.toString()}`,
        { credentials: 'include' }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setShareError(data.message || 'Failed to load shares');
        setList([]);
        return;
      }
      setList(Array.isArray(data.data) ? data.data : []);
    } catch {
      setShareError('Network error');
      setList([]);
    } finally {
      setShareLoading(false);
    }
  }, [vaultId, noteId, isFlashcard, foldFront]);

  useEffect(() => {
    if (!open) return;
    setTab('share');
    setCreated(null);
    setCopied(null);
    setShareError('');
    setExpiresInSeconds(DURATION_SECONDS[1].seconds);
    setRequirePassword(!isOpenVisibility(noteVisibility));
    setMode('copy');
    setQuery('');
    setTargetVaultId(null);
    setCreateNew(false);
    setNewVaultName(noteTitle ? `${noteTitle} vault` : '');
    setSendError('');
    void loadList();
    if (isFlashcard) return;
    void (async () => {
      const res = await fetch('/api/vaults', { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        const listVaults = (Array.isArray(data.data) ? data.data : []).filter(
          (v: VaultOption) => Number(v.Id) !== Number(vaultId)
        );
        setVaults(listVaults);
      }
    })();
  }, [open, loadList, vaultId, noteTitle, noteVisibility, isFlashcard]);

  const filteredVaults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vaults;
    return vaults.filter(
      (v) =>
        String(v.Name || '')
          .toLowerCase()
          .includes(q) ||
        String(v.slug || '')
          .toLowerCase()
          .includes(q)
    );
  }, [vaults, query]);

  if (!open || !noteId) return null;

  const copyText = async (value: string, which: 'url' | 'password') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      onStatus?.('Could not copy to clipboard');
    }
  };

  const onCreateShare = async () => {
    setShareBusy(true);
    setShareError('');
    try {
      const res = await fetch(`/api/vaults/${vaultId}/notes/${noteId}/shares`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expiresInSeconds,
          requirePassword,
          shareKind: isFlashcard ? 'flashcard' : 'note',
          ...(isFlashcard ? { foldFront: String(foldFront).trim() } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setShareError(data.message || 'Failed to create share');
        return;
      }
      setCreated(data.data as CreatedShare);
      onStatus?.(isFlashcard ? 'Flashcard share link created' : 'Share link created');
      await loadList();
    } catch {
      setShareError('Network error');
    } finally {
      setShareBusy(false);
    }
  };

  const onRevoke = async (shareId: number) => {
    setShareBusy(true);
    setShareError('');
    try {
      const res = await fetch(`/api/vaults/${vaultId}/notes/${noteId}/shares/${shareId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setShareError(data.message || 'Failed to revoke share');
        return;
      }
      if (created?.id === shareId) setCreated(null);
      onStatus?.('Share revoked');
      await loadList();
    } catch {
      setShareError('Network error');
    } finally {
      setShareBusy(false);
    }
  };

  const canSend = createNew ? newVaultName.trim().length > 0 : targetVaultId != null;

  const onSend = async () => {
    if (!canSend || sendBusy) return;
    setSendBusy(true);
    setSendError('');
    try {
      const body = createNew
        ? { mode, newVault: { name: newVaultName.trim() } }
        : { mode, targetVaultId };
      const res = await fetch(`/api/vaults/${vaultId}/notes/${noteId}/transfer`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendError(data.message || 'Transfer failed');
        return;
      }
      onTransferDone?.({
        vaultId: Number(data.data.vaultId),
        noteId: Number(data.data.noteId),
        mode,
        createdVault: Boolean(data.data.createdVault),
      });
    } catch {
      setSendError('Network error');
    } finally {
      setSendBusy(false);
    }
  };

  const active = list.filter((s) => s.status === 'active');
  const inactive = list.filter((s) => s.status !== 'active').slice(0, 8);
  const subtitle = isFlashcard ? String(foldFront).trim() : noteTitle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isFlashcard ? t('chrome.shareFlashcard') : t('chrome.shareModalTitle')}
        className="flex max-h-[min(90dvh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl shadow-black/40"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">
              {isFlashcard ? t('chrome.shareFlashcard') : t('chrome.shareModalTitle')}
            </h2>
            <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{subtitle}</p>
          </div>
          <button type="button" className="btn-ghost py-1 text-xs" onClick={onClose}>
            {t('common.close')}
          </button>
        </div>

        {!isFlashcard ? (
          <div
            role="tablist"
            aria-label={t('chrome.shareModeAria')}
            className="flex shrink-0 gap-1 border-b border-[var(--border)] px-3 pt-2"
          >
            <button
              type="button"
              role="tab"
              className={`rounded-t-lg px-3 py-2 text-sm font-medium transition ${
                tab === 'share'
                  ? 'bg-[var(--surface-2)] text-[var(--text)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
              aria-selected={tab === 'share'}
              onClick={() => setTab('share')}
            >
              {t('chrome.linkTab')}
            </button>
            <button
              type="button"
              role="tab"
              className={`rounded-t-lg px-3 py-2 text-sm font-medium transition ${
                tab === 'send'
                  ? 'bg-[var(--surface-2)] text-[var(--text)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
              aria-selected={tab === 'send'}
              onClick={() => setTab('send')}
            >
              {t('chrome.sendTab')}
            </button>
          </div>
        ) : null}

        {tab === 'share' || isFlashcard ? (
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {t('chrome.temporaryLink')}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                {isFlashcard ? t('chrome.shareFlashcardHint') : t('chrome.shareNoteHint')}
                {requirePassword ? t('chrome.sharePasswordOnce') : t('chrome.shareNoPassword')}
              </p>
              <label className="mt-3 block text-xs text-[var(--muted)]">
                {t('chrome.expires')}
                <select
                  className="input mt-1 w-full"
                  value={expiresInSeconds == null ? 'never' : String(expiresInSeconds)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setExpiresInSeconds(v === 'never' ? null : Number(v));
                  }}
                  disabled={shareBusy}
                >
                  {DURATION_SECONDS.map((d) => (
                    <option
                      key={d.key}
                      value={d.seconds == null ? 'never' : String(d.seconds)}
                    >
                      {t(`chrome.${d.key}`)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-3 flex items-center gap-2 text-sm text-[var(--text)]">
                <input
                  type="checkbox"
                  className="accent-[var(--accent)]"
                  checked={requirePassword}
                  onChange={(e) => setRequirePassword(e.target.checked)}
                  disabled={shareBusy}
                />
                {t('chrome.requirePassword')}
              </label>
              <button
                type="button"
                className="btn-primary mt-3"
                disabled={shareBusy}
                onClick={() => void onCreateShare()}
              >
                {shareBusy ? t('home.creating') : t('chrome.createShareLink')}
              </button>
            </section>

            {created ? (
              <section className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)]/40 p-3">
                <p className="text-xs font-medium text-[var(--accent-soft)]">
                  {created.password ? t('chrome.copyPasswordOnce') : t('chrome.copyLinkNoPassword')}
                </p>
                <label className="mt-3 block text-[11px] uppercase tracking-wider text-[var(--muted)]">
                  {t('chrome.linkLabel')}
                  <div className="mt-1 flex gap-2">
                    <input
                      className="input min-w-0 flex-1 font-mono text-xs"
                      readOnly
                      value={created.url}
                    />
                    <button
                      type="button"
                      className="btn-ghost shrink-0 text-xs"
                      onClick={() => void copyText(created.url, 'url')}
                    >
                      {copied === 'url' ? t('chrome.copied') : t('chrome.copyAction')}
                    </button>
                  </div>
                </label>
                {created.password ? (
                  <label className="mt-3 block text-[11px] uppercase tracking-wider text-[var(--muted)]">
                    {t('chrome.passwordLabel')}
                    <div className="mt-1 flex gap-2">
                      <input
                        className="input min-w-0 flex-1 font-mono text-xs"
                        readOnly
                        value={created.password}
                      />
                      <button
                        type="button"
                        className="btn-ghost shrink-0 text-xs"
                        onClick={() => void copyText(created.password!, 'password')}
                      >
                        {copied === 'password' ? t('chrome.copied') : t('chrome.copyAction')}
                      </button>
                    </div>
                  </label>
                ) : null}
                <p className="mt-2 text-[11px] text-[var(--muted)]">
                  {created.expiresAt
                    ? t('chrome.expiresAtLabel', {
                        date: new Date(created.expiresAt).toLocaleString(),
                      })
                    : t('chrome.noExpiry')}
                </p>
              </section>
            ) : null}

            <section>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {t('chrome.activeShares')}
              </p>
              {shareLoading ? (
                <p className="mt-2 text-xs text-[var(--muted)]">{t('common.loading')}</p>
              ) : active.length === 0 ? (
                <p className="mt-2 text-xs text-[var(--muted)]">{t('chrome.noneYet')}</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {active.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-2.5 py-2"
                    >
                      <div className="min-w-0 text-xs">
                        <p className="text-[var(--text)]">
                          {s.expiresAt
                            ? t('chrome.expiresAtLabel', {
                                date: new Date(s.expiresAt).toLocaleString(),
                              })
                            : t('chrome.noExpiry')}
                          {s.hasPassword === false
                            ? t('chrome.openLinkSuffix')
                            : t('chrome.passwordSuffix')}
                        </p>
                        <p className="text-[var(--muted)]">
                          {t('chrome.createdAtLabel', {
                            date: new Date(s.createdAt).toLocaleString(),
                          })}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-danger shrink-0 py-1 text-xs"
                        disabled={shareBusy}
                        onClick={() => void onRevoke(s.id)}
                      >
                        {t('chrome.revoke')}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {inactive.length > 0 ? (
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  {t('chrome.recentEnded')}
                </p>
                <ul className="mt-2 space-y-1 text-xs text-[var(--muted)]">
                  {inactive.map((s) => (
                    <li key={s.id}>
                      #{s.id} · {s.status} ·{' '}
                      {s.expiresAt ? new Date(s.expiresAt).toLocaleString() : 'no expiry'}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {shareError ? <p className="text-sm text-[var(--danger)]">{shareError}</p> : null}
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
              <p className="text-xs leading-relaxed text-[var(--muted)]">
                Copy or move this note to another vault. Media in the note is included; Myelin links
                are not.
              </p>
              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Action
                </legend>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      mode === 'copy'
                        ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--text)]'
                        : 'border-[var(--border)] text-[var(--muted)]'
                    }`}
                    onClick={() => setMode('copy')}
                  >
                    {t('chrome.transferCopy')}
                  </button>
                  <button
                    type="button"
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      mode === 'move'
                        ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--text)]'
                        : 'border-[var(--border)] text-[var(--muted)]'
                    }`}
                    onClick={() => setMode('move')}
                  >
                    {t('chrome.transferMove')}
                  </button>
                </div>
                {mode === 'move' && (
                  <p className="mt-2 text-xs text-[var(--muted)]">{t('chrome.moveTrashHint')}</p>
                )}
              </fieldset>

              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {t('chrome.destination')}
                </legend>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      !createNew
                        ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--text)]'
                        : 'border-[var(--border)] text-[var(--muted)]'
                    }`}
                    onClick={() => setCreateNew(false)}
                  >
                    {t('chrome.existingVault')}
                  </button>
                  <button
                    type="button"
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      createNew
                        ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--text)]'
                        : 'border-[var(--border)] text-[var(--muted)]'
                    }`}
                    onClick={() => setCreateNew(true)}
                  >
                    {t('home.newVault')}
                  </button>
                </div>

                {createNew ? (
                  <label className="mt-3 block text-xs font-medium text-[var(--muted)]">
                    {t('home.vaultName')}
                    <input
                      className="input mt-1.5 w-full"
                      value={newVaultName}
                      onChange={(e) => setNewVaultName(e.target.value)}
                      placeholder={t('chrome.newVaultPlaceholder')}
                      autoFocus
                    />
                  </label>
                ) : (
                  <div className="mt-3 space-y-2">
                    <input
                      className="input w-full"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t('chrome.searchVaults')}
                      aria-label={t('chrome.searchVaults')}
                    />
                    <ul className="max-h-48 space-y-1 overflow-auto rounded-lg border border-[var(--border)] p-1">
                      {filteredVaults.length === 0 && (
                        <li className="px-2 py-3 text-center text-sm text-[var(--muted)]">
                          {t('chrome.noOtherEditableVaults')}
                        </li>
                      )}
                      {filteredVaults.map((v) => (
                        <li key={v.Id}>
                          <button
                            type="button"
                            className={`w-full rounded-md px-2 py-1.5 text-left text-sm ${
                              targetVaultId === Number(v.Id)
                                ? 'bg-[var(--accent)]/20 text-[var(--text)]'
                                : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                            }`}
                            onClick={() => setTargetVaultId(Number(v.Id))}
                          >
                            {v.Name}
                            {v.slug ? (
                              <span className="ml-1 text-[11px] text-[var(--muted)]">/{v.slug}</span>
                            ) : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </fieldset>

              {sendError ? <p className="text-sm text-[var(--danger)]">{sendError}</p> : null}
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--border)] px-4 py-3">
              <button type="button" className="btn-ghost" onClick={onClose} disabled={sendBusy}>
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={!canSend || sendBusy}
                onClick={() => void onSend()}
              >
                {sendBusy
                  ? t('chrome.working')
                  : mode === 'move'
                    ? t('chrome.moveNote')
                    : t('chrome.copyNoteAction')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
