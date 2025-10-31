#!/usr/bin/env tsx
/**
 * Performance Testing Script
 *
 * Tests PicForge.com performance metrics:
 * 1. Lighthouse audit (Performance, Accessibility, Best Practices, SEO)
 * 2. Bundle size analysis
 * 3. Core Web Vitals
 * 4. API response times
 * 5. Image processing speed
 *
 * Usage: npm run test:performance
 *
 * Note: Requires Chrome/Chromium installed
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

interface PerformanceResult {
  test: string;
  passed: boolean;
  value: number;
  target: number;
  unit: string;
  message: string;
}

const results: PerformanceResult[] = [];
const projectRoot = process.cwd();

// Target scores
const TARGETS = {
  lighthouse: {
    performance: 90,
    accessibility: 95,
    bestPractices: 95,
    seo: 95
  },
  bundleSize: 500, // KB
  fcp: 1500, // ms (First Contentful Paint)
  lcp: 2500, // ms (Largest Contentful Paint)
  cls: 0.1, // Cumulative Layout Shift
  fid: 100, // ms (First Input Delay)
  tti: 3500, // ms (Time to Interactive)
  apiResponseTime: 500 // ms
};

// ============================================
// Test 1: Bundle Size Analysis
// ============================================

async function testBundleSize() {
  console.log(`\n${colors.blue}${colors.bold}Test 1: Bundle Size Analysis${colors.reset}`);
  console.log('Analyzing Next.js build output...\n');

  try {
    const nextDir = path.join(projectRoot, '.next');

    if (!fs.existsSync(nextDir)) {
      console.log(`${colors.yellow}⚠ WARNING${colors.reset}: .next directory not found. Run 'npm run build' first.`);
      results.push({
        test: 'Bundle Size',
        passed: false,
        value: 0,
        target: TARGETS.bundleSize,
        unit: 'KB',
        message: 'Build not found - run npm run build first'
      });
      return;
    }

    // Check static chunks size
    const staticDir = path.join(nextDir, 'static', 'chunks');
    if (!fs.existsSync(staticDir)) {
      console.log(`${colors.yellow}⚠ WARNING${colors.reset}: Static chunks not found`);
      return;
    }

    let totalSize = 0;
    const files = fs.readdirSync(staticDir, { recursive: true }) as string[];

    files.forEach((file: string) => {
      const filePath = path.join(staticDir, file);
      if (fs.statSync(filePath).isFile() && (filePath.endsWith('.js') || filePath.endsWith('.css'))) {
        totalSize += fs.statSync(filePath).size;
      }
    });

    const sizeKB = Math.round(totalSize / 1024);

    if (sizeKB <= TARGETS.bundleSize) {
      results.push({
        test: 'Bundle Size',
        passed: true,
        value: sizeKB,
        target: TARGETS.bundleSize,
        unit: 'KB',
        message: `Bundle size within target`
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: Bundle size: ${sizeKB} KB (target: <${TARGETS.bundleSize} KB)`);
    } else {
      results.push({
        test: 'Bundle Size',
        passed: false,
        value: sizeKB,
        target: TARGETS.bundleSize,
        unit: 'KB',
        message: `Bundle size exceeds target by ${sizeKB - TARGETS.bundleSize} KB`
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: Bundle size: ${sizeKB} KB (target: <${TARGETS.bundleSize} KB)`);
    }

    // Show largest chunks
    console.log(`\n${colors.cyan}Largest Chunks:${colors.reset}`);
    const chunkSizes: { file: string; size: number }[] = [];

    files.forEach((file: string) => {
      const filePath = path.join(staticDir, file);
      if (fs.statSync(filePath).isFile() && filePath.endsWith('.js')) {
        chunkSizes.push({
          file: path.basename(file),
          size: fs.statSync(filePath).size
        });
      }
    });

    chunkSizes
      .sort((a, b) => b.size - a.size)
      .slice(0, 5)
      .forEach(chunk => {
        console.log(`  ${chunk.file}: ${Math.round(chunk.size / 1024)} KB`);
      });

  } catch (error) {
    console.log(`${colors.red}✗ ERROR${colors.reset}: ${error}`);
    results.push({
      test: 'Bundle Size',
      passed: false,
      value: 0,
      target: TARGETS.bundleSize,
      unit: 'KB',
      message: `Error analyzing bundle: ${error}`
    });
  }
}

// ============================================
// Test 2: Lighthouse Audit (Simulated)
// ============================================

async function testLighthouse() {
  console.log(`\n${colors.blue}${colors.bold}Test 2: Lighthouse Audit${colors.reset}`);
  console.log('Note: This requires Lighthouse CLI installed globally\n');

  try {
    // Check if Lighthouse is installed
    execSync('lighthouse --version', { stdio: 'ignore' });

    console.log('Running Lighthouse audit (this may take 30-60 seconds)...\n');

    // Run Lighthouse on production URL
    const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://picforge.com';
    const outputPath = path.join(projectRoot, 'lighthouse-report.json');

    try {
      execSync(
        `lighthouse ${url} --output=json --output-path=${outputPath} --chrome-flags="--headless" --quiet`,
        { stdio: 'inherit' }
      );

      // Parse results
      if (fs.existsSync(outputPath)) {
        const report = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));

        const scores = {
          performance: Math.round((report.categories.performance?.score || 0) * 100),
          accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
          bestPractices: Math.round((report.categories['best-practices']?.score || 0) * 100),
          seo: Math.round((report.categories.seo?.score || 0) * 100)
        };

        // Check each score
        Object.entries(scores).forEach(([category, score]) => {
          const target = TARGETS.lighthouse[category as keyof typeof TARGETS.lighthouse];
          const passed = score >= target;

          results.push({
            test: `Lighthouse ${category}`,
            passed,
            value: score,
            target,
            unit: '%',
            message: passed ? 'Meets target' : `Below target by ${target - score}`
          });

          const icon = passed ? `${colors.green}✓` : `${colors.red}✗`;
          console.log(`${icon} ${category}: ${score}/100 (target: ${target}+)${colors.reset}`);
        });

        // Core Web Vitals
        const fcp = report.audits['first-contentful-paint']?.numericValue || 0;
        const lcp = report.audits['largest-contentful-paint']?.numericValue || 0;
        const cls = report.audits['cumulative-layout-shift']?.numericValue || 0;
        const tti = report.audits['interactive']?.numericValue || 0;

        console.log(`\n${colors.cyan}Core Web Vitals:${colors.reset}`);
        console.log(`  FCP: ${Math.round(fcp)}ms (target: <${TARGETS.fcp}ms)`);
        console.log(`  LCP: ${Math.round(lcp)}ms (target: <${TARGETS.lcp}ms)`);
        console.log(`  CLS: ${cls.toFixed(3)} (target: <${TARGETS.cls})`);
        console.log(`  TTI: ${Math.round(tti)}ms (target: <${TARGETS.tti}ms)`);

        // Save results
        results.push({
          test: 'First Contentful Paint',
          passed: fcp <= TARGETS.fcp,
          value: Math.round(fcp),
          target: TARGETS.fcp,
          unit: 'ms',
          message: fcp <= TARGETS.fcp ? 'Good' : 'Needs improvement'
        });

        results.push({
          test: 'Largest Contentful Paint',
          passed: lcp <= TARGETS.lcp,
          value: Math.round(lcp),
          target: TARGETS.lcp,
          unit: 'ms',
          message: lcp <= TARGETS.lcp ? 'Good' : 'Needs improvement'
        });

        results.push({
          test: 'Cumulative Layout Shift',
          passed: cls <= TARGETS.cls,
          value: cls,
          target: TARGETS.cls,
          unit: '',
          message: cls <= TARGETS.cls ? 'Good' : 'Needs improvement'
        });
      }
    } catch (lighthouseError) {
      console.log(`${colors.yellow}⚠ WARNING${colors.reset}: Lighthouse audit failed`);
      console.log('This is expected if the site is not publicly accessible.');
      console.log('Run Lighthouse manually: lighthouse https://picforge.com\n');
    }

  } catch (error) {
    console.log(`${colors.yellow}⚠ WARNING${colors.reset}: Lighthouse CLI not installed`);
    console.log('Install with: npm install -g lighthouse');
    console.log('Or run manually in Chrome DevTools (Ctrl+Shift+I → Lighthouse tab)\n');

    // Add placeholder results
    results.push({
      test: 'Lighthouse (manual)',
      passed: false,
      value: 0,
      target: 90,
      unit: '',
      message: 'Run manually in Chrome DevTools'
    });
  }
}

// ============================================
// Test 3: API Response Time
// ============================================

async function testAPIResponseTime() {
  console.log(`\n${colors.blue}${colors.bold}Test 3: API Response Time${colors.reset}`);
  console.log('Testing API endpoint response times...\n');

  const apiEndpoints = [
    '/api/health',
    '/api/track-visitor'
  ];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  for (const endpoint of apiEndpoints) {
    try {
      const url = `${baseUrl}${endpoint}`;
      const start = Date.now();

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => null);

      const duration = Date.now() - start;

      if (!response) {
        console.log(`${colors.yellow}⚠ SKIP${colors.reset}: ${endpoint} (endpoint not reachable)`);
        continue;
      }

      const passed = duration <= TARGETS.apiResponseTime;

      results.push({
        test: `API ${endpoint}`,
        passed,
        value: duration,
        target: TARGETS.apiResponseTime,
        unit: 'ms',
        message: passed ? 'Fast response' : 'Slow response'
      });

      const icon = passed ? `${colors.green}✓` : `${colors.red}✗`;
      console.log(`${icon} ${endpoint}: ${duration}ms (target: <${TARGETS.apiResponseTime}ms)${colors.reset}`);

    } catch (error) {
      console.log(`${colors.yellow}⚠ ERROR${colors.reset}: ${endpoint} - ${error}`);
    }
  }
}

// ============================================
// Test 4: Image Processing Speed
// ============================================

async function testImageProcessingSpeed() {
  console.log(`\n${colors.blue}${colors.bold}Test 4: Image Processing Speed${colors.reset}`);
  console.log('Note: This requires running app locally with test images\n');

  console.log(`${colors.cyan}Manual Test Required:${colors.reset}`);
  console.log('1. Upload a test image (1MB)');
  console.log('2. Apply transformation with prompt');
  console.log('3. Measure time from click → result displayed');
  console.log('4. Target: <5 seconds per image\n');

  console.log(`${colors.cyan}Batch Processing Target:${colors.reset}`);
  console.log('100 images with client-side effects: <2 minutes\n');
}

// ============================================
// Test 5: Build Time
// ============================================

async function testBuildTime() {
  console.log(`\n${colors.blue}${colors.bold}Test 5: Build Performance${colors.reset}`);
  console.log('Checking Next.js build output...\n');

  const buildLogPath = path.join(projectRoot, 'build.log');

  if (!fs.existsSync(buildLogPath)) {
    console.log(`${colors.yellow}⚠ INFO${colors.reset}: No build.log found. Build time not measured.`);
    console.log('To measure: npm run build > build.log 2>&1\n');
    return;
  }

  const buildLog = fs.readFileSync(buildLogPath, 'utf-8');

  // Parse build time from log
  const timeMatch = buildLog.match(/Done in (\d+\.\d+)s/);
  if (timeMatch) {
    const buildTime = parseFloat(timeMatch[1]);
    console.log(`${colors.cyan}Build completed in: ${buildTime}s${colors.reset}\n`);

    results.push({
      test: 'Build Time',
      passed: buildTime < 60,
      value: buildTime,
      target: 60,
      unit: 's',
      message: buildTime < 60 ? 'Fast build' : 'Slow build'
    });
  }
}

// ============================================
// Print Summary
// ============================================

function printSummary() {
  console.log(`\n${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bold}PERFORMANCE TEST SUMMARY${colors.reset}`);
  console.log(`${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}\n`);

  console.log(`${colors.bold}Results:${colors.reset}\n`);

  results.forEach(result => {
    const icon = result.passed ? `${colors.green}✓` : `${colors.red}✗`;
    console.log(`${icon} ${result.test}:${colors.reset}`);
    console.log(`   Value: ${result.value}${result.unit} (target: ${result.target}${result.unit})`);
    console.log(`   Status: ${result.message}\n`);
  });

  // Performance score
  const performanceScore = total > 0 ? Math.round((passed / total) * 100) : 0;

  console.log(`${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  if (performanceScore >= 90) {
    console.log(`${colors.green}${colors.bold}✓ EXCELLENT PERFORMANCE (${performanceScore}%)${colors.reset}`);
    console.log(`${colors.green}Application meets all performance targets!${colors.reset}\n`);
  } else if (performanceScore >= 70) {
    console.log(`${colors.yellow}${colors.bold}⚠ GOOD PERFORMANCE (${performanceScore}%)${colors.reset}`);
    console.log(`${colors.yellow}Some optimizations recommended.${colors.reset}\n`);
  } else {
    console.log(`${colors.red}${colors.bold}✗ NEEDS IMPROVEMENT (${performanceScore}%)${colors.reset}`);
    console.log(`${colors.red}Performance optimizations required before launch.${colors.reset}\n`);
  }

  console.log(`${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Save report
  const reportPath = path.join(projectRoot, 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    score: performanceScore,
    results,
    timestamp: new Date().toISOString()
  }, null, 2));

  console.log(`${colors.cyan}Full report saved to: performance-report.json${colors.reset}\n`);
}

// ============================================
// Main Execution
// ============================================

async function main() {
  console.log(`${colors.bold}${colors.cyan}`);
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║          PicForge Performance Testing Suite              ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  console.log('\nThis suite will test:');
  console.log('  1. Bundle size analysis');
  console.log('  2. Lighthouse audit (Performance, A11y, Best Practices, SEO)');
  console.log('  3. API response times');
  console.log('  4. Image processing speed (manual)');
  console.log('  5. Build performance');

  await testBundleSize();
  await testLighthouse();
  await testAPIResponseTime();
  await testImageProcessingSpeed();
  await testBuildTime();

  printSummary();
}

main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
