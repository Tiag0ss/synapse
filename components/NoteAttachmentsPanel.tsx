'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ConfirmModal from '@/components/ConfirmModal';
import { useI18n } from '@/lib/i18n/provider';

export type NoteAttachment = {
  id: number;
  originalName: string | null;
  mimeType: string;
  sizeBytes: number;
  url: string;
};

type NoteAttachmentsPanelProps = {
  vaultId: string;
  noteId: number;
  readOnly?: boolean;
  onInsertMarkdown?: (snippet: string) => void;
  onStatus?: (msg: string) => void;
  /** Bump to reload list after editor uploads */
  refreshToken?: number;
  /** Fired after a successful upload from this panel */
  onUploaded?: () => void;
};

const ATTACH_ACCEPT =
  'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md,.zip,application/pdf,text/plain,text/markdown,application/zip';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function markdownForAttachment(item: NoteAttachment): string {
  const name = (item.originalName || `file-${item.id}`).replace(/[[\]]/g, '');
  if ((item.mimeType || '').startsWith('image/')) {
    const alt = name.replace(/\.[^.]+$/, '') || 'image';
    return `\n![${alt}](${item.url})\n`;
  }
  return `\n[${name}](${item.url})\n`;
}

export default function NoteAttachmentsPanel({
  vaultId,
  noteId,
  readOnly = false,
  onInsertMarkdown,
  onStatus,
  refreshToken = 0,
  onUploaded,
}: NoteAttachmentsPanelProps) {
  const { t } = useI18n();
  const [items, setItems] = useState<NoteAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vaults/${vaultId}/notes/${noteId}/attachments`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        onStatus?.(data.message || t('status.failedToLoadAttachments'));
        return;
      }
      setItems(Array.isArray(data.data) ? data.data : []);
    } catch {
      onStatus?.(t('status.failedToLoadAttachments'));
    } finally {
      setLoading(false);
    }
  }, [noteId, onStatus, vaultId]);

  useEffect(() => {
    void load();
  }, [load, refreshToken]);

  const upload = async (files: File[]) => {
    if (!files.length || readOnly) return;
    setUploading(true);
    try {
      for (const file of files) {
        const buf = await file.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        const dataBase64 = btoa(binary);
        const res = await fetch(`/api/vaults/${vaultId}/media`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mimeType: file.type || 'application/octet-stream',
            dataBase64,
            fileName: file.name,
            noteId,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          onStatus?.(data.message || t('status.uploadFailed'));
          continue;
        }
        onStatus?.(t('status.uploadedNamed', { name: file.name }));
      }
      await load();
      onUploaded?.();
    } catch {
      onStatus?.(t('status.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId == null) return;
    const id = deleteId;
    setDeleteId(null);
    try {
      const res = await fetch(`/api/vaults/${vaultId}/media/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        onStatus?.(data.message || t('chrome.deleteFailed'));
        return;
      }
      onStatus?.(t('status.attachmentRemoved'));
      await load();
      onUploaded?.();
    } catch {
      onStatus?.(t('chrome.deleteFailed'));
    }
  };

  return (
    <section className="border-t border-[var(--border)] pt-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t('chrome.attachments')}
        </h3>
        {!readOnly && (
          <button
            type="button"
            className="btn-ghost px-2 py-0.5 text-[11px]"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? t('chrome.uploading') : t('chrome.upload')}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ATTACH_ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            e.target.value = '';
            void upload(files);
          }}
        />
      </div>

      {loading && !items.length ? (
        <p className="text-[11px] text-[var(--muted)]">{t('common.loading')}</p>
      ) : !items.length ? (
        <p className="text-[11px] text-[var(--muted)]">
          {t('chrome.noneYet')}
        </p>
      ) : (
        <ul className="max-h-48 space-y-1.5 overflow-auto text-xs">
          {items.map((item) => {
            const name = item.originalName || `file-${item.id}`;
            return (
              <li
                key={item.id}
                className="flex items-start gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)]/60 px-2 py-1.5"
              >
                <div className="min-w-0 flex-1">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate font-medium text-[var(--accent-soft)] hover:underline"
                    title={name}
                  >
                    {name}
                  </a>
                  <p className="truncate text-[10px] text-[var(--muted)]">
                    {item.mimeType || 'file'} · {formatSize(item.sizeBytes)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-0.5">
                  {!readOnly && onInsertMarkdown ? (
                    <button
                      type="button"
                      className="text-[10px] text-[var(--text)] hover:text-[var(--accent-soft)]"
                      title={t('chrome.insertLink')}
                      onClick={() => onInsertMarkdown(markdownForAttachment(item))}
                    >
                      {t('chrome.insert')}
                    </button>
                  ) : null}
                  {!readOnly ? (
                    <button
                      type="button"
                      className="text-[10px] text-[var(--danger)] hover:underline"
                      onClick={() => setDeleteId(item.id)}
                    >
                      {t('chrome.remove')}
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmModal
        open={deleteId != null}
        title={t('chrome.removeAttachmentTitle')}
        message={t('chrome.removeAttachmentMessage')}
        confirmLabel={t('chrome.remove')}
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void confirmDelete()}
      />
    </section>
  );
}
