import type { Edge, Node } from '@xyflow/react';
import type { FlowNodeData } from '@/lib/flowDocument';
import { flowToMermaid } from '@/lib/flowMermaid';
import { serializeFlowDocument } from '@/lib/flowDocument';

export type FlowExportFormat = 'json' | 'mermaid' | 'svg';

function downloadBlob(filename: string, mime: string, contents: string) {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Simple SVG snapshot of nodes/edges (not pixel-perfect; good for sharing structure). */
export function flowToSvg(nodes: Node<FlowNodeData>[], edges: Edge[]): string {
  const pad = 40;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const w = 180;
  const h = 72;
  for (const n of nodes) {
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + w);
    maxY = Math.max(maxY, n.position.y + h);
  }
  if (!Number.isFinite(minX)) {
    minX = 0;
    minY = 0;
    maxX = 400;
    maxY = 300;
  }
  const width = Math.max(320, maxX - minX + pad * 2);
  const height = Math.max(240, maxY - minY + pad * 2);
  const ox = (n: Node) => n.position.x - minX + pad;
  const oy = (n: Node) => n.position.y - minY + pad;

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const edgeLines = edges
    .map((e) => {
      const s = byId.get(e.source);
      const t = byId.get(e.target);
      if (!s || !t) return '';
      const x1 = ox(s) + w / 2;
      const y1 = oy(s) + h;
      const x2 = ox(t) + w / 2;
      const y2 = oy(t);
      const label = e.label != null ? String(e.label) : e.sourceHandle || '';
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#5b8def" stroke-width="2" marker-end="url(#arrow)" />${
        label
          ? `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 4}" fill="#9db0c7" font-size="11" text-anchor="middle">${escapeXml(label)}</text>`
          : ''
      }`;
    })
    .join('\n');

  const nodeRects = nodes
    .map((n) => {
      const x = ox(n);
      const y = oy(n);
      const label = escapeXml(n.data.label || n.id);
      const kind = escapeXml(n.data.kind);
      const rx = n.data.kind === 'start' || n.data.kind === 'end' ? 36 : 8;
      return `<g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#121a22" stroke="#2a3a4a" stroke-width="1.5"/>
  <text x="${x + w / 2}" y="${y + 28}" fill="#e8eef6" font-size="13" text-anchor="middle">${label}</text>
  <text x="${x + w / 2}" y="${y + 48}" fill="#7f93a8" font-size="10" text-anchor="middle">${kind}</text>
</g>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#5b8def"/>
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="#0a0e13"/>
  ${edgeLines}
  ${nodeRects}
</svg>
`;
}

function escapeXml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function exportFlow(
  format: FlowExportFormat,
  nodes: Node<FlowNodeData>[],
  edges: Edge[],
  basename: string
): void {
  const base = (basename || 'flow').replace(/\.md$/i, '').replace(/[^\w.-]+/g, '_') || 'flow';
  if (format === 'json') {
    downloadBlob(`${base}.flow.json`, 'application/json', serializeFlowDocument(nodes, edges));
    return;
  }
  if (format === 'mermaid') {
    downloadBlob(`${base}.mmd`, 'text/plain;charset=utf-8', flowToMermaid(nodes, edges));
    return;
  }
  downloadBlob(`${base}.svg`, 'image/svg+xml;charset=utf-8', flowToSvg(nodes, edges));
}
