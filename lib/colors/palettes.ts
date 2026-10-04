// Bead brand palettes. Data sourced from get-colors-from-beans (MIT license).
// We normalize each brand to its largest available color set.

import rawColors from '@/get-colors.json';
import { rgbToLab, type Lab } from './ciede2000';

export interface BeadColor {
  /** brand-specific color code, e.g. "A01" */
  code: string;
  /** hex color, e.g. "#FFFFFF" */
  hex: string;
  /** precomputed Lab for fast matching */
  lab: Lab;
}

export interface BeadPalette {
  id: string;
  name: string;
  nameZh: string;
  colors: BeadColor[];
}

type RawBrand = { 'color-name': string; color: string }[];
const raw = rawColors as Record<string, RawBrand>;

// Map brand base name -> which set to use (prefer largest full set).
// For brands with multiple size variants, pick the largest.
const BRAND_SELECTION: Record<string, string> = {
  COCO: 'COCO-291',
  Mard: 'Mard-291',
  DMC: 'DMC-508',
  DODO: 'DODO-291',
  '优肯': '优肯-174',
  '卡卡': '卡卡-284',
  '咪小窝': '咪小窝-290',
  '小舞': '小舞-291',
  '柿柿': '柿柿-220',
  '漫漫': '漫漫-278',
  '盼盼': '盼盼-289',
  '童趣': '童趣-120',
  '黄豆豆': '黄豆豆-291',
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function buildPalette(id: string, nameZh: string, setKey: string): BeadPalette {
  const list = raw[setKey] || [];
  const colors: BeadColor[] = list.map((c) => {
    const [r, g, b] = hexToRgb(c.color);
    return {
      code: c['color-name'],
      hex: c.color.toUpperCase(),
      lab: rgbToLab(r, g, b),
    };
  });
  return { id, name: id, nameZh, colors };
}

export const PALETTES: BeadPalette[] = [
  buildPalette('COCO', 'COCO', BRAND_SELECTION.COCO),
  buildPalette('MARD', 'MARD', BRAND_SELECTION.Mard),
  buildPalette('DMC', 'DMC 十字绣', BRAND_SELECTION.DMC),
  buildPalette('DODO', 'DODO', BRAND_SELECTION.DODO),
  buildPalette('Youken', '优肯', BRAND_SELECTION['优肯']),
  buildPalette('Kaka', '卡卡', BRAND_SELECTION['卡卡']),
  buildPalette('Mixiaowo', '咪小窝', BRAND_SELECTION['咪小窝']),
  buildPalette('Xiaowu', '小舞', BRAND_SELECTION['小舞']),
  buildPalette('Shishi', '柿柿', BRAND_SELECTION['柿柿']),
  buildPalette('Manman', '漫漫', BRAND_SELECTION['漫漫']),
  buildPalette('Panpan', '盼盼', BRAND_SELECTION['盼盼']),
  buildPalette('Tongqu', '童趣', BRAND_SELECTION['童趣']),
  buildPalette('Huangdoudou', '黄豆豆', BRAND_SELECTION['黄豆豆']),
];

export function getPalette(id: string): BeadPalette {
  return PALETTES.find((p) => p.id === id) || PALETTES[0];
}
