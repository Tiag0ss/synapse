'use client';

import { useEffect, useRef, useState } from 'react';
import type { LinkableVaultNotes, NoteIndexEntry } from '@/lib/renderMarkdown';
import { openPrintWindow, printNoteDocument } from '@/lib/printNote';
import { useI18n } from '@/lib/i18n/provider';

type ExportTemplate = {
  id: number;
  label: string;
  description: string | null;
  originalName: string;
};

type ExportFormat = 'markdown' | 'pdf' | 'docx';

interface NoteExportModalProps {
  open: boolean;
  vaultId: string;
  noteId: number | null;
  noteTitle: string;
  /** Current editor body (used for Markdown / PDF after save flush). */
  bodyMarkdown?: string;
  notes?: NoteIndexEntry[];
  linkableVaults?: LinkableVaultNotes[];
  /** Flush unsaved editor changes before export (server reads DB for DOCX). */
  onBeforeExport?: () => Promise<boolean>;
  onClose: () => void;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function safeMarkdownFilename(title: string): string {
  const leaf = (title || 'note').split('/').pop() || 'note';
  const cleaned = leaf.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').trim() || 'note';
  return cleaned.toLowerCase().endsWith('.md') ? cleaned : `${cleaned}.md`;
}

export default function NoteExportModal({
  open,
  vaultId,
  noteId,
  noteTitle,
  bodyMarkdown = '',
  notes = [],
  linkableVaults = [],
  onBeforeExport,
  onClose,
}: NoteExportModalProps) {
  const { t } = useI18n();
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const [templates, setTemplates] = useState<ExportTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const bodyRef = useRef(bodyMarkdown);
  bodyRef.current = bodyMarkdown;

  useEffect(() => {
    if (!open) return;
    setError('');
    setFormat('markdown');
    setLoading(true);
    void (async () => {
      try {
        const res = await fetch('/api/export-templates', { credentials: 'include' });
        const json = await res.json();
        if (!res.ok) {
          setError(json.message || 'Failed to load templates');
          setTemplates([]);
          return;
        }
        const list = (json.data || []) as ExportTemplate[];
        setTemplates(list);
        setSelectedId(list[0]?.id ?? null);
      } catch {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  if (!open) return null;

  const downloadMarkdown = async () => {
    if (!noteId) return;
    setBusy(true);
    setError('');
    try {
      if (onBeforeExport) {
        const ok = await onBeforeExport();
        if (!ok) {
          setError('Save failed — fix save errors before exporting');
          return;
        }
      }
      const blob = new Blob([bodyRef.current ?? ''], { type: 'text/markdown;charset=utf-8' });
      downloadBlob(blob, safeMarkdownFilename(noteTitle));
      onClose();
    } catch {
      setError('Failed to download Markdown');
    } finally {
      setBusy(false);
    }
  };

  const printOrPdf = async () => {
    if (!noteId) return;
    setBusy(true);
    setError('');
    // Open synchronously in the click gesture (before await), otherwise browsers block it.
    let printWindow: Window;
    try {
      printWindow = openPrintWindow();
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : 'Failed to open print window');
      return;
    }
    try {
      if (onBeforeExport) {
        const ok = await onBeforeExport();
        if (!ok) {
          printWindow.close();
          setError('Save failed — fix save errors before exporting');
          return;
        }
      }
      await printNoteDocument({
        title: noteTitle,
        bodyMarkdown: bodyRef.current ?? '',
        notes,
        linkableVaults,
        noteId,
        vaultId,
        printWindow,
      });
      onClose();
    } catch (e) {
      try {
        printWindow.close();
      } catch {
        /* ignore */
      }
      setError(e instanceof Error ? e.message : 'Failed to open print dialog');
    } finally {
      setBusy(false);
    }
  };

  const downloadDocx = async () => {
    if (!noteId || selectedId == null) return;
    setBusy(true);
    setError('');
    try {
      if (onBeforeExport) {
        const ok = await onBeforeExport();
        if (!ok) {
          setError('Save failed — fix save errors before exporting');
          return;
        }
      }
      const res = await fetch(`/api/vaults/${vaultId}/notes/${noteId}/export-docx`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exportTemplateId: selectedId }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.message || 'Export failed');
        return;
      }
      const blob = await res.blob();
      const disp = res.headers.get('Content-Disposition') || '';
      const match = /filename="([^"]+)"/i.exec(disp);
      const name = match?.[1] || `${noteTitle || 'note'}.docx`;
      downloadBlob(blob, name);
      onClose();
    } catch {
      setError('Network error');
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (format === 'markdown') void downloadMarkdown();
    else if (format === 'pdf') void printOrPdf();
    else void downloadDocx();
  };

  const canDownload =
    Boolean(noteId) &&
    !busy &&
    (format === 'markdown' || format === 'pdf' || (selectedId != null && templates.length > 0));

  const actionLabel =
    format === 'markdown'
      ? t('chrome.downloadMd')
      : format === 'pdf'
        ? t('chrome.printPdf')
        : 'Download DOCX';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal
        aria-labelledby="note-export-title"
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 id="note-export-title" className="text-lg font-semibold tracking-tight">
              {t('chrome.exportModalTitle')}
            </h2>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Markdown, PDF/print, or Word template
              {noteTitle ? ` · ${noteTitle}` : ''}
            </p>
          </div>
          <button type="button" className="btn-ghost py-1" onClick={onClose}>
            {t('common.close')}
          </button>
        </header>

        <div className="space-y-4 px-5 py-4">
          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div
            className="flex rounded-lg border border-[var(--border)] bg-[var(--surface)] p-0.5"
            role="tablist"
            aria-label={t('chrome.exportFormatAria')}
          >
            {(
              [
                { id: 'markdown', label: t('chrome.tabMarkdown') },
                { id: 'pdf', label: t('chrome.tabPdf') },
                { id: 'docx', label: t('chrome.tabWord') },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={format === opt.id}
                className={`flex-1 rounded-md px-2 py-1.5 text-sm font-medium transition sm:px-3 ${
                  format === opt.id
                    ? 'bg-[var(--accent)] text-[var(--accent-fg)]'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
                onClick={() => setFormat(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {format === 'markdown' ? (
            <p className="text-sm text-[var(--muted)]">
              Downloads the note body as a <code className="font-mono text-[var(--accent-soft)]">.md</code>{' '}
              file (including frontmatter and checkboxes).
            </p>
          ) : format === 'pdf' ? (
            <p className="text-sm text-[var(--muted)]">
              Opens the system print dialog. Choose <span className="text-[var(--text)]">Save as PDF</span>{' '}
              or send to a printer. Layout uses the rendered note preview.
            </p>
          ) : loading ? (
            <p className="text-sm text-[var(--muted)]">Loading templates…</p>
          ) : templates.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">{t('chrome.noWordTemplates')}</p>
          ) : (
            <>
              <label className="block text-sm">
                Template
                <select
                  className="input mt-1 w-full"
                  value={selectedId ?? ''}
                  onChange={(e) => setSelectedId(Number(e.target.value) || null)}
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                      {t.description ? ` — ${t.description}` : ''}
                    </option>
                  ))}
                </select>
              </label>
              <p className="text-[11px] text-[var(--muted)]">
                Use Carbone markers such as {'{d.title}'}, {'{d.body}'}, {'{d.fm.<key>}'}, and{' '}
                {'{d.<list>[i].<field>}'} for grids. See Settings → Word export → How to create
                templates.
              </p>
            </>
          )}
        </div>

        <footer className="flex justify-end gap-2 border-t border-[var(--border)] px-5 py-3">
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!canDownload}
            onClick={download}
          >
            {busy ? 'Exporting…' : actionLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
