import { logger } from '@/utils/logger';
import { cacheService } from './CacheService';

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

interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

interface BorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

interface ThemeConfig {
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
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

class ThemeService {
  private static instance: ThemeService;
  private themes: Map<string, ThemeConfig> = new Map();
  private activeTheme: string = 'light';
  private metrics: ThemeMetrics;
  private observers: ((theme: string) => void)[] = [];

  private constructor() {
    this.metrics = this.initializeMetrics();
    this.initializeDefaultThemes();
  }

  public static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  private initializeMetrics(): ThemeMetrics {
    return {
      activeTheme: this.activeTheme,
      availableThemes: [],
      customProperties: 0,
      lastUpdate: Date.now()
    };
  }

  private initializeDefaultThemes(): void {
    this.registerTheme('light', {
      name: 'Light Theme',
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        accent: '#F59E0B',
        background: '#FFFFFF',
        surface: '#F3F4F6',
        text: '#1F2937',
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
        info: '#3B82F6'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        lineHeight: {
          none: 1,
          tight: 1.25,
          snug: 1.375,
          normal: 1.5,
          relaxed: 1.625,
          loose: 2
        }
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem'
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.5rem',
        xl: '1rem',
        full: '9999px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      },
      transitions: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms'
        },
        timing: {
          ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
          linear: 'linear',
          bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }
      }
    });

    this.registerTheme('dark', {
      name: 'Dark Theme',
      colors: {
        primary: '#60A5FA',
        secondary: '#9CA3AF',
        accent: '#FBBF24',
        background: '#1F2937',
        surface: '#374151',
        text: '#F9FAFB',
        error: '#F87171',
        warning: '#FBBF24',
        success: '#34D399',
        info: '#60A5FA'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        lineHeight: {
          none: 1,
          tight: 1.25,
          snug: 1.375,
          normal: 1.5,
          relaxed: 1.625,
          loose: 2
        }
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem'
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.5rem',
        xl: '1rem',
        full: '9999px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
      },
      transitions: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms'
        },
        timing: {
          ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
          linear: 'linear',
          bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }
      }
    });
  }

  public async setTheme(name: string): Promise<void> {
    try {
      if (!this.themes.has(name)) {
        throw new Error(`Theme '${name}' not found`);
      }

      this.activeTheme = name;
      this.updateMetrics();
      this.applyTheme();
      this.notifyObservers();

      // Cache the active theme
      await cacheService.set(`theme:active`, name, {
        ttl: 0, // No expiration
        type: 'theme'
      });

      logger.debug('Theme changed', { name });
    } catch (error) {
      logger.error('Failed to set theme', { name, error });
      throw error;
    }
  }

  private applyTheme(): void {
    if (typeof document === 'undefined') return;

    const theme = this.getTheme();
    const root = document.documentElement;

    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply typography
    root.style.setProperty('--font-family', theme.typography.fontFamily);
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Apply shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Apply transitions
    Object.entries(theme.transitions.duration).forEach(([key, value]) => {
      root.style.setProperty(`--duration-${key}`, value);
    });
    Object.entries(theme.transitions.timing).forEach(([key, value]) => {
      root.style.setProperty(`--timing-${key}`, value);
    });
  }

  public registerTheme(name: string, config: ThemeConfig): void {
    try {
      this.themes.set(name, config);
      this.updateMetrics();
      logger.debug('Theme registered', { name });
    } catch (error) {
      logger.error('Failed to register theme', { name, error });
      throw error;
    }
  }

  public getTheme(name: string = this.activeTheme): ThemeConfig {
    const theme = this.themes.get(name);
    if (!theme) {
      throw new Error(`Theme '${name}' not found`);
    }
    return theme;
  }

  public onThemeChange(callback: (theme: string) => void): () => void {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  private notifyObservers(): void {
    this.observers.forEach(callback => {
      try {
        callback(this.activeTheme);
      } catch (error) {
        logger.error('Theme change callback failed', { error });
      }
    });
  }

  private updateMetrics(): void {
    this.metrics = {
      activeTheme: this.activeTheme,
      availableThemes: Array.from(this.themes.keys()),
      customProperties: this.countCustomProperties(),
      lastUpdate: Date.now()
    };
  }

  private countCustomProperties(): number {
    const theme = this.getTheme();
    let count = 0;

    // Count color properties
    count += Object.keys(theme.colors).length;

    // Count typography properties
    count += Object.keys(theme.typography.fontSize).length;
    count += Object.keys(theme.typography.fontWeight).length;
    count += Object.keys(theme.typography.lineHeight).length;
    count += 1; // fontFamily

    // Count spacing properties
    count += Object.keys(theme.spacing).length;

    // Count border radius properties
    count += Object.keys(theme.borderRadius).length;

    // Count shadow properties
    count += Object.keys(theme.shadows).length;

    // Count transition properties
    count += Object.keys(theme.transitions.duration).length;
    count += Object.keys(theme.transitions.timing).length;

    return count;
  }

  public getMetrics(): ThemeMetrics {
    return { ...this.metrics };
  }

  public async generateReport(): Promise<string> {
    const report = {
      metrics: this.metrics,
      themes: Array.from(this.themes.entries()).reduce((acc, [name, config]) => {
        acc[name] = config;
        return acc;
      }, {} as Record<string, ThemeConfig>),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }
}

export const themeService = ThemeService.getInstance();
export default ThemeService;
