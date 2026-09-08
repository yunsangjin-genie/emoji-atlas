import { EmojiItem, Language } from '../types';

/**
 * Normalizes a search query or target string:
 * - Lowercase
 * - NFD diacritics stripping followed by NFC canonical composition
 * - German ß -> ss, ligatures œ -> oe, æ -> ae
 * - Whitespace trimming and collapse
 */
export function normalizeSearchString(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize('NFC')
    .replace(/ß/g, 'ss')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Strips whitespace, hyphens, colons, parentheses, and punctuation
 * for compact matching (e.g. "엄지척" <-> "엄지 척 (좋아요)", "thumbsup" <-> "thumbs up").
 */
export function normalizeCompact(str: string): string {
  if (!str) return '';
  return normalizeSearchString(str).replace(/[\s\-_():;,.!?'"\/\\+]+/g, '');
}

/**
 * Converts Japanese Hiragana to Katakana for unified Japanese phonetic search.
 */
function hiraToKata(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  );
}

/**
 * Checks if an emoji contains a skin tone modifier (U+1F3FB through U+1F3FF)
 * or explicit skin tone ID.
 */
function hasSkinToneModifier(item: EmojiItem): boolean {
  return /[\u{1F3FB}-\u{1F3FF}]/u.test(item.emoji) || (Boolean(item.id) && item.id.includes('-skin-tone'));
}

/**
 * Curated concept dictionary mapping high-frequency user intent keywords to canonical target emojis.
 * This guarantees that fundamental concepts (e.g. "하트", "heart", "love", "고양이", "개발자", "엄지척", "태극기")
 * always rank their most universally recognized emoji first.
 */
const CONCEPT_TARGETS: Record<string, string[]> = {
  // Heart & Love
  '하트': ['red-heart', 'sparkling-heart', 'heart-hands', 'smiling-face-with-hearts', 'smiling-face-with-heart-eyes'],
  '사랑': ['red-heart', 'smiling-face-with-hearts', 'smiling-face-with-heart-eyes', 'love-letter', 'heart-hands'],
  '애정': ['red-heart', 'smiling-face-with-hearts', 'smiling-face-with-heart-eyes'],
  '마음': ['red-heart', 'sparkling-heart', 'heart-hands'],
  '러브': ['red-heart', 'smiling-face-with-hearts', 'love-letter'],
  'heart': ['red-heart', 'sparkling-heart', 'heart-hands', 'smiling-face-with-hearts'],
  'love': ['red-heart', 'smiling-face-with-hearts', 'smiling-face-with-heart-eyes', 'love-letter'],
  'ハート': ['red-heart', 'sparkling-heart', 'heart-hands'],
  '愛': ['red-heart', 'smiling-face-with-hearts', 'smiling-face-with-heart-eyes'],
  '爱': ['red-heart', 'smiling-face-with-hearts', 'smiling-face-with-heart-eyes'],
  'corazon': ['red-heart', 'sparkling-heart'],
  'coeur': ['red-heart', 'sparkling-heart'],
  'herz': ['red-heart', 'sparkling-heart'],

  // Cat
  '고양이': ['cat-face', 'cat', 'black-cat'],
  '냥이': ['cat-face', 'cat'],
  '야옹이': ['cat-face', 'cat'],
  '반려묘': ['cat-face', 'cat'],
  '집사': ['cat-face', 'cat'],
  '고양': ['cat-face', 'cat'],
  'cat': ['cat-face', 'cat', 'black-cat'],
  'kitty': ['cat-face', 'cat'],
  'feline': ['cat-face', 'cat'],
  '猫': ['cat-face', 'cat', 'black-cat'],
  'ねこ': ['cat-face', 'cat'],
  'ネコ': ['cat-face', 'cat'],
  'gato': ['cat-face', 'cat'],
  'chat': ['cat-face', 'cat'],
  'katze': ['cat-face', 'cat'],

  // Dog
  '개': ['dog-face', 'dog', 'guide-dog'],
  '강아지': ['dog-face', 'dog', 'poodle'],
  '강아': ['dog-face', 'dog'],
  '댕댕이': ['dog-face', 'dog'],
  '멍멍이': ['dog-face', 'dog'],
  '반려견': ['dog-face', 'dog'],
  'dog': ['dog-face', 'dog', 'guide-dog'],
  'puppy': ['dog-face', 'dog'],
  'canine': ['dog-face', 'dog'],
  '犬': ['dog-face', 'dog'],
  'いぬ': ['dog-face', 'dog'],
  'イヌ': ['dog-face', 'dog'],
  '狗': ['dog-face', 'dog'],
  'perro': ['dog-face', 'dog'],
  'chien': ['dog-face', 'dog'],
  'hund': ['dog-face', 'dog'],

  // Developer & Technologist
  '개발자': ['technologist', 'man-technologist', 'woman-technologist'],
  '개발': ['technologist', 'man-technologist', 'woman-technologist', 'laptop'],
  '프로그래머': ['technologist', 'man-technologist', 'woman-technologist'],
  '코딩': ['technologist', 'man-technologist', 'woman-technologist', 'laptop'],
  '소프트웨어': ['technologist', 'man-technologist', 'woman-technologist', 'laptop'],
  'developer': ['technologist', 'man-technologist', 'woman-technologist'],
  'programmer': ['technologist', 'man-technologist', 'woman-technologist'],
  'coder': ['technologist', 'man-technologist', 'woman-technologist'],
  'software': ['technologist', 'man-technologist', 'woman-technologist', 'laptop'],
  'technologist': ['technologist', 'man-technologist', 'woman-technologist'],
  '開発者': ['technologist', 'man-technologist', 'woman-technologist'],
  '技術者': ['technologist', 'man-technologist', 'woman-technologist'],
  'プログラマ': ['technologist', 'man-technologist', 'woman-technologist'],
  'プログラマー': ['technologist', 'man-technologist', 'woman-technologist'],
  '开发者': ['technologist', 'man-technologist', 'woman-technologist'],
  '开发人员': ['technologist', 'man-technologist', 'woman-technologist'],
  '程序员': ['technologist', 'man-technologist', 'woman-technologist'],
  '工程師': ['technologist', 'man-technologist', 'woman-technologist'],
  '碼農': ['technologist', 'man-technologist', 'woman-technologist'],
  '码农': ['technologist', 'man-technologist', 'woman-technologist'],
  'desarrollador': ['technologist', 'man-technologist', 'woman-technologist'],
  'programador': ['technologist', 'man-technologist', 'woman-technologist'],
  'informatico': ['technologist', 'man-technologist', 'woman-technologist'],
  'developpeur': ['technologist', 'man-technologist', 'woman-technologist'],
  'programmeur': ['technologist', 'man-technologist', 'woman-technologist'],
  'informaticien': ['technologist', 'man-technologist', 'woman-technologist'],
  'entwickler': ['technologist', 'man-technologist', 'woman-technologist'],
  'programmierer': ['technologist', 'man-technologist', 'woman-technologist'],

  // Thumbs up & Like & Good
  '엄지척': ['thumbs-up'],
  '엄지 척': ['thumbs-up'],
  '엄지': ['thumbs-up'],
  '따봉': ['thumbs-up'],
  '좋아요': ['thumbs-up', 'red-heart'],
  '추천': ['thumbs-up'],
  '굿': ['thumbs-up'],
  'thumbs up': ['thumbs-up'],
  'thumbsup': ['thumbs-up'],
  'like': ['thumbs-up', 'red-heart'],
  'good': ['thumbs-up'],
  'approve': ['thumbs-up'],
  'いいね': ['thumbs-up'],
  '点赞': ['thumbs-up'],
  '大拇指': ['thumbs-up'],

  // Clap & Hands
  '박수': ['clapping-hands'],
  '손뼉': ['clapping-hands'],
  '환호': ['clapping-hands', 'party-popper', 'partying-face'],
  'clap': ['clapping-hands'],
  'clapping': ['clapping-hands'],
  'applause': ['clapping-hands'],
  'bravo': ['clapping-hands'],
  '拍手': ['clapping-hands'],
  '鼓掌': ['clapping-hands'],

  // Celebration & Party
  '축하': ['party-popper', 'partying-face', 'birthday-cake', 'clapping-hands'],
  '축하해': ['party-popper', 'partying-face', 'birthday-cake'],
  'celebration': ['party-popper', 'partying-face', 'birthday-cake', 'clapping-hands'],
  'party': ['party-popper', 'partying-face'],
  'お祝い': ['party-popper', 'partying-face', 'birthday-cake'],
  '庆祝': ['party-popper', 'partying-face', 'birthday-cake'],
  'celebracion': ['party-popper', 'partying-face', 'birthday-cake'],
  'fete': ['party-popper', 'partying-face', 'birthday-cake'],
  'feier': ['party-popper', 'partying-face', 'birthday-cake'],

  // South Korea & Taegeukgi
  '태극기': ['flag-south-korea'],
  '한국': ['flag-south-korea'],
  '대한민국': ['flag-south-korea'],
  'korea': ['flag-south-korea'],
  'south korea': ['flag-south-korea'],
  'taegeukgi': ['flag-south-korea'],
  '韓国': ['flag-south-korea'],
  '韩国': ['flag-south-korea'],

  // Smile & Happy
  '웃음': ['grinning-face', 'grinning-face-with-big-eyes', 'grinning-face-with-smiling-eyes', 'beaming-face-with-smiling-eyes', 'smiling-face-with-smiling-eyes'],
  '웃는 얼굴': ['grinning-face', 'grinning-face-with-big-eyes', 'grinning-face-with-smiling-eyes'],
  '미소': ['smiling-face-with-smiling-eyes', 'slightly-smiling-face', 'grinning-face-with-smiling-eyes'],
  '행복': ['grinning-face-with-big-eyes', 'smiling-face-with-smiling-eyes', 'grinning-face'],
  '즐거움': ['grinning-face-with-big-eyes', 'grinning-face-with-smiling-eyes'],
  'smile': ['grinning-face', 'grinning-face-with-big-eyes', 'grinning-face-with-smiling-eyes', 'smiling-face-with-smiling-eyes'],
  'smiling': ['grinning-face', 'grinning-face-with-big-eyes', 'grinning-face-with-smiling-eyes'],
  'happy': ['grinning-face-with-big-eyes', 'smiling-face-with-smiling-eyes'],
  '笑顔': ['grinning-face', 'grinning-face-with-smiling-eyes', 'smiling-face-with-smiling-eyes'],
  '笑脸': ['grinning-face', 'grinning-face-with-big-eyes', 'grinning-face-with-smiling-eyes'],
};

/**
 * Searches the Emoji database with high accuracy, multi-tier ranking,
 * concept boosts, and deterministic secondary sorting.
 */
export function searchEmojis(emojis: EmojiItem[], query: string, currentLang: Language): EmojiItem[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const cleanQuery = normalizeSearchString(trimmed);
  const compactQuery = normalizeCompact(trimmed);
  const kanaQuery = hiraToKata(cleanQuery);
  const isSkinToneExplicit = /skin|피부|肌|肤|piel|peau|haut/i.test(trimmed);

  // Retrieve concept target IDs if query matches any known core intent
  const conceptIds = CONCEPT_TARGETS[cleanQuery] || CONCEPT_TARGETS[compactQuery] || CONCEPT_TARGETS[kanaQuery] || [];

  const queryTokens = cleanQuery.split(' ').filter((t) => t.length > 0);
  const compactTokens = queryTokens.map(normalizeCompact);

  const scoredResults: { emoji: EmojiItem; score: number; index: number }[] = [];

  for (let idx = 0; idx < emojis.length; idx++) {
    const item = emojis[idx];
    let score = 0;

    // 1. Direct Emoji Character match (highest priority)
    if (item.emoji === trimmed) {
      score += 10000;
    } else if (item.emoji.includes(trimmed)) {
      score += 5000;
    }

    // 2. High-frequency semantic concept boost
    const conceptRank = conceptIds.indexOf(item.id);
    if (conceptRank !== -1) {
      score += Math.max(2000, 6000 - conceptRank * 1200);
    }

    const currentRawName = item.names[currentLang] || '';
    const enRawName = item.names.en || '';

    const currentName = normalizeSearchString(currentRawName);
    const currentNameCompact = normalizeCompact(currentRawName);
    const currentNameNoParens = normalizeSearchString(currentRawName.replace(/\([^)]*\)/g, ''));

    const enName = normalizeSearchString(enRawName);
    const enNameCompact = normalizeCompact(enRawName);
    const enNameNoParens = normalizeSearchString(enRawName.replace(/\([^)]*\)/g, ''));

    const currentKeywords = (item.keywords[currentLang] || []).map(normalizeSearchString);
    const currentKeywordsCompact = (item.keywords[currentLang] || []).map(normalizeCompact);
    const enKeywords = (item.keywords.en || []).map(normalizeSearchString);
    const enKeywordsCompact = (item.keywords.en || []).map(normalizeCompact);

    // 3. Localized Name Matching (Tier 1: Exact, Tier 2: StartsWith, Tier 3: Includes)
    if (currentName === cleanQuery || currentNameNoParens === cleanQuery) {
      score += 2500;
    } else if (currentNameCompact === compactQuery && compactQuery.length >= 2) {
      score += 2400;
    } else if (currentName.startsWith(cleanQuery) || currentNameNoParens.startsWith(cleanQuery)) {
      score += 1600;
    } else if (currentNameCompact.startsWith(compactQuery) && compactQuery.length >= 2) {
      score += 1500;
    } else if (currentName.includes(cleanQuery)) {
      score += 900;
    } else if (currentNameCompact.includes(compactQuery) && compactQuery.length >= 2) {
      score += 850;
    }

    // 4. English Name Fallback Matching (only if currentLang !== 'en' to avoid double-counting)
    if (currentLang !== 'en') {
      if (enName === cleanQuery || enNameNoParens === cleanQuery) {
        score += 1800;
      } else if (enNameCompact === compactQuery && compactQuery.length >= 2) {
        score += 1700;
      } else if (enName.startsWith(cleanQuery) || enNameNoParens.startsWith(cleanQuery)) {
        score += 1200;
      } else if (enNameCompact.startsWith(compactQuery) && compactQuery.length >= 2) {
        score += 1100;
      } else if (enName.includes(cleanQuery)) {
        score += 700;
      } else if (enNameCompact.includes(compactQuery) && compactQuery.length >= 2) {
        score += 650;
      }
    }

    // 5. Localized Keywords Matching
    if (currentKeywords.includes(cleanQuery) || currentKeywordsCompact.includes(compactQuery)) {
      score += 1400;
    } else if (currentKeywords.some((k) => k.startsWith(cleanQuery))) {
      score += 700;
    } else if (currentKeywords.some((k) => k.includes(cleanQuery))) {
      score += 350;
    }

    // 6. English Keywords Fallback Matching
    if (currentLang !== 'en') {
      if (enKeywords.includes(cleanQuery) || enKeywordsCompact.includes(compactQuery)) {
        score += 1000;
      } else if (enKeywords.some((k) => k.startsWith(cleanQuery))) {
        score += 500;
      } else if (enKeywords.some((k) => k.includes(cleanQuery))) {
        score += 250;
      }
    }

    // 7. Subcategory / Category / Unicode / ID
    if (item.id === cleanQuery.replace(/\s+/g, '-')) {
      score += 1200;
    } else if (item.id.includes(cleanQuery.replace(/\s+/g, '-'))) {
      score += 300;
    }
    if (item.subcategory && normalizeSearchString(item.subcategory).includes(cleanQuery)) {
      score += 200;
    }
    if (normalizeSearchString(item.category).includes(cleanQuery)) {
      score += 150;
    }
    const cleanUnicode = cleanQuery.replace(/^u\+/, '');
    if (cleanUnicode.length >= 3 && normalizeSearchString(item.unicode).includes(cleanUnicode)) {
      score += 200;
    }

    // 8. Multi-token evaluation for multi-word queries (e.g. "사랑 하트", "red heart", "고양이 얼굴")
    if (queryTokens.length > 1) {
      let tokensMatched = 0;
      for (let tIdx = 0; tIdx < queryTokens.length; tIdx++) {
        const token = queryTokens[tIdx];
        const tokenCompact = compactTokens[tIdx];
        let matchedThis = false;

        if (currentName.includes(token) || currentNameCompact.includes(tokenCompact)) {
          score += 250;
          matchedThis = true;
        }
        if (currentLang !== 'en' && (enName.includes(token) || enNameCompact.includes(tokenCompact))) {
          score += 180;
          matchedThis = true;
        }
        if (currentKeywords.some((k) => k.includes(token))) {
          score += 180;
          matchedThis = true;
        }
        if (currentLang !== 'en' && enKeywords.some((k) => k.includes(token))) {
          score += 120;
          matchedThis = true;
        }
        if (matchedThis) {
          tokensMatched++;
        }
      }
      // If all tokens matched, grant a compound match bonus
      if (tokensMatched === queryTokens.length) {
        score += 800;
      }
    }

    if (score > 0) {
      // 9. Base emoji vs Skin-tone modifier adjustments
      const isSkinTone = hasSkinToneModifier(item);
      if (isSkinTone) {
        if (!isSkinToneExplicit) {
          score -= 300; // Prioritize base yellow/standard emoji
        }
      } else {
        score += 100; // Reward base emoji
      }

      // 10. Popular emoji boost
      if (item.isPopular) {
        score += 150;
      }

      scoredResults.push({ emoji: item, score, index: idx });
    }
  }

  // Stable secondary sorting: Score (desc) -> isPopular (desc) -> Original order (asc)
  scoredResults.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aPop = a.emoji.isPopular ? 1 : 0;
    const bPop = b.emoji.isPopular ? 1 : 0;
    if (bPop !== aPop) return bPop - aPop;
    return a.index - b.index;
  });

  return scoredResults.map((r) => r.emoji);
}
