import React from 'react';
import { EmojiItem, Language } from '../types';
import { translations } from '../locales/translations';
import { Copy } from 'lucide-react';

interface EmojiCardProps {
  emoji: EmojiItem;
  currentLang: Language;
  onCopy: (emojiChar: string) => void;
  onSelect: (emojiId: string) => void;
}

export const EmojiCard: React.FC<EmojiCardProps> = ({ emoji, currentLang, onCopy, onSelect }) => {
  const t = translations[currentLang];
  const displayName = emoji.names[currentLang] || emoji.names.en;

  return (
    <div
      id={`emoji-card-${emoji.id}`}
      className="group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-md transition-all duration-150"
    >
      {/* Big Emoji Clickable Area */}
      <button
        onClick={() => onCopy(emoji.emoji)}
        className="w-full flex flex-col items-center justify-center py-2 focus:outline-none cursor-pointer select-none group-hover:scale-105 transition-transform"
        title={`${emoji.emoji} - ${t.clickToCopy}`}
        aria-label={`${displayName} ${t.clickToCopy}`}
      >
        <span className="text-4xl sm:text-5xl leading-none my-1 font-emoji">
          {emoji.emoji}
        </span>
      </button>

      {/* Name with link to detail */}
      <button
        onClick={() => onSelect(emoji.id)}
        className="w-full text-center mt-2 focus:outline-none cursor-pointer group/name"
        title={t.viewDetail}
      >
        <span className="block text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate group-hover/name:text-amber-600 dark:group-hover/name:text-amber-400 transition-colors">
          {displayName}
        </span>
        <span className="block text-[11px] text-neutral-600 dark:text-neutral-400 truncate mt-0.5">
          {emoji.unicode}
        </span>
      </button>

      {/* Copy Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCopy(emoji.emoji);
        }}
        className="w-full mt-3 py-1.5 px-3 flex items-center justify-center gap-1.5 text-xs font-medium rounded-xl bg-neutral-100 dark:bg-neutral-700/80 text-neutral-700 dark:text-neutral-200 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-colors cursor-pointer"
        aria-label={`${t.copy} ${emoji.emoji}`}
      >
        <Copy className="w-3.5 h-3.5" />
        <span>{t.copy}</span>
      </button>
    </div>
  );
};
