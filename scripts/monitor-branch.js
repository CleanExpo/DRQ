#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const winston = require('winston');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/branch-error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/branch-combined.log' 
    })
  ]
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

class BranchMonitor {
  constructor() {
    this.branchName = execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .trim();
    this.startTime = Date.now();
    this.metrics = {
      buildTime: 0,
      testsPassing: 0,
      totalTests: 0,
      lintErrors: 0,
      typeErrors: 0,
      unusedDeps: [],
      outdatedDeps: [],
      performance: {},
    };
  }

  async monitorBuild() {
    try {
      logger.info('Starting build monitoring');
      
      // Run build and capture metrics
      const buildStart = Date.now();
      execSync('npm run build', { stdio: 'pipe' });
      this.metrics.buildTime = Date.now() - buildStart;
      
      logger.info('Build completed', { buildTime: this.metrics.buildTime });
    } catch (error) {
      logger.error('Build failed', { error: error.message });
      throw error;
    }
  }

  async runTests() {
    try {
      logger.info('Running tests');
      
      const testOutput = execSync('npm run test:ci', { stdio: 'pipe' })
        .toString();
      
      // Parse test results
      const matches = testOutput.match(/Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/);
      if (matches) {
        this.metrics.testsPassing = parseInt(matches[1]);
        this.metrics.totalTests = parseInt(matches[2]);
      }
      
      logger.info('Tests completed', {
        passing: this.metrics.testsPassing,
        total: this.metrics.totalTests
      });
    } catch (error) {
      logger.error('Tests failed', { error: error.message });
      throw error;
    }
  }

  async checkCode() {
    try {
      logger.info('Checking code quality');
      
      // Run ESLint
      try {
        execSync('npm run lint', { stdio: 'pipe' });
      } catch (error) {
        this.metrics.lintErrors = (error.stdout.match(/problems/g) || []).length;
      }

      // Run TypeScript check
      try {
        execSync('npm run type-check', { stdio: 'pipe' });
      } catch (error) {
        this.metrics.typeErrors = (error.stdout.match(/error TS/g) || []).length;
      }

      logger.info('Code check completed', {
        lintErrors: this.metrics.lintErrors,
        typeErrors: this.metrics.typeErrors
      });
    } catch (error) {
      logger.error('Code check failed', { error: error.message });
      throw error;
    }
  }

  async checkDependencies() {
    try {
      logger.info('Checking dependencies');
      
      // Check for unused dependencies
      const depcheck = require('depcheck');
      const unused = await depcheck(process.cwd());
      this.metrics.unusedDeps = unused.dependencies;

      // Check for outdated dependencies
      const outdated = execSync('npm outdated --json', { stdio: 'pipe' })
        .toString();
      this.metrics.outdatedDeps = JSON.parse(outdated);

      logger.info('Dependency check completed', {
        unused: this.metrics.unusedDeps.length,
        outdated: Object.keys(this.metrics.outdatedDeps).length
      });
    } catch (error) {
      logger.error('Dependency check failed', { error: error.message });
    }
  }

  async checkPerformance() {
    try {
      logger.info('Checking performance');
      
      // Run Lighthouse CI
      const lighthouse = require('lighthouse');
      const chrome = require('chrome-launcher');

      const chrome = await chrome.launch();
      const options = {
        logLevel: 'info',
        output: 'json',
        port: chrome.port,
      };

      const results = await lighthouse('http://localhost:3002', options);
      await chrome.kill();

      this.metrics.performance = {
        performance: results.lhr.categories.performance.score * 100,
        accessibility: results.lhr.categories.accessibility.score * 100,
        bestPractices: results.lhr.categories['best-practices'].score * 100,
        seo: results.lhr.categories.seo.score * 100,
      };

      logger.info('Performance check completed', this.metrics.performance);
    } catch (error) {
      logger.error('Performance check failed', { error: error.message });
    }
  }

  generateReport() {
    const reportPath = path.join('reports', `branch-report-${this.branchName}.json`);
    const report = {
      branch: this.branchName,
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime,
      metrics: this.metrics,
      summary: {
        status: this.getSummaryStatus(),
        recommendations: this.getRecommendations(),
      }
    };

    fs.mkdirSync('reports', { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    logger.info('Report generated', { path: reportPath });
    return report;
  }

  getSummaryStatus() {
    const checks = {
      build: this.metrics.buildTime < 120000,
      tests: this.metrics.testsPassing === this.metrics.totalTests,
      lint: this.metrics.lintErrors === 0,
      types: this.metrics.typeErrors === 0,
      performance: this.metrics.performance.performance > 90,
    };

    return Object.entries(checks).reduce((acc, [key, value]) => {
      acc[key] = value ? 'pass' : 'fail';
      return acc;
    }, {});
  }

  getRecommendations() {
    const recommendations = [];

    if (this.metrics.buildTime > 120000) {
      recommendations.push('Consider optimizing build time');
    }
    if (this.metrics.lintErrors > 0) {
      recommendations.push('Fix linting errors');
    }
    if (this.metrics.typeErrors > 0) {
      recommendations.push('Fix type errors');
    }
    if (this.metrics.unusedDeps.length > 0) {
      recommendations.push('Remove unused dependencies');
    }
    if (Object.keys(this.metrics.outdatedDeps).length > 0) {
      recommendations.push('Update outdated dependencies');
    }
    if (this.metrics.performance.performance < 90) {
      recommendations.push('Improve performance score');
    }

    return recommendations;
  }

  displaySummary(report) {
    console.log(`\n${colors.bright}Branch Monitor Summary${colors.reset}\n`);
    console.log(`Branch: ${colors.cyan}${report.branch}${colors.reset}`);
    console.log(`Duration: ${report.duration}ms\n`);

    console.log(`${colors.bright}Status:${colors.reset}`);
    Object.entries(report.summary.status).forEach(([key, value]) => {
      const color = value === 'pass' ? colors.green : colors.red;
      console.log(`${key}: ${color}${value}${colors.reset}`);
    });

    if (report.summary.recommendations.length > 0) {
      console.log(`\n${colors.bright}Recommendations:${colors.reset}`);
      report.summary.recommendations.forEach(rec => {
        console.log(`${colors.yellow}• ${rec}${colors.reset}`);
      });
    }
  }

  async monitor() {
    try {
      await this.monitorBuild();
      await this.runTests();
      await this.checkCode();
      await this.checkDependencies();
      await this.checkPerformance();
      
      const report = this.generateReport();
      this.displaySummary(report);
    } catch (error) {
      logger.error('Monitoring failed', { error: error.message });
      process.exit(1);
    }
  }
}

// Run monitor
const monitor = new BranchMonitor();
monitor.monitor().catch(console.error);
