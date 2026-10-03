import { pool, ResultSetHeader, RowDataPacket } from '../config/database';
import logger from '../utils/logger';

export type NotificationKind = 'vault_share' | 'vault_role';

export async function createNotification(input: {
  userId: number;
  kind: NotificationKind;
  title: string;
  body?: string | null;
  href?: string | null;
}): Promise<number | null> {
  const userId = Number(input.userId);
  if (!Number.isFinite(userId) || userId <= 0) return null;
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO Notifications (UserId, Kind, Title, Body, Href)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        input.kind,
        String(input.title || '').slice(0, 255),
        input.body != null ? String(input.body).slice(0, 2000) : null,
        input.href != null ? String(input.href).slice(0, 1024) : null,
      ]
    );
    return Number(result.insertId) || null;
  } catch (error) {
    logger.warn('Failed to create notification', { error, userId, kind: input.kind });
    return null;
  }
}

export async function notifyVaultShare(input: {
  userId: number;
  vaultId: number;
  vaultName: string;
  role: string;
  byUsername?: string | null;
}): Promise<void> {
  const role = String(input.role || 'read');
  const by = input.byUsername ? ` by ${input.byUsername}` : '';
  await createNotification({
    userId: input.userId,
    kind: 'vault_share',
    title: `Shared: ${input.vaultName}`,
    body: `You were given ${role} access${by}.`,
    href: `/vaults/${input.vaultId}`,
  });
}

export async function notifyVaultRoleChange(input: {
  userId: number;
  vaultId: number;
  vaultName: string;
  role: string;
}): Promise<void> {
  await createNotification({
    userId: input.userId,
    kind: 'vault_role',
    title: `Role updated: ${input.vaultName}`,
    body: `Your access is now ${input.role}.`,
    href: `/vaults/${input.vaultId}`,
  });
}

export async function listNotificationsForUser(
  userId: number,
  opts?: { limit?: number; unreadOnly?: boolean }
): Promise<
  Array<{
    id: number;
    kind: string;
    title: string;
    body: string | null;
    href: string | null;
    readAt: string | null;
    createdAt: string;
  }>
> {
  const limit = Math.min(50, Math.max(1, Number(opts?.limit) || 30));
  const unreadOnly = Boolean(opts?.unreadOnly);
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT Id, Kind, Title, Body, Href, ReadAt, CreatedAt
     FROM Notifications
     WHERE UserId = ?
       ${unreadOnly ? 'AND ReadAt IS NULL' : ''}
     ORDER BY CreatedAt DESC
     LIMIT ${limit}`,
    [userId]
  );
  return rows.map((r) => ({
    id: Number(r.Id),
    kind: String(r.Kind),
    title: String(r.Title),
    body: r.Body != null ? String(r.Body) : null,
    href: r.Href != null ? String(r.Href) : null,
    readAt: r.ReadAt != null ? new Date(r.ReadAt).toISOString() : null,
    createdAt: new Date(r.CreatedAt).toISOString(),
  }));
}

export async function countUnreadNotifications(userId: number): Promise<number> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) AS c FROM Notifications WHERE UserId = ? AND ReadAt IS NULL',
    [userId]
  );
  return Number(rows[0]?.c || 0);
}

export async function markNotificationRead(
  userId: number,
  notificationId: number
): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE Notifications SET ReadAt = COALESCE(ReadAt, CURRENT_TIMESTAMP)
     WHERE Id = ? AND UserId = ?`,
    [notificationId, userId]
  );
  return result.affectedRows > 0;
}

export async function markAllNotificationsRead(userId: number): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE Notifications SET ReadAt = CURRENT_TIMESTAMP
     WHERE UserId = ? AND ReadAt IS NULL`,
    [userId]
  );
  return result.affectedRows;
}
