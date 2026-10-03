'use client';

import { useEffect, useMemo, useState } from 'react';
import ConfirmModal from '@/components/ConfirmModal';

interface MemberRow {
  pmUserId: number;
  username: string;
  email: string;
  role: 'owner' | 'read' | 'edit';
  createdAt?: string;
}

interface UserHit {
  pmUserId: number;
  username: string;
  email: string;
}

interface VaultShareModalProps {
  open: boolean;
  vaultId: string;
  vaultName: string;
  isOwner: boolean;
  onClose: () => void;
  /** Render inside vault options Share tab (no overlay). */
  embedded?: boolean;
  /**
   * API root for members CRUD. Default `/api/vaults/{vaultId}`.
   * Admin settings uses `/api/settings/vaults/{vaultId}`.
   */
  membersBasePath?: string;
  /** Force manage UI (admin). Defaults to `isOwner`, and also follows API `accessRole`. */
  canManage?: boolean;
}

export default function VaultShareModal({
  open,
  vaultId,
  vaultName,
  isOwner,
  onClose,
  embedded = false,
  membersBasePath,
  canManage,
}: VaultShareModalProps) {
  const [owner, setOwner] = useState<MemberRow | null>(null);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [accessRole, setAccessRole] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<UserHit[]>([]);
  const [hitsLoading, setHitsLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState<UserHit | null>(null);
  const [role, setRole] = useState<'read' | 'edit'>('read');
  const [bulkRole, setBulkRole] = useState<'read' | 'edit'>('read');
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

  const base = membersBasePath || `/api/vaults/${vaultId}`;
  const manage =
    canManage === true ||
    isOwner ||
    accessRole === 'owner';

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base}/members`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.message || 'Failed to load members');
        return;
      }
      setOwner(data.data.owner);
      setMembers(data.data.members || []);
      if (data.data.accessRole != null) {
        setAccessRole(String(data.data.accessRole));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setStatus('');
    setQuery('');
    setHits([]);
    setSelected(null);
    setPickerOpen(false);
    setAccessRole(null);
    setBulkConfirmOpen(false);
    void load();
     
  }, [open, vaultId, base]);

  useEffect(() => {
    if (!open || !manage) return;
    const q = query.trim();
    const t = window.setTimeout(() => {
      void (async () => {
        setHitsLoading(true);
        try {
          const res = await fetch(`/api/vaults/users/search?q=${encodeURIComponent(q)}`, {
            credentials: 'include',
          });
          const data = await res.json();
          if (res.ok) setHits(data.data || []);
        } finally {
          setHitsLoading(false);
        }
      })();
    }, q.length === 0 ? 0 : 200);
    return () => window.clearTimeout(t);
  }, [query, open, manage]);

  const memberIds = useMemo(() => new Set(members.map((m) => m.pmUserId)), [members]);

  const pickerHits = useMemo(() => {
    return hits.filter((u) => u.pmUserId !== owner?.pmUserId);
  }, [hits, owner?.pmUserId]);

  if (!open) return null;

  const addMember = async (user: UserHit) => {
    setBusy(true);
    setStatus('');
    try {
      const res = await fetch(`${base}/members`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pmUserId: user.pmUserId, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.message || 'Could not add member');
        return;
      }
      setQuery('');
      setSelected(null);
      setPickerOpen(false);
      setStatus(`Granted ${role} to ${user.username}`);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const changeRole = async (pmUserId: number, next: 'read' | 'edit') => {
    setBusy(true);
    try {
      const res = await fetch(`${base}/members/${pmUserId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: next }),
      });
      const data = await res.json();
      if (!res.ok) setStatus(data.message || 'Update failed');
      else await load();
    } finally {
      setBusy(false);
    }
  };

  const removeMember = async (pmUserId: number) => {
    setBusy(true);
    try {
      const res = await fetch(`${base}/members/${pmUserId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) setStatus(data.message || 'Remove failed');
      else await load();
    } finally {
      setBusy(false);
    }
  };

  const runBulkAdd = async () => {
    setBulkConfirmOpen(false);
    setBusy(true);
    setStatus('');
    try {
      const res = await fetch(`${base}/members/bulk-all`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: bulkRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.message || 'Could not add all users');
        return;
      }
      const d = data.data || {};
      setStatus(
        `Added ${d.added ?? 0} user(s) as ${bulkRole}` +
          (d.skippedAlreadyMember
            ? ` · ${d.skippedAlreadyMember} already members`
            : '')
      );
      await load();
    } finally {
      setBusy(false);
    }
  };

  const rows: Array<MemberRow & { kind: 'owner' | 'member' }> = [
    ...(owner ? [{ ...owner, kind: 'owner' as const }] : []),
    ...members.map((m) => ({ ...m, kind: 'member' as const })),
  ];

  const bulkRoleLabel = bulkRole === 'edit' ? 'Edit (vault + wiki)' : 'Read (wiki only)';

  const body = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-auto p-5">
        <p className="text-sm text-[var(--muted)]">
          {vaultName} — <strong className="font-medium text-[var(--text)]">Read</strong> = wiki only;{' '}
          <strong className="font-medium text-[var(--text)]">Edit</strong> = vault + wiki.
        </p>

        {loading && rows.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Loading…</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--panel)]/80 text-[var(--muted)]">
                <tr>
                  <th className="px-3 py-2 font-medium">Person</th>
                  <th className="px-3 py-2 font-medium">Access</th>
                  <th className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-8 text-center text-[var(--muted)]">
                      No people on this vault yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={`${row.kind}-${row.pmUserId}`}
                      className="border-b border-[var(--border)]/60"
                    >
                      <td className="px-3 py-2">
                        <div className="font-medium text-[var(--text)]">{row.username}</div>
                        <div className="text-xs text-[var(--muted)]">{row.email || '—'}</div>
                      </td>
                      <td className="px-3 py-2">
                        {row.kind === 'owner' ? (
                          <span className="text-xs font-medium text-[var(--accent-soft)]">
                            Owner
                          </span>
                        ) : manage ? (
                          <select
                            className="input py-1 text-xs"
                            value={row.role}
                            disabled={busy}
                            onChange={(e) =>
                              void changeRole(row.pmUserId, e.target.value as 'read' | 'edit')
                            }
                          >
                            <option value="read">Wiki only (Read)</option>
                            <option value="edit">Vault + wiki (Edit)</option>
                          </select>
                        ) : (
                          <span className="text-xs capitalize text-[var(--muted)]">{row.role}</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {row.kind === 'owner' ? (
                          <span className="text-xs text-[var(--muted)]">Full access</span>
                        ) : manage ? (
                          <button
                            type="button"
                            className="btn-danger py-1 text-xs"
                            disabled={busy}
                            onClick={() => void removeMember(row.pmUserId)}
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="text-xs text-[var(--muted)]">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {manage && (
          <>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-4">
              <p className="text-sm font-semibold text-[var(--text)]">Add people</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Search Synapse users and grant wiki Read or vault Edit access.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start">
                <div className="relative min-w-[14rem] flex-1">
                  <label className="sr-only" htmlFor="vault-share-user-search">
                    Search users
                  </label>
                  <input
                    id="vault-share-user-search"
                    className="input w-full"
                    placeholder="Search users…"
                    value={selected ? selected.username : query}
                    onChange={(e) => {
                      setSelected(null);
                      setQuery(e.target.value);
                      setPickerOpen(true);
                    }}
                    onFocus={() => setPickerOpen(true)}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={pickerOpen}
                    aria-controls="vault-share-user-list"
                    aria-autocomplete="list"
                  />
                  {pickerOpen && (
                    <div
                      id="vault-share-user-list"
                      role="listbox"
                      className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--panel)] shadow-xl"
                    >
                      {hitsLoading ? (
                        <p className="px-3 py-2 text-xs text-[var(--muted)]">Loading…</p>
                      ) : pickerHits.length === 0 ? (
                        <p className="px-3 py-2 text-xs text-[var(--muted)]">No users found.</p>
                      ) : (
                        pickerHits.map((u) => {
                          const already = memberIds.has(u.pmUserId);
                          return (
                            <button
                              key={u.pmUserId}
                              type="button"
                              role="option"
                              aria-selected={selected?.pmUserId === u.pmUserId}
                              disabled={already || busy}
                              className={`flex w-full flex-col px-3 py-2 text-left text-sm transition ${
                                already
                                  ? 'cursor-not-allowed opacity-50'
                                  : 'hover:bg-[var(--surface-2)]'
                              } ${
                                selected?.pmUserId === u.pmUserId
                                  ? 'bg-[var(--surface-2)]'
                                  : ''
                              }`}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                if (already) return;
                                setSelected(u);
                                setQuery(u.username);
                                setPickerOpen(false);
                              }}
                            >
                              <span className="font-medium text-[var(--text)]">{u.username}</span>
                              <span className="text-xs text-[var(--muted)]">
                                {already ? 'Already added' : u.email || '—'}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
                <select
                  className="input w-full sm:w-auto"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'read' | 'edit')}
                  aria-label="Access role for new member"
                >
                  <option value="read">Wiki only (Read)</option>
                  <option value="edit">Vault + wiki (Edit)</option>
                </select>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={busy || !selected || memberIds.has(selected.pmUserId)}
                  onClick={() => selected && void addMember(selected)}
                >
                  Add
                </button>
              </div>
              {pickerOpen && (
                <button
                  type="button"
                  className="mt-2 text-xs text-[var(--muted)] hover:text-[var(--text)]"
                  onClick={() => setPickerOpen(false)}
                >
                  Close list
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/40 p-4">
              <p className="text-sm font-semibold text-[var(--text)]">Add all users</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Grant access to every active Synapse user who is not already a member. Existing
                members keep their current role.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  className="input w-auto"
                  value={bulkRole}
                  onChange={(e) => setBulkRole(e.target.value as 'read' | 'edit')}
                  aria-label="Access role for bulk add"
                  disabled={busy}
                >
                  <option value="read">Wiki only (Read)</option>
                  <option value="edit">Vault + wiki (Edit)</option>
                </select>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={busy}
                  onClick={() => setBulkConfirmOpen(true)}
                >
                  Add all users
                </button>
              </div>
            </div>
          </>
        )}

        {!manage && (
          <p className="text-xs text-[var(--muted)]">
            Only the vault owner can change sharing. Ask the owner for Edit access if you need to
            manage members.
          </p>
        )}
      </div>

      {status && (
        <footer className="shrink-0 border-t border-[var(--border)] px-5 py-2 text-xs text-[var(--muted)]">
          {status}
        </footer>
      )}

      <ConfirmModal
        open={bulkConfirmOpen}
        title="Add all users?"
        message={`Grant ${bulkRoleLabel} to all active Synapse users who are not already members of “${vaultName}”? Existing members will not be changed.`}
        confirmLabel="Add all"
        cancelLabel="Cancel"
        onConfirm={() => void runBulkAdd()}
        onCancel={() => setBulkConfirmOpen(false)}
      />
    </div>
  );

  if (embedded) {
    return <div className="flex h-full min-h-0 flex-col overflow-hidden">{body}</div>;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="flex max-h-[min(720px,92vh)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Share vault</h2>
            <p className="mt-0.5 text-sm text-[var(--muted)]">{vaultName}</p>
          </div>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">{body}</div>
      </div>
    </div>
  );
}
