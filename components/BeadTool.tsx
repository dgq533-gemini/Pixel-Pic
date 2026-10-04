'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PALETTES, getPalette, type BeadPalette } from '@/lib/colors/palettes';
import {
  processImage,
  resizeToBeadGrid,
  type ProcessResult,
} from '@/lib/image/processor';
import { renderPreview, downloadPNG, downloadPDF } from '@/lib/image/exporter';
import type { DitherMode } from '@/lib/image/dither';

interface BeadToolProps {
  initialImage?: File | null;
}

const DITHER_OPTIONS: { value: DitherMode; label: string }[] = [
  { value: 'none', label: '无抖动' },
  { value: 'floyd', label: 'Floyd-Steinberg' },
  { value: 'atkinson', label: 'Atkinson' },
  { value: 'bayer4', label: '有序抖动 4×4' },
  { value: 'bayer8', label: '有序抖动 8×8' },
];

export function BeadTool({ initialImage }: BeadToolProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [paletteId, setPaletteId] = useState(PALETTES[0].id);
  const [gridWidth, setGridWidth] = useState(80);
  const [maxColors, setMaxColors] = useState(20);
  const [dither, setDither] = useState<DitherMode>('floyd');
  const [ditherStrength, setDitherStrength] = useState(0.6);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [cellSize, setCellSize] = useState(14);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const palette = useMemo(() => getPalette(paletteId), [paletteId]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件（JPG/PNG）');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('图片不能超过 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const runProcess = useCallback(() => {
    if (!image) return;
    setProcessing(true);
    // Defer to next frame so UI can show loading state
    requestAnimationFrame(() => {
      try {
        const imgData = resizeToBeadGrid(image, gridWidth);
        const res = processImage(imgData, {
          palette,
          maxColors,
          dither,
          ditherStrength,
        });
        setResult(res);
      } finally {
        setProcessing(false);
      }
    });
  }, [image, gridWidth, palette, maxColors, dither, ditherStrength]);

  // Reprocess when inputs change
  useEffect(() => {
    if (image) runProcess();
  }, [image, runProcess]);

  // Render preview canvas when result changes
  useEffect(() => {
    if (!result || !canvasRef.current) return;
    const canvas = renderPreview(result, palette, cellSize);
    const ctx = canvasRef.current.getContext('2d')!;
    canvasRef.current.width = canvas.width;
    canvasRef.current.height = canvas.height;
    ctx.drawImage(canvas, 0, 0);
  }, [result, palette, cellSize]);

  if (!image) {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition ${
          dragOver ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <div className="mx-auto w-16 h-16 rounded-full bg-brand-100 grid place-items-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
            <path d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          拖拽图片到此处，或点击上传
        </h3>
        <p className="text-sm text-gray-500">支持 JPG / PNG / WebP，最大 10MB</p>
        <p className="text-xs text-gray-400 mt-3">所有处理在浏览器本地完成，图片不会上传到服务器</p>
      </div>
    );
  }

  const totalBeads = result ? result.width * result.height : 0;

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6">
      {/* Preview area */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-500">
              {result ? `${result.width} × ${result.height} 颗拼豆` : '处理中...'}
            </div>
            <button
              onClick={() => setImage(null)}
              className="text-xs text-gray-400 hover:text-brand-600"
            >
              重新上传
            </button>
          </div>

          <div className="overflow-auto bg-[repeating-conic-gradient(#f3f4f6_0%_25%,white_0%_50%)] bg-[length:20px_20px] rounded-lg p-2 min-h-[300px] flex items-center justify-center">
            {processing ? (
              <div className="text-gray-400 text-sm">处理中...</div>
            ) : (
              <canvas
                ref={canvasRef}
                className="bead-canvas max-w-full"
                style={{ maxHeight: '70vh' }}
              />
            )}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <label className="text-xs text-gray-500 whitespace-nowrap">预览缩放</label>
            <input
              type="range"
              min={4}
              max={32}
              value={cellSize}
              onChange={(e) => setCellSize(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-gray-400 w-10 text-right">{cellSize}px</span>
          </div>
        </div>

        {/* Export buttons */}
        {result && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => downloadPNG(result, palette)}
              className="flex-1 min-w-[140px] bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl font-medium transition"
            >
              下载 PNG
            </button>
            <button
              onClick={() => downloadPDF(result, palette)}
              className="flex-1 min-w-[140px] bg-gray-900 hover:bg-gray-800 text-white py-2.5 rounded-xl font-medium transition"
            >
              下载 PDF
            </button>
          </div>
        )}
      </div>

      {/* Controls + bead count */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-5">
          {/* Brand palette */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              拼豆品牌
            </label>
            <select
              value={paletteId}
              onChange={(e) => setPaletteId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            >
              {PALETTES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameZh}（{p.colors.length} 色）
                </option>
              ))}
            </select>
          </div>

          {/* Grid width */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="font-medium text-gray-700">图案宽度</label>
              <span className="text-brand-600 font-semibold">{gridWidth} 列</span>
            </div>
            <input
              type="range"
              min={16}
              max={200}
              value={gridWidth}
              onChange={(e) => setGridWidth(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>16</span>
              <span>200</span>
            </div>
          </div>

          {/* Max colors */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label className="font-medium text-gray-700">颜色数量</label>
              <span className="text-brand-600 font-semibold">{maxColors} 色</span>
            </div>
            <input
              type="range"
              min={2}
              max={palette.colors.length}
              value={maxColors}
              onChange={(e) => setMaxColors(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Dither */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              抖动方式
            </label>
            <select
              value={dither}
              onChange={(e) => setDither(e.target.value as DitherMode)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            >
              {DITHER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {(dither === 'bayer4' || dither === 'bayer8') && (
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <label className="text-gray-600">抖动强度</label>
                  <span className="text-brand-600">{Math.round(ditherStrength * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={ditherStrength}
                  onChange={(e) => setDitherStrength(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bead count */}
        {result && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">颜色统计</h3>
              <span className="text-xs text-gray-400">
                共 {totalBeads} 颗
              </span>
            </div>
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {result.usedColors.map((ci) => {
                const c = palette.colors[ci];
                const count = result.counts[ci];
                const pct = (count / totalBeads) * 100;
                const low = count < 5;
                return (
                  <div
                    key={ci}
                    className={`flex items-center gap-2 py-1 px-1.5 rounded ${
                      low ? 'bg-amber-50' : ''
                    }`}
                    title={low ? '使用量较少，可考虑合并' : undefined}
                  >
                    <span
                      className="w-5 h-5 rounded border border-gray-200 flex-shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-xs font-mono text-gray-600 w-12">{c.code}</span>
                    <span className="text-xs text-gray-400 w-16">{c.hex}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: c.hex }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-10 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
