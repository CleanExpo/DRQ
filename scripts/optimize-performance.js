#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const sharp = require('sharp');
const glob = require('glob');
const { gzip, brotliCompress } = require('zlib');
const { promisify } = require('util');

// Promisify functions
const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotliCompress);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper function to log with colors
const log = {
  info: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}\n`)
};

class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      lighthouse: {},
      imageOptimization: {
        totalImages: 0,
        optimizedImages: 0,
        spaceSaved: 0
      },
      compression: {
        gzip: {},
        brotli: {}
      },
      bundleSize: {
        before: 0,
        after: 0
      }
    };
  }

  async runLighthouse() {
    log.info('Running Lighthouse audit...');
    
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = {
      logLevel: 'info',
      output: 'json',
      port: chrome.port,
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo']
    };

    try {
      const results = await lighthouse('http://localhost:3002', options);
      this.metrics.lighthouse = {
        performance: results.lhr.categories.performance.score * 100,
        accessibility: results.lhr.categories.accessibility.score * 100,
        bestPractices: results.lhr.categories['best-practices'].score * 100,
        seo: results.lhr.categories.seo.score * 100
      };

      log.success('Lighthouse audit completed');
    } catch (error) {
      log.error('Lighthouse audit failed:', error);
    } finally {
      await chrome.kill();
    }
  }

  async optimizeImages() {
    log.info('Optimizing images...');

    const images = glob.sync('public/**/*.{jpg,jpeg,png,gif}');
    this.metrics.imageOptimization.totalImages = images.length;

    for (const image of images) {
      const originalSize = fs.statSync(image).size;
      const outputPath = image.replace(/\.[^.]+$/, '.webp');

      try {
        await sharp(image)
          .webp({ quality: 80 })
          .toFile(outputPath);

        const optimizedSize = fs.statSync(outputPath).size;
        const saved = originalSize - optimizedSize;
        
        this.metrics.imageOptimization.optimizedImages++;
        this.metrics.imageOptimization.spaceSaved += saved;

        log.success(`Optimized: ${image} (saved ${(saved / 1024).toFixed(2)}KB)`);
      } catch (error) {
        log.error(`Failed to optimize ${image}:`, error);
      }
    }
  }

  async compressAssets() {
    log.info('Compressing assets...');

    const assets = glob.sync('.next/static/**/*.{js,css}');
    
    for (const asset of assets) {
      const content = fs.readFileSync(asset);
      
      try {
        // Gzip compression
        const gzipped = await gzipAsync(content);
        fs.writeFileSync(`${asset}.gz`, gzipped);
        this.metrics.compression.gzip[asset] = {
          original: content.length,
          compressed: gzipped.length
        };

        // Brotli compression
        const brotlied = await brotliAsync(content);
        fs.writeFileSync(`${asset}.br`, brotlied);
        this.metrics.compression.brotli[asset] = {
          original: content.length,
          compressed: brotlied.length
        };

        log.success(`Compressed: ${asset}`);
      } catch (error) {
        log.error(`Failed to compress ${asset}:`, error);
      }
    }
  }

  async analyzeBundleSize() {
    log.info('Analyzing bundle size...');

    try {
      // Get initial bundle size
      const initialStats = execSync('next build --stats', { encoding: 'utf8' });
      this.metrics.bundleSize.before = this.parseBundleStats(initialStats);

      // Optimize bundle
      execSync('next build --no-lint --no-mangling');
      
      // Get optimized bundle size
      const finalStats = execSync('next build --stats', { encoding: 'utf8' });
      this.metrics.bundleSize.after = this.parseBundleStats(finalStats);

      log.success('Bundle analysis completed');
    } catch (error) {
      log.error('Bundle analysis failed:', error);
    }
  }

  parseBundleStats(stats) {
    // Parse Next.js build stats
    const totalSize = stats.match(/Total Size: ([\d.]+\s*\w+)/)?.[1] || '0 B';
    return this.convertToBytes(totalSize);
  }

  convertToBytes(size) {
    const units = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024
    };

    const [value, unit] = size.split(' ');
    return parseFloat(value) * units[unit.toUpperCase()];
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      improvements: {
        images: {
          count: this.metrics.imageOptimization.optimizedImages,
          spaceSaved: `${(this.metrics.imageOptimization.spaceSaved / 1024 / 1024).toFixed(2)}MB`
        },
        bundle: {
          reduction: `${((1 - this.metrics.bundleSize.after / this.metrics.bundleSize.before) * 100).toFixed(2)}%`
        },
        compression: {
          averageReduction: {
            gzip: this.calculateCompressionRatio(this.metrics.compression.gzip),
            brotli: this.calculateCompressionRatio(this.metrics.compression.brotli)
          }
        }
      },
      recommendations: this.generateRecommendations()
    };

    fs.mkdirSync('reports', { recursive: true });
    fs.writeFileSync(
      'reports/performance-optimization.json',
      JSON.stringify(report, null, 2)
    );

    return report;
  }

  calculateCompressionRatio(compressionData) {
    const ratios = Object.values(compressionData).map(
      ({ original, compressed }) => (original - compressed) / original
    );
    const average = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    return `${(average * 100).toFixed(2)}%`;
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.metrics.lighthouse.performance < 90) {
      recommendations.push('Improve overall performance score');
    }
    if (this.metrics.lighthouse.accessibility < 90) {
      recommendations.push('Address accessibility issues');
    }
    if (this.metrics.bundleSize.after > 1024 * 1024) {
      recommendations.push('Further optimize bundle size');
    }
    if (this.metrics.imageOptimization.spaceSaved < 1024 * 1024) {
      recommendations.push('Consider additional image optimization');
    }

    return recommendations;
  }

  displaySummary(report) {
    log.title('Performance Optimization Summary');

    log.info('Lighthouse Scores:');
    Object.entries(report.metrics.lighthouse).forEach(([metric, score]) => {
      const color = score >= 90 ? colors.green : score >= 70 ? colors.yellow : colors.red;
      console.log(`${metric}: ${color}${score}${colors.reset}`);
    });

    log.info('\nOptimizations:');
    console.log(`Images Optimized: ${report.improvements.images.count}`);
    console.log(`Space Saved: ${report.improvements.images.spaceSaved}`);
    console.log(`Bundle Size Reduction: ${report.improvements.bundle.reduction}`);
    console.log(`Average Gzip Reduction: ${report.improvements.compression.averageReduction.gzip}`);
    console.log(`Average Brotli Reduction: ${report.improvements.compression.averageReduction.brotli}`);

    if (report.recommendations.length > 0) {
      log.info('\nRecommendations:');
      report.recommendations.forEach(rec => {
        console.log(`${colors.yellow}• ${rec}${colors.reset}`);
      });
    }
  }

  async optimize() {
    try {
      await this.runLighthouse();
      await this.optimizeImages();
      await this.compressAssets();
      await this.analyzeBundleSize();
      
      const report = this.generateReport();
      this.displaySummary(report);
    } catch (error) {
      log.error('Optimization failed:', error);
      process.exit(1);
    }
  }
}

// Run optimizer
const optimizer = new PerformanceOptimizer();
optimizer.optimize().catch(console.error);
