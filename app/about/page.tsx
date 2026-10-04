export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">关于 Pixel-Pic</h1>
      <div className="space-y-4 text-gray-600 leading-relaxed">
        <p>
          Pixel-Pic 是一个免费的在线拼豆图案生成工具，帮助你将照片或插画快速转换为
          可打印的拼豆图案。
        </p>
        <p>
          我们使用 CIEDE2000 感知色差算法进行颜色匹配，让生成的图案更接近人眼真实感受。
          内置 COCO、MARD、DMC 等多种拼豆品牌色板，自动统计颜色用量，支持导出 PNG 和 PDF。
        </p>
        <p>
          所有图片处理在浏览器本地完成，不会上传到任何服务器，保护你的隐私。
        </p>
      </div>
    </div>
  );
}
