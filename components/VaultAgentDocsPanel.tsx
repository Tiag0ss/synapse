'use client';

import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n/provider';
import ConfirmModal from '@/components/ConfirmModal';

type AgentDoc = {
  id: number;
  name: string;
  slug: string;
  content: string;
  sortOrder: number;
};

type DocKind = 'skills' | 'rules';

interface VaultAgentDocsPanelProps {
  vaultId: string;
  canEdit: boolean;
  onStatus?: (msg: string) => void;
}

export default function VaultAgentDocsPanel({
  vaultId,
  canEdit,
  onStatus,
}: VaultAgentDocsPanelProps) {
  const { t } = useI18n();
  const [kind, setKind] = useState<DocKind>('skills');
  const [items, setItems] = useState<AgentDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const pathSegment = kind === 'skills' ? 'agent-skills' : 'agent-rules';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vaults/${vaultId}/${pathSegment}`, { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) {
        onStatus?.(json.message || t('chrome.agentDocsLoadFailed'));
        setItems([]);
        return;
      }
      setItems(Array.isArray(json.data) ? json.data : []);
    } catch {
      onStatus?.(t('chrome.agentDocsLoadFailed'));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [vaultId, pathSegment, onStatus, t]);

  useEffect(() => {
    void load();
    setEditingId(null);
    setName('');
    setContent('');
  }, [load]);

  const startCreate = () => {
    setEditingId(0);
    setName('');
    setContent('');
  };

  const startEdit = (doc: AgentDoc) => {
    setEditingId(doc.id);
    setName(doc.name);
    setContent(doc.content || '');
  };

  const save = async () => {
    if (!canEdit || !name.trim()) return;
    setBusy(true);
    try {
      const isCreate = editingId === 0;
      const res = await fetch(
        isCreate
          ? `/api/vaults/${vaultId}/${pathSegment}`
          : `/api/vaults/${vaultId}/${pathSegment}/${editingId}`,
        {
          method: isCreate ? 'POST' : 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), content }),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        onStatus?.(json.message || t('chrome.agentDocsSaveFailed'));
        return;
      }
      onStatus?.(t('chrome.agentDocsSaved'));
      setEditingId(null);
      setName('');
      setContent('');
      await load();
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId || !canEdit) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/vaults/${vaultId}/${pathSegment}/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) {
        onStatus?.(json.message || t('chrome.agentDocsDeleteFailed'));
        return;
      }
      onStatus?.(t('chrome.agentDocsDeleted'));
      setDeleteId(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const subTabs: Array<{ id: DocKind; label: string }> = [
    { id: 'skills', label: t('chrome.agentSkills') },
    { id: 'rules', label: t('chrome.agentRules') },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-end justify-between gap-2 border-b border-[var(--border)] px-1">
        <div className="flex gap-1" role="tablist" aria-label={t('chrome.agentTab')}>
          {subTabs.map((tabItem) => (
            <button
              key={tabItem.id}
              type="button"
              role="tab"
              aria-selected={kind === tabItem.id}
              className={`rounded-t-lg px-3 py-2 text-sm transition ${
                kind === tabItem.id
                  ? 'bg-[var(--surface)] font-medium text-[var(--text)] ring-1 ring-[var(--border)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
              onClick={() => setKind(tabItem.id)}
            >
              {tabItem.label}
            </button>
          ))}
        </div>
        {canEdit && (
          <button type="button" className="btn-primary mb-1 text-sm" onClick={startCreate}>
            {t('chrome.newAgentDoc')}
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-1 pt-3">
        <p className="text-xs text-[var(--muted)]">
          {kind === 'skills' ? t('chrome.agentSkillsHint') : t('chrome.agentRulesHint')}
        </p>

        {editingId != null && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
              {t('chrome.agentDocName')}
            </label>
            <input
              className="input w-full"
              value={name}
              disabled={busy || !canEdit}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="mb-1 mt-3 block text-xs font-medium text-[var(--muted)]">
              {t('chrome.agentDocContent')}
            </label>
            <textarea
              className="input min-h-[160px] w-full font-mono text-sm"
              value={content}
              disabled={busy || !canEdit}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                className="btn-ghost text-sm"
                disabled={busy}
                onClick={() => setEditingId(null)}
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="btn-primary text-sm"
                disabled={busy || !canEdit || !name.trim()}
                onClick={() => void save()}
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-[var(--muted)]">{t('common.loading')}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">{t('chrome.noAgentDocs')}</p>
        ) : (
          <ul className="space-y-2">
            {items.map((doc) => (
              <li
                key={doc.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-[var(--border)] px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--text)]">{doc.name}</p>
                  <p className="truncate text-xs text-[var(--muted)]">{doc.slug}</p>
                </div>
                {canEdit && (
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      className="btn-ghost text-xs"
                      onClick={() => startEdit(doc)}
                    >
                      {t('chrome.editAgentDoc')}
                    </button>
                    <button
                      type="button"
                      className="btn-ghost text-xs text-red-300"
                      onClick={() => setDeleteId(doc.id)}
                    >
                      {t('chrome.delete')}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmModal
        open={deleteId != null}
        title={t('chrome.deleteAgentDocTitle')}
        message={t('chrome.deleteAgentDocMessage')}
        confirmLabel={t('chrome.delete')}
        danger
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
