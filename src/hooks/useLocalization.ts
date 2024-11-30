import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { localizationService } from '@/services/LocalizationService';
import { logger } from '@/utils/logger';

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

interface UseLocalizationOptions {
  defaultLocale?: string;
  onMissingKey?: (key: string, locale: string) => void;
  onError?: (error: Error) => void;
}

export function useLocalization(options: UseLocalizationOptions = {}) {
  const {
    defaultLocale = 'en-AU',
    onMissingKey,
    onError
  } = options;

  const pathname = usePathname();
  const [metrics, setMetrics] = useState<LocalizationMetrics>(localizationService.getMetrics());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Extract locale from pathname if available
    const localeMatch = pathname?.match(/^\/([a-z]{2}-[A-Z]{2})/);
    const localeFromPath = localeMatch ? localeMatch[1] : defaultLocale;

    setLocale(localeFromPath);
  }, [pathname, defaultLocale]);

  const setLocale = useCallback(async (locale: string) => {
    try {
      setIsLoading(true);
      await localizationService.setLocale(locale);
      setMetrics(localizationService.getMetrics());
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to set locale');
      onError?.(err);
      logger.error('Failed to set locale', { locale, error });
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const t = useCallback((
    key: string,
    params: { [key: string]: string | number } = {}
  ): string => {
    try {
      const translation = localizationService.translate(key, params);
      if (translation === key) {
        onMissingKey?.(key, metrics.activeLocale);
      }
      return translation;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Translation failed');
      onError?.(err);
      logger.error('Translation error', { key, error });
      return key;
    }
  }, [metrics.activeLocale, onMissingKey, onError]);

  const formatDate = useCallback((
    date: Date | string | number,
    format?: string
  ): string => {
    try {
      return localizationService.formatDate(date, format);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Date formatting failed');
      onError?.(err);
      logger.error('Date formatting error', { date, error });
      return String(date);
    }
  }, [onError]);

  const formatTime = useCallback((
    date: Date | string | number,
    format?: string
  ): string => {
    try {
      return localizationService.formatTime(date, format);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Time formatting failed');
      onError?.(err);
      logger.error('Time formatting error', { date, error });
      return String(date);
    }
  }, [onError]);

  const formatNumber = useCallback((
    number: number,
    precision?: number,
    format: 'decimal' | 'currency' | 'percent' = 'decimal'
  ): string => {
    try {
      return localizationService.formatNumber(number, precision, format);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Number formatting failed');
      onError?.(err);
      logger.error('Number formatting error', { number, error });
      return String(number);
    }
  }, [onError]);

  const getConfig = useCallback(() => {
    return localizationService.getConfig();
  }, []);

  const getCoverage = useCallback((locale?: string) => {
    return metrics.translationCoverage[locale || metrics.activeLocale] || 0;
  }, [metrics]);

  const getMissingKeys = useCallback((locale?: string) => {
    return metrics.missingKeys[locale || metrics.activeLocale] || [];
  }, [metrics]);

  const generateReport = useCallback(async () => {
    try {
      return await localizationService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Report generation failed');
      onError?.(err);
      logger.error('Report generation error', { error });
      throw err;
    }
  }, [onError]);

  return {
    t,
    formatDate,
    formatTime,
    formatNumber,
    setLocale,
    getConfig,
    getCoverage,
    getMissingKeys,
    generateReport,
    metrics,
    isLoading
  };
}

// Example usage:
/*
function MyComponent() {
  const {
    t,
    formatDate,
    formatNumber,
    metrics,
    isLoading
  } = useLocalization({
    defaultLocale: 'en-AU',
    onMissingKey: (key, locale) => {
      console.warn(`Missing translation: ${key} (${locale})`);
    }
  });

  if (isLoading) return <div>Loading translations...</div>;

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.message', { name: 'User' })}</p>
      <div>Date: {formatDate(new Date())}</div>
      <div>Price: {formatNumber(99.99, 2, 'currency')}</div>
      <div>Coverage: {metrics.translationCoverage['en-AU']}%</div>
    </div>
  );
}
*/
