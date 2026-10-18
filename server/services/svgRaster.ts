import logger from '../utils/logger';

/**
 * Rasterize SVG → PNG. Prefers `@resvg/resvg-js` (bundled); falls back to `rsvg-convert`.
 */
export async function svgToPngBuffer(
  svg: string,
  options: { width?: number; background?: string } = {}
): Promise<Buffer | null> {
  const width = options.width ?? 960;
  const background = options.background;

  try {
    const { Resvg } = await import('@resvg/resvg-js');
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: width },
      ...(background
        ? {
            background,
          }
        : {}),
    });
    return Buffer.from(resvg.render().asPng());
  } catch (error) {
    logger.warn('Resvg SVG→PNG failed; trying rsvg-convert', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    const { spawn } = await import('child_process');
    const { mkdtemp, writeFile, readFile, rm } = await import('fs/promises');
    const { tmpdir } = await import('os');
    const { join } = await import('path');

    const dir = await mkdtemp(join(tmpdir(), 'synapse-svg-'));
    const svgPath = join(dir, 'd.svg');
    const pngPath = join(dir, 'd.png');
    try {
      await writeFile(svgPath, svg, 'utf8');
      const args = ['-w', String(width), '-f', 'png', '-o', pngPath, svgPath];
      if (background) args.splice(0, 0, '-b', background);
      const ok = await new Promise<boolean>((resolve) => {
        const child = spawn('rsvg-convert', args, { stdio: 'ignore' });
        child.on('error', () => resolve(false));
        child.on('close', (code) => resolve(code === 0));
      });
      if (!ok) return null;
      return await readFile(pngPath);
    } finally {
      await rm(dir, { recursive: true, force: true }).catch(() => undefined);
    }
  } catch (error) {
    logger.warn('rsvg-convert SVG→PNG failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
