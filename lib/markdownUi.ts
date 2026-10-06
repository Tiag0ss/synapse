/** Optional UI copy for markdown HTML (board embeds, locked wikilinks). */

export type SynapseMarkdownUi = {
  loadingBoard?: string;
  whiteboardNotFound?: string;
  /** Prefix before “: {name}” for missing board aria labels. */
  missingWhiteboard?: string;
  /** Prefix before “: {name}” for loading board aria labels. */
  whiteboardLabel?: string;
  /** Short badge on locked wikilinks. */
  noAccess?: string;
  /** Tooltip / title on locked wikilinks. */
  noAccessTitle?: string;
  /** Print fallback when a board SVG cannot be rendered (`{title}`). */
  couldNotLoadWhiteboard?: string;
  /** Rare catch fallback when markdown render throws. */
  previewError?: string;
};

export const DEFAULT_SYNAPSE_MARKDOWN_UI: Required<SynapseMarkdownUi> = {
  loadingBoard: 'Loading board…',
  whiteboardNotFound: 'Whiteboard not found',
  missingWhiteboard: 'Missing whiteboard',
  whiteboardLabel: 'Whiteboard',
  noAccess: 'no access',
  noAccessTitle: "You don't have access to this note",
  couldNotLoadWhiteboard: 'Could not load whiteboard: {title}',
  previewError: 'Preview error',
};

export function resolveMarkdownUi(ui?: SynapseMarkdownUi | null): Required<SynapseMarkdownUi> {
  return { ...DEFAULT_SYNAPSE_MARKDOWN_UI, ...ui };
}

export function synapseMarkdownUiFromT(
  t: (path: string, vars?: Record<string, string | number>) => string
): SynapseMarkdownUi {
  return {
    loadingBoard: t('chrome.loadingBoard'),
    whiteboardNotFound: t('chrome.whiteboardNotFound'),
    missingWhiteboard: t('chrome.missingWhiteboard'),
    whiteboardLabel: t('chrome.whiteboardPrefix'),
    noAccess: t('chrome.noAccess'),
    noAccessTitle: t('chrome.noAccessThisNote'),
    // Leave `{title}` for the print path to interpolate.
    couldNotLoadWhiteboard: t('chrome.couldNotLoadWhiteboard'),
    previewError: t('chrome.previewError'),
  };
}

export function formatMarkdownUi(
  template: string,
  vars: Record<string, string | number>
): string {
  let s = template;
  for (const [k, v] of Object.entries(vars)) {
    s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return s;
}
