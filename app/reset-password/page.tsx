'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n/provider';

function ResetForm() {
  const { t } = useI18n();
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError('');
    setMessage('');
    if (password !== confirm) {
      setError(t('authPages.passwordsMismatch'));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || t('status.resetFailed'));
        return;
      }
      setMessage(data.message || t('settings.passwordUpdated'));
    } catch {
      setError(t('status.resetFailed'));
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return <p className="mt-4 text-sm text-red-300">{t('authPages.missingToken')}</p>;
  }

  return (
    <>
      {error && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      {message ? (
        <p className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-3 text-sm">
          {message}{' '}
          <Link href="/" className="text-[var(--accent-soft)]">
            {t('nav.signIn')}
          </Link>
        </p>
      ) : (
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <input
            className="input w-full"
            type="password"
            required
            placeholder={t('authPages.newPassword')}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="input w-full"
            type="password"
            required
            placeholder={t('authPages.confirmPassword')}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? t('common.save') : t('authPages.updatePassword')}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  const { t } = useI18n();
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)]/80 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-2xl font-semibold tracking-tight">{t('authPages.resetTitle')}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{t('authPages.resetHint')}</p>
        <Suspense fallback={<p className="mt-4 text-sm text-[var(--muted)]">{t('common.loading')}</p>}>
          <ResetForm />
        </Suspense>
        <Link href="/" className="mt-6 block text-center text-sm text-[var(--accent-soft)]">
          {t('authPages.backSignIn')}
        </Link>
      </div>
    </main>
  );
}
