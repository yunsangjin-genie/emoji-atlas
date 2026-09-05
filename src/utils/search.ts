import { EmojiItem, Language } from '../types';

export function normalizeSearchString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

export function searchEmojis(emojis: EmojiItem[], query: string, currentLang: Language): EmojiItem[] {
  const cleanQuery = normalizeSearchString(query);
  if (!cleanQuery) return [];

  // Support multi-word searches (e.g. "red heart" or "파란 하트")
  const queryTokens = cleanQuery.split(' ').filter((t) => t.length > 0);

  const scoredResults: { emoji: EmojiItem; score: number }[] = [];

  for (const item of emojis) {
    let score = 0;

    // 1. Direct Emoji Character match
    if (item.emoji === query.trim()) {
      score += 1000;
    }

    const currentName = normalizeSearchString(item.names[currentLang] || '');
    const enName = normalizeSearchString(item.names.en || '');
    const unicodeStr = normalizeSearchString(item.unicode);
    const categoryStr = normalizeSearchString(item.category);

    const currentKeywords = (item.keywords[currentLang] || []).map(normalizeSearchString);
    const enKeywords = (item.keywords.en || []).map(normalizeSearchString);

    let allTokensMatched = true;

    for (const token of queryTokens) {
      let tokenMatched = false;

      // Current language name exact match
      if (currentName === token) {
        score += 300;
        tokenMatched = true;
      } else if (currentName.startsWith(token)) {
        score += 180;
        tokenMatched = true;
      } else if (currentName.includes(token)) {
        score += 100;
        tokenMatched = true;
      }

      // Current language keyword matches
      if (currentKeywords.includes(token)) {
        score += 150;
        tokenMatched = true;
      } else if (currentKeywords.some((k) => k.startsWith(token))) {
        score += 80;
        tokenMatched = true;
      } else if (currentKeywords.some((k) => k.includes(token))) {
        score += 40;
        tokenMatched = true;
      }

      // English name match fallback
      if (enName === token) {
        score += 120;
        tokenMatched = true;
      } else if (enName.startsWith(token)) {
        score += 70;
        tokenMatched = true;
      } else if (enName.includes(token)) {
        score += 35;
        tokenMatched = true;
      }

      // English keyword match fallback
      if (enKeywords.includes(token)) {
        score += 60;
        tokenMatched = true;
      } else if (enKeywords.some((k) => k.includes(token))) {
        score += 25;
        tokenMatched = true;
      }

      // Unicode hex code matching
      const cleanToken = token.replace(/^u\+/, '');
      if (unicodeStr.includes(cleanToken)) {
        score += 50;
        tokenMatched = true;
      }

      // Category matching
      if (categoryStr.includes(token)) {
        score += 20;
        tokenMatched = true;
      }

      if (!tokenMatched) {
        allTokensMatched = false;
      }
    }

    if (allTokensMatched && score > 0) {
      scoredResults.push({ emoji: item, score });
    }
  }

  // Sort descending by relevance score
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.map((r) => r.emoji);
}
