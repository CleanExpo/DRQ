import { useState, useEffect, useCallback } from 'react';
import { themeService } from '@/services/ThemeService';
import { logger } from '@/utils/logger';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  [key: string]: string;
}

interface Typography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
}

interface ThemeConfig {
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    timing: {
      ease: string;
      linear: string;
      bounce: string;
    };
  };
}

interface ThemeMetrics {
  activeTheme: string;
  availableThemes: string[];
  customProperties: number;
  lastUpdate: number;
}

interface UseThemeOptions {
  defaultTheme?: string;
  onChange?: (theme: string) => void;
  onError?: (error: Error) => void;
}

export function useTheme(options: UseThemeOptions = {}) {
  const {
    defaultTheme = 'light',
    onChange,
    onError
  } = options;

  const [theme, setTheme] = useState<string>(defaultTheme);
  const [metrics, setMetrics] = useState<ThemeMetrics>(themeService.getMetrics());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to theme changes
    const unsubscribe = themeService.onThemeChange((newTheme) => {
      setTheme(newTheme);
      onChange?.(newTheme);
      setMetrics(themeService.getMetrics());
    });

    // Set initial theme
    setTheme(defaultTheme);

    return unsubscribe;
  }, [defaultTheme, onChange]);

  const switchTheme = useCallback(async (themeName: string) => {
    try {
      setIsLoading(true);
      await themeService.setTheme(themeName);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to switch theme');
      onError?.(err);
      logger.error('Theme switch failed', { theme: themeName, error });
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const getThemeConfig = useCallback((themeName?: string): ThemeConfig => {
    try {
      return themeService.getTheme(themeName);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to get theme config');
      onError?.(err);
      logger.error('Failed to get theme config', { theme: themeName, error });
      return themeService.getTheme('light'); // Fallback to light theme
    }
  }, [onError]);

  const getColor = useCallback((key: keyof ColorPalette): string => {
    try {
      const config = getThemeConfig();
      return config.colors[key] || '';
    } catch (error) {
      logger.error('Failed to get color', { key, error });
      return '';
    }
  }, [getThemeConfig]);

  const getFontSize = useCallback((size: keyof Typography['fontSize']): string => {
    try {
      const config = getThemeConfig();
      return config.typography.fontSize[size] || '';
    } catch (error) {
      logger.error('Failed to get font size', { size, error });
      return '';
    }
  }, [getThemeConfig]);

  const getSpacing = useCallback((size: keyof ThemeConfig['spacing']): string => {
    try {
      const config = getThemeConfig();
      return config.spacing[size] || '';
    } catch (error) {
      logger.error('Failed to get spacing', { size, error });
      return '';
    }
  }, [getThemeConfig]);

  const generateReport = useCallback(async () => {
    try {
      return await themeService.generateReport();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to generate report');
      onError?.(err);
      logger.error('Report generation failed', { error });
      throw err;
    }
  }, [onError]);

  return {
    theme,
    metrics,
    isLoading,
    switchTheme,
    getThemeConfig,
    getColor,
    getFontSize,
    getSpacing,
    generateReport
  };
}

// Example usage:
/*
function MyComponent() {
  const {
    theme,
    metrics,
    switchTheme,
    getColor,
    getFontSize
  } = useTheme({
    defaultTheme: 'light',
    onChange: (theme) => {
      console.log('Theme changed:', theme);
    }
  });

  return (
    <div style={{ 
      backgroundColor: getColor('background'),
      color: getColor('text'),
      fontSize: getFontSize('base')
    }}>
      <h1>Current Theme: {theme}</h1>
      <button onClick={() => switchTheme('dark')}>
        Switch to Dark Theme
      </button>
      <div>
        Available Themes: {metrics.availableThemes.join(', ')}
      </div>
    </div>
  );
}
*/
