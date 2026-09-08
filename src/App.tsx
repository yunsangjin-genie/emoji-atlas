import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { EmojiItem, Language, RouteState, ViewType } from './types';
import { translations, SUPPORTED_LANGUAGES } from './locales/translations';
import { EMOJIS } from './data/emojis';
import { EMOJI_CATEGORIES } from './data/categories';
import {
  getRecentEmojis,
  saveRecentEmoji,
  clearRecentEmojis,
  getStoredTheme,
  setStoredTheme,
  getStoredLanguage,
  setStoredLanguage,
  getFavoriteEmojiIds,
  toggleFavoriteEmoji,
} from './utils/storage';
import { copyToClipboard } from './utils/clipboard';
import { searchEmojis } from './utils/search';
import { updateMetaTags } from './utils/seo';
import { findEmojiByIdOrCode } from './utils/emojiDetail';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSearch } from './components/HeroSearch';
import { RecentEmojis } from './components/RecentEmojis';
import { EmojiCard } from './components/EmojiCard';
import { EmojiDetail } from './components/EmojiDetail';
import { FavoritesView } from './components/FavoritesView';
import { SymbolsView } from './components/SymbolsView';
import { EmoticonsView } from './components/EmoticonsView';
import { StaticPages } from './components/StaticPages';
import { AdSlot } from './components/AdSlot';
import { Toast } from './components/Toast';
import { Sparkles, ArrowRight, Grid, Flame } from 'lucide-react';

export interface CategoryTabItem {
  id: string;
  icon: string;
}

export const CATEGORY_TABS: CategoryTabItem[] = [
  { id: 'all', icon: '✨' },
  { id: 'popular', icon: '🔥' },
  { id: 'smileys-emotion', icon: '😀' },
  { id: 'people-body', icon: '👋' },
  { id: 'animals-nature', icon: '🐶' },
  { id: 'food-drink', icon: '🍎' },
  { id: 'travel-places', icon: '🚗' },
  { id: 'activities', icon: '⚽' },
  { id: 'objects', icon: '💡' },
  { id: 'symbols', icon: '❤️' },
  { id: 'flags', icon: '🇰🇷' },
];

// Canonical visual priority for the curated popular emojis
export const POPULAR_PRIORITY_ORDER: string[] = [
  'red-heart',
  'face-with-tears-of-joy',
  'smiling-face-with-hearts',
  'smiling-face-with-heart-eyes',
  'grinning-face',
  'loudly-crying-face',
  'rolling-on-the-floor-laughing',
  'thumbs-up',
  'fire',
  'sparkles',
  'party-popper',
  'pleading-face',
  'thinking-face',
  'partying-face',
  'folded-hands',
  'heart-hands',
  'waving-hand',
  'sparkling-heart',
  'dog-face',
  'cat-face',
  'cherry-blossom',
  'birthday-cake',
  'hot-beverage',
  'skull',
  'light-bulb',
  'laptop',
  'rocket',
  'fire-heart',
  'check-mark-button',
  'flag-south-korea',
  'flag-united-states',
];

export function sortPopularEmojis(list: EmojiItem[]): EmojiItem[] {
  return [...list].sort((a, b) => {
    const aIndex = POPULAR_PRIORITY_ORDER.indexOf(a.id);
    const bIndex = POPULAR_PRIORITY_ORDER.indexOf(b.id);
    const aRank = aIndex === -1 ? 999 : aIndex;
    const bRank = bIndex === -1 ? 999 : bIndex;
    return aRank - bRank;
  });
}

// URL path parser helper
function parsePathname(): RouteState {
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  const segments = path.split('/').filter(Boolean);

  let lang: Language = getStoredLanguage();
  let view: ViewType = 'home';
  let emojiId: string | undefined;
  let categoryId: string | undefined;

  if (segments.length > 0) {
    const maybeLang = segments[0];
    if (['ko', 'en', 'ja', 'zh-hans', 'zh-hant', 'es', 'fr', 'de'].includes(maybeLang)) {
      lang = maybeLang as Language;
      segments.shift();
    }
  }

  if (segments.length > 0) {
    const first = segments[0];
    if (first === 'emoji' || first === 'emojis') {
      if (segments[1]) {
        // Check if segment 1 is a known category or emoji id
        const isCat = segments[1] === 'popular' || EMOJI_CATEGORIES.some((c) => c.id === segments[1]);
        if (isCat) {
          view = 'emoji';
          categoryId = segments[1];
        } else {
          view = 'detail';
          emojiId = segments[1];
        }
      } else {
        view = 'emoji';
      }
    } else if (first === 'symbols') {
      view = 'symbols';
    } else if (first === 'emoticons') {
      view = 'emoticons';
    } else if (first === 'popular') {
      view = 'popular';
      categoryId = 'popular';
    } else if (first === 'favorites') {
      view = 'favorites';
    } else if (['about', 'contact', 'privacy', 'terms'].includes(first)) {
      view = first as ViewType;
    }
  }

  // Parse search query
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get('q') || undefined;

  return { lang, view, emojiId, categoryId, searchQuery };
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => parsePathname());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme());
  const [searchQuery, setSearchQuery] = useState<string>(route.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (route.view === 'popular') return 'popular';
    return route.categoryId || 'all';
  });
  const [visibleCount, setVisibleCount] = useState<number>(96);
  const [recentList, setRecentList] = useState<string[]>(() => getRecentEmojis());
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavoriteEmojiIds());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentLang = route.lang;
  const t = translations[currentLang];

  // Synchronize category & reset visible count when route changes
  useEffect(() => {
    if (route.view === 'emoji') {
      setSelectedCategory(route.categoryId || 'all');
    } else if (route.view === 'popular') {
      setSelectedCategory('popular');
    } else if (route.view === 'home') {
      setSelectedCategory('all');
    }
    setVisibleCount(96);
  }, [route.view, route.categoryId]);

  // Synchronize HTML dark mode class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setStoredTheme(theme);
  }, [theme]);

  // Handle browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parsePathname();
      setRoute(parsed);
      if (parsed.searchQuery !== undefined) {
        setSearchQuery(parsed.searchQuery);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL on navigation
  const navigate = useCallback(
    (newRoutePartial: Partial<RouteState>, skipScroll = false) => {
      const nextRoute: RouteState = {
        ...route,
        ...newRoutePartial,
      };

      setRoute(nextRoute);

      let path = `/${nextRoute.lang}/`;
      if (nextRoute.view === 'emoji') {
        path += nextRoute.categoryId && nextRoute.categoryId !== 'all' ? `emoji/${nextRoute.categoryId}/` : `emoji/`;
      } else if (nextRoute.view === 'popular') {
        path += `popular/`;
      } else if (nextRoute.view === 'detail' && nextRoute.emojiId) {
        path += `emoji/${nextRoute.emojiId}/`;
      } else if (nextRoute.view !== 'home') {
        path += `${nextRoute.view}/`;
      }

      if (nextRoute.searchQuery) {
        path += `?q=${encodeURIComponent(nextRoute.searchQuery)}`;
      }

      window.history.pushState(null, '', path);
      if (!skipScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [route]
  );

  // Update SEO metadata whenever route, language, or emoji changes
  useEffect(() => {
    let title = `${t.brandName} – ${t.brandTagline}`;
    let desc = t.homeMetaDesc;
    let emojiChar: string | undefined;

    if (route.searchQuery) {
      title = `${t.searchPageTitle} – ${t.brandName}`;
      desc = `${t.searchResults}: ${route.searchQuery}`;
    } else if (route.view === 'detail' && route.emojiId) {
      const emoji = findEmojiByIdOrCode(route.emojiId);
      if (emoji) {
        const name = emoji.names[currentLang] || emoji.names.en;
        emojiChar = emoji.emoji;
        if (currentLang === 'ko') {
          title = `${emoji.emoji} ${name} 이모지 | ${t.brandName}`;
          desc = `${emoji.emoji} ${name} 이모지의 Unicode, 이름, 키워드와 관련 이모지를 확인하고 간편하게 복사하세요.`;
        } else if (currentLang === 'en') {
          title = `${emoji.emoji} ${name} Emoji | ${t.brandName}`;
          desc = `Check ${emoji.emoji} ${name} emoji unicode, keywords, meaning, related emojis, and copy with one click.`;
        } else {
          title = `${emoji.emoji} ${name} | ${t.brandName}`;
          desc = emoji.description ? (emoji.description[currentLang] || emoji.description.en) : `${emoji.emoji} ${name} (${emoji.unicode})`;
        }
      }
    } else if (route.view === 'emoji') {
      if (route.categoryId) {
        if (route.categoryId === 'popular') {
          title = `${t.popularTitle} – ${t.brandName}`;
          desc = t.popularDesc;
        } else {
          const cat = EMOJI_CATEGORIES.find((c) => c.id === route.categoryId);
          const catName = cat ? cat.names[currentLang] || cat.names.en : (t.emojiCategories[route.categoryId] || t.categoriesTitle);
          title = `${catName} – ${t.brandName}`;
          desc = cat?.descriptions?.[currentLang] || t.allEmojiDesc;
        }
      } else {
        title = `${t.allEmojiTitle} – ${t.brandName}`;
        desc = t.allEmojiDesc;
      }
    } else if (route.view === 'symbols') {
      title = `${t.symbolsTitle} – ${t.brandName}`;
      desc = t.symbolsDesc;
    } else if (route.view === 'emoticons') {
      title = t.emoticonsMetaTitle;
      desc = t.emoticonsMetaDesc;
    } else if (route.view === 'popular') {
      title = `${t.popularTitle} – ${t.brandName}`;
      desc = t.popularDesc;
    } else if (route.view === 'favorites') {
      title = `${t.favoritesTitle} – ${t.brandName}`;
      desc = t.savedEmojis;
    } else if (route.view === 'about') {
      title = `${t.navAbout} – ${t.brandName}`;
      desc = t.homeMetaDesc;
    } else if (route.view === 'contact') {
      title = `${t.navContact} – ${t.brandName}`;
      desc = t.homeMetaDesc;
    } else if (route.view === 'privacy') {
      title = `${t.navPrivacy} – ${t.brandName}`;
      desc = t.homeMetaDesc;
    } else if (route.view === 'terms') {
      title = `${t.navTerms} – ${t.brandName}`;
      desc = t.homeMetaDesc;
    }

    updateMetaTags(route, title, desc, emojiChar);
  }, [route, currentLang, t]);

  // Toast trigger
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  }, []);

  // Copy handler
  const handleCopy = useCallback(
    async (char: string) => {
      const success = await copyToClipboard(char);
      if (success) {
        showToast(t.copied);
        const updated = saveRecentEmoji(char);
        setRecentList(updated);
      } else {
        showToast(t.copyFailed);
      }
    },
    [t, showToast]
  );

  // Share handler
  const handleShare = useCallback(async () => {
    const success = await copyToClipboard(window.location.href);
    if (success) {
      showToast(t.shareCopied);
    }
  }, [t, showToast]);

  // Clear recents
  const handleClearRecents = () => {
    clearRecentEmojis();
    setRecentList([]);
  };

  // Toggle favorite emoji handler
  const handleToggleFavorite = useCallback(
    (emojiId: string) => {
      const { favorites: updated, isFavorite } = toggleFavoriteEmoji(emojiId);
      setFavoriteIds(updated);
      showToast(isFavorite ? t.favoriteAddedToast : t.favoriteRemovedToast);
    },
    [t, showToast]
  );

  // Language switch
  const handleLanguageChange = (lang: Language) => {
    setStoredLanguage(lang);
    navigate({ lang });
  };

  // Theme toggle
  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Search Results & Combined Filtering
  // Dynamically compute emoji counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: EMOJIS.length,
      popular: 0,
    };
    for (const cat of EMOJI_CATEGORIES) {
      counts[cat.id] = 0;
    }
    for (const emoji of EMOJIS) {
      if (emoji.isPopular) {
        counts.popular += 1;
      }
      if (counts[emoji.category] !== undefined) {
        counts[emoji.category] += 1;
      }
    }
    return counts;
  }, []);

  // Base category pool according to selectedCategory
  const categoryBasePool = useMemo(() => {
    if (selectedCategory === 'all') return EMOJIS;
    if (selectedCategory === 'popular') return sortPopularEmojis(EMOJIS.filter((e) => e.isPopular));
    return EMOJIS.filter((e) => e.category === selectedCategory);
  }, [selectedCategory]);

  // Combined Filter: Category Pool + Search Query
  const filteredEmojis = useMemo(() => {
    if (!searchQuery.trim()) {
      return categoryBasePool;
    }
    return searchEmojis(categoryBasePool, searchQuery, currentLang);
  }, [categoryBasePool, searchQuery, currentLang]);

  const popularEmojis = useMemo(() => {
    return sortPopularEmojis(EMOJIS.filter((e) => e.isPopular));
  }, []);

  // Curated 40 representative emojis for the homepage preview (isPopular prioritized, then filled to 40)
  const homePreviewEmojis = useMemo(() => {
    const popular = sortPopularEmojis(EMOJIS.filter((e) => e.isPopular));
    if (popular.length >= 40) {
      return popular.slice(0, 40);
    }
    const popularSet = new Set(popular.map((e) => e.id));
    const additional = EMOJIS.filter((e) => !popularSet.has(e.id)).slice(0, 40 - popular.length);
    return [...popular, ...additional];
  }, []);

  // Category selection handler with smooth transition
  const handleCategoryClick = useCallback(
    (catId: string) => {
      setSelectedCategory(catId);
      setVisibleCount(96);
      if (route.view === 'home') {
        navigate({
          view: 'emoji',
          categoryId: catId === 'all' ? undefined : catId,
          searchQuery: searchQuery || undefined,
        });
      } else {
        navigate(
          {
            view: 'emoji',
            categoryId: catId === 'all' ? undefined : catId,
            searchQuery: searchQuery || undefined,
          },
          true
        );
      }
    },
    [route.view, navigate, searchQuery]
  );

  // Category filter navigation bar renderer
  const renderCategoryBar = (variant: 'explore' | 'home' | 'search' | 'popular' = 'explore') => (
    <div
      role="tablist"
      aria-label={t.categoriesTitle}
      className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-6 scrollbar-thin scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
    >
      {CATEGORY_TABS.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const catName = t.emojiCategories[cat.id] || (cat.id === 'all' ? t.allEmojiTitle : cat.id);
        const count = categoryCounts[cat.id] ?? 0;
        return (
          <button
            key={cat.id}
            id={`cat-btn-${variant}-${cat.id}`}
            role="tab"
            type="button"
            aria-selected={isSelected}
            aria-label={`${catName}, ${count.toLocaleString()}`}
            onClick={() => handleCategoryClick(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              isSelected
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs font-semibold'
                : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600 font-medium'
            }`}
          >
            <span aria-hidden="true">{cat.icon}</span>
            <span>{catName}</span>
            <span
              className={`text-[11px] sm:text-xs font-mono px-1.5 py-0.5 rounded-md ${
                isSelected
                  ? 'bg-neutral-700 dark:bg-neutral-200 text-neutral-200 dark:text-neutral-800 font-medium'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {count.toLocaleString()}
            </span>
          </button>
        );
      })}
    </div>
  );

  // Find active detail emoji if on detail view
  const currentDetailEmoji = useMemo(() => {
    if (route.view === 'detail' && route.emojiId) {
      return findEmojiByIdOrCode(route.emojiId);
    }
    return null;
  }, [route.view, route.emojiId]);

  // Handle closing detail modal
  const handleCloseDetail = useCallback(() => {
    navigate(
      {
        view: selectedCategory === 'popular' ? 'popular' : selectedCategory === 'all' ? 'home' : 'emoji',
        categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
        emojiId: undefined,
      },
      true
    );
  }, [navigate, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-200 dark:selection:bg-amber-900 selection:text-amber-900 dark:selection:text-amber-200">
      {/* Top Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        currentTheme={theme}
        onThemeToggle={handleThemeToggle}
        route={route}
        onNavigate={navigate}
        favoritesCount={favoriteIds.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6">
        {/* VIEW: SYMBOLS */}
        {route.view === 'symbols' && (
          <SymbolsView currentLang={currentLang} onCopy={handleCopy} />
        )}

        {/* VIEW: EMOTICONS */}
        {route.view === 'emoticons' && (
          <EmoticonsView currentLang={currentLang} onCopy={handleCopy} />
        )}

        {/* VIEW: FAVORITES */}
        {route.view === 'favorites' && (
          <FavoritesView
            currentLang={currentLang}
            favoriteIds={favoriteIds}
            onCopy={handleCopy}
            onSelect={(id) => navigate({ view: 'detail', emojiId: id }, true)}
            onToggleFavorite={handleToggleFavorite}
            onBrowseEmojis={() => navigate({ view: 'emoji', categoryId: undefined })}
          />
        )}

        {/* VIEW: STATIC POLICIES (ABOUT / CONTACT / PRIVACY / TERMS) */}
        {['about', 'contact', 'privacy', 'terms'].includes(route.view) && (
          <StaticPages type={route.view as any} currentLang={currentLang} onNavigate={navigate} />
        )}

        {/* VIEW: HOME, ALL EMOJIS, POPULAR, OR DETAIL (as underlying view) */}
        {(route.view === 'home' || route.view === 'emoji' || route.view === 'popular' || route.view === 'detail') && (
          <div>
            {/* Hero Search Section */}
            <HeroSearch
              currentLang={currentLang}
              emojis={categoryBasePool}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectEmoji={(id) => navigate({ view: 'detail', emojiId: id }, true)}
              onCopyEmoji={handleCopy}
            />

            {/* Recently Used Bar */}
            <RecentEmojis
              currentLang={currentLang}
              recentList={recentList}
              onCopyEmoji={handleCopy}
              onClearRecent={handleClearRecents}
            />

            {/* SEARCH RESULTS MODE */}
            {searchQuery.trim() ? (
              <div id="search-results-section" className="my-8">
                {/* Category navigation bar inside search mode */}
                {renderCategoryBar('search')}

                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                    "{searchQuery}"
                    {selectedCategory !== 'all' && (
                      <span className="text-amber-600 dark:text-amber-400 ml-1.5 font-normal text-base sm:text-lg">
                        · {t.emojiCategories[selectedCategory] || selectedCategory}
                      </span>
                    )}
                    <span className="ml-1.5 font-normal text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                      {t.searchResults}
                    </span>
                  </h2>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                    {filteredEmojis.length} {t.searchCount}
                  </span>
                </div>

                {filteredEmojis.length > 0 ? (
                  <>
                    {/* Natural Ad Placement between Search Result Header and Emoji Cards */}
                    <AdSlot id="search-ad" className="my-3 sm:my-4" />

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                      {filteredEmojis.slice(0, visibleCount).map((emoji) => (
                        <EmojiCard
                          key={emoji.id}
                          emoji={emoji}
                          currentLang={currentLang}
                          onCopy={handleCopy}
                          onSelect={(id) => navigate({ view: 'detail', emojiId: id }, true)}
                          isFavorite={favoriteIds.includes(emoji.id)}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </div>

                    {filteredEmojis.length > visibleCount && (
                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          id="btn-search-load-more"
                          onClick={() => setVisibleCount((prev) => prev + 96)}
                          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          {t.loadMore} (+96)
                        </button>
                        <button
                          id="btn-search-show-all"
                          onClick={() => setVisibleCount(filteredEmojis.length)}
                          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 font-semibold text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all cursor-pointer active:scale-95"
                        >
                          {t.viewAllEmojis} ({filteredEmojis.length})
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16 px-4 bg-white dark:bg-neutral-800/60 rounded-3xl border border-neutral-200 dark:border-neutral-700/80">
                    <span className="text-5xl block mb-3">🔍</span>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-1">
                      {t.noResults}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-5">
                      {t.noResultsTip}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {selectedCategory !== 'all' && (
                        <button
                          type="button"
                          onClick={() => handleCategoryClick('all')}
                          className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
                        >
                          {t.emojiCategories.all} ({categoryCounts.all.toLocaleString()})
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
                      >
                        {t.clearSearch}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : route.view === 'home' ? (
              /* =================================================== */
              /* VIEW: HOME (Optimized ~40 Preview + Exploration CTA) */
              /* =================================================== */
              <>
                {/* Ad Placement between Search Area and Emoji Content */}
                <AdSlot id="home-ad" className="my-3 sm:my-4" />

                {/* 1. Representative Emoji Preview Section */}
                <section id="emojis-preview-section" className="my-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                          {t.allEmojiTitle}
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                          {t.brandTagline}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate({ view: 'emoji', categoryId: undefined })}
                      className="hidden sm:flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      <span>{t.viewAllEmojis}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Category Filter Pills / Quick Links */}
                  {renderCategoryBar('home')}

                  {/* Representative 40 Emojis Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {homePreviewEmojis.map((emoji) => (
                      <EmojiCard
                        key={emoji.id}
                        emoji={emoji}
                        currentLang={currentLang}
                        onCopy={handleCopy}
                        onSelect={(id) => navigate({ view: 'detail', emojiId: id }, true)}
                        isFavorite={favoriteIds.includes(emoji.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>

                  {/* Prominent "View All Emojis" CTA Button */}
                  <div className="mt-8 flex justify-center">
                    <button
                      id="btn-view-all-emojis"
                      onClick={() => navigate({ view: 'emoji', categoryId: undefined })}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-sm sm:text-base hover:bg-neutral-800 dark:hover:bg-neutral-100 hover:shadow-lg transition-all duration-150 cursor-pointer active:scale-95"
                    >
                      <span>{t.viewAllEmojis}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-700 dark:bg-neutral-200 text-neutral-200 dark:text-neutral-700 font-mono font-medium">
                        {EMOJIS.length}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </section>

                {/* 2. Special Symbols Preview on Home */}
                <section id="symbols-preview-section" className="my-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700/80">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                        {t.symbolsTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                        {t.symbolsDesc}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate({ view: 'symbols' })}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
                    >
                      더보기 →
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {['♡', '♥', '★', '☆', '✦', '✧', '✿', '❀', '→', '←', '↑', '↓', '∞', '±', '【 】', '『 』', '༺ ༻', 'ੈ✩‧₊˚'].map((char, i) => (
                      <button
                        key={i}
                        onClick={() => handleCopy(char)}
                        className="w-11 h-11 text-lg rounded-xl bg-neutral-50 dark:bg-neutral-700/60 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white font-mono flex items-center justify-center transition-all cursor-pointer active:scale-90"
                        title={`${char} - ${t.clickToCopy}`}
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                </section>

                {/* 4. Emoticons (Kaomoji) Preview on Home */}
                <section id="emoticons-preview-section" className="my-12 p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700/80">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                        {t.emoticonsTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                        {t.emoticonsDesc}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate({ view: 'emoticons' })}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
                    >
                      더보기 →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
                    {['(｡♥‿♥｡)', '¯\\_(ツ)_/¯', '(づ｡◕‿‿◕｡)づ', '(๑>ᴗ<๑)', '(๑˃̵ᴗ˂̵)و', '٩(๑❛ᴗ❛๑)۶', '(人\'v`*)', '( ˘ ³˘)♥'].map((text, i) => (
                      <button
                        key={i}
                        onClick={() => handleCopy(text)}
                        className="py-2.5 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/60 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white font-mono text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer active:scale-95 text-center truncate"
                        title={`${text} - ${t.clickToCopy}`}
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              /* =================================================== */
              /* VIEW: ALL EMOJIS EXPLORATION (/emoji/ or /emoji/:cat) */
              /* =================================================== */
              <section id="categories-section" className="my-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {selectedCategory === 'popular' ? (
                      <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                    ) : (
                      <Grid className="w-5 h-5 text-amber-500" />
                    )}
                    <div>
                      <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                        {selectedCategory === 'popular'
                          ? t.popularTitle
                          : t.emojiCategories[selectedCategory] ||
                            (selectedCategory === 'all' ? t.allEmojiTitle : t.categoriesTitle)}
                      </h1>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                        {selectedCategory === 'all'
                          ? t.allEmojiDesc
                          : selectedCategory === 'popular'
                          ? t.popularDesc
                          : EMOJI_CATEGORIES.find((c) => c.id === selectedCategory)?.descriptions[currentLang] || t.allEmojiDesc}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-mono">
                    {filteredEmojis.length.toLocaleString()} {t.navEmoji}
                  </span>
                </div>

                {/* Category Filter Tabs */}
                {renderCategoryBar('explore')}

                {/* Natural Ad Placement between Category/Popular Header and Emoji Cards */}
                <AdSlot id="category-popular-ad" className="my-3 sm:my-4" />

                {/* Main Emoji Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {filteredEmojis.slice(0, visibleCount).map((emoji) => (
                    <EmojiCard
                      key={emoji.id}
                      emoji={emoji}
                      currentLang={currentLang}
                      onCopy={handleCopy}
                      onSelect={(id) => navigate({ view: 'detail', emojiId: id }, true)}
                      isFavorite={favoriteIds.includes(emoji.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>

                {/* Load More & Expand All Controls */}
                {filteredEmojis.length > visibleCount && (
                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      id="btn-load-more"
                      onClick={() => setVisibleCount((prev) => prev + 96)}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {t.loadMore} (+96)
                    </button>
                    <button
                      id="btn-show-all"
                      onClick={() => setVisibleCount(filteredEmojis.length)}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 font-semibold text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all cursor-pointer active:scale-95"
                    >
                      {t.viewAllEmojis} ({filteredEmojis.length.toLocaleString()})
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* EMOJI DETAIL MODAL / BOTTOM SHEET */}
        {route.view === 'detail' && currentDetailEmoji && (
          <EmojiDetail
            emoji={currentDetailEmoji}
            currentLang={currentLang}
            onCopy={handleCopy}
            onNavigate={navigate}
            onShare={handleShare}
            onClose={handleCloseDetail}
            isFavorite={favoriteIds.includes(currentDetailEmoji.id)}
            onToggleFavorite={handleToggleFavorite}
            favoriteIds={favoriteIds}
          />
        )}
      </main>

      {/* Global Toast Notification */}
      <Toast message={toastMessage} />

      {/* Global Footer */}
      <Footer currentLang={currentLang} onLanguageChange={handleLanguageChange} onNavigate={navigate} />
    </div>
  );
}
