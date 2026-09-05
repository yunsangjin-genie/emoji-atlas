export type Language = 'ko' | 'en' | 'ja' | 'zh-hans' | 'zh-hant' | 'es' | 'fr' | 'de';

export interface LocalizedString {
  ko: string;
  en: string;
  ja: string;
  'zh-hans': string;
  'zh-hant': string;
  es: string;
  fr: string;
  de: string;
}

export interface LocalizedKeywords {
  ko: string[];
  en: string[];
  ja?: string[];
  'zh-hans'?: string[];
  'zh-hant'?: string[];
  es?: string[];
  fr?: string[];
  de?: string[];
}

export interface EmojiItem {
  id: string; // e.g. 'red-heart', 'grinning-face'
  emoji: string;
  unicode: string; // e.g. 'U+2764' or 'U+1F600'
  category: string; // e.g. 'smileys-emotion'
  subcategory?: string;
  version?: string;
  names: LocalizedString;
  keywords: LocalizedKeywords;
  description?: LocalizedString;
  examples?: {
    ko: string[];
    en: string[];
  };
  related?: string[]; // array of emoji strings or ids
  isPopular?: boolean;
}

export interface EmojiCategory {
  id: string;
  icon: string;
  names: LocalizedString;
  descriptions?: LocalizedString;
}

export interface SymbolItem {
  id: string;
  char: string;
  name: LocalizedString;
  category: 'heart' | 'star' | 'flower' | 'arrow' | 'math' | 'bracket' | 'decorations';
}

export interface EmoticonItem {
  id: string;
  text: string;
  name: LocalizedString;
  category: 'cute' | 'funny' | 'love' | 'angry' | 'sad' | 'greeting' | 'thanks' | 'cheering';
}

export interface Emoticon {
  id: string;
  text: string;
  category: string;
  subcategory?: string;
  names: Record<string, string>;
  keywords: Record<string, string[]>;
  tags: string[];
}

export type ViewType = 
  | 'home'
  | 'emoji'
  | 'category'
  | 'detail'
  | 'symbols'
  | 'emoticons'
  | 'popular'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms';

export interface RouteState {
  view: ViewType;
  lang: Language;
  emojiId?: string;
  categoryId?: string;
  symbolCategory?: string;
  emoticonCategory?: string;
  searchQuery?: string;
}
