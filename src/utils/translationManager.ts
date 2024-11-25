import fs from 'fs/promises';
import path from 'path';
import { Locale, i18nConfig } from '../config/i18n.config';

interface TranslationStatus {
  locale: Locale;
  completionPercentage: number;
  missingKeys: string[];
  outdatedKeys: string[];
  lastUpdated: string;
}

interface TranslationDiff {
  added: string[];
  removed: string[];
  modified: string[];
}

export class TranslationManager {
  private readonly localesDir: string;
  private readonly defaultLocale: Locale;

  constructor() {
    this.localesDir = path.join(process.cwd(), 'public/locales');
    this.defaultLocale = i18nConfig.defaultLocale;
  }

  /**
   * Get translation status for all locales
   */
  async getTranslationStatus(): Promise<TranslationStatus[]> {
    const defaultTranslations = await this.loadTranslations(this.defaultLocale);
    const defaultKeys = this.flattenKeys(defaultTranslations);
    const statuses: TranslationStatus[] = [];

    for (const locale of i18nConfig.locales) {
      if (locale === this.defaultLocale) continue;

      const translations = await this.loadTranslations(locale);
      const localeKeys = this.flattenKeys(translations);
      const missingKeys = defaultKeys.filter(key => !localeKeys.includes(key));
      const outdatedKeys = localeKeys.filter(key => 
        this.isKeyOutdated(key, defaultTranslations, translations)
      );

      const completionPercentage = (
        ((defaultKeys.length - missingKeys.length) / defaultKeys.length) * 100
      ).toFixed(2);

      const stats = await fs.stat(path.join(this.localesDir, locale, 'common.json'));

      statuses.push({
        locale,
        completionPercentage: parseFloat(completionPercentage),
        missingKeys,
        outdatedKeys,
        lastUpdated: stats.mtime.toISOString()
      });
    }

    return statuses;
  }

  /**
   * Generate translation template for new keys
   */
  async generateTranslationTemplate(): Promise<Record<string, string>> {
    const defaultTranslations = await this.loadTranslations(this.defaultLocale);
    const template: Record<string, string> = {};

    for (const locale of i18nConfig.locales) {
      if (locale === this.defaultLocale) continue;

      const translations = await this.loadTranslations(locale);
      const diff = await this.getTranslationDiff(defaultTranslations, translations);

      for (const key of diff.added) {
        template[key] = defaultTranslations[key];
      }
    }

    return template;
  }

  /**
   * Sync translations with default locale
   */
  async syncTranslations(locale: Locale): Promise<void> {
    const defaultTranslations = await this.loadTranslations(this.defaultLocale);
    const translations = await this.loadTranslations(locale);
    const diff = await this.getTranslationDiff(defaultTranslations, translations);

    // Add missing keys with default values
    for (const key of diff.added) {
      translations[key] = defaultTranslations[key];
    }

    // Remove obsolete keys
    for (const key of diff.removed) {
      delete translations[key];
    }

    await this.saveTranslations(locale, translations);
  }

  /**
   * Export translations for external translation service
   */
  async exportTranslations(locale: Locale): Promise<string> {
    const translations = await this.loadTranslations(locale);
    return JSON.stringify(translations, null, 2);
  }

  /**
   * Import translations from external translation service
   */
  async importTranslations(locale: Locale, content: string): Promise<void> {
    try {
      const translations = JSON.parse(content);
      await this.saveTranslations(locale, translations);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to import translations: ${error.message}`);
      }
      throw new Error('Failed to import translations: Unknown error');
    }
  }

  /**
   * Load translations from file
   */
  private async loadTranslations(locale: Locale): Promise<Record<string, any>> {
    try {
      const content = await fs.readFile(
        path.join(this.localesDir, locale, 'common.json'),
        'utf-8'
      );
      return JSON.parse(content);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load translations for ${locale}: ${error.message}`);
      }
      throw new Error(`Failed to load translations for ${locale}: Unknown error`);
    }
  }

  /**
   * Save translations to file
   */
  private async saveTranslations(
    locale: Locale,
    translations: Record<string, any>
  ): Promise<void> {
    try {
      await fs.writeFile(
        path.join(this.localesDir, locale, 'common.json'),
        JSON.stringify(translations, null, 2),
        'utf-8'
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to save translations for ${locale}: ${error.message}`);
      }
      throw new Error(`Failed to save translations for ${locale}: Unknown error`);
    }
  }

  /**
   * Get differences between two translation objects
   */
  private async getTranslationDiff(
    source: Record<string, any>,
    target: Record<string, any>
  ): Promise<TranslationDiff> {
    const sourceKeys = this.flattenKeys(source);
    const targetKeys = this.flattenKeys(target);

    return {
      added: sourceKeys.filter(key => !targetKeys.includes(key)),
      removed: targetKeys.filter(key => !sourceKeys.includes(key)),
      modified: sourceKeys.filter(key => 
        targetKeys.includes(key) && 
        this.isKeyOutdated(key, source, target)
      )
    };
  }

  /**
   * Flatten nested translation keys
   */
  private flattenKeys(obj: Record<string, any>, prefix = ''): string[] {
    return Object.entries(obj).reduce((acc: string[], [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        return [...acc, ...this.flattenKeys(value, newKey)];
      }
      return [...acc, newKey];
    }, []);
  }

  /**
   * Check if a translation key is outdated
   */
  private isKeyOutdated(
    key: string,
    source: Record<string, any>,
    target: Record<string, any>
  ): boolean {
    const sourceValue = this.getNestedValue(source, key);
    const targetValue = this.getNestedValue(target, key);
    return sourceValue !== targetValue;
  }

  /**
   * Get nested object value by dot notation
   */
  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Export singleton instance
export const translationManager = new TranslationManager();
