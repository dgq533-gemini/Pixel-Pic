'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV = [
  { href: '/', label: '首页' },
  { href: '/photo-to-pattern', label: '照片转图案' },
  { href: '/guides/color-chart', label: '色卡' },
  { href: '/guides/board-sizes', label: '板尺寸' },
  { href: '/patterns/cute', label: '图案库' },
  { href: '/guides/bead-comparison', label: '品牌对比' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="inline-block w-7 h-7 rounded bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white text-sm">
            P
          </span>
          <span className="text-gray-900">Pixel-Pic</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm text-gray-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden p-2 text-gray-600"
          aria-label="菜单"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col p-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-gray-700 hover:bg-brand-50 rounded-lg"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
