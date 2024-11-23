type TranslationKey = string;
type Locale = string;

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Default translations
const translations: Translations = {
  'en-AU': {
    'error.title': 'Something went wrong',
    'error.description': 'We apologize for the inconvenience. Our team has been notified and is working to fix the issue.',
    'error.reload': 'Reload page',
    'error.home': 'Return to home',
    'emergency.call': 'Call now'
  }
};

export const translate = (key: TranslationKey, locale: Locale = 'en-AU'): string => {
  try {
    const localeTranslations = translations[locale] || translations['en-AU'];
    return localeTranslations[key] || key;
  } catch (error) {
    console.error(`Translation error for key "${key}" in locale "${locale}"`, error);
    return key;
  }
};
