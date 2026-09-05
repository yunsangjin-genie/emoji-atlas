import { Language } from '../types';

const RECENT_KEY = 'modooEmojiRecent';
const THEME_KEY = 'modooEmojiTheme';
const LANG_KEY = 'modooEmojiLang';

export function getRecentEmojis(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
  } catch {
    return [];
  }
}

export function saveRecentEmoji(emoji: string): string[] {
  if (!emoji) return getRecentEmojis();
  try {
    const existing = getRecentEmojis().filter((item) => item !== emoji);
    const updated = [emoji, ...existing].slice(0, 30);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearRecentEmojis(): void {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch (err) {
    console.error('Failed to clear recent emojis', err);
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // fallback
  }
  return 'light';
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error('Failed to save theme', err);
  }
}

export function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored && ['ko', 'en', 'ja', 'zh-hans', 'zh-hant', 'es', 'fr', 'de'].includes(stored)) {
      return stored as Language;
    }
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith('ko')) return 'ko';
    if (navLang.startsWith('ja')) return 'ja';
    if (navLang.startsWith('zh-cn') || navLang === 'zh-hans') return 'zh-hans';
    if (navLang.startsWith('zh-tw') || navLang.startsWith('zh-hk') || navLang === 'zh-hant') return 'zh-hant';
    if (navLang.startsWith('es')) return 'es';
    if (navLang.startsWith('fr')) return 'fr';
    if (navLang.startsWith('de')) return 'de';
    if (navLang.startsWith('en')) return 'en';
  } catch {
    // fallback
  }
  return 'ko';
}

export function setStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch (err) {
    console.error('Failed to save language', err);
  }
}
