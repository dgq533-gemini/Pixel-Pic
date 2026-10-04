import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Pixel-Pic — 免费拼豆图案生成器 | 图片转拼豆',
  description:
    '免费在线拼豆图案生成器，将照片或插画转换为 Perler/Hama/Artkal 拼豆图案。CIEDE2000 感知配色，支持 COCO、MARD、DMC 等多种品牌色板，浏览器本地处理，无需上传。',
  keywords: [
    '拼豆图案',
    '拼豆生成器',
    'perler bead pattern',
    '图片转拼豆',
    '像素拼豆',
    'CIEDE2000',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
