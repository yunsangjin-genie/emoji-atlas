import React, { useState, useRef, useEffect } from 'react';
import { Language, RouteState } from '../types';
import { SUPPORTED_LANGUAGES, translations } from '../locales/translations';
import { Sun, Moon, Globe, Menu, X, ChevronDown, Star } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentTheme: 'light' | 'dark';
  onThemeToggle: () => void;
  route: RouteState;
  onNavigate: (route: Partial<RouteState>) => void;
  favoritesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  currentTheme,
  onThemeToggle,
  route,
  onNavigate,
  favoritesCount = 0,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const t = translations[currentLang];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const handleNav = (view: RouteState['view']) => {
    if (view === 'popular') {
      onNavigate({ view: 'popular', categoryId: 'popular', emojiId: undefined, searchQuery: undefined });
    } else {
      onNavigate({ view, emojiId: undefined, categoryId: undefined, searchQuery: undefined });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#111315]/90 border-b border-neutral-200 dark:border-neutral-800 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
          aria-label={t.brandName}
        >
          <span className="text-2xl sm:text-3xl select-none group-hover:scale-110 transition-transform duration-150">
            😊
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-lg sm:text-xl tracking-tight text-neutral-900 dark:text-white leading-none">
              {t.brandName}
            </span>
            <span className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-tight hidden sm:inline">
              emoji.modoo.co
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          <button
            id="nav-link-emoji"
            onClick={() => handleNav('emoji')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              route.view === 'emoji' && route.categoryId !== 'popular'
                ? 'bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
            }`}
          >
            {t.navEmoji}
          </button>
          <button
            id="nav-link-symbols"
            onClick={() => handleNav('symbols')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              route.view === 'symbols'
                ? 'bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
            }`}
          >
            {t.navSymbols}
          </button>
          <button
            id="nav-link-emoticons"
            onClick={() => handleNav('emoticons')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              route.view === 'emoticons'
                ? 'bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
            }`}
          >
            {t.navEmoticons}
          </button>
          <button
            id="nav-link-popular"
            onClick={() => handleNav('popular')}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              route.view === 'popular' || (route.view === 'emoji' && route.categoryId === 'popular')
                ? 'bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
            }`}
          >
            {t.navPopular}
          </button>
          <button
            id="nav-link-favorites"
            onClick={() => handleNav('favorites')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              route.view === 'favorites'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
            }`}
          >
            <Star
              className={`w-4 h-4 ${
                favoritesCount > 0
                  ? 'fill-amber-400 text-amber-500 dark:text-amber-400'
                  : 'text-neutral-400 dark:text-neutral-500'
              }`}
            />
            <span>{t.navFavorites}</span>
            {favoritesCount > 0 && (
              <span
                id="header-nav-favorites-count"
                className="px-1.5 py-0.2 rounded-full text-[11px] font-bold font-mono bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300"
              >
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Actions: Quick Favorites + Language + Theme + Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Favorites Access Button */}
          <button
            id="header-quick-favorites-btn"
            onClick={() => handleNav('favorites')}
            className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
              route.view === 'favorites'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title={t.navFavorites}
            aria-label={t.navFavorites}
          >
            <Star
              className={`w-5 h-5 ${
                favoritesCount > 0
                  ? 'fill-amber-400 text-amber-500 dark:text-amber-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            />
            {favoritesCount > 0 && (
              <span
                id="header-quick-favorites-count"
                className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold font-mono flex items-center justify-center shadow-xs"
              >
                {favoritesCount > 99 ? '99+' : favoritesCount}
              </span>
            )}
          </button>

          {/* Language Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              id="language-selector-btn"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors cursor-pointer"
              aria-expanded={langMenuOpen}
              aria-label={t.languageSelect}
            >
              <span className="text-base">{currentLangObj.flag}</span>
              <span className="hidden sm:inline">{currentLangObj.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
            </button>

            {langMenuOpen && (
              <div
                id="language-dropdown-menu"
                className="absolute right-0 mt-2 w-48 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl z-50 text-sm"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left transition-colors cursor-pointer ${
                      currentLang === lang.code
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    {currentLang === lang.code && <span className="text-xs text-amber-600 dark:text-amber-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onThemeToggle}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label={currentTheme === 'dark' ? t.themeLight : t.themeDark}
            title={currentTheme === 'dark' ? t.themeLight : t.themeDark}
          >
            {currentTheme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-neutral-700" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Open Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111315] px-4 py-3 space-y-1"
        >
          <button
            id="mobile-nav-link-home"
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              route.view === 'home'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            {t.navHome}
          </button>
          <button
            id="mobile-nav-link-emoji"
            onClick={() => handleNav('emoji')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              route.view === 'emoji' && route.categoryId !== 'popular'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            {t.navEmoji}
          </button>
          <button
            id="mobile-nav-link-symbols"
            onClick={() => handleNav('symbols')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              route.view === 'symbols'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            {t.navSymbols}
          </button>
          <button
            id="mobile-nav-link-emoticons"
            onClick={() => handleNav('emoticons')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              route.view === 'emoticons'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            {t.navEmoticons}
          </button>
          <button
            id="mobile-nav-link-popular"
            onClick={() => handleNav('popular')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              route.view === 'popular' || (route.view === 'emoji' && route.categoryId === 'popular')
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            {t.navPopular}
          </button>
          <button
            id="mobile-nav-link-favorites"
            onClick={() => handleNav('favorites')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
              route.view === 'favorites'
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
                : 'text-neutral-600 dark:text-neutral-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Star
                className={`w-4 h-4 ${
                  favoritesCount > 0
                    ? 'fill-amber-400 text-amber-500 dark:text-amber-400'
                    : 'text-neutral-400'
                }`}
              />
              <span>{t.navFavorites}</span>
            </span>
            {favoritesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
