import React from 'react';
import { Language } from '../types';
import { translations } from '../locales/translations';
import { Trash2 } from 'lucide-react';

interface RecentEmojisProps {
  currentLang: Language;
  recentList: string[];
  onCopyEmoji: (emoji: string) => void;
  onClearRecent: () => void;
}

export const RecentEmojis: React.FC<RecentEmojisProps> = ({
  currentLang,
  recentList,
  onCopyEmoji,
  onClearRecent,
}) => {
  const t = translations[currentLang];

  if (!recentList || recentList.length === 0) {
    return null;
  }

  return (
    <div
      id="recent-emojis-container"
      className="w-full max-w-4xl mx-auto my-6 px-4 py-3 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 shadow-xs"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
          <span>🕒</span>
          <span>{t.recentTitle}</span>
          <span className="text-[11px] font-normal text-neutral-600 dark:text-neutral-400">({recentList.length})</span>
        </div>
        <button
          id="clear-recent-emojis-btn"
          onClick={onClearRecent}
          className="flex items-center gap-1 text-xs text-neutral-600 hover:text-rose-500 dark:text-neutral-400 dark:hover:text-rose-400 transition-colors cursor-pointer px-1 py-0.5"
          title={t.clearRecent}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.clearRecent}</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {recentList.map((emoji, index) => (
          <button
            key={`${emoji}-${index}`}
            onClick={() => onCopyEmoji(emoji)}
            className="w-10 h-10 shrink-0 text-xl rounded-xl flex items-center justify-center bg-neutral-50 dark:bg-neutral-700/60 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:scale-110 active:scale-95 transition-all cursor-pointer select-none"
            title={`${emoji} - ${t.clickToCopy}`}
            aria-label={`${emoji} ${t.clickToCopy}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
