import emoticonsData from '../../data/emoticons.json';
import { translations } from '../locales/translations';
import { Emoticon, Language } from '../types';

/**
 * Type-cast the imported JSON array to Emoticon[]
 */
const EMOTICONS_DATA: Emoticon[] = emoticonsData as Emoticon[];

/**
 * Standardize locale string to handle variations like 'zh-hans' vs 'zh-Hans'
 */
function normalizeLocale(locale: string): string {
  if (!locale) return 'en';
  const lower = locale.toLowerCase();
  if (lower === 'zh-hans') return 'zh-Hans';
  if (lower === 'zh-hant') return 'zh-Hant';
  return lower;
}

/**
 * Returns all emoticons in the database.
 */
export function getAllEmoticons(): Emoticon[] {
  return EMOTICONS_DATA;
}

/**
 * Finds an emoticon by its unique ID.
 */
export function getEmoticonById(id: string): Emoticon | undefined {
  if (!id) return undefined;
  const targetId = id.trim().toLowerCase();
  return EMOTICONS_DATA.find((item) => item.id.toLowerCase() === targetId);
}

/**
 * Returns all emoticons belonging to a specific category.
 */
export function getEmoticonsByCategory(category: string): Emoticon[] {
  if (!category || category === 'all') return EMOTICONS_DATA;
  const targetCategory = category.trim().toLowerCase();
  return EMOTICONS_DATA.filter((item) => item.category.toLowerCase() === targetCategory);
}

/**
 * Gets the localized name of an emoticon.
 * Supports locale fallback: requested locale -> normalized locale -> 'en' -> 'ko' -> first available.
 */
export function getEmoticonName(emoticon: Emoticon, locale: string = 'en'): string {
  if (!emoticon || !emoticon.names) return '';
  const normalized = normalizeLocale(locale);

  if (emoticon.names[locale]) return emoticon.names[locale];
  if (emoticon.names[normalized]) return emoticon.names[normalized];
  if (emoticon.names[locale.toLowerCase()]) return emoticon.names[locale.toLowerCase()];
  if (emoticon.names['en']) return emoticon.names['en'];
  if (emoticon.names['ko']) return emoticon.names['ko'];

  const values = Object.values(emoticon.names);
  return values.length > 0 ? values[0] : '';
}

/**
 * Gets the localized keywords array of an emoticon.
 * Falls back to 'en' or 'ko' or empty array if not present.
 */
export function getEmoticonKeywords(emoticon: Emoticon, locale: string = 'en'): string[] {
  if (!emoticon || !emoticon.keywords) return [];
  const normalized = normalizeLocale(locale);

  if (emoticon.keywords[locale] && emoticon.keywords[locale].length > 0) {
    return emoticon.keywords[locale];
  }
  if (emoticon.keywords[normalized] && emoticon.keywords[normalized].length > 0) {
    return emoticon.keywords[normalized];
  }
  if (emoticon.keywords[locale.toLowerCase()] && emoticon.keywords[locale.toLowerCase()].length > 0) {
    return emoticon.keywords[locale.toLowerCase()];
  }
  if (emoticon.keywords['en'] && emoticon.keywords['en'].length > 0) {
    return emoticon.keywords['en'];
  }
  if (emoticon.keywords['ko'] && emoticon.keywords['ko'].length > 0) {
    return emoticon.keywords['ko'];
  }

  return [];
}

/**
 * Cleans text for accent-insensitive, lowercase search matching.
 */
function cleanSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Searches emoticons based on query string and locale.
 * Independent search system completely decoupled from emoji search.
 */
export function searchEmoticons(query: string, locale: string = 'en'): Emoticon[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return getAllEmoticons();
  }

  const cleanQuery = cleanSearchText(trimmed);
  const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

  const lang = (locale.toLowerCase() as Language);
  const localizedCategories = translations[lang]?.emoticonCategories || translations['en']?.emoticonCategories || {};

  // Score each emoticon
  const scoredResults: { emoticon: Emoticon; score: number }[] = [];

  for (const emoticon of EMOTICONS_DATA) {
    let score = 0;

    // 1. Exact or partial text match (user searches with actual emoticon characters)
    if (emoticon.text.includes(trimmed)) {
      score += 100;
    }

    // 2. ID match
    if (emoticon.id.toLowerCase() === cleanQuery) {
      score += 80;
    } else if (emoticon.id.toLowerCase().includes(cleanQuery)) {
      score += 40;
    }

    // 3. Current locale name matching (exact: 70, startsWith: 50, includes: 35)
    const currentName = cleanSearchText(getEmoticonName(emoticon, locale));
    if (currentName === cleanQuery) {
      score += 70;
    } else if (currentName.startsWith(cleanQuery)) {
      score += 50;
    } else if (currentName.includes(cleanQuery)) {
      score += 35;
    }

    // 4. Current locale keywords matching (exact: 40, includes: 20)
    const currentKeywords = getEmoticonKeywords(emoticon, locale).map(cleanSearchText);
    for (const kw of currentKeywords) {
      if (kw === cleanQuery) {
        score += 40;
      } else if (kw.includes(cleanQuery)) {
        score += 20;
      }
    }

    // 5. Tags matching (exact: 35, includes: 15)
    for (const tag of emoticon.tags) {
      const cleanTag = cleanSearchText(tag);
      if (cleanTag === cleanQuery) {
        score += 35;
      } else if (cleanTag.includes(cleanQuery)) {
        score += 15;
      }
    }

    // 6. Category (ID & localized label) / Subcategory matching
    const catLabel = cleanSearchText(localizedCategories[emoticon.category] || '');
    const catId = cleanSearchText(emoticon.category);
    if (catId === cleanQuery || catLabel === cleanQuery) {
      score += 30;
    } else if (catId.includes(cleanQuery) || catLabel.includes(cleanQuery)) {
      score += 15;
    }

    if (emoticon.subcategory && cleanSearchText(emoticon.subcategory).includes(cleanQuery)) {
      score += 15;
    }

    // 7. Multi-token partial & combined matching
    if (queryTokens.length > 1) {
      let matchedTokens = 0;
      for (const token of queryTokens) {
        if (
          currentName.includes(token) ||
          currentKeywords.some((kw) => kw.includes(token)) ||
          emoticon.tags.some((tag) => cleanSearchText(tag).includes(token)) ||
          catId.includes(token) ||
          catLabel.includes(token) ||
          (emoticon.subcategory && cleanSearchText(emoticon.subcategory).includes(token))
        ) {
          matchedTokens++;
          score += 15;
        }
      }
      if (matchedTokens === queryTokens.length) {
        score += 30; // bonus when every word in the multi-word query matched
      }
    }

    // 8. Cross-language fallback match (check all names in other languages if score is still 0)
    if (score === 0) {
      for (const name of Object.values(emoticon.names)) {
        if (cleanSearchText(name).includes(cleanQuery)) {
          score += 15;
          break;
        }
      }
    }

    if (score > 0) {
      scoredResults.push({ emoticon, score });
    }
  }

  // Sort descending by score
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.map((result) => result.emoticon);
}

/**
 * Storage key dedicated exclusively to recent emoticons.
 * Must NOT conflict with or touch the existing Emoji key ('modooEmojiRecent').
 */
export const RECENT_EMOTICONS_STORAGE_KEY = 'emojiAtlasRecentEmoticons';
export const MAX_RECENT_EMOTICONS = 12;

/**
 * Safely retrieves recently used emoticon IDs from localStorage.
 * Validates against emoticons database and returns at most 12 valid IDs.
 */
export function getRecentEmoticonIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_EMOTICONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const validIds: string[] = [];
    for (const item of parsed) {
      if (typeof item === 'string') {
        const id = item.trim();
        if (id && getEmoticonById(id) && !validIds.includes(id)) {
          validIds.push(id);
          if (validIds.length >= MAX_RECENT_EMOTICONS) break;
        }
      }
    }
    return validIds;
  } catch {
    return [];
  }
}

/**
 * Safely saves an emoticon ID into the recent emoticons list.
 * Deduplicates, brings the ID to the front, limits to 12 items, and returns the updated list.
 */
export function saveRecentEmoticonId(id: string): string[] {
  if (typeof window === 'undefined' || !id) return [];
  try {
    const trimmedId = id.trim();
    if (!getEmoticonById(trimmedId)) return getRecentEmoticonIds();

    const current = getRecentEmoticonIds();
    const filtered = current.filter((item) => item.toLowerCase() !== trimmedId.toLowerCase());
    const updated = [trimmedId, ...filtered].slice(0, MAX_RECENT_EMOTICONS);
    localStorage.setItem(RECENT_EMOTICONS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
