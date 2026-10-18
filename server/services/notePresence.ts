import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

/** Drop presence rows older than this (client heartbeats ~15s). */
export const NOTE_PRESENCE_TTL_MS = 45_000;

export type NotePresencePeer = {
  userId: number;
  username: string;
  hasFocus: boolean;
  lastSeenAt: string;
};

export type NotePresenceSnapshot = {
  peers: NotePresencePeer[];
  /** Other user currently holding soft focus lock, if any. */
  softLock: NotePresencePeer | null;
};

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function rowToPeer(row: RowDataPacket): NotePresencePeer {
  return {
    userId: Number(row.UserId),
    username: String(row.Username || '').trim() || `User #${row.UserId}`,
    hasFocus: Number(row.HasFocus) === 1,
    lastSeenAt: toIso(row.LastSeenAt),
  };
}

/** Pure helper — pick soft-lock holder among peers (excluding self). */
export function pickSoftLock(
  peers: NotePresencePeer[],
  selfUserId: number,
  nowMs: number = Date.now(),
  ttlMs: number = NOTE_PRESENCE_TTL_MS
): NotePresencePeer | null {
  const cutoff = nowMs - ttlMs;
  const focused = peers
    .filter((p) => p.userId !== selfUserId && p.hasFocus)
    .filter((p) => {
      const t = new Date(p.lastSeenAt).getTime();
      return Number.isFinite(t) && t >= cutoff;
    })
    .sort((a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime());
  return focused[0] ?? null;
}

async function pruneStale(noteId: number): Promise<void> {
  const cutoff = new Date(Date.now() - NOTE_PRESENCE_TTL_MS);
  await pool.execute<ResultSetHeader>(
    'DELETE FROM NotePresence WHERE NoteId = ? AND LastSeenAt < ?',
    [noteId, cutoff]
  );
}

export async function listNotePresence(
  noteId: number,
  selfUserId: number
): Promise<NotePresenceSnapshot> {
  await pruneStale(noteId);
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT UserId, Username, HasFocus, LastSeenAt
     FROM NotePresence
     WHERE NoteId = ?
     ORDER BY HasFocus DESC, LastSeenAt DESC`,
    [noteId]
  );
  const peers: NotePresencePeer[] = rows.map(rowToPeer);
  return {
    peers: peers.filter((p: NotePresencePeer) => p.userId !== selfUserId),
    softLock: pickSoftLock(peers, selfUserId),
  };
}

export async function upsertNotePresence(params: {
  noteId: number;
  userId: number;
  username: string;
  hasFocus: boolean;
}): Promise<NotePresenceSnapshot> {
  const name = String(params.username || '').trim().slice(0, 255) || `User #${params.userId}`;
  await pool.execute(
    `INSERT INTO NotePresence (NoteId, UserId, Username, HasFocus, LastSeenAt)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP(3))
     ON DUPLICATE KEY UPDATE
       Username = VALUES(Username),
       HasFocus = VALUES(HasFocus),
       LastSeenAt = CURRENT_TIMESTAMP(3)`,
    [params.noteId, params.userId, name, params.hasFocus ? 1 : 0]
  );
  return listNotePresence(params.noteId, params.userId);
}

export async function clearNotePresence(noteId: number, userId: number): Promise<void> {
  await pool.execute('DELETE FROM NotePresence WHERE NoteId = ? AND UserId = ?', [
    noteId,
    userId,
  ]);
}
