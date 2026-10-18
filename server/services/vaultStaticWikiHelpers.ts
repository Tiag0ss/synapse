import { resolveNoteId, type NoteResolveEntry } from './notePaths';

export function relativeFrom(fromHtmlPath: string, toHtmlPath: string): string {
  const fromDir = fromHtmlPath.split('/').filter(Boolean).slice(0, -1);
  const toParts = toHtmlPath.split('/').filter(Boolean);
  let i = 0;
  const maxCommon = Math.min(fromDir.length, Math.max(0, toParts.length - 1));
  while (i < maxCommon && fromDir[i] === toParts[i]) i += 1;
  const ups = fromDir.length - i;
  const down = toParts.slice(i);
  const parts = [...Array.from({ length: ups }, () => '..'), ...down];
  return parts.join('/') || '.';
}

/**
 * Turn `[[wikilinks]]` into markdown links so static HTML gets real `<a href>`.
 * Leaves `![[board]]` embeds alone (negative lookbehind for !).
 */
export function rewriteStaticWikilinks(
  md: string,
  notes: NoteResolveEntry[],
  htmlPathById: Map<number, string>,
  pagePath: string
): string {
  return md.replace(
    /(?<!!)\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g,
    (_m, target: string, alias?: string) => {
      const t = String(target).trim();
      if (!t || t.startsWith('@')) {
        const label = String(alias || t).trim() || t;
        return label;
      }
      const label = (alias != null ? String(alias).trim() : '') || t;
      const id = resolveNoteId(t, notes);
      if (id == null) return label;
      const targetPath = htmlPathById.get(id);
      if (!targetPath) return label;
      const href = relativeFrom(pagePath, targetPath);
      const safeLabel = label.replace(/[\[\]]/g, '');
      return `[${safeLabel}](${href})`;
    }
  );
}
