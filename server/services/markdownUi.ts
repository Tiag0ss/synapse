/**
 * Optional UI copy for markdown HTML (board embeds, locked wikilinks).
 * Keep in sync with lib/markdownUi.ts (defaults + shape).
 */

export type SynapseMarkdownUi = {
  loadingBoard?: string;
  whiteboardNotFound?: string;
  missingWhiteboard?: string;
  whiteboardLabel?: string;
  noAccess?: string;
  noAccessTitle?: string;
  couldNotLoadWhiteboard?: string;
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
