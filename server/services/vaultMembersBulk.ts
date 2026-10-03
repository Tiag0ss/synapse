import { pool, RowDataPacket, ResultSetHeader } from '../config/database';
import { isPersonalWorkVault } from './personalWorkVault';

export type BulkAddAllResult =
  | {
      ok: true;
      added: number;
      skippedAlreadyMember: number;
      skippedOwner: number;
      role: 'read' | 'edit';
    }
  | { ok: false; status: number; message: string };

/**
 * Grant Read or Edit to every active Synapse user who is not already a member.
 * Does not change existing member roles. Skips the vault owner.
 */
export async function bulkAddAllActiveUsers(params: {
  vaultId: number;
  role: 'read' | 'edit';
  invitedByUserId: number;
}): Promise<BulkAddAllResult> {
  const [vaultRows] = await pool.execute<RowDataPacket[]>(
    'SELECT Id, OwnerPmUserId, IsPersonalWork FROM Vaults WHERE Id = ?',
    [params.vaultId]
  );
  const vault = vaultRows[0];
  if (!vault) return { ok: false, status: 404, message: 'Vault not found' };
  if (isPersonalWorkVault(vault as Record<string, unknown>)) {
    return { ok: false, status: 403, message: 'The My work vault cannot be shared' };
  }

  const ownerId = Number(vault.OwnerPmUserId);
  const [users] = await pool.execute<RowDataPacket[]>(
    'SELECT Id FROM Users WHERE IsActive = 1 ORDER BY Id ASC'
  );

  const [existing] = await pool.execute<RowDataPacket[]>(
    'SELECT PmUserId FROM VaultMembers WHERE VaultId = ?',
    [params.vaultId]
  );
  const memberIds = new Set(existing.map((r) => Number(r.PmUserId)));

  let added = 0;
  let skippedAlreadyMember = 0;
  let skippedOwner = 0;

  for (const row of users) {
    const userId = Number(row.Id);
    if (userId === ownerId) {
      skippedOwner += 1;
      continue;
    }
    if (memberIds.has(userId)) {
      skippedAlreadyMember += 1;
      continue;
    }
    await pool.execute<ResultSetHeader>(
      `INSERT INTO VaultMembers (VaultId, PmUserId, Role, InvitedByPmUserId)
       VALUES (?, ?, ?, ?)`,
      [params.vaultId, userId, params.role, params.invitedByUserId]
    );
    memberIds.add(userId);
    added += 1;
  }

  return {
    ok: true,
    added,
    skippedAlreadyMember,
    skippedOwner,
    role: params.role,
  };
}
