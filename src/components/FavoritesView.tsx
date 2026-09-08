import React, { useMemo } from 'react';
import { EmojiItem, Language } from '../types';
import { translations } from '../locales/translations';
import { EMOJIS } from '../data/emojis';
import { EmojiCard } from './EmojiCard';
import { Star, ArrowRight, Copy } from 'lucide-react';

interface FavoritesViewProps {
  currentLang: Language;
  favoriteIds: string[];
  onCopy: (emojiChar: string) => void;
  onSelect: (emojiId: string) => void;
  onToggleFavorite: (emojiId: string) => void;
  onBrowseEmojis: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  currentLang,
  favoriteIds,
  onCopy,
  onSelect,
  onToggleFavorite,
  onBrowseEmojis,
}) => {
  const t = translations[currentLang];

  // Resolve valid emojis matching stored IDs, preserving user's chronological saved order (newest first)
  // Safely ignores any non-existent or invalid IDs
  const favoriteEmojis = useMemo(() => {
    const emojiMap = new Map<string, EmojiItem>();
    for (const emoji of EMOJIS) {
      emojiMap.set(emoji.id, emoji);
    }
    const list: EmojiItem[] = [];
    for (const id of favoriteIds) {
      const item = emojiMap.get(id);
      if (item) {
        list.push(item);
      }
    }
    return list;
  }, [favoriteIds]);

  const count = favoriteEmojis.length;

  // Handle copying all favorite emojis at once
  const handleCopyAll = () => {
    if (count === 0) return;
    const allChars = favoriteEmojis.map((e) => e.emoji).join(' ');
    onCopy(allChars);
  };

  return (
    <div id="favorites-view" className="my-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                {t.favoritesTitle}
              </h1>
              <span
                id="favorites-count-badge"
                className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono"
              >
                {count}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              {t.savedEmojis} {count > 0 ? `(${count})` : ''}
            </p>
          </div>
        </div>

        {/* Quick action: Copy all favorites */}
        {count > 0 && (
          <button
            id="btn-copy-all-favorites"
            type="button"
            onClick={handleCopyAll}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white transition-colors cursor-pointer"
            title={`${t.copy} ${t.savedEmojis}`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{t.copy} ({count})</span>
          </button>
        )}
      </div>

      {/* Main Content: List or Empty State */}
      {count > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 animate-in fade-in duration-150">
          {favoriteEmojis.map((emoji) => (
            <EmojiCard
              key={emoji.id}
              emoji={emoji}
              currentLang={currentLang}
              onCopy={onCopy}
              onSelect={onSelect}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          id="favorites-empty-state"
          className="text-center py-20 px-4 bg-white dark:bg-neutral-800/50 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xs max-w-xl mx-auto my-6"
        >
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800/60">
            <Star className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-2">
            {t.noFavoritesYet}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
            {t.noFavoritesDesc}
          </p>
          <button
            id="btn-browse-emojis"
            type="button"
            onClick={onBrowseEmojis}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
          >
            <span>{t.browseEmojis}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
