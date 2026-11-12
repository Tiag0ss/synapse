/**
 * Root `index.md` aggregation note (Myelin #1399).
 * Lists every active vault note as a `[[wikilink]]`, grouped by folder.
 */
import { pool, RowDataPacket } from '../config/database';
import { buildNoteTree, type NoteTreeNode, pathStem } from './notePaths';
import { rebuildNoteGraph, snapshotRevision } from './notesGraph';
import { frontmatterJsonString, parseFrontmatter } from './frontmatter';
import logger from '../utils/logger';

export const INDEX_NOTE_PATH = 'index.md';
export const INDEX_NOTE_TITLE = 'index';

export type IndexableNote = {
  Id: number;
  Title: string;
  Path: string;
  Kind?: string | null;
};

function renderNode(node: NoteTreeNode, depth: number): string[] {
  const indent = '  '.repeat(Math.max(0, depth - 1));
  if (node.type === 'folder') {
    const lines = [`${indent}- **${node.name}/**`];
    for (const child of node.children) lines.push(...renderNode(child, depth + 1));
    return lines;
  }
  const target = pathStem(node.path);
  const label = node.name;
  // Plain wikilink only — emoji prefixes render as broken image glyphs over the link.
  // Whiteboard vs note is already clear from the note itself when opened.
  return [`${indent}- [[${target}|${label}]]`];
}

/**
 * Build the `index.md` body. Pure function — no DB access — for easy unit testing.
 * Callers must already exclude trashed notes and the index note itself.
 */
export function buildIndexMarkdown(vaultName: string, notes: IndexableNote[]): string {
  const tree = buildNoteTree(
    notes.map((n) => ({ Id: n.Id, Title: n.Title, Path: n.Path, Kind: n.Kind }))
  );
  const lines: string[] = [`# ${vaultName}`, ''];
  if (!notes.length) {
    lines.push('_No notes yet._');
  } else {
    for (const node of tree) lines.push(...renderNode(node, 1));
  }
  lines.push('', `<!-- synapse:index-note auto-generated=true notes=${notes.length} -->`);
  return lines.join('\n');
}

async function loadIndexableNotes(vaultId: number): Promise<IndexableNote[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT Id, Title, Path, Kind FROM Notes
     WHERE VaultId = ? AND DeletedAt IS NULL AND Path <> ?
     ORDER BY Path ASC`,
    [vaultId, INDEX_NOTE_PATH]
  );
  return rows.map((r) => ({
    Id: Number(r.Id),
    Title: String(r.Title),
    Path: String(r.Path),
    Kind: r.Kind != null ? String(r.Kind) : 'note',
  }));
}

/** Rebuild `index.md` body from current vault notes. Creates the note if missing. */
export async function refreshIndexNote(
  vaultId: number,
  pmUserId: number
): Promise<{ noteId: number; created: boolean }> {
  const [vaultRows] = await pool.execute<RowDataPacket[]>('SELECT Name FROM Vaults WHERE Id = ?', [
    vaultId,
  ]);
  const vaultName = vaultRows[0]?.Name != null ? String(vaultRows[0].Name) : 'Vault';

  const notes = await loadIndexableNotes(vaultId);
  const body = buildIndexMarkdown(vaultName, notes);
  const fmJson = frontmatterJsonString(parseFrontmatter(body).data);

  const [existingRows] = await pool.execute<RowDataPacket[]>(
    `SELECT Id FROM Notes WHERE VaultId = ? AND Path = ? LIMIT 1`,
    [vaultId, INDEX_NOTE_PATH]
  );

  let noteId: number;
  let created = false;
  if (existingRows.length) {
    noteId = Number(existingRows[0].Id);
    await pool.execute(
      `UPDATE Notes SET Title = ?, BodyMarkdown = ?, FrontmatterJson = ?, DeletedAt = NULL WHERE Id = ?`,
      [INDEX_NOTE_TITLE, body, fmJson, noteId]
    );
  } else {
    const [result] = await pool.execute<import('../config/database').ResultSetHeader>(
      `INSERT INTO Notes (VaultId, Path, Title, BodyMarkdown, Kind, FrontmatterJson)
       VALUES (?, ?, ?, ?, 'note', ?)`,
      [vaultId, INDEX_NOTE_PATH, INDEX_NOTE_TITLE, body, fmJson]
    );
    noteId = result.insertId;
    created = true;
  }

  await snapshotRevision(noteId, pmUserId, {
    title: INDEX_NOTE_TITLE,
    path: INDEX_NOTE_PATH,
    bodyMarkdown: body,
    frontmatterJson: fmJson,
    visibility: null,
    source: 'auto',
  });
  await rebuildNoteGraph(noteId, vaultId);

  logger.info('Refreshed vault index note', { vaultId, noteId, created, notes: notes.length });
  return { noteId, created };
}

/** Ensure `index.md` exists; refresh it unless it already exists and `force` is false. */
export async function ensureIndexNote(
  vaultId: number,
  pmUserId: number,
  force = false
): Promise<{ noteId: number; created: boolean }> {
  if (!force) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT Id FROM Notes WHERE VaultId = ? AND Path = ? LIMIT 1`,
      [vaultId, INDEX_NOTE_PATH]
    );
    if (rows.length) return { noteId: Number(rows[0].Id), created: false };
  }
  return refreshIndexNote(vaultId, pmUserId);
}

/** Best-effort refresh hook for note create/rename/delete — never throws. */
export async function refreshIndexNoteQuiet(vaultId: number, pmUserId: number): Promise<void> {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT Id FROM Notes WHERE VaultId = ? AND Path = ? LIMIT 1`,
      [vaultId, INDEX_NOTE_PATH]
    );
    if (!rows.length) return; // Only auto-refresh once the vault opted in by creating it.
    await refreshIndexNote(vaultId, pmUserId);
  } catch (error) {
    logger.warn('Index note refresh skipped', { vaultId, error });
  }
}
