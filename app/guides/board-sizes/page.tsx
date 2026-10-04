import { AdSlot } from '@/components/AdSlot';

const BOARDS = [
  { name: '小号方板', size: '29 × 29', beads: 841, use: '挂件、钥匙扣、小图案' },
  { name: '中号方板', size: '58 × 58', beads: 3364, use: '中型图案、徽章' },
  { name: '大号方板', size: '87 × 87', beads: 7569, use: '大幅作品、装饰画' },
  { name: '超大方板', size: '116 × 116', beads: 13456, use: '超大幅作品' },
  { name: '圆形板', size: '直径 ~29', beads: '约 600', use: '杯垫、圆形图案' },
  { name: '六边形板', size: '边长 29', beads: '约 700', use: '六边形图案' },
];

export default function BoardSizesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">拼豆板尺寸指南</h1>
        <p className="text-gray-500 mt-2">常见拼豆板尺寸与适用场景</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">板型</th>
              <th className="text-left px-4 py-3 font-medium">尺寸（颗）</th>
              <th className="text-left px-4 py-3 font-medium">总颗数</th>
              <th className="text-left px-4 py-3 font-medium">适用场景</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {BOARDS.map((b) => (
              <tr key={b.name} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                <td className="px-4 py-3 text-gray-600">{b.size}</td>
                <td className="px-4 py-3 text-gray-600">{b.beads}</td>
                <td className="px-4 py-3 text-gray-600">{b.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-4 text-sm text-gray-600 leading-relaxed">
        <h2 className="font-semibold text-gray-800 text-base">如何选择图案宽度？</h2>
        <p>
          在 Pixel-Pic 中，图案宽度决定了最终拼豆作品的列数。建议根据你的拼豆板大小来设置：
          小号板选 29 左右，中号板选 58 左右，大号板选 87 左右。宽度越大，细节越丰富，
          但需要的拼豆数量也越多。
        </p>
        <p>
          拼豆板通常可以拼接使用，通过组合多块板来制作更大的图案。拼接时注意对齐格子，
          熨烫时可先固定四角再整体熨烫。
        </p>
      </div>

      <div className="mt-10">
        <AdSlot variant="leaderboard" label="板尺寸页广告位" />
      </div>
    </div>
  );
}
