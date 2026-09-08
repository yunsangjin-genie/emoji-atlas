import React, { useEffect, useMemo, useState, useRef } from 'react';
import { EmojiItem, Language, RouteState } from '../types';
import { translations } from '../locales/translations';
import { EMOJI_CATEGORIES } from '../data/categories';
import { EMOJIS } from '../data/emojis';
import { getRelatedEmojis } from '../utils/emojiDetail';
import { Copy, Share2, X, Check, Sparkles, Tag, Layers, Star } from 'lucide-react';
import { AdSlot } from './AdSlot';

interface EmojiDetailProps {
  emoji: EmojiItem;
  currentLang: Language;
  onCopy: (char: string) => void;
  onNavigate: (route: Partial<RouteState>, skipScroll?: boolean) => void;
  onShare: () => void;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (emojiId: string) => void;
  favoriteIds?: string[];
}

export const EmojiDetail: React.FC<EmojiDetailProps> = ({
  emoji,
  currentLang,
  onCopy,
  onNavigate,
  onShare,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  favoriteIds = [],
}) => {
  const [justCopied, setJustCopied] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const t = translations[currentLang];

  // Names
  const localizedName = emoji.names[currentLang] || emoji.names.en;
  const englishName = emoji.names.en;
  const isEnglish = currentLang === 'en';

  // Category & Subcategory
  const categoryObj = EMOJI_CATEGORIES.find((c) => c.id === emoji.category);
  const categoryName = categoryObj
    ? categoryObj.names[currentLang] || categoryObj.names.en
    : t.emojiCategories[emoji.category] || emoji.category;

  // Compute up to 8 related emojis dynamically using the prioritized ranking
  const relatedItems = useMemo(() => {
    return getRelatedEmojis(emoji, EMOJIS);
  }, [emoji]);

  // Meaning & Description
  const descriptionText = emoji.description
    ? emoji.description[currentLang] || emoji.description.en || emoji.description.ko
    : undefined;

  // Usage Examples
  const examplesList =
    currentLang === 'ko'
      ? emoji.examples?.ko || []
      : emoji.examples?.en || emoji.examples?.ko || [];

  // Keywords (merge current language + english, clean & dedup)
  const keywordsList = useMemo(() => {
    const list: string[] = [];
    const seen = new Set<string>();

    const addList = (arr?: string[]) => {
      if (!arr) return;
      for (const k of arr) {
        const clean = k.trim();
        const lower = clean.toLowerCase();
        // Exclude raw emoji symbol itself from keyword pills
        if (clean && clean !== emoji.emoji && !seen.has(lower)) {
          seen.add(lower);
          list.push(clean);
        }
      }
    };

    addList(emoji.keywords?.[currentLang]);
    if (!isEnglish) {
      addList(emoji.keywords?.en);
    }

    return list;
  }, [emoji, currentLang, isEnglish]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock background body scroll while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle copy button
  const handleCopyClick = () => {
    onCopy(emoji.emoji);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 2000);
  };

  // Handle clicking a related emoji
  const handleSelectRelated = (relatedId: string) => {
    onNavigate({ view: 'detail', emojiId: relatedId }, true);
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      id={`emoji-detail-modal-backdrop`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="emoji-detail-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Modal Card / Bottom Sheet Container */}
      <div
        ref={modalContentRef}
        className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Modal Header Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-6 py-3.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          {/* Category & Subcategory Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>{categoryName}</span>
            </span>
            {emoji.subcategory && (
              <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/60 px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700/60">
                {emoji.subcategory}
              </span>
            )}
          </div>

          {/* Action Buttons: Favorite, Share & Close */}
          <div className="flex items-center gap-1">
            {onToggleFavorite && (
              <button
                id="detail-header-favorite-btn"
                type="button"
                onClick={() => onToggleFavorite(emoji.id)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isFavorite
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                title={isFavorite ? t.removeFromFavorites : t.addToFavorites}
                aria-label={isFavorite ? t.removeFromFavorites : t.addToFavorites}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-500 dark:text-amber-400' : ''}`} />
              </button>
            )}
            <button
              id="detail-share-btn"
              type="button"
              onClick={onShare}
              className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title={t.share}
              aria-label={t.share}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="detail-close-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title={t.close}
              aria-label={t.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Top Emoji Showcase */}
          <div className="flex flex-col items-center text-center">
            {/* Big Emoji Symbol */}
            <div className="text-7xl sm:text-8xl my-2 font-emoji select-none drop-shadow-xs animate-in zoom-in-95 duration-200">
              {emoji.emoji}
            </div>

            {/* Localized Name */}
            <h1
              id="emoji-detail-title"
              className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-2 mb-0.5 tracking-tight"
            >
              {localizedName}
            </h1>

            {/* English Name (if not English) */}
            {!isEnglish && englishName && englishName !== localizedName && (
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {englishName}
              </p>
            )}

            {/* Unicode Codepoint Tag */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/70 text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300">
              <span className="text-neutral-600 dark:text-neutral-400">Unicode:</span>
              <span className="font-semibold text-amber-700 dark:text-amber-400">{emoji.unicode}</span>
              {emoji.version && (
                <span className="text-neutral-600 dark:text-neutral-400 text-[10px]">
                  • v{emoji.version}
                </span>
              )}
            </div>

            {/* Primary Action Buttons: Favorite & Copy */}
            <div className="w-full max-w-md mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {onToggleFavorite && (
                <button
                  id="detail-modal-favorite-btn"
                  type="button"
                  onClick={() => onToggleFavorite(emoji.id)}
                  className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 border ${
                    isFavorite
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                      : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600 shadow-2xs'
                  }`}
                  aria-label={isFavorite ? t.removeFromFavorites : t.addToFavorites}
                >
                  <Star
                    className={`w-4 h-4 ${
                      isFavorite
                        ? 'fill-amber-400 text-amber-500 dark:text-amber-400'
                        : 'text-neutral-400 dark:text-neutral-500'
                    }`}
                  />
                  <span>{isFavorite ? t.removeFromFavorites : t.addToFavorites}</span>
                </button>
              )}

              <button
                id="detail-modal-copy-btn"
                type="button"
                onClick={handleCopyClick}
                className={`py-3 px-4 rounded-2xl font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                  !onToggleFavorite ? 'col-span-full' : ''
                } ${
                  justCopied
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-md'
                }`}
                aria-label={`${t.copyEmoji}: ${emoji.emoji}`}
              >
                {justCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>
                      {emoji.emoji} {t.copyEmoji}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Keywords / Tags Section */}
          {keywordsList.length > 0 && (
            <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl p-4 border border-neutral-150 dark:border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2.5">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.keywords}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {keywordsList.map((keyword, index) => (
                  <span
                    key={`${keyword}-${index}`}
                    className="inline-block px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/70 text-neutral-700 dark:text-neutral-300 select-all"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meaning / Background Description (if available) */}
          {descriptionText && (
            <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl p-4 border border-neutral-150 dark:border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.meaning}</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {descriptionText}
              </p>
            </div>
          )}

          {/* Usage Examples (if available) */}
          {examplesList.length > 0 && (
            <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl p-4 border border-neutral-150 dark:border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2.5">
                <span>💬</span>
                <span>{t.usageExamples}</span>
              </div>
              <div className="space-y-2">
                {examplesList.map((example, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 text-xs sm:text-sm"
                  >
                    <span className="text-neutral-800 dark:text-neutral-200">{example}</span>
                    <button
                      type="button"
                      onClick={() => onCopy(example)}
                      className="px-2 py-1 text-[11px] font-medium rounded-md bg-neutral-100 dark:bg-neutral-700 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                    >
                      {t.copy}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AdSense Unit between Emoji Details and Related Emojis */}
          <AdSlot id="detail-ad" className="my-3 sm:my-4" />

          {/* Related Emojis Section (Section 4 & 5) */}
          {relatedItems.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  <span>🔗</span>
                  <span>{t.relatedEmojis}</span>
                </div>
                <span className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  {relatedItems.length}
                </span>
              </div>

              {/* Grid of up to 8 related emojis */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5">
                {relatedItems.map((rel) => {
                  const relName = rel.names[currentLang] || rel.names.en;
                  const isRelFavorite = favoriteIds.includes(rel.id);
                  return (
                    <div
                      key={rel.id}
                      className="group relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 hover:border-amber-500 dark:hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-neutral-800 transition-all text-center"
                    >
                      {onToggleFavorite && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(rel.id);
                          }}
                          className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-md text-neutral-400 hover:text-amber-500 dark:text-neutral-500 dark:hover:text-amber-400 z-10 cursor-pointer"
                          title={isRelFavorite ? t.removeFromFavorites : t.addToFavorites}
                          aria-label={`${isRelFavorite ? t.removeFromFavorites : t.addToFavorites}: ${relName}`}
                        >
                          <Star
                            className={`w-3 h-3 transition-transform active:scale-125 ${
                              isRelFavorite
                                ? 'fill-amber-400 text-amber-500 dark:text-amber-400'
                                : 'text-neutral-300 dark:text-neutral-600 hover:text-neutral-500'
                            }`}
                          />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleSelectRelated(rel.id)}
                        className="w-full flex flex-col items-center justify-center cursor-pointer focus:outline-none"
                        title={`${relName} (${rel.emoji})`}
                        aria-label={`${relName} ${rel.emoji}`}
                      >
                        <span className="text-3xl sm:text-4xl my-0.5 select-none font-emoji group-hover:scale-110 transition-transform">
                          {rel.emoji}
                        </span>
                        <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 truncate w-full mt-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {relName}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
