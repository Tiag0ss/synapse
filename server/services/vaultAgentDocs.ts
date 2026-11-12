/**
 * Vault-scoped agent skills / rules (Myelin #1400 / #1401).
 * Stored per-vault so each team can tailor the agent docs an MCP client sees.
 */
import { pool, RowDataPacket, ResultSetHeader } from '../config/database';
import { slugify } from './markdown';

export type AgentDocKind = 'skill' | 'rule';

export type VaultAgentDoc = {
  id: number;
  vaultId: number;
  name: string;
  slug: string;
  content: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

function tableFor(kind: AgentDocKind): string {
  return kind === 'skill' ? 'VaultAgentSkills' : 'VaultAgentRules';
}

function mapRow(row: RowDataPacket): VaultAgentDoc {
  return {
    id: Number(row.Id),
    vaultId: Number(row.VaultId),
    name: String(row.Name || ''),
    slug: String(row.Slug || ''),
    content: String(row.Content || ''),
    sortOrder: Number(row.SortOrder || 0),
    createdAt: row.CreatedAt != null ? new Date(row.CreatedAt).toISOString() : '',
    updatedAt: row.UpdatedAt != null ? new Date(row.UpdatedAt).toISOString() : '',
  };
}

async function uniqueSlug(kind: AgentDocKind, vaultId: number, base: string, excludeId?: number): Promise<string> {
  const table = tableFor(kind);
  const root = slugify(base) || (kind === 'skill' ? 'skill' : 'rule');
  let candidate = root;
  let suffix = 1;
  // Small vault-scoped tables — a loop is simple and safe here.
  for (;;) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT Id FROM ${table} WHERE VaultId = ? AND Slug = ?`,
      [vaultId, candidate]
    );
    const hit = rows[0];
    if (!hit || (excludeId != null && Number(hit.Id) === excludeId)) return candidate;
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
}

export async function listAgentDocs(vaultId: number, kind: AgentDocKind): Promise<VaultAgentDoc[]> {
  const table = tableFor(kind);
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM ${table} WHERE VaultId = ? ORDER BY SortOrder ASC, Name ASC`,
    [vaultId]
  );
  return rows.map(mapRow);
}

/** Look up by numeric Id when `idOrSlug` is a number, otherwise by Slug. */
export async function getAgentDoc(
  vaultId: number,
  kind: AgentDocKind,
  idOrSlug: number | string
): Promise<VaultAgentDoc | null> {
  const table = tableFor(kind);
  const byId = typeof idOrSlug === 'number';
  const [rows] = await pool.execute<RowDataPacket[]>(
    byId
      ? `SELECT * FROM ${table} WHERE VaultId = ? AND Id = ? LIMIT 1`
      : `SELECT * FROM ${table} WHERE VaultId = ? AND Slug = ? LIMIT 1`,
    [vaultId, byId ? idOrSlug : String(idOrSlug)]
  );
  return rows.length ? mapRow(rows[0]) : null;
}

export async function createAgentDoc(
  vaultId: number,
  kind: AgentDocKind,
  input: { name: string; content: string; sortOrder?: number }
): Promise<VaultAgentDoc> {
  const table = tableFor(kind);
  const name = input.name.trim();
  const slug = await uniqueSlug(kind, vaultId, name);
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO ${table} (VaultId, Name, Slug, Content, SortOrder) VALUES (?, ?, ?, ?, ?)`,
    [vaultId, name, slug, input.content ?? '', input.sortOrder ?? 0]
  );
  const created = await getAgentDoc(vaultId, kind, result.insertId);
  if (!created) throw new Error('Failed to load created agent doc');
  return created;
}

export async function updateAgentDoc(
  vaultId: number,
  kind: AgentDocKind,
  id: number,
  input: { name?: string; content?: string; sortOrder?: number }
): Promise<VaultAgentDoc | null> {
  const table = tableFor(kind);
  const existing = await getAgentDoc(vaultId, kind, id);
  if (!existing) return null;

  const name = input.name !== undefined ? input.name.trim() : existing.name;
  const slug = input.name !== undefined && input.name.trim() !== existing.name
    ? await uniqueSlug(kind, vaultId, name, id)
    : existing.slug;
  const content = input.content !== undefined ? input.content : existing.content;
  const sortOrder = input.sortOrder !== undefined ? input.sortOrder : existing.sortOrder;

  await pool.execute(
    `UPDATE ${table} SET Name = ?, Slug = ?, Content = ?, SortOrder = ? WHERE Id = ? AND VaultId = ?`,
    [name, slug, content, sortOrder, id, vaultId]
  );
  return getAgentDoc(vaultId, kind, id);
}

export async function deleteAgentDoc(vaultId: number, kind: AgentDocKind, id: number): Promise<boolean> {
  const table = tableFor(kind);
  const [result] = await pool.execute<ResultSetHeader>(
    `DELETE FROM ${table} WHERE Id = ? AND VaultId = ?`,
    [id, vaultId]
  );
  return result.affectedRows > 0;
}
