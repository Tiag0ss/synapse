import logger from '../utils/logger';
import { svgToPngBuffer } from './svgRaster';

type BoardScene = {
  elements: BoardElement[];
  appState: Record<string, unknown>;
  files: Record<string, { dataURL?: string; mimeType?: string } | unknown>;
};

type BoardElement = {
  id?: string;
  type?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  angle?: number;
  strokeColor?: string;
  backgroundColor?: string;
  fillStyle?: string;
  strokeWidth?: number;
  strokeStyle?: string;
  opacity?: number;
  isDeleted?: boolean;
  roundness?: { type?: number } | null;
  points?: [number, number][];
  text?: string;
  fontSize?: number;
  fontFamily?: number;
  textAlign?: string;
  verticalAlign?: string;
  fileId?: string;
  scale?: [number, number];
};

function parseBoardScene(raw: string | null | undefined): BoardScene | null {
  if (raw == null || !String(raw).trim()) {
    return { elements: [], appState: {}, files: {} };
  }
  try {
    const parsed = JSON.parse(String(raw)) as {
      elements?: unknown[];
      appState?: Record<string, unknown>;
      files?: Record<string, unknown>;
    };
    const elements = Array.isArray(parsed.elements)
      ? (parsed.elements.filter((el) => {
          if (!el || typeof el !== 'object') return false;
          return !(el as { isDeleted?: boolean }).isDeleted;
        }) as BoardElement[])
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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function strokeDash(strokeStyle: string | undefined, strokeWidth: number): string {
  if (strokeStyle === 'dashed') return `${Math.max(4, strokeWidth * 4)} ${Math.max(2, strokeWidth * 2)}`;
  if (strokeStyle === 'dotted') return `${Math.max(1, strokeWidth)} ${Math.max(2, strokeWidth * 2)}`;
  return '';
}

function opacityAttr(opacity: number | undefined): string {
  if (opacity == null || opacity >= 100) return '';
  const v = Math.max(0, Math.min(1, opacity / 100));
  return ` opacity="${v}"`;
}

function fillFor(el: BoardElement): string {
  const bg = el.backgroundColor || 'transparent';
  if (!bg || bg === 'transparent') return 'none';
  return escapeXml(bg);
}

function strokeFor(el: BoardElement): string {
  return escapeXml(el.strokeColor || '#1e1e1e');
}

function transformFor(el: BoardElement, cx: number, cy: number): string {
  const angle = el.angle || 0;
  if (!angle) return '';
  const deg = (angle * 180) / Math.PI;
  return ` transform="rotate(${deg} ${cx} ${cy})"`;
}

function elementBounds(el: BoardElement): { minX: number; minY: number; maxX: number; maxY: number } {
  const x = el.x ?? 0;
  const y = el.y ?? 0;
  if ((el.type === 'line' || el.type === 'arrow' || el.type === 'freedraw') && Array.isArray(el.points) && el.points.length) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const [px, py] of el.points) {
      minX = Math.min(minX, x + px);
      minY = Math.min(minY, y + py);
      maxX = Math.max(maxX, x + px);
      maxY = Math.max(maxY, y + py);
    }
    const pad = (el.strokeWidth ?? 2) + 2;
    return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad };
  }
  const w = el.width ?? 0;
  const h = el.height ?? 0;
  return { minX: x, minY: y, maxX: x + w, maxY: y + h };
}

function sceneBounds(elements: BoardElement[], padding: number) {
  if (!elements.length) {
    return { minX: 0, minY: 0, width: 400, height: 300 };
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const el of elements) {
    const b = elementBounds(el);
    minX = Math.min(minX, b.minX);
    minY = Math.min(minY, b.minY);
    maxX = Math.max(maxX, b.maxX);
    maxY = Math.max(maxY, b.maxY);
  }
  return {
    minX: minX - padding,
    minY: minY - padding,
    width: Math.max(1, maxX - minX + padding * 2),
    height: Math.max(1, maxY - minY + padding * 2),
  };
}

function pointsToPath(originX: number, originY: number, points: [number, number][]): string {
  if (!points.length) return '';
  const [x0, y0] = points[0];
  let d = `M ${originX + x0} ${originY + y0}`;
  for (let i = 1; i < points.length; i += 1) {
    const [px, py] = points[i];
    d += ` L ${originX + px} ${originY + py}`;
  }
  return d;
}

function arrowHead(
  originX: number,
  originY: number,
  points: [number, number][],
  stroke: string,
  strokeWidth: number
): string {
  if (points.length < 2) return '';
  const [x1, y1] = points[points.length - 2];
  const [x2, y2] = points[points.length - 1];
  const ax = originX + x1;
  const ay = originY + y1;
  const bx = originX + x2;
  const by = originY + y2;
  const angle = Math.atan2(by - ay, bx - ax);
  const size = Math.max(8, strokeWidth * 4);
  const left = `${bx - size * Math.cos(angle - Math.PI / 6)} ${by - size * Math.sin(angle - Math.PI / 6)}`;
  const right = `${bx - size * Math.cos(angle + Math.PI / 6)} ${by - size * Math.sin(angle + Math.PI / 6)}`;
  return `<polygon points="${bx} ${by} ${left} ${right}" fill="${stroke}" stroke="none" />`;
}

function renderElement(
  el: BoardElement,
  files: BoardScene['files']
): string {
  const type = el.type || '';
  const x = el.x ?? 0;
  const y = el.y ?? 0;
  const w = el.width ?? 0;
  const h = el.height ?? 0;
  const strokeWidth = el.strokeWidth ?? 2;
  const stroke = strokeFor(el);
  const fill = fillFor(el);
  const dash = strokeDash(el.strokeStyle, strokeWidth);
  const dashAttr = dash ? ` stroke-dasharray="${dash}"` : '';
  const op = opacityAttr(el.opacity);
  const common = `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${dashAttr}${op}`;

  if (type === 'rectangle' || type === 'image' || type === 'frame' || type === 'magicframe') {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rx = el.roundness ? Math.min(16, Math.min(w, h) / 4) : 0;
    const tf = transformFor(el, cx, cy);
    if (type === 'image' && el.fileId) {
      const file = files[el.fileId] as { dataURL?: string } | undefined;
      const href = file?.dataURL;
      if (href) {
        return `<image href="${escapeXml(href)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none"${tf}${op} />`;
      }
    }
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ry="${rx}"${tf} ${common} />`;
  }

  if (type === 'ellipse') {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const tf = transformFor(el, cx, cy);
    return `<ellipse cx="${cx}" cy="${cy}" rx="${Math.abs(w) / 2}" ry="${Math.abs(h) / 2}"${tf} ${common} />`;
  }

  if (type === 'diamond') {
    const cx = x + w / 2;
    const cy = y + h / 2;
    const points = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
    const tf = transformFor(el, cx, cy);
    return `<polygon points="${points}"${tf} ${common} />`;
  }

  if (type === 'line' || type === 'arrow' || type === 'freedraw') {
    const pts = Array.isArray(el.points) ? el.points : [];
    const d = pointsToPath(x, y, pts);
    if (!d) return '';
    const path = `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${dashAttr}${op} />`;
    if (type === 'arrow') {
      return path + arrowHead(x, y, pts, stroke, strokeWidth);
    }
    return path;
  }

  if (type === 'text' && el.text) {
    const fontSize = el.fontSize ?? 20;
    const align = el.textAlign || 'left';
    const anchor = align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start';
    const textX = align === 'center' ? x + w / 2 : align === 'right' ? x + w : x;
    const lines = String(el.text).split('\n');
    const lineHeight = fontSize * 1.25;
    const startY = y + fontSize;
    const spans = lines
      .map((line, i) => {
        const dy = i === 0 ? 0 : lineHeight;
        return `<tspan x="${textX}" dy="${dy}">${escapeXml(line)}</tspan>`;
      })
      .join('');
    const tf = transformFor(el, x + w / 2, y + h / 2);
    return `<text x="${textX}" y="${startY}" fill="${stroke}" font-size="${fontSize}" font-family="Virgil, Segoe UI Emoji, sans-serif" text-anchor="${anchor}"${tf}${op}>${spans}</text>`;
  }

  // Skip UI-only types (selection, laser, embeddable, …)
  return '';
}

/**
 * Convert Excalidraw BoardJson to a standalone SVG string (Node-safe, no Excalidraw bundle).
 */
export function boardJsonToSvg(boardJson: string | null | undefined): string | null {
  const scene = parseBoardScene(boardJson);
  if (!scene || scene.elements.length === 0) return null;

  const padding = 16;
  const bounds = sceneBounds(scene.elements, padding);
  const bg =
    typeof scene.appState.viewBackgroundColor === 'string' && scene.appState.viewBackgroundColor
      ? escapeXml(scene.appState.viewBackgroundColor)
      : '#ffffff';

  const body = scene.elements
    .map((el) => renderElement(el, scene.files))
    .filter(Boolean)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${bounds.width}" height="${bounds.height}" viewBox="${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}">
  <rect x="${bounds.minX}" y="${bounds.minY}" width="${bounds.width}" height="${bounds.height}" fill="${bg}" />
  ${body}
</svg>`;
}

/**
 * Rasterize an Excalidraw BoardJson document to PNG for static export.
 */
export async function renderWhiteboardPng(
  boardJson: string | null | undefined
): Promise<Buffer | null> {
  try {
    const svg = boardJsonToSvg(boardJson);
    if (!svg) return null;
    return await svgToPngBuffer(svg, { width: 1200, background: '#ffffff' });
  } catch (error) {
    logger.warn('Whiteboard PNG render failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
