import { BeadTool } from '@/components/BeadTool';
import { AdSlot } from '@/components/AdSlot';

const FEATURES = [
  {
    icon: '🎨',
    title: '多品牌色板',
    desc: '内置 COCO、MARD、DMC、咪小窝等 13 种拼豆品牌色板，精准匹配实物颜色。',
  },
  {
    icon: '🔢',
    title: '自动统计数量',
    desc: '自动统计每种颜色的拼豆用量，低用量颜色高亮提醒，方便采购。',
  },
  {
    icon: '📥',
    title: '图案导出',
    desc: '导出高清 PNG 或可打印 PDF，包含色卡图例和用量清单。',
  },
  {
    icon: '✏️',
    title: '实时调节',
    desc: '自由调整图案宽度、颜色数量、抖动方式，所见即所得。',
  },
  {
    icon: '⚡',
    title: '本地处理',
    desc: '图片在浏览器内处理，不上传服务器，隐私安全有保障。',
  },
  {
    icon: '🎯',
    title: 'CIEDE2000 配色',
    desc: '采用感知色差算法，匹配结果更接近人眼真实感受。',
  },
];

const STEPS = [
  { n: 1, title: '上传图片', desc: '拖拽或点击上传任意照片、插画。' },
  { n: 2, title: '选择参数', desc: '挑选拼豆品牌、颜色数量和抖动风格。' },
  { n: 3, title: '下载图案', desc: '导出 PNG/PDF，附带色卡和用量清单。' },
];

const FAQ = [
  {
    q: 'Pixel-Pic 是免费的吗？',
    a: '是的，完全免费且无需注册。所有功能开放使用。',
  },
  {
    q: '支持哪些图片格式？',
    a: '支持 JPG、PNG、WebP，单张不超过 10MB。',
  },
  {
    q: '我的图片会被上传吗？',
    a: '不会。所有图像处理在你的浏览器本地完成，图片不会离开你的设备。',
  },
  {
    q: '可以混合不同品牌的拼豆吗？',
    a: '可以。建议混合材质相近的品牌（如 COCO 与 MARD），软硬珠混用可能导致熨烫效果不均。',
  },
  {
    q: '导出的 PDF 可以打印吗？',
    a: '可以。PDF 已针对 A4 纸张优化，包含网格、色号和用量统计，可直接打印对照制作。',
  },
];

const RESOURCES = [
  { href: '/photo-to-pattern', title: '照片转图案', desc: '把人像、风景照转为拼豆图案' },
  { href: '/guides/color-chart', title: '色卡指南', desc: '各品牌色号与颜色对照' },
  { href: '/guides/board-sizes', title: '板尺寸指南', desc: '常见拼豆板尺寸与选择建议' },
  { href: '/patterns/cute', title: '可爱图案', desc: '猫咪、爱心、挂件等小图案' },
  { href: '/guides/bead-comparison', title: '品牌对比', desc: 'COCO、MARD、DMC 等品牌区别' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-10 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1 rounded-full mb-5">
          ✨ 100% 免费 · 无需注册 · 本地处理
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
          免费拼豆图案生成器
          <span className="block text-brand-600 mt-1">照片一键转拼豆</span>
        </h1>
        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
          上传任意图片，使用 CIEDE2000 感知配色算法，瞬间生成可打印的拼豆图案。
          支持 COCO、MARD、DMC、咪小窝等多种品牌色板。
        </p>
      </section>

      {/* Tool */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <BeadTool />
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <AdSlot variant="leaderboard" label="首页横幅广告位" />
      </div>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
          核心功能
        </h2>
        <p className="text-center text-gray-500 mb-10">让拼豆创作更简单、更精准</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
            三步生成拼豆图案
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-100 text-brand-700 grid place-items-center text-2xl font-bold mb-4">
                  {s.n}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
          学习资源
        </h2>
        <p className="text-center text-gray-500 mb-10">从入门到进阶的拼豆指南</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RESOURCES.map((r) => (
            <a
              key={r.href}
              href={r.href}
              className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand-300 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 mb-1">
                {r.title}
              </h3>
              <p className="text-sm text-gray-500">{r.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
          常见问题
        </h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details
              key={f.q}
              className="bg-white rounded-2xl border border-gray-100 p-5 group"
            >
              <summary className="cursor-pointer font-medium text-gray-900 flex justify-between items-center">
                {f.q}
                <span className="text-gray-400 group-open:rotate-45 transition text-xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <AdSlot variant="leaderboard" label="底部横幅广告位" />
      </div>
    </div>
  );
}
