import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Language, Emoticon } from '../types';
import { translations } from '../locales/translations';
import {
  getAllEmoticons,
  getEmoticonName,
  searchEmoticons,
  getEmoticonById,
  getRecentEmoticonIds,
  saveRecentEmoticonId,
} from '../utils/emoticons';
import { copyToClipboard } from '../utils/clipboard';
import { AdSlot } from './AdSlot';
import { Toast } from './Toast';
import { Check, Search, X, SearchX, Clock } from 'lucide-react';

interface EmoticonsViewProps {
  currentLang: Language;
  onCopy?: (char: string) => void;
  initialCategory?: string;
}

function formatEmoticonCount(count: number, lang: Language): string {
  switch (lang) {
    case 'ko':
      return `${count}개의 이모티콘`;
    case 'en':
      return `${count} ${count === 1 ? 'emoticon' : 'emoticons'}`;
    case 'ja':
      return `${count}件の顔文字`;
    case 'zh-hans':
      return `${count}个颜文字`;
    case 'zh-hant':
      return `${count}個顏文字`;
    case 'es':
      return `${count} ${count === 1 ? 'emoticono' : 'emoticonos'}`;
    case 'fr':
      return `${count} ${count === 1 ? 'émoticône' : 'émoticônes'}`;
    case 'de':
      return `${count} ${count === 1 ? 'Emoticon' : 'Emoticons'}`;
    default:
      return `${count} emoticons`;
  }
}

export const EmoticonsView: React.FC<EmoticonsViewProps> = ({ currentLang, initialCategory = 'all' }) => {
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastState, setToastState] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = translations[currentLang];

  useEffect(() => {
    setRecentIds(getRecentEmoticonIds());
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const allEmoticons = useMemo(() => getAllEmoticons(), []);

  const recentEmoticons = useMemo(() => {
    return recentIds
      .map((id) => getEmoticonById(id))
      .filter((item): item is Emoticon => item !== undefined);
  }, [recentIds]);

  const categories = [
    { id: 'all', label: t.emoticonCategories.all || 'All' },
    { id: 'cute', label: t.emoticonCategories.cute || 'Cute' },
    { id: 'love', label: t.emoticonCategories.love || 'Love' },
    { id: 'funny', label: t.emoticonCategories.funny || 'Funny' },
    { id: 'happy', label: t.emoticonCategories.happy || 'Happy' },
    { id: 'sad', label: t.emoticonCategories.sad || 'Sad' },
    { id: 'angry', label: t.emoticonCategories.angry || 'Angry' },
    { id: 'greeting', label: t.emoticonCategories.greeting || 'Greeting' },
    { id: 'thanks', label: t.emoticonCategories.thanks || 'Thanks' },
    { id: 'cheering', label: t.emoticonCategories.cheering || 'Cheering' },
    { id: 'surprise', label: t.emoticonCategories.surprise || 'Surprise' },
  ];

  const filtered = useMemo(() => {
    const query = searchQuery.trim();
    const baseList = query ? searchEmoticons(query, currentLang) : allEmoticons;
    if (selectedCat === 'all') return baseList;
    return baseList.filter((e) => e.category.toLowerCase() === selectedCat.toLowerCase());
  }, [allEmoticons, searchQuery, currentLang, selectedCat]);

  const searchPlaceholder = t.emoticonSearchPlaceholder;
  const recentSectionTitle = t.recentEmoticonsTitle;
  const copiedFeedbackText = t.emoticonCopySuccess;
  const copyFailedFeedbackText = t.emoticonCopyFailed;
  const noResultsTitle = t.noEmoticonsFoundTitle;
  const noResultsDesc = t.noEmoticonsFoundDesc;
  const clearSearchText = t.clearSearch;

  // Dedicated Emoticon Copy Handler (isolated from Emoji copy logic)
  const handleCopyEmoticon = async (item: Emoticon, visualKey?: string) => {
    try {
      const success = await copyToClipboard(item.text);
      if (success) {
        if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

        setCopiedId(visualKey || item.id);
        setToastState({ message: copiedFeedbackText, type: 'success' });

        // Save to isolated recent emoticons storage and update UI immediately
        const updatedRecent = saveRecentEmoticonId(item.id);
        setRecentIds(updatedRecent);

        copiedTimeoutRef.current = setTimeout(() => {
          setCopiedId(null);
        }, 1500);

        toastTimeoutRef.current = setTimeout(() => {
          setToastState(null);
        }, 1500);
      } else {
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        setToastState({ message: copyFailedFeedbackText, type: 'error' });
        toastTimeoutRef.current = setTimeout(() => {
          setToastState(null);
        }, 2000);
      }
    } catch {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setToastState({ message: copyFailedFeedbackText, type: 'error' });
      toastTimeoutRef.current = setTimeout(() => {
        setToastState(null);
      }, 2000);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <div id="emoticons-view" className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mb-2">
          {t.emoticonsTitle}
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          {t.emoticonsDesc}
        </p>
      </div>

      {/* Emoticon Search Bar */}
      <div className="relative w-full max-w-xl mx-auto mb-6">
        <div
          className={`flex items-center w-full px-4 py-3 rounded-2xl bg-white dark:bg-neutral-800 border transition-all duration-200 shadow-xs ${
            isSearchFocused
              ? 'border-amber-500 ring-4 ring-amber-500/15 shadow-md'
              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
          }`}
        >
          <Search className="w-5 h-5 text-neutral-400 dark:text-neutral-500 shrink-0 mr-3" />
          <input
            id="emoticon-search-input"
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full bg-transparent text-sm sm:text-base text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />
          {searchQuery && (
            <button
              type="button"
              id="clear-emoticon-search-btn"
              onClick={handleClearSearch}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              aria-label={clearSearchText}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Recently Used Emoticons Section (Displayed only when at least 1 recent emoticon exists) */}
      {recentEmoticons.length > 0 && (
        <section
          id="recent-emoticons-section"
          aria-label={recentSectionTitle}
          className="w-full mb-8 p-3.5 sm:p-4 rounded-2xl bg-neutral-50/90 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/60 transition-all"
        >
          <div className="flex items-center gap-2 mb-3 px-1">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <h2 className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
              {recentSectionTitle}
            </h2>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              ({recentEmoticons.length})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {recentEmoticons.map((item) => {
              const emoName = getEmoticonName(item, currentLang);
              const cardKey = `recent-${item.id}`;
              const isCopied = copiedId === cardKey || copiedId === item.id;
              return (
                <button
                  type="button"
                  key={cardKey}
                  id={`recent-emoticon-card-${item.id}`}
                  onClick={() => handleCopyEmoticon(item, cardKey)}
                  className={`group relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white dark:bg-neutral-800 border transition-all duration-150 text-center cursor-pointer active:scale-95 ${
                    isCopied
                      ? 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-neutral-200 dark:border-neutral-700/80 hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-xs'
                  }`}
                  title={`${item.text} - ${isCopied ? copiedFeedbackText : t.clickToCopy}`}
                  aria-label={`${emoName}: ${item.text}`}
                >
                  <span className="text-sm sm:text-base font-mono text-neutral-900 dark:text-white my-1.5 break-all select-none group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.text}
                  </span>
                  <div className="h-4 flex items-center justify-center w-full mt-0.5">
                    {isCopied ? (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                        <Check className="w-3 h-3 shrink-0" />
                        <span className="truncate">{copiedFeedbackText}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-600 dark:text-neutral-400 truncate w-full">
                        {emoName}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`emoticon-cat-${cat.id}`}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              selectedCat === cat.id
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Result Count & Clear Indicator */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between px-1 mb-4 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          <span>{formatEmoticonCount(filtered.length, currentLang)}</span>
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            {clearSearchText}
          </button>
        </div>
      )}

      {/* Grid of Emoticons or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filtered.map((item) => {
            const emoName = getEmoticonName(item, currentLang);
            const isCopied = copiedId === item.id;
            return (
              <button
                type="button"
                key={item.id}
                id={`emoticon-card-${item.id}`}
                onClick={() => handleCopyEmoticon(item)}
                className={`group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-neutral-800 border transition-all duration-150 text-center cursor-pointer active:scale-95 ${
                  isCopied
                    ? 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-neutral-200 dark:border-neutral-700/80 hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-md'
                }`}
                title={`${item.text} - ${isCopied ? copiedFeedbackText : t.clickToCopy}`}
                aria-label={`${emoName}: ${item.text}`}
              >
                <span className="text-base sm:text-lg font-mono text-neutral-900 dark:text-white my-2.5 break-all select-none group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {item.text}
                </span>
                <div className="h-5 flex items-center justify-center w-full mt-1">
                  {isCopied ? (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{copiedFeedbackText}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate w-full">
                      {emoName}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 max-w-md mx-auto my-6">
          <SearchX className="w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-500 mb-3 stroke-[1.5]" />
          <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-1">
            {noResultsTitle}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-5">
            {noResultsDesc}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCat('all');
            }}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer shadow-xs"
          >
            {clearSearchText}
          </button>
        </div>
      )}

      {/* Non-intrusive AdSlot */}
      <AdSlot id="emoticons-ad" className="mt-12" />

      {/* Global Toast Notification */}
      <Toast message={toastState?.message ?? null} type={toastState?.type} />
    </div>
  );
};


