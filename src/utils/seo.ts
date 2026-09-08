import { Language, RouteState } from '../types';
import { SUPPORTED_LANGUAGES, translations } from '../locales/translations';

const BASE_DOMAIN = 'https://emoji.modoo.co';

export function updateMetaTags(route: RouteState, title: string, description: string, emojiChar?: string): void {
  // Update document title
  document.title = title;

  // Helper to set or create meta tag
  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const siteName = route.lang === 'ko' ? '모두의 이모지' : 'Emoji Atlas';

  const OG_LOCALES: Record<Language, string> = {
    ko: 'ko_KR',
    en: 'en_US',
    ja: 'ja_JP',
    'zh-hans': 'zh_CN',
    'zh-hant': 'zh_TW',
    es: 'es_ES',
    fr: 'fr_FR',
    de: 'de_DE',
  };

  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:site_name', siteName);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:locale', OG_LOCALES[route.lang] || 'en_US');
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);

  // Determine current path
  let currentPath = `/${route.lang}/`;
  if (route.view === 'emoji') currentPath = `/${route.lang}/emoji/`;
  else if (route.view === 'detail' && route.emojiId) currentPath = `/${route.lang}/emoji/${route.emojiId}/`;
  else if (route.view === 'symbols') currentPath = `/${route.lang}/symbols/`;
  else if (route.view === 'emoticons') {
    if (typeof window !== 'undefined' && (window.location.pathname === '/emoticons/' || window.location.pathname === '/emoticons')) {
      currentPath = '/emoticons/';
    } else {
      currentPath = `/${route.lang}/emoticons/`;
    }
  }
  else if (route.view === 'popular') currentPath = `/${route.lang}/popular/`;
  else if (route.view === 'about') currentPath = `/${route.lang}/about/`;
  else if (route.view === 'contact') currentPath = `/${route.lang}/contact/`;
  else if (route.view === 'privacy') currentPath = `/${route.lang}/privacy/`;
  else if (route.view === 'terms') currentPath = `/${route.lang}/terms/`;
  else if (route.view === 'favorites') currentPath = `/${route.lang}/favorites/`;

  const canonicalUrl = `${BASE_DOMAIN}${currentPath}`;
  setMeta('property', 'og:url', canonicalUrl);

  // Robots meta handling: noindex, nofollow for personal favorites page
  if (route.view === 'favorites') {
    setMeta('name', 'robots', 'noindex, nofollow');
  } else {
    const robotsEl = document.querySelector('meta[name="robots"]');
    if (robotsEl) {
      robotsEl.remove();
    }
  }

  // Update or create Canonical link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonicalUrl);

  // Update hreflang tags for all 8 languages
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

  SUPPORTED_LANGUAGES.forEach(({ code }) => {
    let langPath = `/${code}/`;
    if (route.view === 'emoji') langPath = `/${code}/emoji/`;
    else if (route.view === 'detail' && route.emojiId) langPath = `/${code}/emoji/${route.emojiId}/`;
    else if (route.view === 'symbols') langPath = `/${code}/symbols/`;
    else if (route.view === 'emoticons') langPath = `/${code}/emoticons/`;
    else if (route.view === 'popular') langPath = `/${code}/popular/`;
    else if (route.view === 'about') langPath = `/${code}/about/`;
    else if (route.view === 'contact') langPath = `/${code}/contact/`;
    else if (route.view === 'privacy') langPath = `/${code}/privacy/`;
    else if (route.view === 'terms') langPath = `/${code}/terms/`;
    else if (route.view === 'favorites') langPath = `/${code}/favorites/`;

    const alt = document.createElement('link');
    alt.setAttribute('rel', 'alternate');
    alt.setAttribute('hreflang', code === 'zh-hans' ? 'zh-Hans' : code === 'zh-hant' ? 'zh-Hant' : code);
    alt.setAttribute('href', `${BASE_DOMAIN}${langPath}`);
    document.head.appendChild(alt);
  });

  // x-default hreflang (points to english version)
  const defaultAlt = document.createElement('link');
  defaultAlt.setAttribute('rel', 'alternate');
  defaultAlt.setAttribute('hreflang', 'x-default');
  let enPath = `/en/`;
  if (route.view === 'detail' && route.emojiId) enPath = `/en/emoji/${route.emojiId}/`;
  else if (route.view === 'emoji') enPath = `/en/emoji/`;
  else if (route.view === 'emoticons') enPath = `/en/emoticons/`;
  else if (route.view === 'symbols') enPath = `/en/symbols/`;
  else if (route.view === 'popular') enPath = `/en/popular/`;
  else if (['about', 'contact', 'privacy', 'terms', 'favorites'].includes(route.view)) enPath = `/en/${route.view}/`;
  defaultAlt.setAttribute('href', `${BASE_DOMAIN}${enPath}`);
  document.head.appendChild(defaultAlt);

  // Schema.org JSON-LD
  let jsonLdEl = document.getElementById('modoo-schema-jsonld');
  if (!jsonLdEl) {
    jsonLdEl = document.createElement('script');
    jsonLdEl.setAttribute('id', 'modoo-schema-jsonld');
    jsonLdEl.setAttribute('type', 'application/ld+json');
    document.head.appendChild(jsonLdEl);
  }

  const t = translations[route.lang];

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE_DOMAIN}/#website`,
        url: BASE_DOMAIN,
        name: siteName,
        alternateName: siteName,
        description: t.brandTagline,
        inLanguage: route.lang,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_DOMAIN}/${route.lang}/search/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description: description,
        inLanguage: route.lang,
        isPartOf: {
          '@id': `${BASE_DOMAIN}/#website`,
        },
      },
    ],
  };

  // If in detail view, add BreadcrumbList schema
  if (route.view === 'detail' && route.emojiId) {
    structuredData['@graph'].push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t.navHome,
          item: `${BASE_DOMAIN}/${route.lang}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t.navEmoji,
          item: `${BASE_DOMAIN}/${route.lang}/emoji/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: title,
          item: canonicalUrl,
        },
      ],
    });
  } else if (route.view === 'emoticons') {
    structuredData['@graph'].push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t.navHome,
          item: `${BASE_DOMAIN}/${route.lang}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t.emoticonsTitle,
          item: canonicalUrl,
        },
      ],
    });
  }

  jsonLdEl.textContent = JSON.stringify(structuredData);
}
