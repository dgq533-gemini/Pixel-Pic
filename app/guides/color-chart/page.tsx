'use client';

import { useState } from 'react';
import { PALETTES } from '@/lib/colors/palettes';
import { AdSlot } from '@/components/AdSlot';

export default function ColorChartPage() {
  const [activeId, setActiveId] = useState(PALETTES[0].id);
  const palette = PALETTES.find((p) => p.id === activeId)!;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">拼豆色卡指南</h1>
        <p className="text-gray-500 mt-2">各品牌色号与颜色对照，共 {PALETTES.length} 个品牌</p>
      </div>

      {/* Palette tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {PALETTES.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeId === p.id
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
            }`}
          >
            {p.nameZh}
            <span className="ml-1.5 text-xs opacity-70">{p.colors.length}</span>
          </button>
        ))}
      </div>

      {/* Color grid */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {palette.colors.map((c, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-center"
              title={`${c.code} ${c.hex}`}
            >
              <div
                className="w-full aspect-square rounded-lg border border-gray-200 shadow-sm"
                style={{ backgroundColor: c.hex }}
              />
              <span className="text-[10px] font-mono text-gray-600 mt-1">{c.code}</span>
              <span className="text-[9px] text-gray-400">{c.hex}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 max-w-3xl mx-auto text-sm text-gray-500 leading-relaxed">
        <h2 className="font-semibold text-gray-800 text-base mb-2">关于色卡</h2>
        <p>
          以上色卡数据来源于公开的拼豆颜色资料，仅供参考。实际颜色可能因屏幕显示、
          生产批次等因素存在差异，建议以实物色卡为准。不同品牌的同色号颜色并不完全相同，
          混合使用时请注意色差。
        </p>
      </div>

      <div className="mt-10">
        <AdSlot variant="leaderboard" label="色卡页广告位" />
      </div>
    </div>
  );
}
