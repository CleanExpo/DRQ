const locales = [
  'en-AU', // English (Australia)
  'zh',    // Chinese (Simplified)
  'vi',    // Vietnamese
  'pa',    // Punjabi
  'yue',   // Cantonese
  'es',    // Spanish
  'ar',    // Arabic
  'it',    // Italian
  'el',    // Greek
  'tl',    // Tagalog
  'ko'     // Korean
] as const;

export const i18nConfig = {
  defaultLocale: 'en-AU',
  locales,
  localePath: 'public/locales',
  fallbackLng: 'en-AU'
} as const;

export type Locale = typeof locales[number];

export const languageNames: Record<Locale, string> = {
  'en-AU': 'English',
  'zh': '中文',
  'vi': 'Tiếng Việt',
  'pa': 'ਪੰਜਾਬੀ',
  'yue': '粵語',
  'es': 'Español',
  'ar': 'العربية',
  'it': 'Italiano',
  'el': 'Ελληνικά',
  'tl': 'Tagalog',
  'ko': '한국어'
};

export const languageDirections: Record<Locale, 'ltr' | 'rtl'> = {
  'en-AU': 'ltr',
  'zh': 'ltr',
  'vi': 'ltr',
  'pa': 'ltr',
  'yue': 'ltr',
  'es': 'ltr',
  'ar': 'rtl',
  'it': 'ltr',
  'el': 'ltr',
  'tl': 'ltr',
  'ko': 'ltr'
};

export const dateFormatters: Record<Locale, Intl.DateTimeFormat> = {
  'en-AU': new Intl.DateTimeFormat('en-AU'),
  'zh': new Intl.DateTimeFormat('zh'),
  'vi': new Intl.DateTimeFormat('vi'),
  'pa': new Intl.DateTimeFormat('pa'),
  'yue': new Intl.DateTimeFormat('zh-Hant'),
  'es': new Intl.DateTimeFormat('es'),
  'ar': new Intl.DateTimeFormat('ar'),
  'it': new Intl.DateTimeFormat('it'),
  'el': new Intl.DateTimeFormat('el'),
  'tl': new Intl.DateTimeFormat('tl'),
  'ko': new Intl.DateTimeFormat('ko')
};

export const getLanguageName = (locale: Locale): string => {
  return languageNames[locale] || locale;
};

export const getLanguageDirection = (locale: Locale): 'ltr' | 'rtl' => {
  return languageDirections[locale] || 'ltr';
};

export const formatDate = (date: Date | string, locale: Locale): string => {
  const formatter = dateFormatters[locale] || dateFormatters[i18nConfig.defaultLocale];
  return formatter.format(typeof date === 'string' ? new Date(date) : date);
};

export const getSupportedLocales = (): readonly Locale[] => {
  return locales;
};

export const isValidLocale = (locale: string): locale is Locale => {
  return locales.includes(locale as Locale);
};

export const getAlternateLinks = (path: string): Record<Locale, string> => {
  return locales.reduce((acc, locale) => ({
    ...acc,
    [locale]: `/${locale}${path}`
  }), {} as Record<Locale, string>);
};
