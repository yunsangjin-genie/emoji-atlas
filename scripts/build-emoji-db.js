import fs from 'fs';
import path from 'path';
import https from 'https';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url}: HTTP ${res.statusCode}`));
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseXmlAnnotations(xml) {
  const ttsMap = new Map();
  const kwMap = new Map();

  const ttsRegex = /<annotation cp="([^"]+)" type="tts">([^<]+)<\/annotation>/g;
  for (const match of xml.matchAll(ttsRegex)) {
    ttsMap.set(match[1], match[2].trim());
  }

  const kwRegex = /<annotation cp="([^"]+)"(?: draft="[^"]*")?>([^<]+)<\/annotation>/g;
  for (const match of xml.matchAll(kwRegex)) {
    const kws = match[2]
      .split('|')
      .map((k) => k.trim())
      .filter(Boolean);
    kwMap.set(match[1], kws);
  }

  return { ttsMap, kwMap };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Special translations for Unicode 17.0 & recent additions if missing in CLDR
const E17_FALLBACKS = {
  '🫪': {
    en: { name: 'Distorted Face', keywords: ['distorted', 'face', 'shocked', 'swollen', 'panic', 'dizzy'] },
    ko: { name: '왜곡된 얼굴', keywords: ['왜곡된 얼굴', '일그러진 얼굴', '놀란 얼굴', '공황', '놀람', '부은', '부푼', '불안', '충격'] },
    ja: { name: '歪んだ顔', keywords: ['歪んだ顔', 'ショック', 'パニック', '顔'] },
    'zh-hans': { name: '扭曲的脸', keywords: ['扭曲的脸', '震惊', '恐慌', '浮肿', '脸'] },
    'zh-hant': { name: '扭曲的臉', keywords: ['扭曲的臉', '震驚', '恐慌', '浮腫', '臉'] },
    es: { name: 'Cara distorsionada', keywords: ['cara', 'distorsionada', 'conmocionada', 'hinchada', 'pánico'] },
    fr: { name: 'Visage déformé', keywords: ['visage', 'déformé', 'choqué', 'gonflé', 'panique'] },
    de: { name: 'Verzerrtes Gesicht', keywords: ['verzerrt', 'gesicht', 'schockiert', 'panik', 'geschwollen'] },
  },
  '🫯': {
    en: { name: 'Fight Cloud', keywords: ['fight', 'cloud', 'comic', 'brawl', 'clash', 'cartoon'] },
    ko: { name: '싸움 구름', keywords: ['싸움 구름', '격투', '소동', '만화', '싸움', '구름', '충돌'] },
    ja: { name: '戦いの煙', keywords: ['戦いの煙', '乱闘', '煙', 'コミック', '喧嘩'] },
    'zh-hans': { name: '打斗烟尘', keywords: ['打斗烟尘', '打架', '争吵', '混乱', '烟尘'] },
    'zh-hant': { name: '打鬥煙塵', keywords: ['打鬥煙塵', '打架', '爭吵', '混亂', '煙塵'] },
    es: { name: 'Nube de pelea', keywords: ['nube', 'pelea', 'lucha', 'cómic', 'disputa'] },
    fr: { name: 'Nuage de bagarre', keywords: ['nuage', 'bagarre', 'combat', 'bande dessinée'] },
    de: { name: 'Prügelwolke', keywords: ['prügeln', 'wolke', 'kampf', 'comic', 'streit'] },
  },
  '🫈': {
    en: { name: 'Hairy Creature', keywords: ['hairy creature', 'bigfoot', 'sasquatch', 'yeti', 'monster'] },
    ko: { name: '털복숭이 괴생명체', keywords: ['털복숭이 괴생명체', '빅풋', '사스콰치', '설인', '예티', '괴물', '숲'] },
    ja: { name: '毛むくじゃらの生物', keywords: ['毛むくじゃら', 'ビッグフット', '雪男', '怪物'] },
    'zh-hans': { name: '毛茸茸的怪物', keywords: ['毛茸茸的怪物', '大脚怪', '野人', '雪怪'] },
    'zh-hant': { name: '毛茸茸的怪物', keywords: ['毛茸茸的怪物', '大腳怪', '野人', '雪怪'] },
    es: { name: 'Criatura peluda', keywords: ['criatura', 'peluda', 'pie grande', 'yeti', 'monstruo'] },
    fr: { name: 'Créature velue', keywords: ['créature', 'velue', 'bigfoot', 'yéti', 'monstre'] },
    de: { name: 'Haarige Kreatur', keywords: ['haarig', 'kreatur', 'bigfoot', 'yeti', 'sasquatch'] },
  },
  '🧑‍🩰': {
    en: { name: 'Ballet Dancer', keywords: ['ballet dancer', 'dance', 'ballerina', 'ballet'] },
    ko: { name: '발레 무용수', keywords: ['발레 무용수', '발레', '무용수', '발레리나', '발레리노', '춤'] },
    ja: { name: 'バレエダンサー', keywords: ['バレエ', 'ダンサー', '踊り', '舞踊'] },
    'zh-hans': { name: '芭蕾舞演员', keywords: ['芭蕾舞', '舞蹈', '演员', '跳舞'] },
    'zh-hant': { name: '芭蕾舞演員', keywords: ['芭蕾舞', '舞蹈', '演員', '跳舞'] },
    es: { name: 'Bailarín de ballet', keywords: ['ballet', 'bailarín', 'danza', 'bailarina'] },
    fr: { name: 'Danseur de ballet', keywords: ['ballet', 'danseur', 'danseuse', 'danse'] },
    de: { name: 'Balletttänzer', keywords: ['ballett', 'tänzer', 'tänzerin', 'tanz'] },
  },
  '🫍': {
    en: { name: 'Orca', keywords: ['orca', 'killer whale', 'whale', 'ocean', 'marine'] },
    ko: { name: '범고래', keywords: ['범고래', '고래', '바다', '해양', '오르카'] },
    ja: { name: 'シャチ', keywords: ['シャチ', 'クジラ', '海', '海洋生物'] },
    'zh-hans': { name: '虎鲸', keywords: ['虎鲸', '逆戟鲸', '鲸鱼', '海洋'] },
    'zh-hant': { name: '虎鯨', keywords: ['虎鯨', '殺人鯨', '鯨魚', '海洋'] },
    es: { name: 'Orca', keywords: ['orca', 'ballena asesina', 'ballena', 'mar', 'océano'] },
    fr: { name: 'Orque', keywords: ['orque', 'épaulard', 'baleine', 'océan', 'mer'] },
    de: { name: 'Schwertwal', keywords: ['schwertwal', 'orca', 'wal', 'meer', 'ozean'] },
  },
  '🛘': {
    en: { name: 'Landslide', keywords: ['landslide', 'rockfall', 'disaster', 'mountain', 'danger'] },
    ko: { name: '산사태', keywords: ['산사태', '사태', '낙석', '산', '재난', '위험', '지진'] },
    ja: { name: '地滑り', keywords: ['地滑り', '土砂崩れ', '災害', '山'] },
    'zh-hans': { name: '山体滑坡', keywords: ['山体滑坡', '泥石流', '滑坡', '灾害', '山'] },
    'zh-hant': { name: '山崩', keywords: ['山崩', '土石流', '泥石流', '災害', '山'] },
    es: { name: 'Derrumbe', keywords: ['derrumbe', 'deslizamiento', 'tierra', 'desastre', 'montaña'] },
    fr: { name: 'Glissement de terrain', keywords: ['glissement de terrain', 'éboulement', 'catastrophe', 'montagne'] },
    de: { name: 'Erdrutsch', keywords: ['erdrutsch', 'geröll', 'katastrophe', 'berg', 'gefahr'] },
  },
  '🪊': {
    en: { name: 'Trombone', keywords: ['trombone', 'instrument', 'brass', 'music', 'jazz'] },
    ko: { name: '트롬본', keywords: ['트롬본', '악기', '금관악기', '음악', '브라스', '재즈'] },
    ja: { name: 'トロンボーン', keywords: ['トロンボーン', '楽器', '金管楽器', '音楽', 'ジャズ'] },
    'zh-hans': { name: '长号', keywords: ['长号', '乐器', '铜管乐器', '音乐', '爵士'] },
    'zh-hant': { name: '長號', keywords: ['長號', '樂器', '銅管樂器', '音樂', '爵士'] },
    es: { name: 'Trombón', keywords: ['trombón', 'instrumento', 'viento metal', 'música', 'jazz'] },
    fr: { name: 'Trombone', keywords: ['trombone', 'instrument', 'cuivre', 'musique', 'jazz'] },
    de: { name: 'Posaune', keywords: ['posaune', 'blasinstrument', 'messing', 'musik', 'jazz'] },
  },
  '🪎': {
    en: { name: 'Treasure Chest', keywords: ['treasure chest', 'gold', 'pirate', 'box', 'jewels'] },
    ko: { name: '보물 상자', keywords: ['보물 상자', '보물함', '황금', '금괴', '보석', '해적', '상자'] },
    ja: { name: '宝箱', keywords: ['宝箱', '財宝', '海賊', '宝石', 'ゴールド'] },
    'zh-hans': { name: '宝箱', keywords: ['宝箱', '宝藏', '黄金', '海盗', '宝物'] },
    'zh-hant': { name: '寶箱', keywords: ['寶箱', '寶藏', '黃金', '海盜', '寶物'] },
    es: { name: 'Cofre del tesoro', keywords: ['cofre del tesoro', 'tesoro', 'oro', 'pirata', 'joyas'] },
    fr: { name: 'Coffre au trésor', keywords: ['coffre au trésor', 'trésor', 'or', 'pirate', 'bijoux'] },
    de: { name: 'Schatztruhe', keywords: ['schatztruhe', 'schatz', 'gold', 'pirat', 'juwelen'] },
  },
};

const CATEGORY_MAP = {
  'Smileys & Emotion': 'smileys-emotion',
  'People & Body': 'people-body',
  Component: 'people-body',
  'Animals & Nature': 'animals-nature',
  'Food & Drink': 'food-drink',
  'Travel & Places': 'travel-places',
  Activities: 'activities',
  Objects: 'objects',
  Symbols: 'symbols',
  Flags: 'flags',
};

async function main() {
  console.log('🔄 1. Reading existing emojis from src/data/emojis.ts...');
  const emojisTsContent = fs.readFileSync(path.resolve('src/data/emojis.ts'), 'utf-8');

  // Extract existing emojis array from the typescript file
  // We can dynamically evaluate or import it
  const { EMOJIS: existingEmojis } = await import('../src/data/emojis.js').catch(async () => {
    // Use tsx to export or evaluate
    const match = emojisTsContent.match(/export const EMOJIS: EmojiItem\[\] = (\[[\s\S]*\]);/);
    if (!match) throw new Error('Could not parse existing EMOJIS array');
    return { EMOJIS: eval(match[1]) };
  });

  console.log(`Found ${existingEmojis.length} existing emojis.`);
  const existingEmojiMap = new Map();
  const existingIdSet = new Set();
  for (const e of existingEmojis) {
    existingEmojiMap.set(e.emoji, e);
    existingIdSet.add(e.id);
  }

  console.log('📥 2. Fetching official Unicode Emoji 17.0 emoji-test.txt...');
  const emojiTestTxt = await fetchUrl('https://unicode.org/Public/emoji/latest/emoji-test.txt');

  console.log('📥 3. Fetching CLDR annotations for 8 languages...');
  const languages = [
    { code: 'ko', file: 'ko.xml' },
    { code: 'en', file: 'en.xml' },
    { code: 'ja', file: 'ja.xml' },
    { code: 'zh-hans', file: 'zh.xml' },
    { code: 'zh-hant', file: 'zh_Hant.xml' },
    { code: 'es', file: 'es.xml' },
    { code: 'fr', file: 'fr.xml' },
    { code: 'de', file: 'de.xml' },
  ];

  const cldrData = {};
  for (const lang of languages) {
    console.log(`   Fetching ${lang.code} annotations...`);
    const baseXml = await fetchUrl(`https://raw.githubusercontent.com/unicode-org/cldr/main/common/annotations/${lang.file}`);
    const derivedXml = await fetchUrl(`https://raw.githubusercontent.com/unicode-org/cldr/main/common/annotationsDerived/${lang.file}`);

    const baseParsed = parseXmlAnnotations(baseXml);
    const derivedParsed = parseXmlAnnotations(derivedXml);

    const ttsCombined = new Map([...baseParsed.ttsMap, ...derivedParsed.ttsMap]);
    const kwCombined = new Map([...baseParsed.kwMap, ...derivedParsed.kwMap]);

    cldrData[lang.code] = { ttsMap: ttsCombined, kwMap: kwCombined };
  }

  function lookupCldr(langCode, emoji) {
    const lang = cldrData[langCode];
    if (!lang) return null;

    const variants = [emoji, emoji.replace(/\uFE0F/g, ''), emoji + '\uFE0F'];
    for (const v of variants) {
      if (lang.ttsMap.has(v)) {
        return {
          tts: lang.ttsMap.get(v),
          kws: lang.kwMap.get(v) || [],
        };
      }
    }
    return null;
  }

  console.log('⚙️ 4. Parsing Unicode Emoji 17.0 entries...');
  let currentGroup = '';
  let currentSubgroup = '';
  const parsedEntries = [];

  for (const line of emojiTestTxt.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# group:')) {
      currentGroup = trimmed.replace('# group:', '').trim();
    } else if (trimmed.startsWith('# subgroup:')) {
      currentSubgroup = trimmed.replace('# subgroup:', '').trim();
    } else if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split(';');
      if (parts.length >= 2) {
        const hex = parts[0].trim();
        const rest = parts[1].trim();
        const [statusPart, commentPart] = rest.split('#');
        const status = statusPart.trim();
        if (status === 'fully-qualified' || status === 'component') {
          const comment = (commentPart || '').trim();
          const m = comment.match(/^(\S+)\s+(E\d+\.\d+)\s+(.+)$/);
          if (m) {
            parsedEntries.push({
              hex,
              emoji: m[1],
              version: m[2].replace('E', ''),
              name: m[3],
              group: currentGroup,
              subgroup: currentSubgroup,
              status,
            });
          }
        }
      }
    }
  }

  console.log(`Parsed ${parsedEntries.length} total entries from emoji-test.txt.`);

  // Filtering: Include all base emojis (non-skin-tone), plus skin tone variants for hand gestures and popular gestures
  const HAND_GESTURE_SUBGROUPS = ['hand-fingers-open', 'hand-fingers-partial', 'hand-single-finger', 'hand-fingers-closed', 'hands'];
  const POPULAR_SKIN_TONE_BASE_EMOJIS = new Set(['👍', '👎', '👋', '✌️', '🙏', '👏', '🤝', '🫶', '👌', '🤞', '🤙', '👈', '👉', '👆', '👇', '☝️', '✍️', '💪', '🫰', '🖐️', '✋']);

  const selectedEntries = [];
  const addedEmojiChars = new Set();

  // First pass: Always include existing 34 emojis
  for (const e of existingEmojis) {
    addedEmojiChars.add(e.emoji);
  }

  for (const entry of parsedEntries) {
    const isSkinTone = entry.name.includes('skin tone');

    let shouldInclude = false;
    if (!isSkinTone) {
      // Base emoji: include all of them!
      shouldInclude = true;
    } else {
      // Skin tone variant: include hand gestures & popular gestures
      const isHandGesture = HAND_GESTURE_SUBGROUPS.includes(entry.subgroup);
      const isPopularGesture = [...POPULAR_SKIN_TONE_BASE_EMOJIS].some((b) => entry.emoji.startsWith(b));
      if (isHandGesture || isPopularGesture) {
        shouldInclude = true;
      }
    }

    if (shouldInclude) {
      selectedEntries.push(entry);
    }
  }

  console.log(`Selected ${selectedEntries.length} candidate emojis to process.`);

  const finalEmojis = [];
  const usedIds = new Set();
  const usedEmojis = new Set();

  // Step A: Add all existing emojis first to maintain exact order and structure
  for (const existing of existingEmojis) {
    const updated = { ...existing };
    // Enrich names and keywords for other languages from CLDR if not already present
    const updatedNames = { ...existing.names };
    const updatedKeywords = { ...existing.keywords };
    for (const langCode of ['ko', 'en', 'ja', 'zh-hans', 'zh-hant', 'es', 'fr', 'de']) {
      if (!updatedNames[langCode]) {
        const cldr = lookupCldr(langCode, existing.emoji);
        if (cldr && cldr.tts) {
          updatedNames[langCode] = cldr.tts.charAt(0).toUpperCase() + cldr.tts.slice(1);
        } else {
          updatedNames[langCode] = existing.names.en;
        }
      }
      if (!updatedKeywords[langCode] || updatedKeywords[langCode].length === 0) {
        const cldr = lookupCldr(langCode, existing.emoji);
        if (cldr && cldr.kws && cldr.kws.length > 0) {
          updatedKeywords[langCode] = cldr.kws;
        } else {
          updatedKeywords[langCode] = [...existing.keywords.en];
        }
      }
      // Ensure emoji itself is searchable
      if (!updatedKeywords[langCode].includes(existing.emoji)) {
        updatedKeywords[langCode] = [...updatedKeywords[langCode], existing.emoji];
      }
    }
    updated.names = updatedNames;
    updated.keywords = updatedKeywords;

    finalEmojis.push(updated);
    usedIds.add(existing.id);
    usedEmojis.add(existing.emoji);
  }

  // Step B: Add new emojis
  let addedCount = 0;
  for (const entry of selectedEntries) {
    if (usedEmojis.has(entry.emoji)) {
      continue; // already in existing
    }

    const category = CATEGORY_MAP[entry.group] || 'symbols';

    // Generate unique ID
    let baseId = slugify(entry.name);
    if (!baseId) baseId = `emoji-${entry.hex.toLowerCase().replace(/\s+/g, '-')}`;
    let uniqueId = baseId;
    let counter = 2;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${baseId}-${counter}`;
      counter++;
    }

    // Format unicode string: U+1F600 or U+1F468 U+200D U+1F4BB
    const unicodeStr = entry.hex
      .split(' ')
      .map((h) => `U+${h.toUpperCase()}`)
      .join(' ');

    // Collect names and keywords across 8 languages
    const names = {
      ko: '',
      en: entry.name.charAt(0).toUpperCase() + entry.name.slice(1),
      ja: '',
      'zh-hans': '',
      'zh-hant': '',
      es: '',
      fr: '',
      de: '',
    };

    const keywords = {
      ko: [],
      en: [],
      ja: [],
      'zh-hans': [],
      'zh-hant': [],
      es: [],
      fr: [],
      de: [],
    };

    // English keywords from name parts
    const enTokens = entry.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1);
    keywords.en = Array.from(new Set([entry.name.toLowerCase(), ...enTokens]));

    // Check E17 / custom fallbacks first
    const fallback = E17_FALLBACKS[entry.emoji];
    if (fallback) {
      for (const langCode of ['ko', 'en', 'ja', 'zh-hans', 'zh-hant', 'es', 'fr', 'de']) {
        if (fallback[langCode]) {
          names[langCode] = fallback[langCode].name;
          keywords[langCode] = fallback[langCode].keywords;
        }
      }
    }

    // Fill from CLDR
    for (const langCode of ['ko', 'en', 'ja', 'zh-hans', 'zh-hant', 'es', 'fr', 'de']) {
      const cldr = lookupCldr(langCode, entry.emoji);
      if (cldr) {
        if (!names[langCode]) {
          names[langCode] = cldr.tts ? cldr.tts.charAt(0).toUpperCase() + cldr.tts.slice(1) : names.en;
        }
        if (!keywords[langCode] || keywords[langCode].length === 0) {
          keywords[langCode] = cldr.kws;
        } else {
          keywords[langCode] = Array.from(new Set([...keywords[langCode], ...cldr.kws]));
        }
      }
    }

    // Ensure non-empty fallback for every language
    for (const langCode of ['ko', 'en', 'ja', 'zh-hans', 'zh-hant', 'es', 'fr', 'de']) {
      if (!names[langCode]) names[langCode] = names.en;
      if (!keywords[langCode] || keywords[langCode].length === 0) keywords[langCode] = [...keywords.en];
    }

    // Special flag keyword enrichments
    if (category === 'flags' && entry.name.toLowerCase().startsWith('flag:')) {
      const countryEn = entry.name.replace(/^flag:\s*/i, '').trim();
      keywords.en.push(countryEn.toLowerCase());
      if (names.ko.includes('깃발:')) {
        const countryKo = names.ko.replace(/^깃발:\s*/i, '').trim();
        keywords.ko.push(countryKo, `${countryKo} 국기`, countryKo.toLowerCase());
      }
    }

    // Smileys natural synonyms for Korean
    if (category === 'smileys-emotion') {
      if (entry.name.includes('laugh') || entry.name.includes('smile') || entry.name.includes('grin')) {
        keywords.ko.push('웃음', '미소', '스마일', '행복', '얼굴');
      } else if (entry.name.includes('cry') || entry.name.includes('tear') || entry.name.includes('sad')) {
        keywords.ko.push('눈물', '슬픔', '우는', '속상', '우울');
      } else if (entry.name.includes('angry') || entry.name.includes('rage')) {
        keywords.ko.push('화남', '분노', '짜증', '열받음');
      }
    }

    // Clean duplicate keywords and empty entries
    for (const langCode of Object.keys(keywords)) {
      keywords[langCode].push(entry.emoji);
      keywords[langCode] = Array.from(new Set(keywords[langCode].map((k) => k.trim()).filter(Boolean)));
    }

    const newItem = {
      id: uniqueId,
      emoji: entry.emoji,
      unicode: unicodeStr,
      category,
      subcategory: entry.subgroup,
      version: entry.version,
      names,
      keywords,
    };

    finalEmojis.push(newItem);
    usedIds.add(uniqueId);
    usedEmojis.add(entry.emoji);
    addedCount++;
  }

  console.log(`✅ Final total emojis: ${finalEmojis.length} (${existingEmojis.length} original + ${addedCount} added)`);

  // Count by category
  const categoryCounts = {};
  for (const e of finalEmojis) {
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
  }
  console.log('Category breakdown:', categoryCounts);

  // Validation checks
  console.log('🔍 Running Data Quality Validations...');
  let hasError = false;

  // 1. Check duplicate IDs
  const idFreq = {};
  for (const e of finalEmojis) {
    idFreq[e.id] = (idFreq[e.id] || 0) + 1;
    if (idFreq[e.id] > 1) {
      console.error(`❌ Duplicate ID: ${e.id}`);
      hasError = true;
    }
  }

  // 2. Check duplicate Emoji characters
  const emojiFreq = {};
  for (const e of finalEmojis) {
    emojiFreq[e.emoji] = (emojiFreq[e.emoji] || 0) + 1;
    if (emojiFreq[e.emoji] > 1) {
      console.error(`❌ Duplicate Emoji: ${e.emoji} (ID: ${e.id})`);
      hasError = true;
    }
  }

  // 3. Check categories valid
  const validCategories = new Set(Object.values(CATEGORY_MAP));
  for (const e of finalEmojis) {
    if (!validCategories.has(e.category)) {
      console.error(`❌ Invalid Category: ${e.category} on ${e.id}`);
      hasError = true;
    }
  }

  // 4. Check names and keywords
  for (const e of finalEmojis) {
    for (const lang of ['ko', 'en', 'ja', 'zh-hans', 'zh-hant', 'es', 'fr', 'de']) {
      if (!e.names[lang]) {
        console.error(`❌ Missing name for [${lang}] on ${e.id}`);
        hasError = true;
      }
      if (!e.keywords[lang] || e.keywords[lang].length === 0) {
        console.error(`❌ Empty keywords for [${lang}] on ${e.id}`);
        hasError = true;
      }
    }
  }

  if (hasError) {
    console.error('❌ Validation failed! Aborting write.');
    process.exit(1);
  }

  console.log('✅ All validation checks PASSED cleanly!');

  // Generate src/data/emojis.ts
  console.log('💾 Writing src/data/emojis.ts...');
  const outPath = path.resolve('src/data/emojis.ts');
  const code = `import { EmojiItem } from '../types';\n\nexport const EMOJIS: EmojiItem[] = ${JSON.stringify(
    finalEmojis,
    null,
    2
  )};\n`;

  fs.writeFileSync(outPath, code, 'utf-8');
  console.log(`🎉 Successfully updated ${outPath} (${(code.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
