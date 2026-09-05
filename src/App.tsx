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
} from './utils/storage';
import { copyToClipboard } from './utils/clipboard';
import { searchEmojis } from './utils/search';
import { updateMetaTags } from './utils/seo';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSearch } from './components/HeroSearch';
import { RecentEmojis } from './components/RecentEmojis';
import { EmojiCard } from './components/EmojiCard';
import { EmojiDetail } from './components/EmojiDetail';
import { SymbolsView } from './components/SymbolsView';
import { EmoticonsView } from './components/EmoticonsView';
import { StaticPages } from './components/StaticPages';
import { AdSlot } from './components/AdSlot';
import { Toast } from './components/Toast';
import { Sparkles, ArrowRight, Grid, Flame } from 'lucide-react';

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
    if (first === 'emoji') {
      if (segments[1]) {
        // Check if segment 1 is a known category or emoji id
        const isCat = EMOJI_CATEGORIES.some((c) => c.id === segments[1]);
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
  const [selectedCategory, setSelectedCategory] = useState<string>(route.categoryId || 'all');
  const [recentList, setRecentList] = useState<string[]>(() => getRecentEmojis());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentLang = route.lang;
  const t = translations[currentLang];

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
    (newRoutePartial: Partial<RouteState>) => {
      const nextRoute: RouteState = {
        ...route,
        ...newRoutePartial,
      };

      setRoute(nextRoute);

      let path = `/${nextRoute.lang}/`;
      if (nextRoute.view === 'emoji') {
        path += nextRoute.categoryId && nextRoute.categoryId !== 'all' ? `emoji/${nextRoute.categoryId}/` : `emoji/`;
      } else if (nextRoute.view === 'detail' && nextRoute.emojiId) {
        path += `emoji/${nextRoute.emojiId}/`;
      } else if (nextRoute.view !== 'home') {
        path += `${nextRoute.view}/`;
      }

      if (nextRoute.searchQuery) {
        path += `?q=${encodeURIComponent(nextRoute.searchQuery)}`;
      }

      window.history.pushState(null, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const emoji = EMOJIS.find((e) => e.id === route.emojiId);
      if (emoji) {
        const name = emoji.names[currentLang] || emoji.names.en;
        emojiChar = emoji.emoji;
        title = `${name} – ${t.brandName}`;
        desc = emoji.description ? emoji.description[currentLang] || emoji.description.en : `${name} ${emoji.emoji}`;
      }
    } else if (route.view === 'emoji') {
      if (route.categoryId) {
        const cat = EMOJI_CATEGORIES.find((c) => c.id === route.categoryId);
        const catName = cat ? cat.names[currentLang] || cat.names.en : t.categoriesTitle;
        title = `${catName} – ${t.brandName}`;
      } else {
        title = `${t.allEmojiTitle} – ${t.brandName}`;
      }
      desc = t.allEmojiDesc;
    } else if (route.view === 'symbols') {
      title = `${t.symbolsTitle} – ${t.brandName}`;
      desc = t.symbolsDesc;
    } else if (route.view === 'emoticons') {
      title = t.emoticonsMetaTitle;
      desc = t.emoticonsMetaDesc;
    } else if (route.view === 'popular') {
      title = `${t.popularTitle} – ${t.brandName}`;
      desc = t.popularDesc;
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

  // Language switch
  const handleLanguageChange = (lang: Language) => {
    setStoredLanguage(lang);
    navigate({ lang });
  };

  // Theme toggle
  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchEmojis(EMOJIS, searchQuery, currentLang);
  }, [searchQuery, currentLang]);

  // Filtered Emojis for the main grid
  const displayedEmojis = useMemo(() => {
    if (selectedCategory === 'all') return EMOJIS;
    return EMOJIS.filter((e) => e.category === selectedCategory);
  }, [selectedCategory]);

  const popularEmojis = useMemo(() => {
    return EMOJIS.filter((e) => e.isPopular);
  }, []);

  // Find active detail emoji if on detail view
  const currentDetailEmoji = useMemo(() => {
    if (route.view === 'detail' && route.emojiId) {
      return EMOJIS.find((e) => e.id === route.emojiId);
    }
    return null;
  }, [route]);

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
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6">
        {/* VIEW: EMOJI DETAIL */}
        {route.view === 'detail' && currentDetailEmoji && (
          <EmojiDetail
            emoji={currentDetailEmoji}
            currentLang={currentLang}
            onCopy={handleCopy}
            onNavigate={navigate}
            onShare={handleShare}
          />
        )}

        {/* VIEW: SYMBOLS */}
        {route.view === 'symbols' && (
          <SymbolsView currentLang={currentLang} onCopy={handleCopy} />
        )}

        {/* VIEW: EMOTICONS */}
        {route.view === 'emoticons' && (
          <EmoticonsView currentLang={currentLang} onCopy={handleCopy} />
        )}

        {/* VIEW: POPULAR EMOJIS */}
        {route.view === 'popular' && (
          <div className="py-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                <Flame className="w-8 h-8 text-amber-500 fill-amber-500" />
                <span>{t.popularTitle}</span>
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t.popularDesc}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {popularEmojis.map((emoji) => (
                <EmojiCard
                  key={emoji.id}
                  emoji={emoji}
                  currentLang={currentLang}
                  onCopy={handleCopy}
                  onSelect={(id) => navigate({ view: 'detail', emojiId: id })}
                />
              ))}
            </div>
            <AdSlot id="popular-ad" className="mt-12" />
          </div>
        )}

        {/* VIEW: STATIC POLICIES (ABOUT / CONTACT / PRIVACY / TERMS) */}
        {['about', 'contact', 'privacy', 'terms'].includes(route.view) && (
          <StaticPages type={route.view as any} currentLang={currentLang} onNavigate={navigate} />
        )}

        {/* VIEW: HOME OR ALL EMOJIS */}
        {(route.view === 'home' || route.view === 'emoji') && (
          <div>
            {/* Hero Search Section */}
            <HeroSearch
              currentLang={currentLang}
              emojis={EMOJIS}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectEmoji={(id) => navigate({ view: 'detail', emojiId: id })}
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
                <div className="flex items-center justify-between mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                    "{searchQuery}" {t.searchResults}
                  </h2>
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                    {searchResults.length} {t.searchCount}
                  </span>
                </div>

                {searchResults.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                      {searchResults.map((emoji) => (
                        <EmojiCard
                          key={emoji.id}
                          emoji={emoji}
                          currentLang={currentLang}
                          onCopy={handleCopy}
                          onSelect={(id) => navigate({ view: 'detail', emojiId: id })}
                        />
                      ))}
                    </div>
                    <AdSlot id="search-ad" className="mt-10" />
                  </>
                ) : (
                  <div className="text-center py-16 px-4 bg-white dark:bg-neutral-800/60 rounded-3xl border border-neutral-200 dark:border-neutral-700/80">
                    <span className="text-5xl block mb-3">🔍</span>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white mb-1">
                      {t.noResults}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                      {t.noResultsTip}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* DEFAULT HOME / BROWSE CONTENT */
              <>
                {/* 1. Popular Section on Home */}
                {route.view === 'home' && (
                  <section id="popular-section" className="my-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                          {t.popularTitle}
                        </h2>
                      </div>
                      <button
                        onClick={() => navigate({ view: 'popular' })}
                        className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        <span>전체보기</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                      {popularEmojis.slice(0, 12).map((emoji) => (
                        <EmojiCard
                          key={emoji.id}
                          emoji={emoji}
                          currentLang={currentLang}
                          onCopy={handleCopy}
                          onSelect={(id) => navigate({ view: 'detail', emojiId: id })}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* 2. Non-intrusive AdSlot */}
                <AdSlot id="home-ad-middle" />

                {/* 3. Category Filter Tabs */}
                <section id="categories-section" className="my-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Grid className="w-5 h-5 text-amber-500" />
                      <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                        {t.categoriesTitle}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                          : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                      }`}
                    >
                      전체 ({EMOJIS.length})
                    </button>
                    {EMOJI_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                          selectedCategory === cat.id
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.names[currentLang] || cat.names.en}</span>
                      </button>
                    ))}
                  </div>

                  {/* Main Emoji Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                    {displayedEmojis.map((emoji) => (
                      <EmojiCard
                        key={emoji.id}
                        emoji={emoji}
                        currentLang={currentLang}
                        onCopy={handleCopy}
                        onSelect={(id) => navigate({ view: 'detail', emojiId: id })}
                      />
                    ))}
                  </div>
                </section>

                {/* 4. Special Symbols Preview on Home */}
                {route.view === 'home' && (
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
                )}

                {/* 5. Emoticons (Kaomoji) Preview on Home */}
                {route.view === 'home' && (
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
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Global Toast Notification */}
      <Toast message={toastMessage} />

      {/* Global Footer */}
      <Footer currentLang={currentLang} onLanguageChange={handleLanguageChange} onNavigate={navigate} />
    </div>
  );
}
