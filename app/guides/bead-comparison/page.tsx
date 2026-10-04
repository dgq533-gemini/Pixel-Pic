import { PALETTES } from '@/lib/colors/palettes';
import { AdSlot } from '@/components/AdSlot';

export default function BeadComparisonPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">拼豆品牌对比</h1>
        <p className="text-gray-500 mt-2">各品牌特点与选择建议</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {PALETTES.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{p.nameZh}</h3>
              <span className="text-xs text-gray-400">{p.colors.length} 色</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {p.colors.slice(0, 20).map((c, i) => (
                <span
                  key={i}
                  className="w-4 h-4 rounded-sm border border-gray-100"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {p.colors.length > 20 && (
                <span className="text-xs text-gray-400 self-center ml-1">
                  +{p.colors.length - 20}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              色号示例：{p.colors.slice(0, 5).map((c) => c.code).join('、')}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
        <strong>混用建议：</strong>
        建议混合材质相近的品牌。软硬珠混用可能导致熨烫后收缩不均，影响成品效果。
        不同品牌同色号颜色存在差异，大面积作品建议使用单一品牌。
      </div>

      <div className="mt-10">
        <AdSlot variant="leaderboard" label="品牌对比页广告位" />
      </div>
    </div>
  );
}
