import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { EmojiItem, Language } from '../types';
import { translations } from '../locales/translations';
import { searchEmojis } from '../utils/search';

interface HeroSearchProps {
  currentLang: Language;
  emojis: EmojiItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectEmoji: (emojiId: string) => void;
  onCopyEmoji: (emojiChar: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  currentLang,
  emojis,
  searchQuery,
  onSearchChange,
  onSelectEmoji,
  onCopyEmoji,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = translations[currentLang];

  // Quick live preview of results
  const previewResults = searchQuery ? searchEmojis(emojis, searchQuery, currentLang).slice(0, 6) : [];

  // Close preview dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTagClick = (tag: string) => {
    // Extract text after space, or use full tag if no space
    const cleanTag = tag.includes(' ') ? tag.split(' ').slice(1).join(' ') : tag;
    onSearchChange(cleanTag);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center pt-8 pb-4 sm:pt-12 sm:pb-8 px-4" ref={containerRef}>
      {/* Visual Title */}
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white mb-3">
        {t.brandName}
      </h1>
      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mb-8 font-normal">
        {t.brandTagline}
      </p>

      {/* Main Search Input */}
      <div className="relative w-full max-w-2xl mx-auto">
        <div
          className={`flex items-center w-full px-4 sm:px-5 py-3.5 rounded-2xl bg-white dark:bg-neutral-800/90 border transition-all duration-200 shadow-sm ${
            isFocused
              ? 'border-amber-500 ring-4 ring-amber-500/15 shadow-md'
              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
          }`}
        >
          <Search className="w-5 h-5 text-neutral-600 dark:text-neutral-300 shrink-0 mr-3" />
          <input
            id="main-emoji-search-input"
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchAriaLabel}
            className="w-full bg-transparent text-sm sm:text-base text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => {
                onSearchChange('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Instant Autocomplete Dropdown Preview */}
        {isFocused && previewResults.length > 0 && (
          <div
            id="search-autocomplete-dropdown"
            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-2xl overflow-hidden z-30 text-left"
          >
            <div className="p-2 divide-y divide-neutral-100 dark:divide-neutral-700/60">
              {previewResults.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-3 py-2.5 hover:bg-amber-50/70 dark:hover:bg-neutral-700/60 transition-colors group cursor-pointer rounded-lg"
                  onClick={() => {
                    onSelectEmoji(item.id);
                    setIsFocused(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyEmoji(item.emoji);
                      }}
                      title={t.clickToCopy}
                      className="text-2xl p-1 rounded-md hover:scale-125 transition-transform cursor-pointer"
                    >
                      {item.emoji}
                    </button>
                    <div>
                      <div className="font-semibold text-sm text-neutral-900 dark:text-white">
                        {item.names[currentLang] || item.names.en}
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        {item.unicode} • {item.category}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyEmoji(item.emoji);
                    }}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-700 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 transition-colors cursor-pointer"
                  >
                    {t.copy}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popular Search Tags */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4 max-w-2xl mx-auto">
        <span className="text-xs text-neutral-600 dark:text-neutral-400 mr-1 font-medium">Quick:</span>
        {t.popularTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="px-3 py-1 text-xs rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 hover:text-amber-600 dark:hover:border-amber-400 dark:hover:text-amber-300 transition-all cursor-pointer shadow-2xs"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
