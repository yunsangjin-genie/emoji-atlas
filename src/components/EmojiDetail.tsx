import React from 'react';
import { EmojiItem, Language, RouteState } from '../types';
import { translations } from '../locales/translations';
import { EMOJI_CATEGORIES } from '../data/categories';
import { EMOJIS } from '../data/emojis';
import { Copy, Share2, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { AdSlot } from './AdSlot';

interface EmojiDetailProps {
  emoji: EmojiItem;
  currentLang: Language;
  onCopy: (char: string) => void;
  onNavigate: (route: Partial<RouteState>) => void;
  onShare: () => void;
}

export const EmojiDetail: React.FC<EmojiDetailProps> = ({
  emoji,
  currentLang,
  onCopy,
  onNavigate,
  onShare,
}) => {
  const t = translations[currentLang];
  const displayName = emoji.names[currentLang] || emoji.names.en;
  const categoryObj = EMOJI_CATEGORIES.find((c) => c.id === emoji.category);
  const categoryName = categoryObj ? categoryObj.names[currentLang] || categoryObj.names.en : emoji.category;

  // Find related emoji objects
  const relatedItems = (emoji.related || [])
    .map((charOrId) => EMOJIS.find((e) => e.emoji === charOrId || e.id === charOrId))
    .filter(Boolean) as EmojiItem[];

  const descriptionText = emoji.description
    ? emoji.description[currentLang] || emoji.description.en || emoji.description.ko
    : `${displayName} (${emoji.emoji})`;

  const examplesList =
    currentLang === 'ko'
      ? emoji.examples?.ko || []
      : emoji.examples?.en || emoji.examples?.ko || [];

  return (
    <div id={`emoji-detail-${emoji.id}`} className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Back Button & Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 flex-wrap">
        <button
          onClick={() => onNavigate({ view: 'home', emojiId: undefined })}
          className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
        >
          {t.navHome}
        </button>
        <span>&gt;</span>
        <button
          onClick={() => onNavigate({ view: 'emoji', emojiId: undefined })}
          className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
        >
          {t.navEmoji}
        </button>
        <span>&gt;</span>
        <button
          onClick={() => onNavigate({ view: 'emoji', categoryId: emoji.category, emojiId: undefined })}
          className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
        >
          {categoryName}
        </button>
        <span>&gt;</span>
        <span className="text-neutral-900 dark:text-white font-semibold">{displayName}</span>
      </nav>

      {/* Main Hero Card */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700/80 p-6 sm:p-10 shadow-xs flex flex-col items-center text-center">
        <span className="text-7xl sm:text-9xl my-4 select-none animate-in fade-in zoom-in duration-300">
          {emoji.emoji}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mt-2 mb-1">
          {displayName}
        </h1>
        <p className="text-xs sm:text-sm font-mono text-neutral-600 dark:text-neutral-400 mb-6">
          {emoji.unicode} {emoji.subcategory && `• ${emoji.subcategory}`}
        </p>

        {/* Action Buttons: Big Copy & Share */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          <button
            id="detail-big-copy-btn"
            onClick={() => onCopy(emoji.emoji)}
            className="flex-1 min-w-[160px] flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-98"
          >
            <Copy className="w-5 h-5" />
            <span>{emoji.emoji} {t.copy}</span>
          </button>
          <button
            id="detail-share-btn"
            onClick={onShare}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 font-semibold text-sm transition-colors cursor-pointer"
            title={t.share}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t.share}</span>
          </button>
        </div>
      </div>

      {/* Non-intrusive AdSense Slot */}
      <AdSlot id="detail-ad-top" className="my-8" />

      {/* Information Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Meaning & Description */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700/80">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t.meaning}</span>
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {descriptionText}
          </p>
        </div>

        {/* Technical Unicode Info */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700/80">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            <span>{t.unicodeInfo}</span>
          </h2>
          <dl className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-700/60">
              <dt className="text-neutral-600 dark:text-neutral-400">Codepoint</dt>
              <dd className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">{emoji.unicode}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-700/60">
              <dt className="text-neutral-600 dark:text-neutral-400">{t.category}</dt>
              <dd className="font-medium text-neutral-800 dark:text-neutral-200">{categoryName}</dd>
            </div>
            {emoji.version && (
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-700/60">
                <dt className="text-neutral-600 dark:text-neutral-400">Unicode Version</dt>
                <dd className="font-mono text-neutral-800 dark:text-neutral-200">v{emoji.version}</dd>
              </div>
            )}
            <div className="flex justify-between py-1">
              <dt className="text-neutral-600 dark:text-neutral-400">Shortname</dt>
              <dd className="font-mono text-neutral-800 dark:text-neutral-200">:{emoji.id}:</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Usage Examples in Chat */}
      {examplesList.length > 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700/80 my-6">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <span>💬</span>
            <span>{t.usageExamples}</span>
          </h2>
          <div className="space-y-3">
            {examplesList.map((example, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-700/50 text-sm"
              >
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">{example}</span>
                <button
                  onClick={() => onCopy(example)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  {t.copy}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Emojis */}
      {relatedItems.length > 0 && (
        <div className="my-8">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🔗</span>
            <span>{t.relatedEmojis}</span>
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {relatedItems.map((rel) => (
              <button
                key={rel.id}
                onClick={() => onNavigate({ view: 'detail', emojiId: rel.id })}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 hover:border-amber-500 dark:hover:border-amber-400 hover:scale-105 transition-all cursor-pointer shadow-2xs group"
                title={`${rel.names[currentLang] || rel.names.en} - ${rel.emoji}`}
              >
                <span className="text-3xl my-1">{rel.emoji}</span>
                <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 truncate w-full text-center">
                  {rel.names[currentLang] || rel.names.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Second Non-intrusive AdSense Slot */}
      <AdSlot id="detail-ad-bottom" className="my-8" />
    </div>
  );
};
