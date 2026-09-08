import { EmojiItem } from '../types';
import { EMOJIS } from '../data/emojis';

/**
 * Find an emoji by its unique slug ID, its actual character, or hexadecimal unicode.
 * Supports /emoji/red-heart, /emoji/2764, /emoji/U+2764, /emoji/1f600, etc.
 */
export function findEmojiByIdOrCode(idOrCode: string | undefined): EmojiItem | undefined {
  if (!idOrCode) return undefined;
  const decoded = decodeURIComponent(idOrCode).trim();
  const lower = decoded.toLowerCase();

  // 1. Direct ID exact match
  const byId = EMOJIS.find((e) => e.id.toLowerCase() === lower);
  if (byId) return byId;

  // 2. Direct character match
  const byChar = EMOJIS.find((e) => e.emoji === decoded);
  if (byChar) return byChar;

  // 3. Hex code match (e.g. '2764', 'u+2764', '1f600', 'u+1f600')
  const cleanHex = lower.replace(/^u\+/, '');
  const byUnicode = EMOJIS.find((e) => {
    const uHex = e.unicode.toLowerCase().replace(/^u\+/, '');
    return uHex === cleanHex;
  });
  if (byUnicode) return byUnicode;

  return undefined;
}

/**
 * Computes up to 8 related emojis based on:
 * 1. Curated related array (if present in data)
 * 2. Same subcategory (highest priority)
 * 3. Same category
 * 4. Overlapping keywords / tags (current lang and english)
 * 5. Popular counterparts bonus
 *
 * Excludes the current target emoji.
 */
export function getRelatedEmojis(target: EmojiItem, allEmojis: EmojiItem[] = EMOJIS): EmojiItem[] {
  const result: EmojiItem[] = [];
  const seenIds = new Set<string>([target.id]);

  // 1. Curated related array prioritized if available
  if (target.related && target.related.length > 0) {
    for (const item of target.related) {
      const match = allEmojis.find((e) => (e.emoji === item || e.id === item) && !seenIds.has(e.id));
      if (match) {
        seenIds.add(match.id);
        result.push(match);
        if (result.length >= 8) return result;
      }
    }
  }

  // 2. Score candidates by subcategory, category, keyword overlap
  const targetKeywordsEn = new Set(
    (target.keywords?.en || []).map((k) => k.toLowerCase().trim()).filter((k) => k.length > 1)
  );
  const targetKeywordsKo = new Set(
    (target.keywords?.ko || []).map((k) => k.toLowerCase().trim()).filter((k) => k.length > 1)
  );

  const candidates: { item: EmojiItem; score: number }[] = [];

  for (const item of allEmojis) {
    if (seenIds.has(item.id)) continue;
    let score = 0;

    // 1. Same subcategory
    if (item.subcategory && target.subcategory && item.subcategory === target.subcategory) {
      score += 40;
    }

    // 2. Same category
    if (item.category === target.category) {
      score += 10;
    }

    // 3. Keyword / tag overlap
    if (item.keywords?.en) {
      for (const k of item.keywords.en) {
        const lowerK = k.toLowerCase().trim();
        if (lowerK.length > 1 && targetKeywordsEn.has(lowerK)) {
          score += 8;
        }
      }
    }
    if (item.keywords?.ko) {
      for (const k of item.keywords.ko) {
        const lowerK = k.toLowerCase().trim();
        if (lowerK.length > 1 && targetKeywordsKo.has(lowerK)) {
          score += 8;
        }
      }
    }

    // 4. Natural affinity / popular counterpart
    if (item.isPopular) {
      score += 2;
    }

    if (score > 0) {
      candidates.push({ item, score });
    }
  }

  // Sort descending by relevance score
  candidates.sort((a, b) => b.score - a.score);

  for (const c of candidates) {
    result.push(c.item);
    seenIds.add(c.item.id);
    if (result.length >= 8) break;
  }

  return result;
}
