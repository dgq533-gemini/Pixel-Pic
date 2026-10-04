'use client';

interface AdSlotProps {
  /** e.g. "leaderboard", "rectangle", "skyscraper" */
  variant?: 'leaderboard' | 'rectangle' | 'skyscraper';
  label?: string;
}

/**
 * Advertisement placeholder. Replace the inner content with your ad network
 * code (Google AdSense, etc.) when ready.
 */
export function AdSlot({ variant = 'leaderboard', label }: AdSlotProps) {
  const sizes: Record<string, string> = {
    leaderboard: 'h-[90px] md:h-[100px]',
    rectangle: 'h-[250px]',
    skyscraper: 'h-[600px]',
  };

  return (
    <div
      className={`w-full ${sizes[variant]} border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 text-sm select-none`}
      aria-label="广告位"
    >
      <div className="text-xs uppercase tracking-wider mb-1">广告位 · Ad</div>
      <div className="font-medium">{label || '预留广告位'}</div>
      <div className="text-[10px] mt-1 opacity-70">{variant}</div>
    </div>
  );
}
