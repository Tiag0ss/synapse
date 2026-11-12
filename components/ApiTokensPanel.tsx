'use client';

import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/provider';
import ConfirmModal from '@/components/ConfirmModal';

type ApiToken = {
  id: number;
  tokenName: string;
  tokenPrefix: string;
  isActive: boolean;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string | null;
};

export default function ApiTokensPanel() {
  const { t } = useI18n();
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [createdRaw, setCreatedRaw] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<
    { type: 'revoke' | 'delete'; id: number; name: string } | null
  >(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/api-tokens', { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || t('profile.apiTokensLoadFailed'));
        setTokens([]);
        return;
      }
      setTokens(Array.isArray(json.data) ? json.data : []);
    } catch {
      setError(t('profile.apiTokensLoadFailed'));
      setTokens([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const createToken = async () => {
    if (!name.trim()) {
      setError(t('profile.apiTokenNameRequired'));
      return;
    }
    setBusy(true);
    setError('');
    setStatus('');
    setCreatedRaw(null);
    try {
      const res = await fetch('/api/api-tokens', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenName: name.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || t('profile.apiTokenCreateFailed'));
        return;
      }
      setCreatedRaw(String(json.data?.rawToken || ''));
      setName('');
      setStatus(t('profile.apiTokenCreatedOnce'));
      await load();
    } finally {
      setBusy(false);
    }
  };

  const runConfirm = async () => {
    if (!confirm) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const res = await fetch(
        confirm.type === 'revoke'
          ? `/api/api-tokens/${confirm.id}/revoke`
          : `/api/api-tokens/${confirm.id}`,
        {
          method: confirm.type === 'revoke' ? 'PATCH' : 'DELETE',
          credentials: 'include',
        }
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || t('profile.apiTokenActionFailed'));
        return;
      }
      setStatus(
        confirm.type === 'revoke' ? t('profile.apiTokenRevoked') : t('profile.apiTokenDeleted')
      );
      setConfirm(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const copyRaw = async () => {
    if (!createdRaw) return;
    try {
      await navigator.clipboard.writeText(createdRaw);
      setStatus(t('profile.apiTokenCopied'));
    } catch {
      setError(t('profile.apiTokenCopyFailed'));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-[var(--text)]">{t('profile.apiTokensTitle')}</h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
          {t('profile.apiTokensHelp')}
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      {status && (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm">
          {status}
        </p>
      )}

      {createdRaw && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="text-sm font-medium text-amber-100">{t('profile.apiTokenSaveNow')}</p>
          <code className="mt-2 block break-all rounded-lg bg-black/30 px-3 py-2 font-mono text-xs text-[var(--text)]">
            {createdRaw}
          </code>
          <button type="button" className="btn-ghost mt-3 text-sm" onClick={() => void copyRaw()}>
            {t('profile.apiTokenCopy')}
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-2">
        <label className="min-w-[12rem] flex-1 text-sm">
          {t('profile.apiTokenName')}
          <input
            className="input mt-1 w-full"
            value={name}
            disabled={busy}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('profile.apiTokenNamePlaceholder')}
          />
        </label>
        <button
          type="button"
          className="btn-primary"
          disabled={busy || !name.trim()}
          onClick={() => void createToken()}
        >
          {t('profile.apiTokenCreate')}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--muted)]">{t('common.loading')}</p>
      ) : tokens.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{t('profile.apiTokensEmpty')}</p>
      ) : (
        <ul className="space-y-2">
          {tokens.map((tok) => (
            <li
              key={tok.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-[var(--border)] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--text)]">{tok.tokenName}</p>
                <p className="mt-0.5 font-mono text-xs text-[var(--muted)]">{tok.tokenPrefix}…</p>
                <p className="mt-1 text-[11px] text-[var(--muted)]">
                  {tok.isActive ? t('profile.apiTokenActive') : t('profile.apiTokenInactive')}
                  {tok.lastUsedAt
                    ? ` · ${t('profile.apiTokenLastUsed', { when: tok.lastUsedAt })}`
                    : ` · ${t('profile.apiTokenNeverUsed')}`}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                {tok.isActive && (
                  <button
                    type="button"
                    className="btn-ghost text-xs"
                    disabled={busy}
                    onClick={() =>
                      setConfirm({ type: 'revoke', id: tok.id, name: tok.tokenName })
                    }
                  >
                    {t('profile.apiTokenRevoke')}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-ghost text-xs text-red-300"
                  disabled={busy}
                  onClick={() => setConfirm({ type: 'delete', id: tok.id, name: tok.tokenName })}
                >
                  {t('chrome.delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={confirm != null}
        title={
          confirm?.type === 'revoke'
            ? t('profile.apiTokenRevokeTitle')
            : t('profile.apiTokenDeleteTitle')
        }
        message={
          confirm?.type === 'revoke'
            ? t('profile.apiTokenRevokeMessage', { name: confirm.name })
            : t('profile.apiTokenDeleteMessage', { name: confirm?.name || '' })
        }
        confirmLabel={
          confirm?.type === 'revoke' ? t('profile.apiTokenRevoke') : t('chrome.delete')
        }
        danger
        onConfirm={() => void runConfirm()}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
