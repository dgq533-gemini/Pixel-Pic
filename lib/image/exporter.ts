// Export bead pattern as PNG or PDF with color codes, row/col numbers, and legend.

import jsPDF from 'jspdf';
import type { BeadPalette } from '@/lib/colors/palettes';
import type { ProcessResult } from '@/lib/image/processor';

/** palette index -> display number (1-based, sorted by usage desc) */
function buildCodeMap(result: ProcessResult): Map<number, number> {
  const map = new Map<number, number>();
  result.usedColors.forEach((ci, i) => map.set(ci, i + 1));
  return map;
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

/** Pick black or white text color based on background luminance. */
function textColorFor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? '#000000' : '#ffffff';
}

export interface RenderOptions {
  showCodes: boolean;
  showRowColNumbers: boolean;
  cellSize: number;
  showGridLines: boolean;
}

const DEFAULT_OPTIONS: RenderOptions = {
  showCodes: true,
  showRowColNumbers: true,
  cellSize: 24,
  showGridLines: true,
};

const ROW_COL_FONT_RATIO = 0.35; // font size relative to cellSize for row/col numbers
const CODE_FONT_RATIO = 0.45; // font size relative to cellSize for cell codes

/**
 * Draw the bead grid with optional color codes and row/column numbers.
 * Returns a canvas. The grid is offset by headerW (left) and headerH (top)
 * to leave room for row/col number labels.
 */
function drawGrid(
  result: ProcessResult,
  palette: BeadPalette,
  codeMap: Map<number, number>,
  opts: RenderOptions
): HTMLCanvasElement {
  const { width, height, grid } = result;
  const { showCodes, showRowColNumbers, cellSize, showGridLines } = opts;

  const headerW = showRowColNumbers ? Math.max(28, cellSize * 1.2) : 0;
  const headerH = showRowColNumbers ? Math.max(20, cellSize * 0.8) : 0;

  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(headerW + width * cellSize);
  canvas.height = Math.ceil(headerH + height * cellSize);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cells
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const ci = grid[y * width + x];
      const hex = palette.colors[ci].hex;
      ctx.fillStyle = hex;
      ctx.fillRect(headerW + x * cellSize, headerH + y * cellSize, cellSize, cellSize);
    }
  }

  // Grid lines
  if (showGridLines && cellSize >= 4) {
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = cellSize >= 16 ? 1 : 0.5;
    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(headerW + x * cellSize, headerH);
      ctx.lineTo(headerW + x * cellSize, headerH + height * cellSize);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(headerW, headerH + y * cellSize);
      ctx.lineTo(headerW + width * cellSize, headerH + y * cellSize);
      ctx.stroke();
    }
    // Every 10 lines darker
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.lineWidth = cellSize >= 16 ? 1.5 : 1;
    for (let x = 0; x <= width; x += 10) {
      ctx.beginPath();
      ctx.moveTo(headerW + x * cellSize, headerH);
      ctx.lineTo(headerW + x * cellSize, headerH + height * cellSize);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 10) {
      ctx.beginPath();
      ctx.moveTo(headerW, headerH + y * cellSize);
      ctx.lineTo(headerW + width * cellSize, headerH + y * cellSize);
      ctx.stroke();
    }
  }

  // Brand color codes inside cells (e.g. "P41")
  if (showCodes && cellSize >= 12) {
    // Adaptive font: shorter codes can be larger; cap so 4-char codes fit.
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const ci = grid[y * width + x];
        const brandCode = palette.colors[ci].code;
        const hex = palette.colors[ci].hex;
        const len = brandCode.length;
        const ratio = len >= 4 ? 0.32 : len >= 3 ? 0.38 : CODE_FONT_RATIO;
        const fontSize = Math.max(7, Math.floor(cellSize * ratio));
        ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
        ctx.fillStyle = textColorFor(hex);
        ctx.fillText(
          brandCode,
          headerW + x * cellSize + cellSize / 2,
          headerH + y * cellSize + cellSize / 2
        );
      }
    }
  }

  // Row and column numbers
  if (showRowColNumbers) {
    const fontSize = Math.max(8, Math.floor(cellSize * ROW_COL_FONT_RATIO));
    ctx.fillStyle = '#333';
    ctx.font = `${fontSize}px system-ui, sans-serif`;

    // Column numbers (top)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    for (let x = 0; x < width; x++) {
      if ((x + 1) % 5 === 0 || x === 0 || x === width - 1) {
        ctx.fillText(
          String(x + 1),
          headerW + x * cellSize + cellSize / 2,
          headerH - 2
        );
      }
    }

    // Row numbers (left)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = 0; y < height; y++) {
      if ((y + 1) % 5 === 0 || y === 0 || y === height - 1) {
        ctx.fillText(
          String(y + 1),
          headerW - 4,
          headerH + y * cellSize + cellSize / 2
        );
      }
    }
  }

  return canvas;
}

/**
 * Draw the color legend (number, swatch, brand code, hex, quantity) into a
 * canvas context at position (x, y) with max width `w`.
 * Returns the height used.
 */
function drawLegend(
  ctx: CanvasRenderingContext2D,
  result: ProcessResult,
  palette: BeadPalette,
  codeMap: Map<number, number>,
  x: number,
  y: number,
  w: number,
  fontSize = 12
): number {
  const { counts, usedColors } = result;
  const lineH = fontSize + 8;
  const swatch = fontSize + 4;
  let cy = y;

  // Title
  ctx.fillStyle = '#111';
  ctx.font = `bold ${fontSize + 2}px system-ui, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('颜色编号与用量 (Color Codes & Quantities)', x, cy);
  cy += lineH + 4;

  // Column header
  ctx.font = `${fontSize}px system-ui, sans-serif`;
  ctx.fillStyle = '#666';
  ctx.fillText('#', x, cy);
  ctx.fillText('色号', x + 24, cy);
  ctx.fillText('HEX', x + 100, cy);
  ctx.fillText('数量', x + w - 60, cy);
  cy += lineH;

  ctx.font = `${fontSize}px system-ui, sans-serif`;
  for (const ci of usedColors) {
    const code = codeMap.get(ci)!;
    const c = palette.colors[ci];
    const count = counts[ci];

    // number
    ctx.fillStyle = '#222';
    ctx.textAlign = 'left';
    ctx.fillText(String(code), x, cy);

    // swatch
    ctx.fillStyle = c.hex;
    ctx.fillRect(x + 20, cy, swatch, swatch);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 20, cy, swatch, swatch);

    // brand code
    ctx.fillStyle = '#222';
    ctx.fillText(c.code, x + 24 + swatch + 6, cy);

    // hex
    ctx.fillStyle = '#666';
    ctx.fillText(c.hex, x + 100, cy);

    // count
    ctx.fillStyle = '#222';
    ctx.textAlign = 'right';
    ctx.fillText(`${count} pcs`, x + w, cy);

    cy += lineH;
  }

  return cy - y;
}

/**
 * Render a full pattern sheet (grid with codes + row/col numbers + legend) as a canvas.
 * Used for PNG export and high-quality preview.
 */
function renderPatternSheet(
  result: ProcessResult,
  palette: BeadPalette,
  opts: RenderOptions
): HTMLCanvasElement {
  const codeMap = buildCodeMap(result);
  const { width, height } = result;
  const cellSize = opts.cellSize;

  const headerW = opts.showRowColNumbers ? Math.max(28, cellSize * 1.2) : 0;
  const headerH = opts.showRowColNumbers ? Math.max(20, cellSize * 0.8) : 0;
  const gridW = headerW + width * cellSize;
  const gridH = headerH + height * cellSize;

  // Layout: grid on left, legend on right (if enough colors) or below
  const legendFont = 12;
  const legendW = 320;
  const gap = 24;

  const totalW = gridW + gap + legendW;
  const totalH = Math.max(gridH, 600);

  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(totalW);
  canvas.height = Math.ceil(totalH);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  const gridCanvas = drawGrid(result, palette, codeMap, opts);
  ctx.drawImage(gridCanvas, 0, 0);

  // Draw legend
  drawLegend(ctx, result, palette, codeMap, gridW + gap, 10, legendW, legendFont);

  return canvas;
}

export function downloadPNG(
  result: ProcessResult,
  palette: BeadPalette,
  cellSize = 28
) {
  const opts: RenderOptions = {
    ...DEFAULT_OPTIONS,
    cellSize,
    showCodes: cellSize >= 14,
    showRowColNumbers: true,
  };
  const canvas = renderPatternSheet(result, palette, opts);
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `pixel-pic-pattern-${result.width}x${result.height}.png`;
  a.click();
}

/**
 * Export pattern as A4 PDF with grid (color codes + row/col numbers) and legend.
 */
export function downloadPDF(result: ProcessResult, palette: BeadPalette) {
  const { width, height, counts, usedColors } = result;
  const codeMap = buildCodeMap(result);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const margin = 10;
  const usableW = pageW - margin * 2;

  // Title
  let y = margin;
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Pixel-Pic 拼豆图案', margin, y);
  y += 6;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(
    `网格: ${width} x ${height} 颗 | 颜色: ${usedColors.length} 种 | 品牌: ${palette.nameZh}`,
    margin,
    y
  );
  y += 6;

  // Cell size: fit width, max 6mm
  const cellMM = Math.min(usableW / (width + 1.5), 6);
  const headerMM = 6; // space for row numbers
  const headerTop = 5; // space for column numbers
  const gridW = width * cellMM;
  const gridH = height * cellMM;

  const gridX = margin + headerMM;
  let gridY = y;

  const rowsPerPage = Math.floor((pageH - gridY - margin - 10) / cellMM);

  let rowOffset = 0;
  let remaining = height;

  while (remaining > 0) {
    const rowsThisPage = Math.min(rowsPerPage, remaining);
    const drawH = rowsThisPage * cellMM;

    // Cells
    for (let r = 0; r < rowsThisPage; r++) {
      const actualRow = rowOffset + r;
      for (let c = 0; c < width; c++) {
        const ci = result.grid[actualRow * width + c];
        const hex = palette.colors[ci].hex;
        const [r2, g2, b2] = hexToRgb(hex);
        doc.setFillColor(r2, g2, b2);
        doc.rect(gridX + c * cellMM, gridY + r * cellMM, cellMM, cellMM, 'F');
      }
    }

    // Grid lines
    if (cellMM >= 1.5) {
      doc.setDrawColor(0, 0, 0, 40);
      doc.setLineWidth(0.08);
      for (let c = 0; c <= width; c++) {
        doc.line(gridX + c * cellMM, gridY, gridX + c * cellMM, gridY + drawH);
      }
      for (let r = 0; r <= rowsThisPage; r++) {
        doc.line(gridX, gridY + r * cellMM, gridX + gridW, gridY + r * cellMM);
      }
      // bold every 10
      doc.setDrawColor(0, 0, 0, 90);
      doc.setLineWidth(0.2);
      for (let c = 0; c <= width; c += 10) {
        doc.line(gridX + c * cellMM, gridY, gridX + c * cellMM, gridY + drawH);
      }
      for (let r = 0; r <= rowsThisPage; r += 10) {
        doc.line(gridX, gridY + r * cellMM, gridX + gridW, gridY + r * cellMM);
      }
    }

    // Brand color codes in cells (e.g. "P41")
    if (cellMM >= 3) {
      doc.setFont('helvetica', 'bold');
      for (let r = 0; r < rowsThisPage; r++) {
        const actualRow = rowOffset + r;
        for (let c = 0; c < width; c++) {
          const ci = result.grid[actualRow * width + c];
          const brandCode = palette.colors[ci].code;
          const hex = palette.colors[ci].hex;
          const [r2, g2, b2] = hexToRgb(hex);
          const lum = (0.299 * r2 + 0.587 * g2 + 0.114 * b2) / 255;
          doc.setTextColor(lum > 0.6 ? 0 : 255);
          const len = brandCode.length;
          const fs = Math.max(3.5, cellMM * (len >= 4 ? 1.1 : len >= 3 ? 1.3 : 1.6));
          doc.setFontSize(fs);
          doc.text(
            brandCode,
            gridX + c * cellMM + cellMM / 2,
            gridY + r * cellMM + cellMM / 2 + 0.8,
            { align: 'center', baseline: 'middle' }
          );
        }
      }
    }

    // Column numbers
    doc.setTextColor(80);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    for (let c = 0; c < width; c++) {
      if ((c + 1) % 5 === 0 || c === 0 || c === width - 1) {
        doc.text(
          String(c + 1),
          gridX + c * cellMM + cellMM / 2,
          gridY - 1,
          { align: 'center', baseline: 'bottom' }
        );
      }
    }

    // Row numbers
    for (let r = 0; r < rowsThisPage; r++) {
      const actualRow = rowOffset + r;
      if ((actualRow + 1) % 5 === 0 || actualRow === 0 || actualRow === height - 1) {
        doc.text(
          String(actualRow + 1),
          gridX - 1,
          gridY + r * cellMM + cellMM / 2,
          { align: 'right', baseline: 'middle' }
        );
      }
    }

    rowOffset += rowsThisPage;
    remaining -= rowsThisPage;

    if (remaining > 0) {
      doc.addPage();
      gridY = margin;
    } else {
      gridY += drawH + 10;
    }
  }

  // Legend on a new page
  doc.addPage();
  y = margin;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('颜色编号与用量 (Color Codes & Quantities)', margin, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const colW = 62;
  let x = margin;
  let colIndex = 0;

  for (const ci of usedColors) {
    const code = codeMap.get(ci)!;
    const c = palette.colors[ci];
    const count = counts[ci];
    const [r2, g2, b2] = hexToRgb(c.hex);

    // number
    doc.setTextColor(0);
    doc.text(`${code}`, x, y + 3);

    // swatch
    doc.setFillColor(r2, g2, b2);
    doc.rect(x + 10, y, 4, 4, 'F');
    doc.setDrawColor(180);
    doc.setLineWidth(0.1);
    doc.rect(x + 10, y, 4, 4, 'S');

    // code + hex + count
    doc.setTextColor(0);
    doc.text(`${c.code}  ${c.hex}  x${count}`, x + 17, y + 3.5);

    y += 6.5;
    if (y > pageH - margin) {
      colIndex++;
      x = margin + colIndex * colW;
      y = margin + 14;
      if (colIndex >= 3) {
        doc.addPage();
        colIndex = 0;
        x = margin;
        y = margin;
      }
    }
  }

  doc.save(`pixel-pic-pattern-${width}x${height}.pdf`);
}

/**
 * Render a preview canvas for the tool UI.
 * `showCodes` toggles color numbers inside cells.
 */
export function renderPreview(
  result: ProcessResult,
  palette: BeadPalette,
  cellSize: number,
  showCodes = false
): HTMLCanvasElement {
  const opts: RenderOptions = {
    showCodes: showCodes && cellSize >= 14,
    showRowColNumbers: cellSize >= 18,
    cellSize,
    showGridLines: cellSize >= 5,
  };
  return drawGrid(result, palette, buildCodeMap(result), opts);
}
