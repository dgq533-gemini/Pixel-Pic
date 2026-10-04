import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 font-bold text-lg mb-3">
            <span className="inline-block w-7 h-7 rounded bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white text-sm">
              P
            </span>
            Pixel-Pic
          </div>
          <p className="text-gray-500 leading-relaxed">
            免费的在线拼豆图案生成器，使用 CIEDE2000 感知配色算法，将你的照片转为可打印的拼豆图案。
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">工具</h4>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/photo-to-pattern" className="hover:text-brand-600">照片转图案</Link></li>
            <li><Link href="/guides/color-chart" className="hover:text-brand-600">色卡指南</Link></li>
            <li><Link href="/guides/board-sizes" className="hover:text-brand-600">板尺寸</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">资源</h4>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/patterns/cute" className="hover:text-brand-600">可爱图案</Link></li>
            <li><Link href="/guides/bead-comparison" className="hover:text-brand-600">品牌对比</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">关于</h4>
          <ul className="space-y-2 text-gray-500">
            <li><Link href="/about" className="hover:text-brand-600">关于我们</Link></li>
            <li><Link href="/privacy" className="hover:text-brand-600">隐私政策</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Pixel-Pic · 免费拼豆图案生成器 · 所有图片处理在浏览器本地完成
      </div>
    </footer>
  );
}
