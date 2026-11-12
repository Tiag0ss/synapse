/**
 * Synapse personal API tokens (`st_…`) for MCP and machine clients.
 * Distinct from Myelin `pt_…` tokens stored under Profile → Myelin.
 */
import crypto from 'crypto';
import { pool, ResultSetHeader, RowDataPacket } from '../config/database';

export const SYNAPSE_API_TOKEN_PREFIX = 'st_';

export type ApiTokenRow = {
  id: number;
  userId: number;
  tokenName: string;
  tokenPrefix: string;
  isActive: boolean;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string | null;
};

export function hashApiToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateSynapseApiToken(): { raw: string; prefix: string; hash: string } {
  const rawBody = crypto.randomBytes(32).toString('hex');
  const raw = `${SYNAPSE_API_TOKEN_PREFIX}${rawBody}`;
  return {
    raw,
    prefix: `${SYNAPSE_API_TOKEN_PREFIX}${rawBody.slice(0, 8)}`,
    hash: hashApiToken(raw),
  };
}

function mapRow(r: RowDataPacket): ApiTokenRow {
  return {
    id: Number(r.Id),
    userId: Number(r.UserId),
    tokenName: String(r.TokenName || ''),
    tokenPrefix: String(r.TokenPrefix || ''),
    isActive: Number(r.IsActive) === 1,
    lastUsedAt: r.LastUsedAt != null ? String(r.LastUsedAt) : null,
    expiresAt: r.ExpiresAt != null ? String(r.ExpiresAt) : null,
    createdAt: r.CreatedAt != null ? String(r.CreatedAt) : null,
  };
}

export async function listApiTokensForUser(userId: number): Promise<ApiTokenRow[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT Id, UserId, TokenName, TokenPrefix, IsActive, LastUsedAt, ExpiresAt, CreatedAt
     FROM ApiTokens WHERE UserId = ? ORDER BY CreatedAt DESC`,
    [userId]
  );
  return rows.map(mapRow);
}

export async function createApiToken(params: {
  userId: number;
  tokenName: string;
  expiresAt?: Date | null;
}): Promise<{ row: ApiTokenRow; rawToken: string }> {
  const { raw, prefix, hash } = generateSynapseApiToken();
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO ApiTokens (UserId, TokenName, TokenHash, TokenPrefix, IsActive, ExpiresAt)
     VALUES (?, ?, ?, ?, 1, ?)`,
    [params.userId, params.tokenName.trim(), hash, prefix, params.expiresAt ?? null]
  );
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT Id, UserId, TokenName, TokenPrefix, IsActive, LastUsedAt, ExpiresAt, CreatedAt
     FROM ApiTokens WHERE Id = ? LIMIT 1`,
    [result.insertId]
  );
  return { row: mapRow(rows[0]), rawToken: raw };
}

export async function revokeApiToken(userId: number, tokenId: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE ApiTokens SET IsActive = 0 WHERE Id = ? AND UserId = ?`,
    [tokenId, userId]
  );
  return result.affectedRows > 0;
}

export async function deleteApiToken(userId: number, tokenId: number): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>(
    `DELETE FROM ApiTokens WHERE Id = ? AND UserId = ?`,
    [tokenId, userId]
  );
  return result.affectedRows > 0;
}

/** Resolve an active, non-expired `st_…` token to a Synapse user id. */
export async function resolveUserIdFromApiToken(
  rawToken: string
): Promise<{ userId: number; tokenId: number } | null> {
  const token = String(rawToken || '').trim();
  if (!token.startsWith(SYNAPSE_API_TOKEN_PREFIX)) return null;
  const hash = hashApiToken(token);
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT Id, UserId, IsActive, ExpiresAt FROM ApiTokens WHERE TokenHash = ? LIMIT 1`,
    [hash]
  );
  if (!rows.length) return null;
  const row = rows[0];
  if (Number(row.IsActive) !== 1) return null;
  if (row.ExpiresAt != null && new Date(String(row.ExpiresAt)).getTime() < Date.now()) {
    return null;
  }
  const tokenId = Number(row.Id);
  const userId = Number(row.UserId);
  void pool
    .execute('UPDATE ApiTokens SET LastUsedAt = CURRENT_TIMESTAMP WHERE Id = ?', [tokenId])
    .catch(() => {});
  return { userId, tokenId };
}
