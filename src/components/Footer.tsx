import React from 'react';
import { Language, RouteState } from '../types';
import { SUPPORTED_LANGUAGES, translations } from '../locales/translations';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (route: Partial<RouteState>) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onLanguageChange, onNavigate }) => {
  const t = translations[currentLang];

  return (
    <footer
      id="main-footer"
      className="mt-16 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111315] text-neutral-600 dark:text-neutral-400 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-lg">
              <span>😊</span>
              <span>{t.brandName}</span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t.brandTagline}
            </p>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              Official: <span className="font-mono text-neutral-700 dark:text-neutral-300">https://emoji.modoo.co</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate({ view: 'emoji', emojiId: undefined })}
                  className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.navEmoji}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ view: 'symbols', emojiId: undefined })}
                  className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.navSymbols}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ view: 'emoticons', emojiId: undefined })}
                  className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.navEmoticons}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ view: 'popular', categoryId: 'popular', emojiId: undefined })}
                  className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.navPopular}
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Info */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
              Information
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate({ view: 'about', emojiId: undefined })}
                  className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ view: 'contact', emojiId: undefined })}
                  className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.navContact}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ view: 'privacy', emojiId: undefined })}
                  className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.navPrivacy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate({ view: 'terms', emojiId: undefined })}
                  className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {t.navTerms}
                </button>
              </li>
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
              Languages
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    currentLang === lang.code
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-600 dark:text-neutral-400">
          <div>© 2026 {t.brandName}. All rights reserved.</div>
          <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
            Unicode® Emoji standard compliant.
          </div>
        </div>
      </div>
    </footer>
  );
};
