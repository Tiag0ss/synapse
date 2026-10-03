/**
 * Unit coverage for bulk share semantics via a mocked pool.
 */
jest.mock('../../server/config/database', () => {
  const execute = jest.fn();
  return {
    pool: { execute },
    RowDataPacket: class {},
    ResultSetHeader: class {},
  };
});

import { pool } from '../../server/config/database';
import { bulkAddAllActiveUsers } from '../../server/services/vaultMembersBulk';

const execute = pool.execute as jest.Mock;

describe('bulkAddAllActiveUsers', () => {
  beforeEach(() => {
    execute.mockReset();
  });

  it('rejects personal work vaults', async () => {
    execute.mockResolvedValueOnce([
      [{ Id: 1, OwnerPmUserId: 10, IsPersonalWork: 1 }],
    ]);
    const result = await bulkAddAllActiveUsers({
      vaultId: 1,
      role: 'read',
      invitedByUserId: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(403);
    }
  });

  it('adds only non-members and skips owner', async () => {
    execute
      .mockResolvedValueOnce([[{ Id: 5, OwnerPmUserId: 1, IsPersonalWork: 0 }]]) // vault
      .mockResolvedValueOnce([[{ Id: 1 }, { Id: 2 }, { Id: 3 }]]) // users
      .mockResolvedValueOnce([[{ PmUserId: 2 }]]) // existing members
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // insert user 3

    const result = await bulkAddAllActiveUsers({
      vaultId: 5,
      role: 'edit',
      invitedByUserId: 1,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.added).toBe(1);
      expect(result.skippedOwner).toBe(1);
      expect(result.skippedAlreadyMember).toBe(1);
      expect(result.role).toBe('edit');
    }
    expect(execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO VaultMembers'),
      [5, 3, 'edit', 1]
    );
  });
});
