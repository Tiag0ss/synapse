/**
 * Server-side path helpers (keep in sync with lib/notePaths.ts).
 */

export function pathStem(path: string): string {
  return String(path || '')
    .replace(/\\/g, '/')
    .replace(/\.md$/i, '')
    .replace(/^\/+|\/+$/g, '');
}

export function noteLeafName(title: string, path?: string): string {
  const fromTitle = String(title || '')
    .replace(/\\/g, '/')
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean)
    .pop();
  if (fromTitle) return fromTitle;
  const fromPath = pathStem(path || '')
    .split('/')
    .filter(Boolean)
    .pop();
  return fromPath || 'note';
}

export type NoteResolveEntry = {
  id: number;
  title: string;
  path: string;
  /** `note` | `whiteboard` — used for `![[…]]` board embeds. */
  kind?: string;
};

/** Notes from one vault available for `[[@slug/…]]` resolution. */
export type LinkableVaultNotes = {
  vaultId: number;
  vaultSlug: string;
  vaultName: string;
  notes: NoteResolveEntry[];
};

export type CrossVaultResolveResult =
  | {
      status: 'ok';
      noteId: number;
      vaultId: number;
      vaultSlug: string;
      label: string;
    }
  | {
      status: 'missing';
      vaultId: number;
      vaultSlug: string;
      noteTarget: string;
      label: string;
    }
  | { status: 'locked'; label: string };

/**
 * Parse `[[@vault-slug/note-path]]` targets.
 * Returns null when the target is a same-vault wikilink.
 */
export function parseCrossVaultWikilinkTarget(
  target: string
): { vaultSlug: string; noteTarget: string } | null {
  const t = String(target || '')
    .trim()
    .replace(/\\/g, '/');
  const m = t.match(/^@([a-zA-Z0-9][a-zA-Z0-9_-]*)\/(.+)$/);
  if (!m) return null;
  const noteTarget = m[2].trim().replace(/\.md$/i, '');
  if (!noteTarget) return null;
  return { vaultSlug: m[1], noteTarget };
}

export function resolveNoteId(target: string, notes: NoteResolveEntry[]): number | null {
  const needle = target
    .trim()
    .replace(/\\/g, '/')
    .replace(/\.md$/i, '')
    .toLowerCase();
  if (!needle) return null;

  const byTitle = notes.find((n) => n.title.replace(/\\/g, '/').toLowerCase() === needle);
  if (byTitle) return byTitle.id;

  const byPath = notes.find((n) => pathStem(n.path).toLowerCase() === needle);
  if (byPath) return byPath.id;

  const leafHits = notes.filter((n) => {
    const pathLeaf = pathStem(n.path).split('/').pop()?.toLowerCase();
    const titleLeaf = n.title
      .replace(/\\/g, '/')
      .split('/')
      .pop()
      ?.trim()
      .toLowerCase();
    return pathLeaf === needle || titleLeaf === needle;
  });
  if (leafHits.length === 1) return leafHits[0].id;

  return null;
}

/**
 * Resolve `[[@vault-slug/path]]` for a viewer-scoped linkable index.
 * Unknown / inaccessible vault slugs → locked (label kept; UI shows no-access hint).
 */
export function resolveCrossVaultWikilink(
  target: string,
  linkable: LinkableVaultNotes[],
  alias?: string
): CrossVaultResolveResult {
  const parsed = parseCrossVaultWikilinkTarget(target);
  const fallbackLabel =
    String(alias || '').trim() ||
    (parsed ? parsed.noteTarget : String(target || '').trim()) ||
    String(target || '').trim();

  if (!parsed) return { status: 'locked', label: fallbackLabel };

  const vault = linkable.find(
    (v) => v.vaultSlug.toLowerCase() === parsed.vaultSlug.toLowerCase()
  );
  if (!vault) {
    return {
      status: 'locked',
      label: String(alias || '').trim() || parsed.noteTarget,
    };
  }

  const noteId = resolveNoteId(parsed.noteTarget, vault.notes);
  const label = String(alias ?? parsed.noteTarget).trim() || parsed.noteTarget;
  if (noteId == null) {
    return {
      status: 'missing',
      vaultId: vault.vaultId,
      vaultSlug: vault.vaultSlug,
      noteTarget: parsed.noteTarget,
      label,
    };
  }
  return {
    status: 'ok',
    noteId,
    vaultId: vault.vaultId,
    vaultSlug: vault.vaultSlug,
    label,
  };
}

/**
 * Normalize and validate a note Path for storage / ZIP export.
 * Rejects absolute paths, empty segments, and `..` traversal.
 */
export function sanitizeNotePath(raw: string): string | null {
  let p = String(raw || '')
    .replace(/\\/g, '/')
    .replace(/^\.\/+/, '')
    .trim();
  if (!p) return null;
  if (p.startsWith('/') || /^[a-zA-Z]:/.test(p)) return null;

  const parts = p.split('/').filter((seg) => seg.length > 0);
  if (!parts.length) return null;
  for (const seg of parts) {
    if (seg === '.' || seg === '..') return null;
    if (/[<>:"|?*\x00-\x1f]/.test(seg)) return null;
  }

  let out = parts.join('/');
  if (!out.toLowerCase().endsWith('.md') && !out.toLowerCase().endsWith('.markdown')) {
    out = `${out}.md`;
  }
  if (out.length > 1024) return null;
  return out;
}

export type NoteTreeNote = {
  type: 'note';
  id: number;
  title: string;
  path: string;
  name: string;
  kind?: string | null;
};

export type NoteTreeFolder = {
  type: 'folder';
  name: string;
  path: string;
  children: Array<NoteTreeFolder | NoteTreeNote>;
};

export type NoteTreeNode = NoteTreeFolder | NoteTreeNote;

/** Build a nested folder tree from notes. Keep in sync with lib/notePaths.ts. */
export function buildNoteTree(
  notes: Array<{ Id: number; Title: string; Path: string; Kind?: string | null }>
): NoteTreeNode[] {
  const sorted = [...notes].sort((a, b) =>
    pathStem(a.Path).localeCompare(pathStem(b.Path), undefined, { sensitivity: 'base' })
  );

  type MutableFolder = {
    type: 'folder';
    name: string;
    path: string;
    children: Array<MutableFolder | NoteTreeNote>;
  };

  const root: MutableFolder = { type: 'folder', name: '', path: '', children: [] };

  const ensureFolder = (parts: string[]): MutableFolder => {
    let node = root;
    let acc = '';
    for (const part of parts) {
      acc = acc ? `${acc}/${part}` : part;
      let child = node.children.find(
        (c): c is MutableFolder => c.type === 'folder' && c.path === acc
      );
      if (!child) {
        child = { type: 'folder', name: part, path: acc, children: [] };
        node.children.push(child);
      }
      node = child;
    }
    return node;
  };

  for (const n of sorted) {
    const parts = pathStem(n.Path).split('/').filter(Boolean);
    if (!parts.length) continue;
    const leaf = parts[parts.length - 1];
    const folderParts = parts.slice(0, -1);
    const parent = folderParts.length ? ensureFolder(folderParts) : root;
    parent.children.push({
      type: 'note',
      id: n.Id,
      title: n.Title,
      path: n.Path,
      name: noteLeafName(n.Title, n.Path) || leaf,
      kind: n.Kind ?? 'note',
    });
  }

  const sortTreeNodes = (nodes: Array<MutableFolder | NoteTreeNote>) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    });
    for (const node of nodes) {
      if (node.type === 'folder') sortTreeNodes(node.children);
    }
  };
  sortTreeNodes(root.children);

  return root.children;
}

/** Safe entry name inside a ZIP (no traversal). */
export function safeZipEntryName(name: string): string {
  const cleaned = String(name || '')
    .replace(/[<>:"|?*\\]/g, '_')
    .replace(/\\/g, '/');
  const parts = cleaned
    .split('/')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s !== '.' && s !== '..');
  return parts.join('/') || 'note.md';
}
