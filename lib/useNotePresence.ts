'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { NotePresencePeer } from '@/components/NotePresenceBanner';

const HEARTBEAT_MS = 15_000;

type PresencePayload = {
  peers: NotePresencePeer[];
  softLock: NotePresencePeer | null;
};

/**
 * Heartbeat note presence while a note is open. Soft lock = another user with focus.
 */
export function useNotePresence(params: {
  vaultId: string | number;
  noteId: number | null;
  /** Claim soft lock only when this user can edit. */
  claimFocus: boolean;
  enabled?: boolean;
}) {
  const { vaultId, noteId, claimFocus, enabled = true } = params;
  const [peers, setPeers] = useState<NotePresencePeer[]>([]);
  const [softLock, setSoftLock] = useState<NotePresencePeer | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const noteIdRef = useRef(noteId);
  const claimFocusRef = useRef(claimFocus);
  const windowFocusedRef = useRef(true);

  useEffect(() => {
    noteIdRef.current = noteId;
  }, [noteId]);

  useEffect(() => {
    claimFocusRef.current = claimFocus;
  }, [claimFocus]);

  useEffect(() => {
    const sync = () => {
      windowFocusedRef.current =
        typeof document !== 'undefined' &&
        document.visibilityState === 'visible' &&
        document.hasFocus();
    };
    sync();
    window.addEventListener('focus', sync);
    window.addEventListener('blur', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      window.removeEventListener('focus', sync);
      window.removeEventListener('blur', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  const applySnapshot = useCallback((data: PresencePayload | null | undefined) => {
    setPeers(Array.isArray(data?.peers) ? data!.peers : []);
    setSoftLock(data?.softLock ?? null);
    setNowMs(Date.now());
  }, []);

  const clearLocal = useCallback(() => {
    setPeers([]);
    setSoftLock(null);
  }, []);

  useEffect(() => {
    if (!enabled || !noteId || !vaultId) {
      clearLocal();
      return;
    }

    let cancelled = false;
    const base = `/api/vaults/${vaultId}/notes/${noteId}/presence`;

    const beat = async () => {
      const hasFocus = claimFocusRef.current && windowFocusedRef.current;
      try {
        const res = await fetch(base, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hasFocus }),
        });
        if (cancelled || noteIdRef.current !== noteId) return;
        if (!res.ok) return;
        const json = (await res.json()) as { success?: boolean; data?: PresencePayload };
        if (json.success && json.data) applySnapshot(json.data);
      } catch {
        /* ignore transient network errors */
      }
    };

    void beat();
    const iv = window.setInterval(() => void beat(), HEARTBEAT_MS);

    const leave = () => {
      try {
        void fetch(base, { method: 'DELETE', credentials: 'include', keepalive: true });
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('pagehide', leave);

    return () => {
      cancelled = true;
      window.clearInterval(iv);
      window.removeEventListener('pagehide', leave);
      leave();
      clearLocal();
    };
  }, [enabled, noteId, vaultId, applySnapshot, clearLocal]);

  return { peers, softLock, nowMs };
}
