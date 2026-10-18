'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n/provider';

export type LinkablePmTaskOption = {
  id: number;
  taskName: string;
  statusName: string | null;
  projectId: number;
  projectName: string;
  openUrl: string;
};

export type LinkablePmProjectOption = {
  id: number;
  name: string;
};

interface LinkOrCreatePmTaskModalProps {
  open: boolean;
  vaultId: string;
  checkboxLabel: string;
  busy?: boolean;
  onClose: () => void;
  onCreate: () => void | Promise<void>;
  onLink: (pmTaskId: number, pmProjectId: number) => void | Promise<void>;
}

const MIN_SEARCH_CHARS = 2;
const SEARCH_DEBOUNCE_MS = 350;

function normalizeLinkableTask(raw: Record<string, unknown>): LinkablePmTaskOption | null {
  const id = Number(raw.id ?? raw.Id);
  if (!Number.isFinite(id) || id <= 0) return null;
  const projectId = Number(raw.projectId ?? raw.ProjectId ?? 0);
  const taskName = String(raw.taskName ?? raw.TaskName ?? raw.Name ?? `Task #${id}`).trim();
  const statusNameRaw = raw.statusName ?? raw.StatusName;
  return {
    id,
    taskName: taskName || `Task #${id}`,
    statusName: statusNameRaw != null && String(statusNameRaw).trim() ? String(statusNameRaw) : null,
    projectId: Number.isFinite(projectId) && projectId > 0 ? projectId : 0,
    projectName: String(raw.projectName ?? raw.ProjectName ?? '').trim() || 'Project',
    openUrl: String(raw.openUrl ?? raw.OpenUrl ?? ''),
  };
}

export default function LinkOrCreatePmTaskModal({
  open,
  vaultId,
  checkboxLabel,
  busy = false,
  onClose,
  onCreate,
  onLink,
}: LinkOrCreatePmTaskModalProps) {
  const { t } = useI18n();
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsReauth, setNeedsReauth] = useState(false);
  const [projects, setProjects] = useState<LinkablePmProjectOption[]>([]);
  const [tasks, setTasks] = useState<LinkablePmTaskOption[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [defaultProjectId, setDefaultProjectId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchGen = useRef(0);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setDebouncedQuery('');
    setSelectedId(null);
    setError('');
    setNeedsReauth(false);
    setTasks([]);
    setHasSearched(false);
    let cancelled = false;
    (async () => {
      setProjectsLoading(true);
      try {
        const res = await fetch(`/api/vaults/${vaultId}/pm-tasks/linkable?projectsOnly=1`, {
          credentials: 'include',
        });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          if (json.reauth || res.status === 401) setNeedsReauth(true);
          setProjects([]);
          setError(json.message || t('status.failedToLoadMyelinTasks'));
          return;
        }
        const payload = json.data;
        const rawProjects = Array.isArray(payload?.projects) ? payload.projects : [];
        setProjects(
          rawProjects
            .map((p: { id?: number; Id?: number; name?: string; Name?: string }) => ({
              id: Number(p.id ?? p.Id),
              name: String(p.name ?? p.Name ?? '').trim() || `Project #${p.id ?? p.Id}`,
            }))
            .filter((p: LinkablePmProjectOption) => Number.isFinite(p.id) && p.id > 0)
        );
        const def = Number(payload?.defaultProjectId);
        const defaultId = Number.isFinite(def) && def > 0 ? def : null;
        setDefaultProjectId(defaultId);
        // Prefer vault project so search hits one project instead of the whole org.
        setProjectFilter(defaultId != null ? String(defaultId) : 'all');
      } catch {
        if (!cancelled) {
          setProjects([]);
          setError(t('status.networkErrorLoadingMyelinTasks'));
        }
      } finally {
        if (!cancelled) setProjectsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, vaultId, t]);

  useEffect(() => {
    if (!open) return;
    const handle = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [open, query]);

  useEffect(() => {
    if (!open || projectsLoading) return;
    const q = debouncedQuery;
    if (q.length < MIN_SEARCH_CHARS) {
      setTasks([]);
      setHasSearched(false);
      setTasksLoading(false);
      return;
    }

    let cancelled = false;
    const gen = ++searchGen.current;
    (async () => {
      setTasksLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        params.set('q', q);
        if (projectFilter !== 'all') params.set('projectId', projectFilter);
        const res = await fetch(`/api/vaults/${vaultId}/pm-tasks/linkable?${params.toString()}`, {
          credentials: 'include',
        });
        const json = await res.json();
        if (cancelled || gen !== searchGen.current) return;
        if (!res.ok) {
          if (json.reauth || res.status === 401) setNeedsReauth(true);
          setTasks([]);
          setHasSearched(true);
          setError(json.message || t('status.failedToLoadMyelinTasks'));
          return;
        }
        const payload = json.data;
        const rawTasks = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.tasks)
            ? payload.tasks
            : [];
        const normalized = rawTasks
          .map((row: unknown) =>
            row && typeof row === 'object'
              ? normalizeLinkableTask(row as Record<string, unknown>)
              : null
          )
          .filter((row: LinkablePmTaskOption | null): row is LinkablePmTaskOption => row != null);
        setTasks(normalized);
        setHasSearched(true);
        setSelectedId(null);
      } catch {
        if (!cancelled && gen === searchGen.current) {
          setTasks([]);
          setHasSearched(true);
          setError(t('status.networkErrorLoadingMyelinTasks'));
        }
      } finally {
        if (!cancelled && gen === searchGen.current) setTasksLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, vaultId, debouncedQuery, projectFilter, projectsLoading, t]);

  useEffect(() => {
    if (!open || projectsLoading) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open, projectsLoading]);

  const selectedTask = useMemo(
    () => (selectedId != null ? tasks.find((task) => task.id === selectedId) : null),
    [tasks, selectedId]
  );

  const listMessage = useMemo(() => {
    if (projectsLoading) return t('common.loading');
    if (query.trim().length < MIN_SEARCH_CHARS) return t('chrome.searchTasksToLoad');
    if (tasksLoading) return t('common.loading');
    if (!hasSearched) return t('chrome.searchTasksToLoad');
    if (tasks.length === 0) return t('chrome.noTasksMatchFilter');
    return null;
  }, [projectsLoading, query, tasksLoading, hasSearched, tasks.length, t]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-or-create-pm-title"
        className="flex max-h-[min(640px,92vh)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl sm:rounded-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <header className="shrink-0 border-b border-[var(--border)] px-5 py-4">
          <h2 id="link-or-create-pm-title" className="text-lg font-semibold text-[var(--text)]">
            {t('chrome.linkOrCreateTask')}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {t('chrome.linkOrCreateTaskHint', {
              label: checkboxLabel.trim() || t('chrome.thisCheckboxFallback'),
            })}
          </p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-5 py-4">
          {needsReauth && (
            <p className="shrink-0 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              {t('chrome.reconnectOrTokenForTasks')}
            </p>
          )}
          {error && !needsReauth && (
            <p className="shrink-0 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          )}

          {projects.length > 0 && (
            <div className="shrink-0">
              <label className="mb-1 block text-xs font-medium text-[var(--muted)]" htmlFor="linkable-project">
                {t('chrome.projectLabel')}
              </label>
              <select
                id="linkable-project"
                className="input w-full"
                value={projectFilter}
                disabled={busy || projectsLoading || tasksLoading}
                onChange={(e) => {
                  setProjectFilter(e.target.value);
                  setSelectedId(null);
                }}
              >
                <option value="all">{t('chrome.allProjects')}</option>
                {projects.map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.name}
                    {defaultProjectId === p.id ? t('chrome.vaultProjectSuffix') : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="shrink-0 block text-xs font-medium text-[var(--muted)]" htmlFor="linkable-search">
            {t('chrome.searchTasks')}
          </label>
          <input
            ref={inputRef}
            id="linkable-search"
            type="text"
            autoComplete="off"
            className="input w-full shrink-0"
            placeholder={t('chrome.filterTasksExtended')}
            aria-label={t('chrome.filterTasksExtended')}
            value={query}
            disabled={busy || projectsLoading}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Escape' && !busy) {
                e.preventDefault();
                onClose();
              }
            }}
          />

          <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-[var(--border)]">
            {listMessage ? (
              <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">{listMessage}</p>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {tasks.map((task) => {
                  const selected = selectedId === task.id;
                  return (
                    <li key={`${task.projectId}-${task.id}`}>
                      <button
                        type="button"
                        disabled={busy}
                        className={`flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition ${
                          selected
                            ? 'bg-[var(--accent)]/20 text-[var(--text)]'
                            : 'hover:bg-[var(--surface)]/60 text-[var(--text)]'
                        }`}
                        onClick={() => setSelectedId(task.id)}
                      >
                        <span
                          className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            selected
                              ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]'
                              : 'border-[var(--border)]'
                          }`}
                          aria-hidden
                        >
                          {selected ? '✓' : ''}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{task.taskName}</span>
                          <span className="mt-0.5 block text-[11px] text-[var(--muted)]">
                            #{task.id}
                            {task.projectName ? ` · ${task.projectName}` : ''}
                            {task.statusName ? ` · ${task.statusName}` : ''}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] px-5 py-3">
          <button type="button" className="btn-ghost" disabled={busy} onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className="btn-ghost"
            disabled={busy || projectsLoading}
            onClick={() => void onCreate()}
          >
            {t('chrome.createNewTask')}
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={busy || tasksLoading || !selectedTask || !selectedTask.projectId}
            onClick={() => {
              if (selectedTask) void onLink(selectedTask.id, selectedTask.projectId);
            }}
          >
            {t('chrome.linkSelected')}
          </button>
        </footer>
      </div>
    </div>
  );
}
