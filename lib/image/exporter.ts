// Export bead pattern as PNG or PDF with color legend and bead count.

import jsPDF from 'jspdf';
import type { BeadPalette } from '@/lib/colors/palettes';
import type { ProcessResult } from '@/lib/image/processor';

const CELL = 14; // px per bead cell in render

/**
 * Render the bead grid to an offscreen canvas at bead resolution, then scale.
 */
function renderGridCanvas(
  result: ProcessResult,
  palette: BeadPalette,
  cellSize: number,
  showGrid: boolean
): HTMLCanvasElement {
  const { width, height, grid } = result;
  const canvas = document.createElement('canvas');
  canvas.width = width * cellSize;
  canvas.height = height * cellSize;
  const ctx = canvas.getContext('2d')!;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const ci = grid[y * width + x];
      ctx.fillStyle = palette.colors[ci].hex;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }

  if (showGrid && cellSize >= 6) {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, height * cellSize);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(width * cellSize, y * cellSize);
      ctx.stroke();
    }
  }
  return canvas;
}

export function downloadPNG(
  result: ProcessResult,
  palette: BeadPalette,
  cellSize = 16
) {
  const canvas = renderGridCanvas(result, palette, cellSize, true);
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `pixel-pic-pattern-${result.width}x${result.height}.png`;
  a.click();
}

/**
 * Export pattern as A4 PDF with grid, color legend, and bead count.
 */
export function downloadPDF(result: ProcessResult, palette: BeadPalette) {
  const { width, height, counts } = result;
  const used = result.usedColors;

  // Compute cell size to fit A4 width (190mm usable)
  const pageW = 210;
  const usableW = 190;
  const cellMM = Math.min(usableW / width, 8); // max 8mm per bead
  const gridW = width * cellMM;
  const gridH = height * cellMM;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageH = 297;
  const margin = 10;
  let y = margin;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Pixel-Pic Bead Pattern', margin, y);
  y += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(
    `Grid: ${width} x ${height} beads | Colors: ${used.length} | Brand: ${palette.nameZh}`,
    margin,
    y
  );
  y += 6;

  // Draw grid
  const gridX = margin + (usableW - gridW) / 2;
  // If grid too tall for one page, paginate
  let remainingH = gridH;
  let gridY = y;
  let rowOffset = 0;
  const rowsPerPage = Math.floor((pageH - gridY - margin - 40) / cellMM);

  while (remainingH > 0) {
    const rowsThisPage = Math.min(rowsPerPage, Math.ceil(remainingH / cellMM));
    const drawH = rowsThisPage * cellMM;

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(gridX, gridY, gridW, drawH, 'F');

    // Cells
    for (let r = 0; r < rowsThisPage; r++) {
      const actualRow = rowOffset + r;
      if (actualRow >= height) break;
      for (let c = 0; c < width; c++) {
        const ci = result.grid[actualRow * width + c];
        const col = palette.colors[ci].hex;
        const r2 = parseInt(col.slice(1, 3), 16);
        const g2 = parseInt(col.slice(3, 5), 16);
        const b2 = parseInt(col.slice(5, 7), 16);
        doc.setFillColor(r2, g2, b2);
        doc.rect(gridX + c * cellMM, gridY + r * cellMM, cellMM, cellMM, 'F');
      }
    }

    // Grid lines
    if (cellMM >= 2) {
      doc.setDrawColor(0, 0, 0, 30);
      doc.setLineWidth(0.1);
      for (let c = 0; c <= width; c++) {
        doc.line(gridX + c * cellMM, gridY, gridX + c * cellMM, gridY + drawH);
      }
      for (let r = 0; r <= rowsThisPage; r++) {
        doc.line(gridX, gridY + r * cellMM, gridX + gridW, gridY + r * cellMM);
      }
    }

    rowOffset += rowsThisPage;
    remainingH -= rowsThisPage * cellMM;

    if (remainingH > 0) {
      doc.addPage();
      gridY = margin;
    }
  }

  // Color legend + counts on a final page
  doc.addPage();
  y = margin;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Color Legend & Bead Count', margin, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const colW = 60;
  let x = margin;
  let colIndex = 0;

  for (const ci of used) {
    const c = palette.colors[ci];
    const count = counts[ci];
    // color swatch
    const r2 = parseInt(c.hex.slice(1, 3), 16);
    const g2 = parseInt(c.hex.slice(3, 5), 16);
    const b2 = parseInt(c.hex.slice(5, 7), 16);
    doc.setFillColor(r2, g2, b2);
    doc.rect(x, y, 5, 5, 'F');
    doc.setDrawColor(180);
    doc.rect(x, y, 5, 5, 'S');

    doc.setTextColor(0);
    doc.text(`${c.code}  ${c.hex}  x${count}`, x + 7, y + 4);

    y += 7;
    if (y > pageH - margin) {
      colIndex++;
      x = margin + colIndex * colW;
      y = margin + 15;
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

/** Render a small preview canvas for the tool UI. */
export function renderPreview(
  result: ProcessResult,
  palette: BeadPalette,
  cellSize: number
): HTMLCanvasElement {
  return renderGridCanvas(result, palette, cellSize, cellSize >= 6);
}
