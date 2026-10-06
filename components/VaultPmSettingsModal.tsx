'use client';

import { useEffect, useMemo, useState } from 'react';
import { resolveNoteId, type NoteResolveEntry } from '@/lib/notePaths';
import { renderInlineMarkdown } from '@/lib/renderMarkdown';
import ConfirmModal from '@/components/ConfirmModal';
import LinkOrCreatePmTaskModal from '@/components/LinkOrCreatePmTaskModal';
import { useI18n } from '@/lib/i18n/provider';

export interface VaultCheckboxItem {
  noteId: number;
  noteTitle: string;
  index: number;
  text: string;
  checked: boolean;
  markerId: string | null;
  indent?: number;
  source?: 'checkbox' | 'frontmatter';
  linkedNote?: string | null;
  pmTaskId: number | null;
  openUrl: string | null;
}

interface BulkProgress {
  phase: 'prepare' | 'create';
  done: number;
  total: number;
  created: number;
  failed: number;
  skipped: number;
  label?: string;
}

interface VaultPmSettingsModalProps {
  open: boolean;
  vaultId: string;
  vaultName: string;
  pmProjectId?: number | null;
  pmProjectName?: string | null;
  pmOrganizationId?: number | null;
  onClose: () => void;
  onChanged: () => void;
  /** Bubble status into vault toast / header. */
  onStatus?: (msg: string) => void;
  onOpenNote?: (noteId: number) => void;
  notes?: NoteResolveEntry[];
  /** Render as a panel inside Vault options (no overlay chrome). */
  embedded?: boolean;
}

export default function VaultPmSettingsModal({
  open,
  vaultId,
  vaultName,
  pmProjectId,
  pmProjectName,
  pmOrganizationId,
  onClose,
  onChanged,
  onStatus,
  onOpenNote,
  notes = [],
  embedded = false,
}: VaultPmSettingsModalProps) {
  const { t } = useI18n();
  const [orgs, setOrgs] = useState<Array<{ Id: number; Name: string }>>([]);
  const [orgId, setOrgId] = useState(pmOrganizationId ? String(pmOrganizationId) : '');
  const [projects, setProjects] = useState<Array<{ Id: number; Name: string }>>([]);
  const [projectQuery, setProjectQuery] = useState('');
  const [linkProjectId, setLinkProjectId] = useState('');
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [linkedProjectId, setLinkedProjectId] = useState<number | null>(pmProjectId ?? null);
  const [linkedProjectName, setLinkedProjectName] = useState<string | null>(
    pmProjectName?.trim() || null
  );
  const [projectStale, setProjectStale] = useState(false);
  const [items, setItems] = useState<VaultCheckboxItem[]>([]);
  const [status, setStatusState] = useState('');
  const setStatus = (msg: string) => {
    setStatusState(msg);
    if (msg.trim()) onStatus?.(msg);
  };
  const [orgError, setOrgError] = useState('');
  const [needsReauth, setNeedsReauth] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unlinked' | 'open'>('unlinked');
  const [bulkProgress, setBulkProgress] = useState<BulkProgress | null>(null);
  const [chooserItem, setChooserItem] = useState<VaultCheckboxItem | null>(null);
  const [unlinkItem, setUnlinkItem] = useState<VaultCheckboxItem | null>(null);
  const [autoLinkNoteId, setAutoLinkNoteId] = useState<number | ''>('');

  const load = async () => {
    setLoadingOrgs(true);
    setOrgError('');
    setNeedsReauth(false);
    try {
      const [orgRes, cbRes] = await Promise.all([
        fetch('/api/vaults/pm/organizations', { credentials: 'include' }),
        fetch(`/api/vaults/${vaultId}/checkboxes`, { credentials: 'include' }),
      ]);
      const orgJson = await orgRes.json();
      if (orgRes.ok) {
        const list = Array.isArray(orgJson.data) ? orgJson.data : [];
        setOrgs(
          list.map((o: { Id?: number; id?: number; Name?: string; name?: string }) => ({
            Id: Number(o.Id ?? o.id),
            Name: String(o.Name ?? o.name ?? o.Id),
          }))
        );
        if (list.length === 0) {
          setOrgError(t('status.noOrganizationsReturned'));
        }
      } else {
        setOrgs([]);
        setNeedsReauth(Boolean(orgJson.reauth) || orgRes.status === 401);
        const msg =
          orgJson.message ||
          t('status.failedLoadOrganizations');
        setOrgError(msg);
        setStatus(msg);
      }
      const cbJson = await cbRes.json();
      if (cbRes.ok) setItems(cbJson.data?.items || []);
    } catch {
      setOrgError(t('status.networkErrorLoadingOrganizations'));
    } finally {
      setLoadingOrgs(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setOrgId(pmOrganizationId ? String(pmOrganizationId) : '');
    setLinkedProjectId(pmProjectId ?? null);
    setLinkedProjectName(pmProjectName?.trim() || null);
    setLinkProjectId('');
    setProjectQuery('');
    void load();
  }, [open, vaultId, pmOrganizationId, pmProjectId, pmProjectName]);

  useEffect(() => {
    if (!open || !orgId) {
      setProjects([]);
      return;
    }
    let cancelled = false;
    setLoadingProjects(true);
    void (async () => {
      try {
        const res = await fetch(`/api/vaults/pm/projects?organizationId=${encodeURIComponent(orgId)}`, {
          credentials: 'include',
        });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setProjects([]);
          if (json.reauth || res.status === 401) setNeedsReauth(true);
          setOrgError(json.message || t('status.failedLoadProjects'));
          return;
        }
        const list = Array.isArray(json.data) ? json.data : [];
        const mapped = list
          .map((p: { Id?: number; id?: number; Name?: string; name?: string }) => ({
            Id: Number(p.Id ?? p.id),
            Name: String(p.Name ?? p.name ?? `Project #${p.Id ?? p.id}`),
          }))
          .filter((p: { Id: number }) => Number.isFinite(p.Id) && p.Id > 0);
        setProjects(mapped);
        if (linkedProjectId) {
          const match = mapped.find((p: { Id: number }) => p.Id === linkedProjectId);
          if (match?.Name) {
            setLinkedProjectName(match.Name);
            setProjectStale(false);
          } else if (mapped.length > 0) {
            setProjectStale(true);
          }
        } else {
          setProjectStale(false);
        }
        setNeedsReauth(false);
      } catch {
        if (!cancelled) setProjects([]);
      } finally {
        if (!cancelled) setLoadingProjects(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, orgId, linkedProjectId]);

  const filteredProjects = useMemo(() => {
    const q = projectQuery.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) => p.Name.toLowerCase().includes(q) || String(p.Id).includes(q)
    );
  }, [projects, projectQuery]);

  const selectedProjectName = useMemo(() => {
    const id = Number(linkProjectId);
    if (!Number.isFinite(id) || id <= 0) return '';
    return projects.find((p) => p.Id === id)?.Name || '';
  }, [projects, linkProjectId]);

  const missingCount = items.filter((i) => !i.pmTaskId).length;
  const linkedCount = items.filter((i) => i.pmTaskId).length;
  const openLinkedCount = items.filter((i) => i.pmTaskId && !i.checked).length;

  const notesWithUnlinked = useMemo(() => {
    const map = new Map<number, string>();
    for (const item of items) {
      if (!item.pmTaskId) map.set(item.noteId, item.noteTitle);
    }
    return [...map.entries()]
      .map(([id, title]) => ({ id, title }))
      .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
  }, [items]);

  const autoLinkCandidates = autoLinkNoteId
    ? items.filter((i) => i.noteId === autoLinkNoteId && !i.pmTaskId).length
    : 0;

  if (!open) return null;

  const visible = items.filter((i) => {
    if (filter === 'unlinked') return !i.pmTaskId;
    if (filter === 'open') return !i.checked;
    return true;
  });

  const createProject = async () => {
    if (!orgId) {
      setStatus(t('status.pickOrgFirst'));
      return;
    }
    setBusy(true);
    setStatus(t('status.creatingProject'));
    try {
      const res = await fetch(`/api/vaults/${vaultId}/push-project`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: Number(orgId), projectName: vaultName }),
      });
      const data = await res.json();
      if (res.ok) {
        const id = Number(data.data.pmProjectId);
        const name = String(data.data.pmProjectName || vaultName || '').trim() || null;
        setLinkedProjectId(id);
        setLinkedProjectName(name);
        setStatus(name ? t('status.linkedMyelinProjectName', { name }) : t('status.linkedMyelinProjectId', { id }));
        onChanged();
        await load();
      } else if (res.status === 409 && data.data?.pmProjectId) {
        setLinkedProjectId(Number(data.data.pmProjectId));
        const name = String(data.data.pmProjectName || '').trim();
        if (name) setLinkedProjectName(name);
        setStatus(t('status.alreadyLinked'));
        if (data.data.openUrl) window.open(data.data.openUrl, '_blank');
        onChanged();
      } else {
        setStatus(data.message || t('status.failedCreateProject'));
      }
    } finally {
      setBusy(false);
    }
  };

  const linkProject = async () => {
    if (!orgId || !linkProjectId) {
      setStatus(t('status.orgAndProjectRequired'));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/vaults/${vaultId}/link-project`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: Number(orgId), projectId: Number(linkProjectId) }),
      });
      const data = await res.json();
      if (res.ok) {
        const id = Number(data.data.pmProjectId);
        const name =
          String(data.data.pmProjectName || selectedProjectName || '').trim() || null;
        setLinkedProjectId(id);
        setLinkedProjectName(name);
        setStatus(name ? t('status.linkedMyelinProjectName', { name }) : t('status.linkedMyelinProjectId', { id }));
        onChanged();
        await load();
      } else {
        setStatus(data.message || t('status.linkFailed'));
      }
    } finally {
      setBusy(false);
    }
  };

  const unlink = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/vaults/${vaultId}/unlink-pm`, {
        method: 'POST',
        credentials: 'include',
      });
      setStatus(res.ok ? t('status.projectUnlinked') : t('status.unlinkFailed'));
      if (res.ok) {
        setLinkedProjectId(null);
        setLinkedProjectName(null);
        onChanged();
        await load();
      }
    } finally {
      setBusy(false);
    }
  };

  const pushCheckbox = async (item: VaultCheckboxItem) => {
    if (!linkedProjectId) {
      setStatus(t('status.linkMyelinProjectFirst'));
      return;
    }
    setBusy(true);
    setStatus(t('status.creatingTask'));
    try {
      const res = await fetch(`/api/vaults/${vaultId}/notes/${item.noteId}/checkboxes/push`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: item.index }),
      });
      const data = await res.json();
      if (res.ok || (res.status === 409 && data.data?.pmTaskId)) {
        setStatus(
          data.data?.alreadyLinked
            ? t('status.alreadyLinkedAsMyelin', { id: data.data.pmTaskId })
            : t('status.createdMyelinTask', { id: data.data.pmTaskId })
        );
        if (!data.data?.alreadyLinked && data.data?.openUrl) {
          window.open(data.data.openUrl, '_blank');
        }
        setChooserItem(null);
        onChanged();
        await load();
      } else {
        if (data.reauth || res.status === 401) setNeedsReauth(true);
        setStatus(data.message || t('status.couldNotCreateTask'));
      }
    } finally {
      setBusy(false);
    }
  };

  const linkCheckbox = async (item: VaultCheckboxItem, pmTaskId: number, pmProjectId: number) => {
    if (!linkedProjectId) {
      setStatus(t('status.linkMyelinProjectFirst'));
      return;
    }
    setBusy(true);
    setStatus(t('status.linkingTask'));
    try {
      const res = await fetch(`/api/vaults/${vaultId}/notes/${item.noteId}/checkboxes/link`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index: item.index, pmTaskId, pmProjectId }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(t('status.linkedToMyelin', { id: data.data?.pmTaskId ?? pmTaskId }));
        setChooserItem(null);
        onChanged();
        await load();
      } else {
        if (data.reauth || res.status === 401) setNeedsReauth(true);
        setStatus(data.message || t('status.couldNotLinkTask'));
      }
    } finally {
      setBusy(false);
    }
  };

  const unlinkCheckbox = async (item: VaultCheckboxItem) => {
    if (!item.pmTaskId) return;
    setBusy(true);
    setStatus(t('status.unlinking'));
    try {
      const res = await fetch(`/api/vaults/${vaultId}/notes/${item.noteId}/checkboxes/unlink`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          item.markerId
            ? { markerId: item.markerId }
            : { index: item.index }
        ),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(t('status.unlinkedFromMyelin', { id: data.data?.clearedPmTaskId ?? item.pmTaskId }));
        setUnlinkItem(null);
        onChanged();
        await load();
      } else {
        if (data.reauth || res.status === 401) setNeedsReauth(true);
        setStatus(data.message || t('status.couldNotUnlinkTask'));
      }
    } finally {
      setBusy(false);
    }
  };

  const pushAllMissing = async () => {
    if (!linkedProjectId) {
      setStatus(t('status.linkMyelinProjectFirst'));
      return;
    }
    const missing = items.filter((i) => !i.pmTaskId).length;
    if (!missing) {
      setStatus(t('status.noMissingTasks'));
      return;
    }
    setBusy(true);
    setBulkProgress({
      phase: 'prepare',
      done: 0,
      total: 0,
      created: 0,
      failed: 0,
      skipped: 0,
      label: t('status.preparingCreateTasks', { count: missing }),
    });
    setStatus(t('status.creatingMissingTasks'));
    try {
      const res = await fetch(`/api/vaults/${vaultId}/checkboxes/push-missing?stream=1`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/x-ndjson' },
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        const payload = data as { message?: string; reauth?: boolean };
        if (payload.reauth || res.status === 401) setNeedsReauth(true);
        setStatus(payload.message || t('status.bulkCreateFailed'));
        setBulkProgress(null);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          let event: {
            type?: string;
            phase?: 'prepare' | 'create';
            done?: number;
            total?: number;
            created?: number;
            failed?: number;
            skipped?: number;
            label?: string;
            message?: string;
            success?: boolean;
            reauth?: boolean;
            data?: {
              created?: number;
              skipped?: number;
              failed?: number;
              errors?: unknown[];
            };
          };
          try {
            event = JSON.parse(trimmed);
          } catch {
            continue;
          }
          if (event.type === 'progress') {
            setBulkProgress({
              phase: event.phase === 'create' ? 'create' : 'prepare',
              done: Number(event.done || 0),
              total: Number(event.total || 0),
              created: Number(event.created || 0),
              failed: Number(event.failed || 0),
              skipped: Number(event.skipped || 0),
              label: event.label,
            });
          } else if (event.type === 'done') {
            const d = event.data || {};
            finalMessage =
              t('status.bulkCreateSummary', {
                created: d.created || 0,
                skipped: d.skipped || 0,
                failed: d.failed || 0,
              }) +
              (d.errors?.length ? t('status.bulkCreateErrorsSuffix', { count: d.errors.length }) : '');
            setStatus(finalMessage);
          } else if (event.type === 'error') {
            if (event.reauth) setNeedsReauth(true);
            finalMessage = event.message || t('status.bulkCreateFailed');
            setStatus(finalMessage);
          }
        }
      }

      if (buffer.trim()) {
        try {
          const event = JSON.parse(buffer.trim()) as {
            type?: string;
            message?: string;
            reauth?: boolean;
            data?: { created?: number; skipped?: number; failed?: number; errors?: unknown[] };
          };
          if (event.type === 'done') {
            const d = event.data || {};
            setStatus(
              t('status.bulkCreateSummary', {
                created: d.created || 0,
                skipped: d.skipped || 0,
                failed: d.failed || 0,
              }) +
                (d.errors?.length ? t('status.bulkCreateErrorsSuffix', { count: d.errors.length }) : '')
            );
          } else if (event.type === 'error') {
            if (event.reauth) setNeedsReauth(true);
            setStatus(event.message || t('status.bulkCreateFailed'));
          }
        } catch {
          /* ignore trailing garbage */
        }
      }

      onChanged();
      await load();
    } catch {
      setStatus(t('status.networkErrorBulkCreate'));
    } finally {
      setBusy(false);
      setBulkProgress(null);
    }
  };

  const autoLinkByDescription = async () => {
    if (!linkedProjectId) {
      setStatus(t('status.linkMyelinProjectFirst'));
      return;
    }
    if (!autoLinkNoteId) {
      setStatus(t('status.selectNoteFirst'));
      return;
    }
    if (!autoLinkCandidates) {
      setStatus(t('status.noUnlinkedCheckboxes'));
      return;
    }
    setBusy(true);
    setStatus(t('status.matchingMyelinByDescription'));
    try {
      const res = await fetch(`/api/vaults/${vaultId}/checkboxes/auto-link`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId: autoLinkNoteId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.reauth || res.status === 401) setNeedsReauth(true);
        setStatus(data.message || t('status.autoLinkFailed'));
        return;
      }
      const linked = Number(data.data?.linked?.length || 0);
      const unmatched = Number(data.data?.unmatched?.length || 0);
      const ambiguous = Number(data.data?.ambiguous?.length || 0);
      const failed = Number(data.data?.failed?.length || 0);
      const failedPart = failed > 0 ? t('status.failedCountSuffix', { count: failed }) : '';
      setStatus(
        t('status.autoLinkDetailed', {
          linked,
          unmatched,
          ambiguous,
          failedPart,
        })
      );
      onChanged();
      await load();
    } finally {
      setBusy(false);
    }
  };

  const inner = (
    <>
        {!embedded && (
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{t('chrome.vaultMyelin')}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {t('chrome.vaultPmLinkHint')}
            </p>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t('common.close')}
          </button>
        </header>
        )}

        <div className="min-h-0 flex-1 space-y-5 overflow-auto p-5">
          {embedded && (
            <p className="text-sm text-[var(--muted)]">
              {t('chrome.vaultPmLinkHint')}
            </p>
          )}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
            <h3 className="text-sm font-semibold">{t('chrome.myelinProject')}</h3>
            {linkedProjectId ? (
              <>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {t('chrome.linkedToPrefix')}{' '}
                  <a
                    className="text-[var(--accent-soft)]"
                    href={`${process.env.NEXT_PUBLIC_PM_BASE_URL || 'http://localhost:3000'}/projects/${linkedProjectId}`}
                    target="_blank"
                    rel="noreferrer"
                    title={t('chrome.myelinProjectHashId', { id: linkedProjectId })}
                  >
                    {linkedProjectName?.trim() || t('chrome.projectHashId', { id: linkedProjectId })}
                  </a>
                  {linkedProjectName?.trim() ? (
                    <span className="text-[var(--muted)]"> #{linkedProjectId}</span>
                  ) : null}
                </p>
                {projectStale && (
                  <div className="mt-2 rounded-lg border border-[color-mix(in_srgb,var(--warn)_45%,var(--border))] bg-[color-mix(in_srgb,var(--warn)_10%,transparent)] px-3 py-2 text-xs text-[var(--text)]">
                    <p className="font-medium">{t('chrome.projectNotFoundOrg')}</p>
                    <p className="mt-0.5 text-[var(--muted)]">{t('chrome.projectNotFoundHint')}</p>
                    <button
                      type="button"
                      className="btn-ghost mt-2 py-1 text-xs"
                      disabled={busy}
                      onClick={() => void unlink()}
                    >
                      {t('chrome.unlinkProject')}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm text-[var(--muted)]">{t('chrome.noProjectLinked')}</p>
            )}
            {items.length > 0 && (
              <p className="mt-3 text-[11px] text-[var(--muted)]">
                {t('chrome.tasksLinkedSummary', { linked: linkedCount, missing: missingCount })}
                {openLinkedCount > 0
                  ? t('chrome.openLinkedSuffix', { count: openLinkedCount })
                  : ''}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <select
                className="input min-w-[14rem]"
                value={orgId}
                onChange={(e) => {
                  setOrgId(e.target.value);
                  setLinkProjectId('');
                  setProjectQuery('');
                }}
                disabled={loadingOrgs}
              >
                <option value="">
                  {loadingOrgs
                    ? t('chrome.loadingOrganizations')
                    : orgs.length
                      ? t('chrome.organizationEllipsis')
                      : t('chrome.noOrganizations')}
                </option>
                {orgs.map((o) => (
                  <option key={o.Id} value={o.Id}>
                    {o.Name}
                  </option>
                ))}
              </select>
              <button type="button" className="btn-ghost" disabled={loadingOrgs} onClick={() => void load()}>
                {t('chrome.refresh')}
              </button>
              {!linkedProjectId && (
                <div className="mt-3 w-full space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={busy || !orgId}
                      onClick={() => void createProject()}
                    >
                      {t('chrome.createProjectFromVault')}
                    </button>
                  </div>
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)]/40 p-3">
                    <label className="block text-xs font-medium text-[var(--muted)]" htmlFor="pm-project-search">
                      {t('chrome.orLinkExisting')}
                    </label>
                    <input
                      id="pm-project-search"
                      className="input mt-1.5 w-full"
                      placeholder={
                        !orgId
                          ? t('chrome.pickOrgFirst')
                          : loadingProjects
                            ? t('chrome.loadingProjects')
                            : t('chrome.searchProjects')
                      }
                      value={projectQuery}
                      onChange={(e) => {
                        setProjectQuery(e.target.value);
                        setLinkProjectId('');
                      }}
                      disabled={!orgId || loadingProjects || busy}
                      autoComplete="off"
                    />
                    {linkProjectId && selectedProjectName && (
                      <p className="mt-1.5 text-xs text-[var(--accent-soft)]">
                        {t('chrome.selectedLabel', { name: selectedProjectName })}{' '}
                        <span className="text-[var(--muted)]">#{linkProjectId}</span>
                      </p>
                    )}
                    <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-[var(--border)]">
                      {!orgId ? (
                        <p className="px-3 py-2 text-xs text-[var(--muted)]">{t('chrome.selectOrgToList')}</p>
                      ) : loadingProjects ? (
                        <p className="px-3 py-2 text-xs text-[var(--muted)]">{t('common.loading')}</p>
                      ) : filteredProjects.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-[var(--muted)]">
                          {projects.length === 0 ? t('chrome.noProjectsInOrg') : t('chrome.noMatches')}
                        </p>
                      ) : (
                        <ul className="divide-y divide-[var(--border)]" role="listbox" aria-label={t('chrome.projectsAria')}>
                          {filteredProjects.map((p) => {
                            const selected = String(p.Id) === linkProjectId;
                            return (
                              <li key={p.Id}>
                                <button
                                  type="button"
                                  role="option"
                                  aria-selected={selected}
                                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition ${
                                    selected
                                      ? 'bg-[var(--accent)]/20 text-[var(--text)]'
                                      : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                                  }`}
                                  onClick={() => {
                                    setLinkProjectId(String(p.Id));
                                    setProjectQuery(p.Name);
                                  }}
                                >
                                  <span className="min-w-0 truncate">{p.Name}</span>
                                  <span className="shrink-0 text-xs text-[var(--muted)]">#{p.Id}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn-ghost mt-2"
                      disabled={busy || !orgId || !linkProjectId}
                      onClick={() => void linkProject()}
                    >
                      {t('chrome.linkSelectedProject')}
                    </button>
                  </div>
                </div>
              )}
              {linkedProjectId && (
                <button type="button" className="btn-danger" disabled={busy} onClick={() => void unlink()}>
                  {t('chrome.unlinkProject')}
                </button>
              )}
            </div>
            {orgError && (
              <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                <p>{orgError}</p>
                {(needsReauth ||
                  orgError.toLowerCase().includes('sso') ||
                  orgError.toLowerCase().includes('credential') ||
                  orgError.toLowerCase().includes('profile') ||
                  orgError.toLowerCase().includes('sign in') ||
                  orgError.toLowerCase().includes('expired') ||
                  orgError.toLowerCase().includes('401')) && (
                  <div className="mt-2 flex flex-wrap gap-3">
                    <a
                      href="/api/auth/sso/start"
                      className="font-medium text-[var(--accent-soft)] no-underline hover:underline"
                    >
                      {t('chrome.reconnectSsoArrow')}
                    </a>
                    <a
                      href="/profile"
                      className="font-medium text-[var(--accent-soft)] no-underline hover:underline"
                    >
                      {t('chrome.addPersonalTokenArrow')}
                    </a>
                  </div>
                )}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">{t('chrome.checkboxTasks')}</h3>
              <div className="flex flex-wrap items-center gap-1">
                {(
                  [
                    ['unlinked', 'chrome.filterUnlinked'],
                    ['open', 'chrome.filterOpen'],
                    ['all', 'chrome.filterAll'],
                  ] as const
                ).map(([f, key]) => (
                  <button
                    key={f}
                    type="button"
                    className={`rounded-md px-2.5 py-1 text-xs ${
                      filter === f ? 'bg-[var(--accent)] text-[var(--accent-fg)]' : 'btn-ghost py-1'
                    }`}
                    onClick={() => setFilter(f)}
                  >
                    {t(key)}
                  </button>
                ))}
                <button
                  type="button"
                  className="btn-primary py-1 text-xs"
                  disabled={busy || !linkedProjectId || missingCount === 0}
                  title={
                    !linkedProjectId
                      ? t('chrome.linkProjectFirst')
                      : missingCount === 0
                        ? t('chrome.allCheckboxesHaveTasks')
                        : t('chrome.createMissingTitle', { count: missingCount })
                  }
                  onClick={() => void pushAllMissing()}
                >
                  {missingCount > 0
                    ? t('chrome.createAllMissingCount', { count: missingCount })
                    : t('chrome.createAllMissing')}
                </button>
              </div>
            </div>
            <p className="mb-3 text-xs text-[var(--muted)]">{t('chrome.checkboxTasksHint')}</p>
            {notesWithUnlinked.length > 0 && (
              <div className="mb-3 flex flex-wrap items-end gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)]/40 p-3">
                <label className="min-w-[12rem] flex-1 text-xs">
                  <span className="mb-1 block font-medium text-[var(--text)]">{t('chrome.autoLinkByDescription')}</span>
                  <select
                    className="input w-full py-1.5 text-xs"
                    value={autoLinkNoteId === '' ? '' : String(autoLinkNoteId)}
                    onChange={(e) =>
                      setAutoLinkNoteId(e.target.value ? Number(e.target.value) : '')
                    }
                  >
                    <option value="">{t('chrome.selectNoteEllipsis')}</option>
                    {notesWithUnlinked.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.title}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="btn-primary py-1 text-xs"
                  disabled={busy || !linkedProjectId || !autoLinkNoteId || autoLinkCandidates === 0}
                  title={
                    !autoLinkNoteId
                      ? t('chrome.selectNoteUnlinked')
                      : autoLinkCandidates === 0
                        ? t('chrome.noUnlinkedInNote')
                        : t('chrome.matchCheckboxesTitle', { count: autoLinkCandidates })
                  }
                  onClick={() => void autoLinkByDescription()}
                >
                  {t('chrome.autoLinkNote')}
                </button>
              </div>
            )}
            {bulkProgress && (
              <div
                className="mb-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-3"
                role="status"
                aria-live="polite"
              >
                <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-[var(--text)]">
                    {bulkProgress.phase === 'prepare' ? t('chrome.preparing') : t('chrome.creatingTasks')}
                  </span>
                  <span className="tabular-nums text-[var(--muted)]">
                    {bulkProgress.total > 0
                      ? `${bulkProgress.done} / ${bulkProgress.total}`
                      : '…'}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className={`h-full rounded-full bg-[var(--accent)] transition-[width] duration-200 ${
                      bulkProgress.total <= 0 ? 'animate-pulse' : ''
                    }`}
                    style={{
                      width:
                        bulkProgress.total > 0
                          ? `${Math.min(100, Math.round((bulkProgress.done / bulkProgress.total) * 100))}%`
                          : '35%',
                    }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-[var(--muted)]">
                  <span className="min-w-0 truncate" title={bulkProgress.label}>
                    {bulkProgress.label || t('chrome.working')}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {t('chrome.bulkCreated', { count: bulkProgress.created })}
                    {bulkProgress.failed > 0
                      ? t('chrome.bulkFailed', { count: bulkProgress.failed })
                      : ''}
                    {bulkProgress.skipped > 0
                      ? t('chrome.bulkSkipped', { count: bulkProgress.skipped })
                      : ''}
                  </span>
                </div>
              </div>
            )}
            {visible.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted)]">
                {t('chrome.noMatchingCheckboxes')}
              </p>
            ) : (
              <ul className="space-y-2">
                {visible.map((item) => (
                  <li
                    key={`${item.noteId}-${item.index}-${item.markerId || item.text}`}
                    className="flex flex-wrap items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/40 px-3 py-2.5"
                    style={{
                      marginLeft: `${Math.min(item.indent || 0, 12) * 0.45}rem`,
                    }}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                        item.checked
                          ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300'
                          : 'border-[var(--border)] text-transparent'
                      }`}
                      title={item.checked ? t('chrome.taskDone') : t('chrome.taskOpen')}
                    >
                      ✓
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(item.source === 'frontmatter' ||
                          (typeof item.markerId === 'string' &&
                            item.markerId.startsWith('fm:'))) && (
                          <span
                            className="shrink-0 rounded border border-[var(--border)] px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide text-[var(--muted)]"
                            title={t('chrome.fromYamlTodos')}
                          >
                            YAML
                          </span>
                        )}
                        <div
                          className={`synapse-task-label text-sm leading-snug ${
                            item.checked
                              ? 'text-[var(--muted)] line-through'
                              : 'text-[var(--text)]'
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: renderInlineMarkdown(item.text || t('chrome.emptyCheckbox')),
                          }}
                        />
                        {item.linkedNote &&
                          (() => {
                            const target = item.linkedNote;
                            const linkedId = resolveNoteId(target, notes);
                            if (linkedId && onOpenNote) {
                              return (
                                <button
                                  type="button"
                                  className="synapse-wikilink shrink-0 max-w-[9rem] truncate rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] font-medium no-underline"
                                  title={t('chrome.openNoteTitle', { name: target })}
                                  onClick={() => onOpenNote(linkedId)}
                                >
                                  {target}
                                </button>
                              );
                            }
                            return (
                              <span
                                className="synapse-wikilink is-missing shrink-0 max-w-[9rem] truncate rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] font-medium"
                                title={
                                  linkedId
                                    ? t('chrome.openNoteTitle', { name: target })
                                    : t('chrome.missingNoteTitle', { name: target })
                                }
                              >
                                {target}
                              </span>
                            );
                          })()}
                      </div>
                      <button
                        type="button"
                        className="mt-1 text-[11px] text-[var(--accent-soft)]"
                        onClick={() => onOpenNote?.(item.noteId)}
                      >
                        {item.noteTitle}
                      </button>
                    </div>
                    {item.pmTaskId ? (
                      <div className="flex shrink-0 flex-wrap items-center gap-1">
                        <a
                          className="btn-ghost py-1 text-xs no-underline"
                          href={item.openUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Myelin #{item.pmTaskId}
                        </a>
                        <button
                          type="button"
                          className="btn-ghost py-1 text-xs text-red-300"
                          disabled={busy || !linkedProjectId}
                          title={t('chrome.removeSynapseLinkTitle')}
                          onClick={() => setUnlinkItem(item)}
                        >
                          {t('chrome.unlink')}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary shrink-0 py-1 text-xs"
                        disabled={busy || !linkedProjectId}
                        title={
                          linkedProjectId
                            ? t('chrome.linkOrCreateMyelinTaskTitle')
                            : t('chrome.linkProjectFirst')
                        }
                        onClick={() => setChooserItem(item)}
                      >
                        {t('chrome.linkCreate')}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {status && (
          <footer className="shrink-0 border-t border-[var(--border)] px-5 py-2 text-xs text-[var(--muted)]">
            {status}
          </footer>
        )}

      <LinkOrCreatePmTaskModal
        open={chooserItem != null}
        vaultId={vaultId}
        checkboxLabel={chooserItem?.text || ''}
        busy={busy}
        onClose={() => {
          if (!busy) setChooserItem(null);
        }}
        onCreate={async () => {
          if (chooserItem) await pushCheckbox(chooserItem);
        }}
        onLink={async (pmTaskId, pmProjectId) => {
          if (chooserItem) await linkCheckbox(chooserItem, pmTaskId, pmProjectId);
        }}
      />

      <ConfirmModal
        open={unlinkItem != null}
        title={t('chrome.unlinkMyelinTitle')}
        message={t('chrome.unlinkConfirmMessage')}
        confirmLabel={busy ? t('chrome.unlinking') : t('chrome.unlink')}
        danger
        onCancel={() => {
          if (!busy) setUnlinkItem(null);
        }}
        onConfirm={() => {
          if (unlinkItem && !busy) void unlinkCheckbox(unlinkItem);
        }}
      />
    </>
  );

  if (embedded) {
    return <div className="flex h-full min-h-0 flex-col overflow-hidden">{inner}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="flex h-[min(820px,92vh)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl"
      >
        {inner}
      </div>
    </div>
  );
}
