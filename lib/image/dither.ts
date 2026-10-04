// Dithering algorithms for converting images to limited bead palettes.
// Implements classic error-diffusion and ordered dithering.

export type DitherMode = 'none' | 'floyd' | 'atkinson' | 'bayer4' | 'bayer8';

// 4x4 Bayer matrix (normalized 0..1, offset -0.5)
const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => v / 16 - 0.5));

// 8x8 Bayer matrix
const BAYER8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map((row) => row.map((v) => v / 64 - 0.5));

/**
 * Apply ordered dithering to an RGB pixel before palette quantization.
 * Returns adjusted RGB values.
 */
export function bayerDither(
  r: number,
  g: number,
  b: number,
  x: number,
  y: number,
  strength: number,
  matrix: number[][]
): [number, number, number] {
  const t = matrix[y % matrix.length][x % matrix[0].length] * strength;
  const clamp = (v: number) => Math.max(0, Math.min(255, v + t * 255));
  return [clamp(r), clamp(g), clamp(b)];
}

export function getBayerMatrix(mode: DitherMode): number[][] | null {
  if (mode === 'bayer4') return BAYER4;
  if (mode === 'bayer8') return BAYER8;
  return null;
}
