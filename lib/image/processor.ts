// Core image-to-bead-pattern processor.
// Pipeline: resize image -> dither -> match each pixel to closest palette color
// via CIEDE2000 -> reduce color count -> produce bead grid + counts.

import { ciede2000, rgbToLab, type Lab } from '@/lib/colors/ciede2000';
import type { BeadPalette, BeadColor } from '@/lib/colors/palettes';
import { bayerDither, getBayerMatrix, type DitherMode } from './dither';

export interface ProcessOptions {
  palette: BeadPalette;
  /** maximum number of distinct bead colors in output */
  maxColors: number;
  dither: DitherMode;
  /** dither strength 0..1 for ordered dither */
  ditherStrength: number;
}

export interface BeadCell {
  /** index into the palette */
  paletteIndex: number;
}

export interface ProcessResult {
  width: number;
  height: number;
  /** flat grid of palette indices, length = width*height */
  grid: Uint16Array;
  /** color usage count per palette index */
  counts: Int32Array;
  /** distinct palette indices actually used */
  usedColors: number[];
}

/**
 * Resize an image to the target bead grid width (height auto by aspect ratio).
 * Returns ImageData at the bead resolution.
 */
export function resizeToBeadGrid(
  source: HTMLImageElement | HTMLCanvasElement | ImageData,
  gridWidth: number
): ImageData {
  let srcData: ImageData;
  if (source instanceof ImageData) {
    srcData = source;
  } else {
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = source.width;
    srcCanvas.height = source.height;
    const srcCtx = srcCanvas.getContext('2d')!;
    srcCtx.drawImage(source, 0, 0);
    srcData = srcCtx.getImageData(0, 0, source.width, source.height);
  }

  const aspect = srcData.height / srcData.width;
  const gridHeight = Math.max(1, Math.round(gridWidth * aspect));

  // Use canvas for high-quality downscaling
  const tmp = document.createElement('canvas');
  tmp.width = srcData.width;
  tmp.height = srcData.height;
  tmp.getContext('2d')!.putImageData(srcData, 0, 0);

  const out = document.createElement('canvas');
  out.width = gridWidth;
  out.height = gridHeight;
  const octx = out.getContext('2d')!;
  octx.imageSmoothingEnabled = true;
  octx.imageSmoothingQuality = 'high';
  octx.drawImage(tmp, 0, 0, gridWidth, gridHeight);
  return octx.getImageData(0, 0, gridWidth, gridHeight);
}

function findClosestColor(
  lab: Lab,
  palette: BeadPalette,
  cache: Map<string, number>
): number {
  // Quantize Lab to a coarse key for cache hit
  const key = `${lab.L | 0},${lab.a | 0},${lab.b | 0}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  let bestIdx = 0;
  let bestDist = Infinity;
  const colors = palette.colors;
  for (let i = 0; i < colors.length; i++) {
    const d = ciede2000(lab, colors[i].lab);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  cache.set(key, bestIdx);
  return bestIdx;
}

/**
 * Main processing entry. Runs on the main thread (UI) — keep grid sizes
 * reasonable (<= 200 wide for responsiveness).
 */
export function processImage(
  imageData: ImageData,
  options: ProcessOptions
): ProcessResult {
  const { palette, maxColors, dither, ditherStrength } = options;
  const { width, height, data } = imageData;
  const n = width * height;
  const grid = new Uint16Array(n);
  const counts = new Int32Array(palette.colors.length);
  const cache = new Map<string, number>();
  const bayer = getBayerMatrix(dither);

  // Working buffer for error diffusion (RGB float)
  const buf = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    buf[i * 3] = data[i * 4];
    buf[i * 3 + 1] = data[i * 4 + 1];
    buf[i * 3 + 2] = data[i * 4 + 2];
  }

  const clamp = (v: number) => Math.max(0, Math.min(255, v));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      let r = buf[idx * 3];
      let g = buf[idx * 3 + 1];
      let b = buf[idx * 3 + 2];

      // Ordered dither: pre-adjust pixel before matching
      if (bayer) {
        const [dr, dg, db] = bayerDither(r, g, b, x, y, ditherStrength, bayer);
        r = dr;
        g = dg;
        b = db;
      }

      const lab = rgbToLab(r, g, b);
      const ci = findClosestColor(lab, palette, cache);
      grid[idx] = ci;
      counts[ci]++;

      // Error diffusion
      const matched = palette.colors[ci];
      const er = r - hexToR(matched.hex);
      const eg = g - hexToG(matched.hex);
      const eb = b - hexToB(matched.hex);

      if (dither === 'floyd') {
        diffuse(buf, width, height, x, y, idx, er, eg, eb, FLOYD);
      } else if (dither === 'atkinson') {
        diffuse(buf, width, height, x, y, idx, er, eg, eb, ATKINSON);
      }
    }
  }

  // Reduce distinct color count
  reduceColors(grid, counts, palette, maxColors);

  const usedColors: number[] = [];
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] > 0) usedColors.push(i);
  }
  usedColors.sort((a, b) => counts[b] - counts[a]);

  return { width, height, grid, counts, usedColors };
}

// Error diffusion kernels
const FLOYD: Array<[number, number, number]> = [
  [1, 0, 7 / 16],
  [-1, 1, 3 / 16],
  [0, 1, 5 / 16],
  [1, 1, 1 / 16],
];

const ATKINSON: Array<[number, number, number]> = [
  [1, 0, 1 / 8],
  [2, 0, 1 / 8],
  [-1, 1, 1 / 8],
  [0, 1, 1 / 8],
  [1, 1, 1 / 8],
  [0, 2, 1 / 8],
];

function diffuse(
  buf: Float32Array,
  width: number,
  height: number,
  x: number,
  y: number,
  idx: number,
  er: number,
  eg: number,
  eb: number,
  kernel: Array<[number, number, number]>
) {
  for (const [dx, dy, f] of kernel) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
    const nidx = ny * width + nx;
    buf[nidx * 3] += er * f;
    buf[nidx * 3 + 1] += eg * f;
    buf[nidx * 3 + 2] += eb * f;
  }
}

function hexToR(hex: string) {
  return parseInt(hex.slice(1, 3), 16);
}
function hexToG(hex: string) {
  return parseInt(hex.slice(3, 5), 16);
}
function hexToB(hex: string) {
  return parseInt(hex.slice(5, 7), 16);
}

/**
 * Merge least-used colors into their nearest remaining palette color
 * until distinct count <= maxColors.
 */
function reduceColors(
  grid: Uint16Array,
  counts: Int32Array,
  palette: BeadPalette,
  maxColors: number
): void {
  let used: number[] = [];
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] > 0) used.push(i);
  }
  if (used.length <= maxColors) return;

  used.sort((a, b) => counts[a] - counts[b]);
  const keep = new Set(used.slice(used.length - maxColors));

  // For each removed color, find nearest kept color
  const remap = new Map<number, number>();
  for (const c of used) {
    if (keep.has(c)) continue;
    const cLab = palette.colors[c].lab;
    let best = -1;
    let bestD = Infinity;
    for (const k of keep) {
      const d = ciede2000(cLab, palette.colors[k].lab);
      if (d < bestD) {
        bestD = d;
        best = k;
      }
    }
    remap.set(c, best);
  }

  for (let i = 0; i < grid.length; i++) {
    const target = remap.get(grid[i]);
    if (target !== undefined) {
      counts[grid[i]]--;
      grid[i] = target;
      counts[target]++;
    }
  }
}
