import Link from 'next/link';
import { AdSlot } from '@/components/AdSlot';

const CATEGORIES = [
  { name: '可爱动物', emoji: '🐱', desc: '猫咪、小狗、兔子等萌宠图案' },
  { name: '爱心系列', emoji: '❤️', desc: '爱心、情侣、表白图案' },
  { name: '食物甜品', emoji: '🍰', desc: '蛋糕、水果、饮料图案' },
  { name: '节日主题', emoji: '🎄', desc: '圣诞、万圣节、生日图案' },
  { name: '卡通角色', emoji: '🎮', desc: '游戏、动漫角色图案' },
  { name: '字母数字', emoji: '🔤', desc: '名字、标语、编号图案' },
];

export default function CutePatternsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">可爱图案库</h1>
        <p className="text-gray-500 mt-2">上传你的图片，立即生成专属拼豆图案</p>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 mb-10 text-center">
        <p className="text-gray-700 mb-4">
          没有灵感？上传任意图片，Pixel-Pic 会自动为你生成拼豆图案！
        </p>
        <Link
          href="/photo-to-pattern"
          className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-medium transition"
        >
          开始制作 →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.name}
            href="/photo-to-pattern"
            className="group bg-white rounded-2xl border border-gray-100 p-6 text-center hover:border-brand-300 hover:shadow-md transition"
          >
            <div className="text-5xl mb-3">{c.emoji}</div>
            <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 mb-1">
              {c.name}
            </h3>
            <p className="text-sm text-gray-500">{c.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <AdSlot variant="leaderboard" label="图案库页广告位" />
      </div>
    </div>
  );
}
