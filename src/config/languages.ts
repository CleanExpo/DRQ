export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export const languages: Language[] = [
  {
    code: 'en-AU',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    direction: 'ltr'
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    direction: 'ltr'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    direction: 'ltr'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    direction: 'ltr'
  },
  {
    code: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    direction: 'ltr'
  },
  {
    code: 'tl',
    name: 'Tagalog',
    nativeName: 'Tagalog',
    direction: 'ltr'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr'
  }
];

export const defaultLanguage = 'en-AU';

export function getLanguage(code: string): Language | undefined {
  return languages.find(lang => lang.code === code);
}

export function isValidLanguage(code: string): boolean {
  return languages.some(lang => lang.code === code);
}
