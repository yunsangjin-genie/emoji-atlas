import React, { useState } from 'react';
import { Language, SymbolItem } from '../types';
import { translations } from '../locales/translations';
import { SYMBOLS } from '../data/symbols';
import { AdSlot } from './AdSlot';

interface SymbolsViewProps {
  currentLang: Language;
  onCopy: (char: string) => void;
  initialCategory?: string;
}

export const SymbolsView: React.FC<SymbolsViewProps> = ({ currentLang, onCopy, initialCategory = 'all' }) => {
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory);
  const t = translations[currentLang];

  const categories = [
    { id: 'all', label: t.symbolCategories.all },
    { id: 'heart', label: t.symbolCategories.heart },
    { id: 'star', label: t.symbolCategories.star },
    { id: 'flower', label: t.symbolCategories.flower },
    { id: 'arrow', label: t.symbolCategories.arrow },
    { id: 'math', label: t.symbolCategories.math },
    { id: 'bracket', label: t.symbolCategories.bracket },
    { id: 'decorations', label: t.symbolCategories.decorations },
  ];

  const filtered = selectedCat === 'all' ? SYMBOLS : SYMBOLS.filter((s) => s.category === selectedCat);

  return (
    <div id="symbols-view" className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mb-2">
          {t.symbolsTitle}
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {t.symbolsDesc}
        </p>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              selectedCat === cat.id
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Special Characters */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {filtered.map((item) => {
          const charName = item.name[currentLang] || item.name.en;
          return (
            <button
              key={item.id}
              onClick={() => onCopy(item.char)}
              className="group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-md active:scale-95 transition-all cursor-pointer"
              title={`${item.char} (${charName}) - ${t.clickToCopy}`}
              aria-label={`${charName} ${item.char}`}
            >
              <span className="text-2xl sm:text-3xl font-mono text-neutral-900 dark:text-white group-hover:scale-115 transition-transform my-1">
                {item.char}
              </span>
              <span className="text-[10px] sm:text-[11px] text-neutral-600 dark:text-neutral-400 truncate w-full text-center mt-1">
                {charName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Non-intrusive AdSlot */}
      <AdSlot id="symbols-ad" className="mt-12" />
    </div>
  );
};
