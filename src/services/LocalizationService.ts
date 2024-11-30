import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

interface Translation {
  [key: string]: string | Translation;
}

interface LocaleConfig {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  numberFormat: {
    decimal: string;
    thousand: string;
    precision: number;
  };
  currency: {
    code: string;
    symbol: string;
    position: 'before' | 'after';
  };
}

interface LocalizationMetrics {
  activeLocale: string;
  availableLocales: string[];
  missingKeys: {
    [locale: string]: string[];
  };
  translationCoverage: {
    [locale: string]: number;
  };
  lastUpdate: number;
}

class LocalizationService {
  private static instance: LocalizationService;
  private translations: { [locale: string]: Translation } = {};
  private configs: { [locale: string]: LocaleConfig } = {};
  private activeLocale: string = 'en-AU';
  private fallbackLocale: string = 'en-AU';
  private metrics: LocalizationMetrics;

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.initializeDefaultConfigs();
  }

  public static getInstance(): LocalizationService {
    if (!LocalizationService.instance) {
      LocalizationService.instance = new LocalizationService();
    }
    return LocalizationService.instance;
  }

  private initializeMetrics(): LocalizationMetrics {
    return {
      activeLocale: this.activeLocale,
      availableLocales: [],
      missingKeys: {},
      translationCoverage: {},
      lastUpdate: Date.now()
    };
  }

  private initializeDefaultConfigs(): void {
    this.configs = {
      'en-AU': {
        code: 'en-AU',
        name: 'English (Australia)',
        direction: 'ltr',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        numberFormat: {
          decimal: '.',
          thousand: ',',
          precision: 2
        },
        currency: {
          code: 'AUD',
          symbol: '$',
          position: 'before'
        }
      }
    };
  }

  public async loadTranslations(locale: string): Promise<void> {
    try {
      const cacheKey = `translations:${locale}`;
      const cached = await cacheService.get<Translation>(cacheKey);

      if (cached) {
        this.translations[locale] = cached;
        logger.debug('Loaded translations from cache', { locale });
        return;
      }

      // In production, this would load from API or file system
      const translations = await this.fetchTranslations(locale);
      this.translations[locale] = translations;

      // Cache the translations
      await cacheService.set(cacheKey, translations, {
        ttl: 3600000, // 1 hour
        type: 'translations'
      });

      this.updateMetrics();
      logger.debug('Loaded translations', { locale });
    } catch (error) {
      logger.error('Failed to load translations', { locale, error });
      throw error;
    }
  }

  private async fetchTranslations(locale: string): Promise<Translation> {
    // This would be replaced with actual API call or file system read
    return {
      common: {
        welcome: 'Welcome',
        loading: 'Loading...',
        error: 'An error occurred'
      },
      navigation: {
        home: 'Home',
        about: 'About',
        contact: 'Contact'
      }
    };
  }

  public async setLocale(locale: string): Promise<void> {
    try {
      if (!this.translations[locale]) {
        await this.loadTranslations(locale);
      }

      this.activeLocale = locale;
      this.updateMetrics();

      // Update document direction
      if (typeof document !== 'undefined') {
        document.documentElement.dir = this.getConfig(locale).direction;
        document.documentElement.lang = locale;
      }

      logger.debug('Locale changed', { locale });
    } catch (error) {
      logger.error('Failed to set locale', { locale, error });
      throw error;
    }
  }

  public translate(key: string, params: { [key: string]: string | number } = {}): string {
    try {
      const keys = key.split('.');
      let translation: any = this.translations[this.activeLocale];

      for (const k of keys) {
        translation = translation?.[k];
      }

      if (!translation) {
        // Try fallback locale
        translation = this.translations[this.fallbackLocale];
        for (const k of keys) {
          translation = translation?.[k];
        }

        if (!translation) {
          this.recordMissingKey(key);
          return key;
        }
      }

      return this.interpolate(translation, params);
    } catch (error) {
      logger.error('Translation error', { key, error });
      return key;
    }
  }

  private interpolate(text: string, params: { [key: string]: string | number }): string {
    return text.replace(/{{\s*([^}\s]+)\s*}}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  private recordMissingKey(key: string): void {
    if (!this.metrics.missingKeys[this.activeLocale]) {
      this.metrics.missingKeys[this.activeLocale] = [];
    }
    if (!this.metrics.missingKeys[this.activeLocale].includes(key)) {
      this.metrics.missingKeys[this.activeLocale].push(key);
      this.updateMetrics();
    }
  }

  public getConfig(locale: string = this.activeLocale): LocaleConfig {
    return this.configs[locale] || this.configs[this.fallbackLocale];
  }

  public formatDate(date: Date | string | number, format?: string): string {
    const config = this.getConfig();
    format = format || config.dateFormat;
    const d = new Date(date);

    return d.toLocaleDateString(this.activeLocale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  public formatTime(date: Date | string | number, format?: string): string {
    const config = this.getConfig();
    format = format || config.timeFormat;
    const d = new Date(date);

    return d.toLocaleTimeString(this.activeLocale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  public formatNumber(
    number: number,
    precision?: number,
    format: 'decimal' | 'currency' | 'percent' = 'decimal'
  ): string {
    const config = this.getConfig();
    precision = precision ?? config.numberFormat.precision;

    return number.toLocaleString(this.activeLocale, {
      style: format,
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
      currency: config.currency.code
    });
  }

  private updateMetrics(): void {
    this.metrics = {
      activeLocale: this.activeLocale,
      availableLocales: Object.keys(this.translations),
      missingKeys: { ...this.metrics.missingKeys },
      translationCoverage: this.calculateCoverage(),
      lastUpdate: Date.now()
    };
  }

  private calculateCoverage(): { [locale: string]: number } {
    const coverage: { [locale: string]: number } = {};
    const baseKeys = this.getAllKeys(this.translations[this.fallbackLocale]);

    Object.keys(this.translations).forEach(locale => {
      const localeKeys = this.getAllKeys(this.translations[locale]);
      coverage[locale] = (localeKeys.length / baseKeys.length) * 100;
    });

    return coverage;
  }

  private getAllKeys(obj: any, prefix: string = ''): string[] {
    let keys: string[] = [];
    for (const key in obj) {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object') {
        keys = [...keys, ...this.getAllKeys(obj[key], newPrefix)];
      } else {
        keys.push(newPrefix);
      }
    }
    return keys;
  }

  public getMetrics(): LocalizationMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      configs: this.configs,
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const localizationService = LocalizationService.getInstance();
export default LocalizationService;
