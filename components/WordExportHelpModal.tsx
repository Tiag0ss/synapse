'use client';

import { useI18n } from '@/lib/i18n/provider';

interface WordExportHelpModalProps {
  open: boolean;
  onClose: () => void;
}

const BUILTIN_FIELD_KEYS: Array<[string, string]> = [
  ['{d.title}', 'settings.wordFieldTitle'],
  ['{d.path}', 'settings.wordFieldPath'],
  ['{d.body}', 'settings.wordFieldBody'],
  ['{d.vaultName}', 'settings.wordFieldVaultName'],
  ['{d.exportedAt}', 'settings.wordFieldExportedAt'],
  ['{d.author}', 'settings.wordFieldAuthor'],
  ['{d.authorEmail}', 'settings.wordFieldAuthorEmail'],
  ['{d.fm.<key>}', 'settings.wordFieldFmKey'],
  ['{d.<key>}', 'settings.wordFieldRootKey'],
  ['{d.<list>[i].<field>}', 'settings.wordFieldListCell'],
];

export default function WordExportHelpModal({ open, onClose }: WordExportHelpModalProps) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal
        aria-labelledby="word-export-help-title"
        className="flex max-h-[min(90vh,40rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 id="word-export-help-title" className="text-lg font-semibold tracking-tight">
              {t('settings.wordHelpTitle')}
            </h2>
            <p className="mt-0.5 text-xs text-[var(--muted)]">{t('settings.wordHelpSubtitle')}</p>
          </div>
          <button type="button" className="btn-ghost py-1" onClick={onClose}>
            {t('common.close')}
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--muted)]">
            <li>{t('settings.wordHelpStep1')}</li>
            <li>{t('settings.wordHelpStep2', { marker: '{d.title}' })}</li>
            <li>{t('settings.wordHelpStep3')}</li>
          </ol>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-3 py-3 text-sm text-[var(--muted)]">
            <p className="font-medium text-[var(--text)]">{t('settings.wordHelpGridsTitle')}</p>
            <p className="mt-1">{t('settings.wordHelpGridsBody')}</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--panel)] p-2 text-[11px] text-[var(--accent-soft)]">{`Column A | Column B
{d.items[i].name} | {d.items[i].value}`}</pre>
            <p className="mt-2 text-xs">{t('settings.wordHelpGridsHint')}</p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-3 py-3 text-sm text-[var(--muted)]">
            <p className="font-medium text-[var(--text)]">{t('settings.wordHelpNestedTitle')}</p>
            <p className="mt-1">{t('settings.wordHelpNestedBody')}</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--panel)] p-2 text-[11px] text-[var(--muted)]">{`items:
  - name: Parent group
    indent: 0
    value: ""
  - name: Child row
    indent: 1
    value: 10`}</pre>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-3 py-3 text-sm text-[var(--muted)]">
            <p className="font-medium text-[var(--text)]">{t('settings.wordHelpBodyTitle')}</p>
            <p className="mt-1">{t('settings.wordHelpBodyP1')}</p>
            <p className="mt-2 text-xs">{t('settings.wordHelpBodyP2')}</p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50 px-3 py-3 text-sm text-[var(--muted)]">
            <p className="font-medium text-[var(--text)]">{t('settings.wordHelpTocTitle')}</p>
            <p className="mt-1">{t('settings.wordHelpTocBody')}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-soft)]">
              {t('settings.wordHelpMarkersTitle')}
            </h3>
            <div className="mt-2 overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="w-full min-w-[24rem] text-left text-xs">
                <thead className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]">
                  <tr>
                    <th className="px-3 py-2 font-medium">{t('settings.wordHelpMarkerCol')}</th>
                    <th className="px-3 py-2 font-medium">{t('settings.wordHelpValueCol')}</th>
                  </tr>
                </thead>
                <tbody>
                  {BUILTIN_FIELD_KEYS.map(([marker, key]) => (
                    <tr key={marker} className="border-b border-[var(--border)]/60">
                      <td className="px-3 py-1.5 font-mono text-[11px] text-[var(--accent-soft)]">
                        {marker}
                      </td>
                      <td className="px-3 py-1.5 text-[var(--muted)]">{t(key)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-[var(--muted)]">{t('settings.wordHelpFmExample')}</p>
        </div>

        <footer className="flex shrink-0 justify-end border-t border-[var(--border)] px-5 py-3">
          <button type="button" className="btn-primary" onClick={onClose}>
            {t('settings.wordHelpGotIt')}
          </button>
        </footer>
      </div>
    </div>
  );
}
