'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/provider';

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)]/80 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-2xl font-semibold tracking-tight">{t('authPages.forgotTitle')}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{t('authPages.forgotHint')}</p>
        {done ? (
          <p className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-3 text-sm">
            {t('authPages.forgotSent')}
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
              type="email"
              required
              placeholder={t('home.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn-primary w-full" disabled={busy}>
              {busy ? t('authPages.sending') : t('authPages.sendReset')}
            </button>
          </form>
        )}
        <Link href="/" className="mt-6 block text-center text-sm text-[var(--accent-soft)]">
          {t('authPages.backSignIn')}
        </Link>
      </div>
    </main>
  );
}
