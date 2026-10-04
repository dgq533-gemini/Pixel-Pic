import { BeadTool } from '@/components/BeadTool';
import { AdSlot } from '@/components/AdSlot';

export const metadata = {
  title: '照片转拼豆图案 | Pixel-Pic',
  description: '将人像、风景、动漫照片转换为可打印的拼豆图案，支持多种品牌色板。',
};

export default function PhotoToPatternPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">照片转拼豆图案</h1>
        <p className="text-gray-500 mt-2">上传照片，自动生成拼豆图案与用量清单</p>
      </div>
      <BeadTool />
      <div className="mt-10">
        <AdSlot variant="leaderboard" label="内容广告位" />
      </div>
    </div>
  );
}
