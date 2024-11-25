export const i18nConfig = {
  defaultLocale: 'en-AU',
  locales: ['en-AU', 'zh', 'vi', 'pa', 'yue', 'es', 'ar', 'it', 'el', 'tl', 'ko'] as const
} as const

export type Locale = typeof i18nConfig.locales[number]

export default i18nConfig
