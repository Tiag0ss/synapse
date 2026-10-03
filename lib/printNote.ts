import {
  renderSynapseMarkdown,
  type LinkableVaultNotes,
  type NoteIndexEntry,
} from '@/lib/renderMarkdown';
import { noteLeafName } from '@/lib/notePaths';
import { renderMermaidInRoot } from '@/lib/mermaidRender';
import { fetchVaultBoardJson } from '@/lib/hydrateBoardEmbeds';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function collectPageStyles(): string {
  return Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((el) => el.outerHTML)
    .join('\n');
}

const PRINT_OVERRIDES = `
  html, body {
    margin: 0;
    padding: 0;
    background: #fff !important;
    color: #111 !important;
    font-family: Georgia, 'Times New Roman', serif;
  }
  body {
    background: #fff !important;
  }
  .synapse-print-root {
    max-width: 48rem;
    margin: 0 auto;
    padding: 1.25rem 1.5rem 2rem;
  }
  .synapse-print-title {
    margin: 0 0 1rem;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #111 !important;
  }
  .synapse-md-preview {
    color: #111 !important;
    background: transparent !important;
  }
  .synapse-md-preview a { color: #0f766e !important; }
  .synapse-md-preview code,
  .synapse-md-preview pre {
    background: #f3f4f6 !important;
    color: #111 !important;
    border-color: #d1d5db !important;
  }
  .synapse-md-preview table th,
  .synapse-md-preview table td {
    border-color: #d1d5db !important;
  }
  .synapse-md-preview .synapse-callout,
  .synapse-md-preview .synapse-fold,
  .synapse-md-preview .synapse-toc,
  .synapse-md-preview .synapse-fm {
    background: #f9fafb !important;
    border-color: #d1d5db !important;
    color: #111 !important;
  }
  /* Print always shows fold/callout bodies (details forced open in JS too). */
  .synapse-md-preview details.synapse-fold,
  .synapse-md-preview details.synapse-callout {
    display: block;
  }
  .synapse-md-preview details[open] > .synapse-fold-body,
  .synapse-md-preview details[open] > :not(summary) {
    display: block;
  }
  .synapse-note-peek,
  .synapse-mermaid-expand,
  .synapse-code-copy,
  .synapse-board-embed-actions,
  button {
    display: none !important;
  }
  .synapse-note-goto {
    all: unset;
    color: #0f766e !important;
    text-decoration: underline;
    cursor: default;
  }
  /* Override live embed placeholder layout (flex row / centered empty state). */
  .synapse-board-embed.synapse-board-embed-print {
    display: block !important;
    break-inside: avoid;
    margin: 1rem 0;
    min-height: 0 !important;
    height: auto !important;
    border: none !important;
    background: transparent !important;
    color: #111 !important;
  }
  .synapse-board-embed-print .synapse-board-embed-frame {
    display: flex;
    flex-direction: column;
    min-height: 0;
    height: auto;
    overflow: hidden;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #fff;
  }
  .synapse-board-embed-print .synapse-board-embed-chrome {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    padding: 0.4rem 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
    color: #111;
    font-family: system-ui, sans-serif;
    font-size: 0.8rem;
  }
  .synapse-board-embed-print .synapse-board-embed-title {
    font-weight: 600;
    color: #111 !important;
    text-decoration: none !important;
  }
  .synapse-board-embed-print .synapse-board-embed-svg {
    padding: 0.5rem;
    background: #fff;
  }
  .synapse-board-embed-print .synapse-board-embed-svg svg {
    display: block;
    width: 100%;
    height: auto;
    max-height: 70vh;
  }
  .synapse-board-embed-print.is-missing,
  .synapse-board-embed-print.is-error {
    display: block !important;
    padding: 0.75rem 1rem;
    min-height: 0 !important;
    height: auto !important;
    border: 1px solid #d1d5db !important;
    border-radius: 8px;
    color: #6b7280 !important;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    background: #f9fafb !important;
  }
  /* Light Mermaid for paper — globals.css targets dark UI fills/labels. */
  .synapse-md-preview .synapse-mermaid {
    background: #fff !important;
    border-color: #d1d5db !important;
    break-inside: avoid;
    color: #111 !important;
  }
  .synapse-md-preview .synapse-mermaid .edgeLabel,
  .synapse-md-preview .synapse-mermaid .edgeLabel foreignObject,
  .synapse-md-preview .synapse-mermaid .edgeLabel span,
  .synapse-md-preview .synapse-mermaid .nodeLabel,
  .synapse-md-preview .synapse-mermaid .label,
  .synapse-md-preview .synapse-mermaid .edgeLabel p,
  .synapse-md-preview .synapse-mermaid .nodeLabel p {
    color: #111 !important;
  }
  .synapse-md-preview .synapse-mermaid .edgeLabel rect,
  .synapse-md-preview .synapse-mermaid .labelBkg {
    fill: #f3f4f6 !important;
  }
  .synapse-md-preview .synapse-mermaid .flowchart-link,
  .synapse-md-preview .synapse-mermaid .edgePath path.path,
  .synapse-md-preview .synapse-mermaid .edgePaths path {
    stroke: #0f766e !important;
  }
  .synapse-md-preview .synapse-mermaid marker path {
    fill: #0f766e !important;
    stroke: #0f766e !important;
  }
  .synapse-md-preview .synapse-mermaid .node rect,
  .synapse-md-preview .synapse-mermaid .node polygon,
  .synapse-md-preview .synapse-mermaid .node circle,
  .synapse-md-preview .synapse-mermaid .node path {
    stroke: #0f766e !important;
    fill: #ecfdf5 !important;
  }
  @media print {
    .synapse-print-root { max-width: none; padding: 0; }
    a[href]::after { content: ''; }
  }
`;

/** Open every collapsible section so print includes full content. */
function expandAllDetails(root: HTMLElement): void {
  root.querySelectorAll('details').forEach((el) => {
    el.setAttribute('open', '');
  });
}

type BoardScene = {
  elements: unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
};

function parseBoardScene(raw: string | null): BoardScene | null {
  if (!raw?.trim()) {
    return { elements: [], appState: {}, files: {} };
  }
  try {
    const parsed = JSON.parse(raw) as {
      elements?: unknown[];
      appState?: Record<string, unknown>;
      files?: Record<string, unknown>;
    };
    const elements = Array.isArray(parsed.elements)
      ? parsed.elements.filter((el) => {
          if (!el || typeof el !== 'object') return false;
          return !(el as { isDeleted?: boolean }).isDeleted;
        })
      : [];
    return {
      elements,
      appState: parsed.appState && typeof parsed.appState === 'object' ? parsed.appState : {},
      files: parsed.files && typeof parsed.files === 'object' ? parsed.files : {},
    };
  } catch {
    return null;
  }
}

async function boardSceneToSvgOuterHtml(scene: BoardScene): Promise<string> {
  const { exportToSvg } = await import('@excalidraw/excalidraw');
  // skipInliningFonts avoids Excalidraw's font-subset worker path, which console.error's
  // "Failed to use workers for subsetting…" and trips the Next.js dev overlay.
  const svg = await exportToSvg({
    elements: scene.elements as Parameters<typeof exportToSvg>[0]['elements'],
    appState: {
      ...scene.appState,
      exportBackground: true,
      viewBackgroundColor: '#ffffff',
    },
    files: scene.files as Parameters<typeof exportToSvg>[0]['files'],
    exportPadding: 16,
    skipInliningFonts: true,
  });
  return svg.outerHTML;
}

/** Replace live Excalidraw embeds with static SVG snapshots for print. */
async function hydratePrintBoardEmbeds(
  root: HTMLElement,
  defaultVaultId: number | null
): Promise<void> {
  const embeds = Array.from(root.querySelectorAll<HTMLElement>('.synapse-board-embed'));
  if (!embeds.length) return;

  await Promise.all(
    embeds.map(async (el) => {
      const noteId = Number(el.dataset.noteId || 0);
      const vaultIdRaw = Number(el.dataset.vaultId || 0);
      const vaultId = vaultIdRaw > 0 ? vaultIdRaw : defaultVaultId;
      const title = String(el.dataset.displayTitle || el.dataset.noteTitle || 'Whiteboard');
      const missing =
        el.classList.contains('is-missing') || el.dataset.missing === '1' || !noteId || !vaultId;

      const doc = el.ownerDocument;
      const frame = doc.createElement('div');
      frame.className = 'synapse-board-embed synapse-board-embed-print';

      if (missing) {
        frame.classList.add('is-missing');
        frame.textContent = `Whiteboard not found: ${title}`;
        el.replaceWith(frame);
        return;
      }

      try {
        const boardJson = await fetchVaultBoardJson(vaultId, noteId);
        const scene = parseBoardScene(boardJson);
        if (!scene) {
          frame.classList.add('is-error');
          frame.textContent = `Could not load whiteboard: ${title}`;
          el.replaceWith(frame);
          return;
        }
        const svgHtml = await boardSceneToSvgOuterHtml(scene);
        // Match live embed structure (`.synapse-board-embed-frame`) so title stays above the board.
        frame.innerHTML =
          `<div class="synapse-board-embed-frame">` +
          `<div class="synapse-board-embed-chrome">` +
          `<span class="synapse-board-embed-title">${escapeHtml(title)}</span>` +
          `</div>` +
          `<div class="synapse-board-embed-svg">${svgHtml}</div>` +
          `</div>`;
        el.replaceWith(frame);
      } catch {
        frame.classList.add('is-error');
        frame.textContent = `Could not load whiteboard: ${title}`;
        el.replaceWith(frame);
      }
    })
  );
}

function waitForPrintReady(win: Window, ms: number): Promise<void> {
  return new Promise((resolve) => {
    const done = () => resolve();
    if (win.document.readyState === 'complete') {
      window.setTimeout(done, ms);
    } else {
      win.addEventListener('load', () => window.setTimeout(done, ms), { once: true });
      window.setTimeout(done, Math.max(ms, 800));
    }
  });
}

/**
 * Open the print window synchronously (must run in the click handler before any await).
 * Do not pass `noopener` — it makes `window.open` return null in modern browsers.
 */
export function openPrintWindow(): Window {
  const win = window.open('', '_blank');
  if (!win) {
    throw new Error('Could not open print window. Check that pop-ups are allowed for this site.');
  }
  win.document.open();
  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <base href="${escapeHtml(window.location.origin)}/" />
  <title>Preparing print…</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; color: #334155; background: #fff; }
  </style>
</head>
<body><p>Preparing note for print / PDF…</p></body>
</html>`);
  win.document.close();
  return win;
}

/**
 * Fill an already-open print window and invoke the browser print dialog
 * (Print or Save as PDF).
 */
export async function printNoteDocument(params: {
  title: string;
  bodyMarkdown: string;
  notes?: NoteIndexEntry[];
  linkableVaults?: LinkableVaultNotes[];
  noteId?: number | null;
  vaultId?: string | number | null;
  /** Window opened via {@link openPrintWindow} in the same user gesture. */
  printWindow: Window;
}): Promise<void> {
  const win = params.printWindow;
  if (win.closed) {
    throw new Error('Print window was closed before export finished');
  }

  const leaf = noteLeafName(params.title || 'Note');
  const bodyHtml = renderSynapseMarkdown(
    params.bodyMarkdown || '',
    params.notes || [],
    params.linkableVaults || [],
    params.noteId ?? null,
    { wikilinks: true }
  );

  const baseHref = `${window.location.origin}/`;
  const doc = win.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <base href="${escapeHtml(baseHref)}" />
  <title>${escapeHtml(leaf)}</title>
  ${collectPageStyles()}
  <style>${PRINT_OVERRIDES}</style>
</head>
<body>
  <article class="synapse-print-root">
    <h1 class="synapse-print-title">${escapeHtml(leaf)}</h1>
    <div class="synapse-md-preview prose-synapse" id="synapse-print-body">${bodyHtml}</div>
  </article>
</body>
</html>`);
  doc.close();

  const bodyEl = doc.getElementById('synapse-print-body');
  if (!bodyEl) {
    throw new Error('Print document body missing');
  }

  // Expand folds/callouts before measuring Mermaid / boards.
  expandAllDetails(bodyEl);

  // Give stylesheets a moment (about:blank → absolute /_next assets via <base>).
  await waitForPrintReady(win, 200);
  if (win.closed) return;

  try {
    await renderMermaidInRoot(bodyEl);
  } catch {
    // Continue — text still prints if a diagram fails.
  }

  const vaultNum = Number(params.vaultId);
  const defaultVaultId = Number.isFinite(vaultNum) && vaultNum > 0 ? vaultNum : null;
  try {
    await hydratePrintBoardEmbeds(bodyEl, defaultVaultId);
  } catch {
    // Continue without boards if export fails.
  }

  // Re-expand in case any hydration replaced nodes inside details.
  expandAllDetails(bodyEl);

  await waitForPrintReady(win, 160);
  if (win.closed) return;
  win.focus();
  win.print();
}
