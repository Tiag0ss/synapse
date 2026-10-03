/**
 * Viewer-scoped note indexes for `[[@vault-slug/…]]` resolution.
 */
import { pool, RowDataPacket } from '../config/database';
import {
  accessibleVault,
  canOpenNoteOnWiki,
  canOpenVaultWiki,
  effectiveVisibility,
  listAccessibleVaults,
} from './vaultAccess';
import type { LinkableVaultNotes } from './notePaths';

const ACTIVE_NOTE = 'DeletedAt IS NULL';

/**
 * Guest password-share catalog: every vault with all active notes for `[[@slug/…]]`
 * resolution. Callers must gate peek with note-level public/unlisted checks — this
 * does not enforce wiki AllowPublicPages (share peek is note-scoped).
 */
export async function listLinkableVaultNotesForGuestShare(): Promise<LinkableVaultNotes[]> {
  const [vaultRows] = await pool.execute<RowDataPacket[]>(
    `SELECT Id, Name, slug FROM Vaults ORDER BY Name ASC`
  );
  const out: LinkableVaultNotes[] = [];
  for (const v of vaultRows) {
    const vaultId = Number(v.Id);
    const [notes] = await pool.execute<RowDataPacket[]>(
      `SELECT Id, Title, Path, Kind FROM Notes WHERE VaultId = ? AND ${ACTIVE_NOTE} ORDER BY Path ASC`,
      [vaultId]
    );
    out.push({
      vaultId,
      vaultSlug: String(v.slug || ''),
      vaultName: String(v.Name || ''),
      notes: notes.map((n) => ({
        id: Number(n.Id),
        title: String(n.Title),
        path: String(n.Path || ''),
        kind: String(n.Kind || 'note'),
      })),
    });
  }
  return out.filter((v) => v.vaultSlug);
}

/** Note ids whose effective visibility is public or unlisted (any vault). */
export async function listGuestPeekableNoteIds(): Promise<number[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT n.Id, n.Visibility, v.DefaultVisibility
     FROM Notes n
     INNER JOIN Vaults v ON v.Id = n.VaultId
     WHERE n.DeletedAt IS NULL`
  );
  return rows
    .filter((n) => {
      const vis = effectiveVisibility(n.Visibility, n.DefaultVisibility);
      return vis === 'public' || vis === 'unlisted';
    })
    .map((n) => Number(n.Id))
    .filter((id) => Number.isFinite(id) && id > 0);
}

/**
 * Note ids a wiki viewer may peek/open via wikilink (public, unlisted, authenticated when
 * signed in, or any note in a vault they can edit). Used like share `guestPeekNoteIds`.
 */
export async function listWikiPeekableNoteIds(opts: {
  isAuthed: boolean;
  pmUserId: number | null;
}): Promise<number[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT n.Id, n.Visibility, n.VaultId, v.DefaultVisibility
     FROM Notes n
     INNER JOIN Vaults v ON v.Id = n.VaultId
     WHERE n.DeletedAt IS NULL`
  );
  const editCache = new Map<number, boolean>();
  const ids: number[] = [];
  for (const n of rows) {
    const vaultId = Number(n.VaultId);
    let canEdit = editCache.get(vaultId);
    if (canEdit === undefined) {
      if (opts.pmUserId) {
        const access = await accessibleVault(vaultId, opts.pmUserId, 'edit');
        canEdit = Boolean(access);
      } else {
        canEdit = false;
      }
      editCache.set(vaultId, canEdit);
    }
    const vis = effectiveVisibility(n.Visibility, n.DefaultVisibility);
    if (canOpenNoteOnWiki(vis, opts.isAuthed, canEdit).ok) {
      const id = Number(n.Id);
      if (Number.isFinite(id) && id > 0) ids.push(id);
    }
  }
  return ids;
}

/** Editable vaults (vault app) with all active notes (including whiteboards). */
export async function listLinkableVaultNotesForApp(
  pmUserId: number
): Promise<LinkableVaultNotes[]> {
  const vaults = await listAccessibleVaults(pmUserId);
  if (!vaults.length) return [];

  const out: LinkableVaultNotes[] = [];
  for (const v of vaults) {
    const vaultId = Number(v.Id);
    const [notes] = await pool.execute<RowDataPacket[]>(
      `SELECT Id, Title, Path, Kind FROM Notes WHERE VaultId = ? AND ${ACTIVE_NOTE} ORDER BY Path ASC`,
      [vaultId]
    );
    out.push({
      vaultId,
      vaultSlug: String(v.slug || ''),
      vaultName: String(v.Name || ''),
      notes: notes.map((n) => ({
        id: Number(n.Id),
        title: String(n.Title),
        path: String(n.Path || ''),
        kind: String(n.Kind || 'note'),
      })),
    });
  }
  return out.filter((v) => v.vaultSlug);
}

/**
 * Wiki viewer: vaults the viewer may open on the wiki, with notes they may open.
 * Includes the current vault plus other share/public vaults when applicable.
 */
export async function listLinkableVaultNotesForWikiViewer(opts: {
  pmUserId: number | null;
  isAuthed: boolean;
}): Promise<LinkableVaultNotes[]> {
  const [vaultRows] = await pool.execute<RowDataPacket[]>(
    `SELECT Id, Name, slug, DefaultVisibility, AllowPublicPages, OwnerPmUserId
     FROM Vaults
     WHERE AllowPublicPages = 1
     ORDER BY Name ASC`
  );

  const out: LinkableVaultNotes[] = [];
  for (const v of vaultRows) {
    const vaultId = Number(v.Id);
    let shareRole: Awaited<ReturnType<typeof accessibleVault>> | null = null;
    if (opts.pmUserId) {
      shareRole = await accessibleVault(vaultId, opts.pmUserId, 'read');
    }
    const hasShare = Boolean(shareRole);
    const canEditVault = Boolean(
      shareRole && (shareRole.AccessRole === 'owner' || shareRole.AccessRole === 'edit')
    );
    const wikiGate = canOpenVaultWiki(v.DefaultVisibility, opts.isAuthed, hasShare);
    if (!wikiGate.ok) continue;

    const [notes] = await pool.execute<RowDataPacket[]>(
      `SELECT Id, Title, Path, Visibility, Kind FROM Notes WHERE VaultId = ? AND ${ACTIVE_NOTE}`,
      [vaultId]
    );
    const openNotes = notes
      .filter((n) => {
        const vis = effectiveVisibility(n.Visibility, v.DefaultVisibility);
        return canOpenNoteOnWiki(vis, opts.isAuthed, canEditVault).ok;
      })
      .map((n) => ({
        id: Number(n.Id),
        title: String(n.Title),
        path: String(n.Path || ''),
        kind: String(n.Kind || 'note'),
      }));

    out.push({
      vaultId,
      vaultSlug: String(v.slug || ''),
      vaultName: String(v.Name || ''),
      notes: openNotes,
    });
  }
  return out.filter((v) => v.vaultSlug);
}
