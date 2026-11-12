/**
 * Synapse MCP tool implementations.
 * Mirrors the Myelin `server/modules/mcp/toolHandlers.ts` pattern: thin,
 * JSON-serializable results, parameterized SQL, vault-scoped auth checks.
 */
import { pool, RowDataPacket } from '../config/database';
import logger from '../utils/logger';
import { accessibleVault, listAccessibleVaults, type VaultAccessRole } from '../services/vaultAccess';
import { sanitizeNotePath } from '../services/notePaths';
import { titleToPath } from '../services/checkboxes';
import { frontmatterJsonString, parseFrontmatter } from '../services/frontmatter';
import {
  rebuildNoteGraph,
  rewriteWikiLinksOnRename,
  snapshotRevision,
} from '../services/notesGraph';
import { listNoteTaskCandidates, type NoteTaskCandidate } from '../services/noteTasks';
import { loadNoteCheckboxLinks, type CheckboxLinkRow } from '../services/pmCheckboxSync';
import { ensureIndexNote, refreshIndexNote } from '../services/vaultIndexNote';
import {
  createAgentDoc,
  deleteAgentDoc,
  getAgentDoc,
  listAgentDocs,
  updateAgentDoc,
  type AgentDocKind,
} from '../services/vaultAgentDocs';

const ACTIVE_NOTE = 'DeletedAt IS NULL';

export type McpToolContext = {
  userId: number;
};

function textResult(data: unknown, isError = false) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
    isError,
  };
}

function fail(message: string, extra?: Record<string, unknown>) {
  return textResult({ success: false, message, ...extra }, true);
}

function ok(data: unknown) {
  return textResult({ success: true, data });
}

type NoteRow = RowDataPacket & {
  Id: number;
  VaultId: number;
  Title: string;
  Path: string;
  BodyMarkdown: string;
  Kind: string;
  Visibility: string | null;
  PmTaskId: number | null;
  PmProjectId: number | null;
};

async function requireVault(
  ctx: McpToolContext,
  vaultId: unknown,
  minimum: VaultAccessRole = 'edit'
) {
  const id = parseInt(String(vaultId ?? ''), 10);
  if (!Number.isFinite(id) || id <= 0) return { error: 'vaultId is required' as const };
  const vault = await accessibleVault(id, ctx.userId, minimum);
  if (!vault) return { error: 'Vault not found or access denied' as const };
  return { vault };
}

function shapeNote(row: NoteRow) {
  return {
    id: Number(row.Id),
    vaultId: Number(row.VaultId),
    title: String(row.Title),
    path: String(row.Path),
    bodyMarkdown: String(row.BodyMarkdown || ''),
    kind: String(row.Kind || 'note'),
    visibility: row.Visibility != null ? String(row.Visibility) : null,
    pmTaskId: row.PmTaskId != null ? Number(row.PmTaskId) : null,
    pmProjectId: row.PmProjectId != null ? Number(row.PmProjectId) : null,
  };
}

async function loadActiveNote(vaultId: number, noteId: number): Promise<NoteRow | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM Notes WHERE Id = ? AND VaultId = ? AND ${ACTIVE_NOTE}`,
    [noteId, vaultId]
  );
  return (rows[0] as NoteRow) || null;
}

export async function toolListVaults(ctx: McpToolContext) {
  const vaults = await listAccessibleVaults(ctx.userId);
  logger.info('MCP tool list_vaults', { userId: ctx.userId, count: vaults.length });
  return ok(
    vaults.map((v) => ({
      id: Number(v.Id),
      name: String(v.Name),
      slug: String(v.slug),
      accessRole: v.AccessRole,
      pmProjectId: v.PmProjectId != null ? Number(v.PmProjectId) : null,
    }))
  );
}

export async function toolListNotes(ctx: McpToolContext, args: Record<string, unknown>) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const includeTrash = args.includeTrash === true;
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT Id, Title, Path, Kind, Visibility, PmTaskId, UpdatedAt FROM Notes
     WHERE VaultId = ? ${includeTrash ? '' : `AND ${ACTIVE_NOTE}`}
     ORDER BY Path ASC`,
    [scope.vault!.Id]
  );
  return ok(
    rows.map((r) => ({
      id: Number(r.Id),
      title: String(r.Title),
      path: String(r.Path),
      kind: String(r.Kind || 'note'),
      visibility: r.Visibility != null ? String(r.Visibility) : null,
      pmTaskId: r.PmTaskId != null ? Number(r.PmTaskId) : null,
    }))
  );
}

export async function toolGetNote(ctx: McpToolContext, args: Record<string, unknown>) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const vaultId = Number(scope.vault!.Id);

  const noteId = args.noteId != null ? parseInt(String(args.noteId), 10) : null;
  const path = args.path != null ? String(args.path).trim() : null;
  if (!noteId && !path) return fail('noteId or path is required');

  const [rows] = await pool.execute<RowDataPacket[]>(
    noteId
      ? `SELECT * FROM Notes WHERE Id = ? AND VaultId = ? AND ${ACTIVE_NOTE}`
      : `SELECT * FROM Notes WHERE Path = ? AND VaultId = ? AND ${ACTIVE_NOTE}`,
    [noteId || path, vaultId]
  );
  if (!rows.length) return fail('Note not found');
  return ok(shapeNote(rows[0] as NoteRow));
}

export async function toolCreateNote(ctx: McpToolContext, args: Record<string, unknown>) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const vaultId = Number(scope.vault!.Id);

  const title = String(args.title ?? '').trim();
  if (!title) return fail('title is required');
  const kind = args.kind === 'whiteboard' ? 'whiteboard' : 'note';
  const rawPath = args.path != null ? String(args.path) : titleToPath(title);
  const path = sanitizeNotePath(rawPath);
  if (!path) return fail('Invalid note path');
  const bodyMarkdown = args.bodyMarkdown != null ? String(args.bodyMarkdown) : '';
  const fmJson = frontmatterJsonString(parseFrontmatter(bodyMarkdown).data);

  const [pathHits] = await pool.execute<RowDataPacket[]>(
    `SELECT Id FROM Notes WHERE VaultId = ? AND Path = ? AND ${ACTIVE_NOTE} LIMIT 1`,
    [vaultId, path]
  );
  if (pathHits.length) {
    return fail('A note already exists at this path', { noteId: Number(pathHits[0].Id) });
  }

  const [result] = await pool.execute<import('../config/database').ResultSetHeader>(
    `INSERT INTO Notes (VaultId, Path, Title, BodyMarkdown, Kind, FrontmatterJson)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [vaultId, path, title, bodyMarkdown, kind, fmJson]
  );
  const noteId = result.insertId;
  await snapshotRevision(noteId, ctx.userId, {
    title,
    path,
    bodyMarkdown,
    frontmatterJson: fmJson,
    visibility: null,
  });
  await rebuildNoteGraph(noteId, vaultId);

  logger.info('MCP tool create_note', { userId: ctx.userId, vaultId, noteId });
  return ok({ id: noteId, path, title, kind });
}

export async function toolUpdateNote(ctx: McpToolContext, args: Record<string, unknown>) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const vaultId = Number(scope.vault!.Id);

  const noteId = parseInt(String(args.noteId ?? ''), 10);
  if (!Number.isFinite(noteId)) return fail('noteId is required');
  const existing = await loadActiveNote(vaultId, noteId);
  if (!existing) return fail('Note not found');

  const title = args.title != null ? String(args.title).trim() || existing.Title : existing.Title;
  let path = args.path != null ? String(args.path) : existing.Path;
  if (args.path == null && args.title != null) path = titleToPath(title);
  const safePath = sanitizeNotePath(path);
  if (!safePath) return fail('Invalid note path');
  path = safePath;
  const bodyMarkdown = args.bodyMarkdown != null ? String(args.bodyMarkdown) : existing.BodyMarkdown;
  const fmJson = frontmatterJsonString(parseFrontmatter(bodyMarkdown).data);

  await pool.execute(
    `UPDATE Notes SET Title = ?, Path = ?, BodyMarkdown = ?, FrontmatterJson = ? WHERE Id = ?`,
    [title, path, bodyMarkdown, fmJson, noteId]
  );
  await snapshotRevision(noteId, ctx.userId, {
    title,
    path,
    bodyMarkdown,
    frontmatterJson: fmJson,
    visibility: existing.Visibility,
    source: 'auto',
  });
  if (title !== existing.Title || path !== existing.Path) {
    await rewriteWikiLinksOnRename(vaultId, existing.Title, title, existing.Path, path);
  }
  await rebuildNoteGraph(noteId, vaultId);

  logger.info('MCP tool update_note', { userId: ctx.userId, vaultId, noteId });
  return ok({ id: noteId, title, path });
}

export async function toolDeleteNote(ctx: McpToolContext, args: Record<string, unknown>) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const vaultId = Number(scope.vault!.Id);

  const noteId = parseInt(String(args.noteId ?? ''), 10);
  if (!Number.isFinite(noteId)) return fail('noteId is required');
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT Id, Path, DeletedAt FROM Notes WHERE Id = ? AND VaultId = ?',
    [noteId, vaultId]
  );
  if (!rows.length) return fail('Note not found');
  const hard = args.hard === true;

  if (hard || rows[0].DeletedAt) {
    await pool.execute('DELETE FROM Notes WHERE Id = ? AND VaultId = ?', [noteId, vaultId]);
    logger.info('MCP tool delete_note (hard)', { userId: ctx.userId, vaultId, noteId });
    return ok({ id: noteId, deleted: 'hard' });
  }
  const trashPath = `__trash__/${noteId}/${String(rows[0].Path)}`.slice(0, 1024);
  await pool.execute(
    `UPDATE Notes SET DeletedAt = CURRENT_TIMESTAMP, Path = ? WHERE Id = ? AND VaultId = ?`,
    [trashPath, noteId, vaultId]
  );
  await pool.execute('DELETE FROM NoteLinks WHERE FromNoteId = ? OR ToNoteId = ?', [noteId, noteId]);
  logger.info('MCP tool delete_note (soft)', { userId: ctx.userId, vaultId, noteId });
  return ok({ id: noteId, deleted: 'soft' });
}

/** Merge one parsed checkbox/todo candidate with its PM task link row, when any. */
export function mergeNoteTaskWithLink(
  candidate: NoteTaskCandidate,
  linksByMarker: Map<string, CheckboxLinkRow>
) {
  const link = candidate.markerId ? linksByMarker.get(candidate.markerId) : undefined;
  return {
    index: candidate.index,
    markerId: candidate.markerId,
    source: candidate.source,
    text: candidate.taskText || candidate.text,
    checked: candidate.checked,
    cancelled: Boolean(candidate.cancelled),
    category: candidate.category || null,
    linkedNote: candidate.linkedNote || null,
    pmTaskId: link?.PmTaskId ?? null,
    pmProjectId: link?.PmProjectId ?? null,
  };
}

export async function toolGetNoteTasks(ctx: McpToolContext, args: Record<string, unknown>) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const vaultId = Number(scope.vault!.Id);

  const noteId = parseInt(String(args.noteId ?? ''), 10);
  if (!Number.isFinite(noteId)) return fail('noteId is required');
  const note = await loadActiveNote(vaultId, noteId);
  if (!note) return fail('Note not found');

  const candidates = listNoteTaskCandidates(note.BodyMarkdown);
  const links = await loadNoteCheckboxLinks(noteId);
  const linksByMarker = new Map(links.map((l) => [l.MarkerId, l]));
  const tasks = candidates.map((c) => mergeNoteTaskWithLink(c, linksByMarker));

  logger.info('MCP tool get_note_tasks', { userId: ctx.userId, vaultId, noteId, count: tasks.length });
  return ok({
    noteId,
    notePmTaskId: note.PmTaskId != null ? Number(note.PmTaskId) : null,
    notePmProjectId: note.PmProjectId != null ? Number(note.PmProjectId) : null,
    tasks,
  });
}

type LinkedNoteSummary = {
  id: number;
  title: string;
  path: string;
  kind: string;
  linkKind: string;
  bodyMarkdown: string;
};

async function loadLinkedNotes(
  vaultId: number,
  noteId: number,
  direction: 'from' | 'to'
): Promise<LinkedNoteSummary[]> {
  const column = direction === 'from' ? 'FromNoteId' : 'ToNoteId';
  const otherColumn = direction === 'from' ? 'ToNoteId' : 'FromNoteId';
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT n.Id, n.Title, n.Path, n.Kind, n.BodyMarkdown, l.Kind AS LinkKind
     FROM NoteLinks l
     INNER JOIN Notes n ON n.Id = l.${otherColumn}
     WHERE l.${column} = ? AND n.VaultId = ? AND n.${ACTIVE_NOTE}
     ORDER BY n.Path ASC`,
    [noteId, vaultId]
  );
  return rows.map((r) => ({
    id: Number(r.Id),
    title: String(r.Title),
    path: String(r.Path),
    kind: String(r.Kind || 'note'),
    linkKind: String(r.LinkKind),
    bodyMarkdown: String(r.BodyMarkdown || ''),
  }));
}

async function buildNoteContext(vaultId: number, noteId: number) {
  const note = await loadActiveNote(vaultId, noteId);
  if (!note) return null;
  const [linkedNotes, backlinks] = await Promise.all([
    loadLinkedNotes(vaultId, noteId, 'from'),
    loadLinkedNotes(vaultId, noteId, 'to'),
  ]);
  return { note: shapeNote(note), linkedNotes, backlinks };
}

/** #1396 — note + context pulled from notes it links to (and notes that link to it). */
export async function toolGetNoteContext(ctx: McpToolContext, args: Record<string, unknown>) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const vaultId = Number(scope.vault!.Id);

  const noteId = parseInt(String(args.noteId ?? ''), 10);
  if (!Number.isFinite(noteId)) return fail('noteId is required');
  const context = await buildNoteContext(vaultId, noteId);
  if (!context) return fail('Note not found');

  logger.info('MCP tool get_note_context', {
    userId: ctx.userId,
    vaultId,
    noteId,
    linked: context.linkedNotes.length,
    backlinks: context.backlinks.length,
  });
  return ok(context);
}

/** #1397 — Myelin task context: the note(s)/checkbox tied to a PM task, plus linked notes. */
export async function toolGetTaskContext(ctx: McpToolContext, args: Record<string, unknown>) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const vaultId = Number(scope.vault!.Id);

  const pmTaskId = args.pmTaskId != null ? parseInt(String(args.pmTaskId), 10) : null;
  const noteId = args.noteId != null ? parseInt(String(args.noteId), 10) : null;
  const markerId = args.markerId != null ? String(args.markerId) : null;

  if (!pmTaskId && !noteId) return fail('pmTaskId or noteId is required');

  const matches: Array<{ noteId: number; markerId: string | null }> = [];

  if (noteId) {
    matches.push({ noteId, markerId });
  }
  if (pmTaskId) {
    const [noteHits] = await pool.execute<RowDataPacket[]>(
      `SELECT Id FROM Notes WHERE VaultId = ? AND PmTaskId = ? AND ${ACTIVE_NOTE}`,
      [vaultId, pmTaskId]
    );
    for (const row of noteHits) matches.push({ noteId: Number(row.Id), markerId: null });

    const [cbHits] = await pool.execute<RowDataPacket[]>(
      `SELECT nct.NoteId, nct.MarkerId
       FROM NoteCheckboxTasks nct
       INNER JOIN Notes n ON n.Id = nct.NoteId AND n.${ACTIVE_NOTE}
       WHERE n.VaultId = ? AND nct.PmTaskId = ?`,
      [vaultId, pmTaskId]
    );
    for (const row of cbHits) {
      matches.push({ noteId: Number(row.NoteId), markerId: String(row.MarkerId) });
    }
  }

  if (!matches.length) return fail('No note or checkbox is linked to this task');

  const results = [];
  for (const match of matches) {
    const context = await buildNoteContext(vaultId, match.noteId);
    if (!context) continue;
    results.push({
      ...context,
      markerId: match.markerId,
      checkboxTask: match.markerId
        ? listNoteTaskCandidates(context.note.bodyMarkdown).find((c) => c.markerId === match.markerId) || null
        : null,
    });
  }

  logger.info('MCP tool get_task_context', {
    userId: ctx.userId,
    vaultId,
    pmTaskId,
    noteId,
    matches: results.length,
  });
  return ok({ pmTaskId, results });
}

export async function toolListAgentDocs(
  ctx: McpToolContext,
  args: Record<string, unknown>,
  kind: AgentDocKind
) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const docs = await listAgentDocs(Number(scope.vault!.Id), kind);
  return ok(docs);
}

export async function toolGetAgentDoc(
  ctx: McpToolContext,
  args: Record<string, unknown>,
  kind: AgentDocKind
) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const idNum = args.id != null ? parseInt(String(args.id), 10) : NaN;
  const idOrSlug = Number.isFinite(idNum) ? idNum : args.slug != null ? String(args.slug) : null;
  if (idOrSlug == null) return fail('id or slug is required');
  const doc = await getAgentDoc(Number(scope.vault!.Id), kind, idOrSlug);
  if (!doc) return fail(`${kind === 'skill' ? 'Skill' : 'Rule'} not found`);
  return ok(doc);
}

export async function toolCreateAgentDoc(
  ctx: McpToolContext,
  args: Record<string, unknown>,
  kind: AgentDocKind
) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const name = String(args.name ?? '').trim();
  if (!name) return fail('name is required');
  const content = args.content != null ? String(args.content) : '';
  const doc = await createAgentDoc(Number(scope.vault!.Id), kind, { name, content });
  logger.info('MCP tool create_agent_doc', { userId: ctx.userId, kind, id: doc.id });
  return ok(doc);
}

export async function toolUpdateAgentDoc(
  ctx: McpToolContext,
  args: Record<string, unknown>,
  kind: AgentDocKind
) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const id = parseInt(String(args.id ?? ''), 10);
  if (!Number.isFinite(id)) return fail('id is required');
  const doc = await updateAgentDoc(Number(scope.vault!.Id), kind, id, {
    name: args.name != null ? String(args.name) : undefined,
    content: args.content != null ? String(args.content) : undefined,
  });
  if (!doc) return fail(`${kind === 'skill' ? 'Skill' : 'Rule'} not found`);
  return ok(doc);
}

export async function toolDeleteAgentDoc(
  ctx: McpToolContext,
  args: Record<string, unknown>,
  kind: AgentDocKind
) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const id = parseInt(String(args.id ?? ''), 10);
  if (!Number.isFinite(id)) return fail('id is required');
  const deleted = await deleteAgentDoc(Number(scope.vault!.Id), kind, id);
  if (!deleted) return fail(`${kind === 'skill' ? 'Skill' : 'Rule'} not found`);
  return ok({ id, deleted: true });
}

export async function toolCreateIndex(ctx: McpToolContext, args: Record<string, unknown>) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const result = await ensureIndexNote(Number(scope.vault!.Id), ctx.userId, args.force === true);
  logger.info('MCP tool create_index', { userId: ctx.userId, vaultId: scope.vault!.Id, ...result });
  return ok(result);
}

export async function toolRefreshIndex(ctx: McpToolContext, args: Record<string, unknown>) {
  const scope = await requireVault(ctx, args.vaultId, 'edit');
  if (scope.error) return fail(scope.error);
  const result = await refreshIndexNote(Number(scope.vault!.Id), ctx.userId);
  logger.info('MCP tool refresh_index', { userId: ctx.userId, vaultId: scope.vault!.Id, ...result });
  return ok(result);
}
