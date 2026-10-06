'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserAvatar from '@/components/UserAvatar';
import AppUserMenu from '@/components/AppUserMenu';
import { useI18n } from '@/lib/i18n/provider';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/lib/i18n/config';

type Profile = {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
  pmUserId: number | null;
  hasPassword: boolean;
  authMethods: { local: boolean; sso: boolean };
  pmIntegration?: {
    enabled: boolean;
    ssoToken: boolean;
    personalApiKey: { configured: boolean; prefix: string | null };
    autoAssignOnCreate?: boolean;
  };
};

export default function ProfilePage() {
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pmApiKey, setPmApiKey] = useState('');
  const [clearPmApiKey, setClearPmApiKey] = useState(false);
  const [autoAssignOnCreate, setAutoAssignOnCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) {
        router.replace('/');
        return;
      }
      const json = await res.json();
      const p = json.data as Profile;
      setProfile(p);
      setUsername(p.username);
      setEmail(p.email);
      setPmApiKey('');
      setClearPmApiKey(false);
      setAutoAssignOnCreate(Boolean(p.pmIntegration?.autoAssignOnCreate));
    } catch {
      setError(t('status.failedToLoadProfile'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveProfile = async () => {
    if (!profile) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const body: Record<string, string> = {};
      if (username.trim() !== profile.username) body.username = username.trim();
      if (!profile.authMethods.sso && email.trim().toLowerCase() !== profile.email.toLowerCase()) {
        body.email = email.trim();
      }
      if (!Object.keys(body).length) {
        setError(t('status.noProfileChanges'));
        return;
      }
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || t('status.saveFailed'));
        return;
      }
      setStatus(t('status.profileSaved'));
      await load();
    } finally {
      setBusy(false);
    }
  };

  const saveAutoAssign = async (next: boolean) => {
    if (!profile) return;
    setBusy(true);
    setError('');
    setStatus('');
    setAutoAssignOnCreate(next);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pmAutoAssignOnCreate: next }),
      });
      const json = await res.json();
      if (!res.ok) {
        setAutoAssignOnCreate(Boolean(profile.pmIntegration?.autoAssignOnCreate));
        setError(json.message || t('status.failedSaveAutoAssign'));
        return;
      }
      setStatus(
        next
          ? t('status.autoAssignOn')
          : t('status.autoAssignOff')
      );
      await load();
    } finally {
      setBusy(false);
    }
  };

  const savePmApiKey = async () => {
    if (!profile) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      if (!clearPmApiKey && !pmApiKey.trim()) {
        setError(t('status.enterApiTokenOrClear'));
        return;
      }
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pmApiKey: clearPmApiKey ? null : pmApiKey.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || t('status.couldNotSaveApiToken'));
        return;
      }
      setStatus(clearPmApiKey ? t('status.apiTokenCleared') : t('status.apiTokenSaved'));
      await load();
    } finally {
      setBusy(false);
    }
  };

  const testPmConnection = async () => {
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const res = await fetch('/api/auth/me/pm-test', {
        method: 'POST',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || t('status.connectionTestFailed'));
        return;
      }
      setStatus(json.message || t('status.connected'));
    } finally {
      setBusy(false);
    }
  };

  const savePassword = async () => {
    if (!profile) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      if (!newPassword) {
        setError(t('status.enterNewPassword'));
        return;
      }
      if (newPassword !== confirmPassword) {
        setError(t('status.passwordsDoNotMatch'));
        return;
      }
      const body: Record<string, string> = { newPassword };
      if (profile.hasPassword) {
        if (!currentPassword) {
          setError(t('status.currentPasswordRequired'));
          return;
        }
        body.currentPassword = currentPassword;
      }
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || t('status.passwordUpdateFailed'));
        return;
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStatus(profile.hasPassword ? t('status.passwordUpdated') : t('status.localPasswordSet'));
      await load();
    } finally {
      setBusy(false);
    }
  };

  if (loading || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-[var(--muted)]">
        {t('profile.loading')}
      </main>
    );
  }

  const sso = profile.authMethods.sso;

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--border)]/80 bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3.5">
          <Link href="/" className="text-sm font-semibold text-[var(--text)] no-underline hover:no-underline">
            {t('profile.backVaults')}
          </Link>
          <AppUserMenu user={profile} dense />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center gap-4">
          <UserAvatar userId={profile.userId} name={profile.username} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">{t('profile.title')}</h1>
            <p className="mt-0.5 text-sm text-[var(--muted)]">
              {t('profile.accountDetails')}
              {sso ? t('profile.linkedToMyelinSuffix') : ''}
            </p>
          </div>
        </div>

        <section className="mt-8 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
          <h2 className="text-sm font-semibold text-[var(--text)]">{t('profile.preferences')}</h2>
          <label className="block text-sm">
            {t('nav.language')}
            <select
              className="input mt-1 w-full"
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
            <span className="mt-1 block text-[11px] text-[var(--muted)]">{t('profile.languageHint')}</span>
          </label>
        </section>

        {error && (
          <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
        {status && (
          <p className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm">
            {status}
          </p>
        )}

        {sso && (
          <div className="mt-6 rounded-xl border border-[color-mix(in_srgb,var(--accent)_30%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-4 py-3 text-sm text-[var(--muted)]">
            <p className="font-medium text-[var(--accent-soft)]">{t('profile.ssoAccountTitle')}</p>
            <p className="mt-1 text-[13px] leading-relaxed">{t('profile.ssoAccountBody')}</p>
            {profile.pmUserId != null && (
              <p className="mt-2 font-mono text-[11px] text-[var(--muted)]">
                {t('profile.myelinUserId', { id: profile.pmUserId })}
              </p>
            )}
          </div>
        )}

        <section className="mt-8 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
          <h2 className="text-sm font-semibold text-[var(--text)]">{t('profile.profileFields')}</h2>
          <label className="block text-sm">
            {t('home.username')}
            <input
              className="input mt-1 w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="block text-sm">
            {t('home.email')}
            <input
              className="input mt-1 w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sso}
              autoComplete="email"
            />
            {sso && (
              <span className="mt-1 block text-[11px] text-[var(--muted)]">
                {t('profile.emailManagedBySso')}
              </span>
            )}
          </label>
          <button
            type="button"
            className="btn-primary"
            disabled={busy}
            onClick={() => void saveProfile()}
          >
            {t('profile.saveProfile')}
          </button>
        </section>

        {profile.pmIntegration?.enabled !== false && (
          <section className="mt-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
            <h2 className="text-sm font-semibold text-[var(--text)]">{t('profile.myelinApiToken')}</h2>
            <p className="text-xs leading-relaxed text-[var(--muted)]">{t('profile.pmTokenHelp')}</p>
            <div className="flex flex-wrap gap-3 text-[12px] text-[var(--muted)]">
              <span>
                {t('profile.ssoStatusLabel')}{' '}
                {profile.pmIntegration?.ssoToken ? (
                  <span className="text-[var(--accent-soft)]">{t('profile.connectionConnected')}</span>
                ) : (
                  <span>{t('profile.connectionNotConnected')}</span>
                )}
              </span>
              <span>
                {t('profile.personalTokenStatusLabel')}{' '}
                {profile.pmIntegration?.personalApiKey.configured ? (
                  <span className="font-mono text-[var(--accent-soft)]">
                    {profile.pmIntegration.personalApiKey.prefix ||
                      t('profile.tokenConfiguredFallback')}
                  </span>
                ) : (
                  <span>{t('profile.tokenNotSet')}</span>
                )}
              </span>
            </div>
            {!profile.pmIntegration?.ssoToken && (
              <a
                href="/api/auth/sso/start"
                className="inline-flex text-sm font-medium text-[var(--accent-soft)] no-underline hover:underline"
              >
                {t('chrome.reconnectSsoArrow')}
              </a>
            )}
            <label className="block text-sm">
              {t('profile.personalApiTokenField')}
              <input
                className="input mt-1 w-full"
                type="password"
                autoComplete="off"
                placeholder={
                  profile.pmIntegration?.personalApiKey.configured ? '••••••••' : 'pt_…'
                }
                value={pmApiKey}
                onChange={(e) => {
                  setPmApiKey(e.target.value);
                  setClearPmApiKey(false);
                }}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={clearPmApiKey}
                onChange={(e) => {
                  setClearPmApiKey(e.target.checked);
                  if (e.target.checked) setPmApiKey('');
                }}
              />
              {t('profile.clearStoredToken')}
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={autoAssignOnCreate}
                disabled={busy}
                onChange={(e) => void saveAutoAssign(e.target.checked)}
              />
              <span>
                <span className="text-[var(--text)]">{t('profile.autoAssignLabel')}</span>
                <span className="mt-0.5 block text-xs text-[var(--muted)]">
                  {t('profile.autoAssignHelp')}
                  {profile.pmUserId == null ? (
                    <span className="mt-1 block text-amber-200/90">
                      {t('profile.autoAssignNoPmUser')}
                    </span>
                  ) : null}
                </span>
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-primary"
                disabled={busy}
                onClick={() => void savePmApiKey()}
              >
                {t('profile.saveToken')}
              </button>
              <button
                type="button"
                className="btn-ghost"
                disabled={busy}
                onClick={() => void testPmConnection()}
              >
                {t('profile.testConnection')}
              </button>
            </div>
          </section>
        )}

        <section className="mt-6 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
          <h2 className="text-sm font-semibold text-[var(--text)]">
            {profile.hasPassword ? t('profile.changePassword') : t('profile.setLocalPassword')}
          </h2>
          <p className="text-xs text-[var(--muted)]">
            {profile.hasPassword
              ? t('profile.changePasswordHint')
              : t('profile.setLocalPasswordHint')}
          </p>
          {profile.hasPassword && (
            <label className="block text-sm">
              {t('profile.currentPassword')}
              <input
                className="input mt-1 w-full"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
          )}
          <label className="block text-sm">
            {t('authPages.newPassword')}
            <input
              className="input mt-1 w-full"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label className="block text-sm">
            {t('authPages.confirmPassword')}
            <input
              className="input mt-1 w-full"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <button
            type="button"
            className="btn-primary"
            disabled={busy}
            onClick={() => void savePassword()}
          >
            {profile.hasPassword ? t('authPages.updatePassword') : t('profile.setPassword')}
          </button>
        </section>

        <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--panel)]/70 p-5">
          <h2 className="text-sm font-semibold text-[var(--text)]">{t('nav.templates')}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{t('profile.templatesHint')}</p>
          <Link
            href="/templates"
            className="btn-ghost mt-4 inline-flex no-underline hover:no-underline"
          >
            {t('chrome.manageTemplates')}
          </Link>
        </section>

        {profile.isAdmin && (
          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            <Link href="/settings" className="text-[var(--accent-soft)]">
              {t('profile.openAdminSettings')}
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
