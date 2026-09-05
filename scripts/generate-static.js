import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

const BASE_URL = 'https://emoji.modoo.co';
const LANGUAGES = ['ko', 'en', 'ja', 'zh-hans', 'zh-hant', 'es', 'fr', 'de'];

// Import emojis and translations
// In ESM node, read the typescript/json or import directly
async function main() {
  console.log('🚀 Starting Emoji Atlas Static Generator for GitHub Pages...');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist directory not found. Please run "vite build" first.');
    process.exit(1);
  }

  const baseHtmlPath = path.resolve(DIST_DIR, 'index.html');
  if (!fs.existsSync(baseHtmlPath)) {
    console.error('❌ dist/index.html not found.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

  // List of standard routes
  const staticRoutes = [
    '',
    'emoji/',
    'symbols/',
    'emoticons/',
    'popular/',
    'about/',
    'contact/',
    'privacy/',
    'terms/',
  ];

  // Emoji IDs for individual detail pages
  const emojiIds = [
    'red-heart',
    'orange-heart',
    'sparkling-heart',
    'fire-heart',
    'grinning-face',
    'face-with-tears-of-joy',
    'rolling-on-the-floor-laughing',
    'smiling-face-with-heart-eyes',
    'smiling-face-with-hearts',
    'pleading-face',
    'loudly-crying-face',
    'skull',
    'thinking-face',
    'waving-hand',
    'thumbs-up',
    'folded-hands',
    'heart-hands',
    'fire',
    'sparkles',
    'cherry-blossom',
    'dog-face',
    'cat-face',
    'birthday-cake',
    'hot-beverage',
    'party-popper',
    'partying-face',
    'soccer-ball',
    'rocket',
    'automobile',
    'light-bulb',
    'laptop',
    'flag-south-korea',
    'flag-united-states',
    'check-mark-button',
  ];

  const allUrls = [];

  // Brand title map
  const brandTaglines = {
    ko: {
      brand: '모두의 이모지',
      tagline: '이모지를 쉽고 빠르게 찾아보세요',
      desc: '모두의 이모지에서 다양한 이모지를 쉽고 빠르게 검색하고 복사하세요. 이름과 키워드, 카테고리로 원하는 이모지를 찾아보세요.',
    },
    en: {
      brand: 'Emoji Atlas',
      tagline: 'Find, Copy & Explore Emojis',
      desc: 'Emoji Atlas is a simple and fast emoji search tool. Find, copy and explore emojis by name, keyword and category.',
    },
    ja: {
      brand: 'Emoji Atlas',
      tagline: '絵文字を検索・コピー・楽しもう',
      desc: 'Emoji Atlasは簡単で高速な絵文字検索ツールです。名前、キーワード、カテゴリーから絵文字を検索・コピー・楽しもう。',
    },
    'zh-hans': {
      brand: 'Emoji Atlas',
      tagline: '搜索、复制和探索 Emoji',
      desc: 'Emoji Atlas 是一个简单快速的 Emoji 表情搜索工具。通过名称、关键词和分类轻松搜索、复制和探索 Emoji。',
    },
    'zh-hant': {
      brand: 'Emoji Atlas',
      tagline: '搜尋、複製與探索 Emoji',
      desc: 'Emoji Atlas 是一個簡單快速的 Emoji 表情符號搜尋工具。透過名稱、關鍵字與分類輕鬆搜尋、複製與探索 Emoji。',
    },
    es: {
      brand: 'Emoji Atlas',
      tagline: 'Busca, copia y descubre emojis',
      desc: 'Emoji Atlas es una herramienta simple y rápida para buscar emojis. Encuentra, copia y descubre emojis por nombre, palabra clave y categoría.',
    },
    fr: {
      brand: 'Emoji Atlas',
      tagline: 'Recherchez, copiez et découvrez les emojis',
      desc: 'Emoji Atlas est un outil simple et rapide de recherche d’émojis. Recherchez, copiez et découvrez les émojis par nom, mot-clé et catégorie.',
    },
    de: {
      brand: 'Emoji Atlas',
      tagline: 'Emojis suchen, kopieren und entdecken',
      desc: 'Emoji Atlas ist ein einfaches und schnelles Emoji-Suchtool. Emojis nach Name, Stichwort und Kategorie suchen, kopieren und entdecken.',
    },
  };

  // Emoticons SEO metadata
  const emoticonsSeo = {
    ko: {
      title: '이모티콘 모음 | 모두의 이모지',
      desc: '귀엽고 재미있는 이모티콘과 다양한 카오모지를 쉽게 찾아 복사해보세요. 카테고리와 검색 기능으로 원하는 이모티콘을 빠르게 찾아보세요.',
      name: '이모티콘',
      home: '홈',
    },
    en: {
      title: 'Emoticons & Kaomoji | Emoji Atlas',
      desc: 'Find cute and fun emoticons and kaomoji. Search, explore and copy your favorite emoticons by category.',
      name: 'Emoticons',
      home: 'Home',
    },
    ja: {
      title: '顔文字一覧 | Emoji Atlas',
      desc: 'かわいくて楽しい顔文字やカオモジを検索して、簡単にコピーできます。',
      name: '顔文字',
      home: 'ホーム',
    },
    'zh-hans': {
      title: '颜文字大全 | Emoji Atlas',
      desc: '搜索可爱又有趣的颜文字和 Kaomoji，按分类查找并轻松复制。',
      name: '颜文字',
      home: '首页',
    },
    'zh-hant': {
      title: '顏文字大全 | Emoji Atlas',
      desc: '搜尋可愛又有趣的顏文字和 Kaomoji，依分類查找並輕鬆複製。',
      name: '顏文字',
      home: '首頁',
    },
    es: {
      title: 'Emoticonos y Kaomoji | Emoji Atlas',
      desc: 'Encuentra, busca y copia emoticonos y kaomoji divertidos y adorables por categoría.',
      name: 'Emoticonos',
      home: 'Inicio',
    },
    fr: {
      title: 'Émoticônes et Kaomoji | Emoji Atlas',
      desc: 'Trouvez, recherchez et copiez facilement des émoticônes et kaomoji amusants et adorables.',
      name: 'Émoticônes',
      home: 'Accueil',
    },
    de: {
      title: 'Emoticons und Kaomoji | Emoji Atlas',
      desc: 'Finde, suche und kopiere süße und lustige Emoticons und Kaomoji nach Kategorien.',
      name: 'Emoticons',
      home: 'Startseite',
    },
  };

  const OG_LOCALES = {
    ko: 'ko_KR',
    en: 'en_US',
    ja: 'ja_JP',
    'zh-hans': 'zh_CN',
    'zh-hant': 'zh_TW',
    es: 'es_ES',
    fr: 'fr_FR',
    de: 'de_DE',
  };

  function buildHreflangTags(routePath) {
    const links = LANGUAGES.map((code) => {
      const hreflangCode = code === 'zh-hans' ? 'zh-Hans' : code === 'zh-hant' ? 'zh-Hant' : code;
      return `<link rel="alternate" hreflang="${hreflangCode}" href="${BASE_URL}/${code}/${routePath}" />`;
    });
    links.push(`<link rel="alternate" hreflang="x-default" href="${BASE_URL}/en/${routePath}" />`);
    return links.join('\n    ');
  }

  function buildJsonLd(lang, routePath, title, description, canonicalUrl) {
    const { brand, tagline } = brandTaglines[lang] || brandTaglines.en;
    const graph = [
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: brand,
        alternateName: brand,
        description: tagline,
        inLanguage: lang,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/${lang}/search/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description: description,
        inLanguage: lang,
        isPartOf: {
          '@id': `${BASE_URL}/#website`,
        },
      },
    ];

    if (routePath === 'emoticons/') {
      const emInfo = emoticonsSeo[lang] || emoticonsSeo.en;
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: emInfo.home,
            item: `${BASE_URL}/${lang}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: emInfo.name,
            item: canonicalUrl,
          },
        ],
      });
    }

    return `<script id="modoo-schema-jsonld" type="application/ld+json">\n${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}\n    </script>`;
  }

  function renderPageHtml(lang, routePath, title, description, canonicalUrl) {
    const { brand } = brandTaglines[lang] || brandTaglines.en;
    const ogLocale = OG_LOCALES[lang] || 'en_US';

    let html = baseHtml
      .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`)
      .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`)
      .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${description}"`)
      .replace(/<meta property="og:site_name" content="[^"]*"/, `<meta property="og:site_name" content="${brand}"`)
      .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonicalUrl}"`)
      .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title}"`)
      .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${description}"`);

    const extraHead = [
      `    <link rel="canonical" href="${canonicalUrl}" />`,
      `    <meta property="og:locale" content="${ogLocale}" />`,
      `    ${buildHreflangTags(routePath)}`,
      `    ${buildJsonLd(lang, routePath, title, description, canonicalUrl)}`,
    ].join('\n');

    return html.replace('</head>', `${extraHead}\n  </head>`);
  }

  // Generate localized pages
  for (const lang of LANGUAGES) {
    const { brand, tagline, desc } = brandTaglines[lang] || brandTaglines.en;
    const homeTitle = `${brand} – ${tagline}`;

    // 1. Static category and section pages
    for (const route of staticRoutes) {
      const pageDir = path.join(DIST_DIR, lang, route);
      fs.mkdirSync(pageDir, { recursive: true });

      const pageUrl = `${BASE_URL}/${lang}/${route}`;
      allUrls.push(pageUrl);

      let pageTitle = homeTitle;
      let pageDesc = desc;

      if (route === 'emoticons/') {
        const emInfo = emoticonsSeo[lang] || emoticonsSeo.en;
        pageTitle = emInfo.title;
        pageDesc = emInfo.desc;
      }

      const pageHtml = renderPageHtml(lang, route, pageTitle, pageDesc, pageUrl);
      fs.writeFileSync(path.join(pageDir, 'index.html'), pageHtml, 'utf-8');
    }

    // 2. Emoji detail pages
    for (const id of emojiIds) {
      const detailDir = path.join(DIST_DIR, lang, 'emoji', id);
      fs.mkdirSync(detailDir, { recursive: true });

      const detailUrl = `${BASE_URL}/${lang}/emoji/${id}/`;
      allUrls.push(detailUrl);

      const detailTitle = `${brand} – ${tagline}`;
      const detailDesc = desc;
      const detailHtml = renderPageHtml(lang, `emoji/${id}/`, detailTitle, detailDesc, detailUrl);
      fs.writeFileSync(path.join(detailDir, 'index.html'), detailHtml, 'utf-8');
    }
  }

  // 3. Generate root default emoticons page (/emoticons/)
  const rootEmoticonsDir = path.join(DIST_DIR, 'emoticons');
  fs.mkdirSync(rootEmoticonsDir, { recursive: true });
  const rootEmoticonsUrl = `${BASE_URL}/emoticons/`;
  allUrls.push(rootEmoticonsUrl);
  const rootEmoticonsHtml = renderPageHtml(
    'ko',
    'emoticons/',
    emoticonsSeo.ko.title,
    emoticonsSeo.ko.desc,
    rootEmoticonsUrl
  );
  fs.writeFileSync(path.join(rootEmoticonsDir, 'index.html'), rootEmoticonsHtml, 'utf-8');

  // 4. Update root /index.html with canonical & hreflang
  allUrls.push(`${BASE_URL}/`);
  const rootIndexHtml = renderPageHtml(
    'ko',
    '',
    `${brandTaglines.ko.brand} – ${brandTaglines.ko.tagline}`,
    brandTaglines.ko.desc,
    `${BASE_URL}/`
  );
  fs.writeFileSync(baseHtmlPath, rootIndexHtml, 'utf-8');

  // Generate comprehensive sitemap.xml
  const uniqueUrls = Array.from(new Set(allUrls));
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${uniqueUrls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log(`✅ Generated sitemap.xml with ${uniqueUrls.length} pages.`);

  // Create GitHub Pages 404.html fallback
  fs.copyFileSync(baseHtmlPath, path.join(DIST_DIR, '404.html'));
  console.log('✅ Created dist/404.html for GitHub Pages routing fallback.');

  // Ensure CNAME exists in dist
  const cnamePath = path.join(DIST_DIR, 'CNAME');
  fs.writeFileSync(cnamePath, 'emoji.modoo.co\n', 'utf-8');
  console.log('✅ Created dist/CNAME for https://emoji.modoo.co.');

  console.log('🎉 Static generation complete! Ready for GitHub Pages deployment.');
}

main().catch((err) => {
  console.error('Error during static generation:', err);
  process.exit(1);
});
