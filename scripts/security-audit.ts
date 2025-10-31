#!/usr/bin/env tsx
/**
 * Security Audit Script
 *
 * Comprehensive security check for PicForge.com before launch:
 * 1. Environment variable validation
 * 2. Exposed secrets detection
 * 3. API route authentication
 * 4. CORS configuration check
 * 5. XSS vulnerability scan
 * 6. File upload validation
 * 7. Admin access verification
 *
 * Usage: npm run security-audit
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

interface AuditResult {
  category: string;
  test: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  passed: boolean;
  message: string;
  details?: string;
  recommendation?: string;
}

const results: AuditResult[] = [];
const projectRoot = process.cwd();

// ============================================
// AUDIT 1: Environment Variables
// ============================================

function auditEnvironmentVariables() {
  console.log(`\n${colors.blue}${colors.bold}Audit 1: Environment Variables${colors.reset}`);
  console.log('Checking for proper configuration and no placeholder values...\n');

  const envPath = path.join(projectRoot, '.env.local');

  if (!fs.existsSync(envPath)) {
    results.push({
      category: 'Environment',
      test: '.env.local exists',
      severity: 'critical',
      passed: false,
      message: '.env.local file not found',
      recommendation: 'Create .env.local from .env.example'
    });
    console.log(`${colors.red}✗ CRITICAL${colors.reset}: .env.local not found`);
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envLines = envContent.split('\n');

  // Required keys
  const requiredKeys = [
    'GEMINI_API_KEY',
    'REPLICATE_API_TOKEN',
    'NEXT_PUBLIC_INSTANT_APP_ID'
  ];

  // Check for placeholder values
  const placeholders = [
    'your_key_here',
    'your_api_key_here',
    'your_token_here',
    'YOUR_KEY_HERE',
    'XXXXXXXXXX',
    'xxxxxxxx',
    'changeme',
    'placeholder'
  ];

  let hasPlaceholders = false;
  let missingRequired: string[] = [];

  requiredKeys.forEach(key => {
    const line = envLines.find(l => l.startsWith(`${key}=`));
    if (!line || line.split('=')[1]?.trim() === '') {
      missingRequired.push(key);
    } else {
      const value = line.split('=')[1];
      if (placeholders.some(p => value.toLowerCase().includes(p.toLowerCase()))) {
        hasPlaceholders = true;
        results.push({
          category: 'Environment',
          test: `${key} has real value`,
          severity: 'critical',
          passed: false,
          message: `${key} contains placeholder value`,
          recommendation: `Replace with actual API key from provider`
        });
        console.log(`${colors.red}✗ CRITICAL${colors.reset}: ${key} has placeholder value`);
      }
    }
  });

  if (missingRequired.length > 0) {
    results.push({
      category: 'Environment',
      test: 'Required keys present',
      severity: 'critical',
      passed: false,
      message: `Missing required keys: ${missingRequired.join(', ')}`,
      recommendation: 'Add all required environment variables'
    });
    console.log(`${colors.red}✗ CRITICAL${colors.reset}: Missing required keys: ${missingRequired.join(', ')}`);
  } else if (!hasPlaceholders) {
    results.push({
      category: 'Environment',
      test: 'Environment variables configured',
      severity: 'critical',
      passed: true,
      message: 'All required env vars present with real values'
    });
    console.log(`${colors.green}✓ PASS${colors.reset}: All required env vars configured`);
  }

  // Check for .env.local in .gitignore
  const gitignorePath = path.join(projectRoot, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    if (gitignoreContent.includes('.env.local')) {
      results.push({
        category: 'Environment',
        test: '.env.local in .gitignore',
        severity: 'critical',
        passed: true,
        message: '.env.local properly ignored by git'
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: .env.local in .gitignore`);
    } else {
      results.push({
        category: 'Environment',
        test: '.env.local in .gitignore',
        severity: 'critical',
        passed: false,
        message: '.env.local NOT in .gitignore - secrets may be committed!',
        recommendation: 'Add .env.local to .gitignore immediately'
      });
      console.log(`${colors.red}✗ CRITICAL${colors.reset}: .env.local NOT in .gitignore`);
    }
  }
}

// ============================================
// AUDIT 2: Exposed Secrets in Client Code
// ============================================

function auditExposedSecrets() {
  console.log(`\n${colors.blue}${colors.bold}Audit 2: Exposed Secrets in Client Code${colors.reset}`);
  console.log('Scanning for secrets in client-side bundles...\n');

  const clientFiles = [
    'app',
    'components',
    'lib',
    'hooks'
  ];

  const secretPatterns = [
    { name: 'API Key', pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"]([^'"]+)['"]/gi },
    { name: 'Secret Key', pattern: /(?:secret[_-]?key|secretkey)\s*[:=]\s*['"]([^'"]+)['"]/gi },
    { name: 'AWS Key', pattern: /AKIA[0-9A-Z]{16}/g },
    { name: 'Private Key', pattern: /-----BEGIN (?:RSA |DSA |EC )?PRIVATE KEY-----/g },
    { name: 'Stripe Secret', pattern: /sk_live_[0-9a-zA-Z]{24,}/g },
    { name: 'Stripe Test Secret', pattern: /sk_test_[0-9a-zA-Z]{24,}/g },
  ];

  let foundSecrets = false;

  clientFiles.forEach(dir => {
    const dirPath = path.join(projectRoot, dir);
    if (!fs.existsSync(dirPath)) return;

    const files = getAllFilesRecursive(dirPath, ['.ts', '.tsx', '.js', '.jsx']);

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');

      // Skip files that properly use process.env
      const isClientComponent = content.includes("'use client'");

      secretPatterns.forEach(({ name, pattern }) => {
        const matches = content.match(pattern);
        if (matches) {
          // Check if it's in process.env (safe) or hardcoded (unsafe)
          const lines = content.split('\n');
          matches.forEach(match => {
            const lineIndex = lines.findIndex(l => l.includes(match));
            if (lineIndex >= 0) {
              const line = lines[lineIndex];

              // Safe: process.env.NEXT_PUBLIC_*
              if (line.includes('process.env.NEXT_PUBLIC_')) {
                // This is OK for client components
                return;
              }

              // Safe: process.env in server components
              if (!isClientComponent && line.includes('process.env.')) {
                // This is OK for server components
                return;
              }

              // Unsafe: Hardcoded secret
              foundSecrets = true;
              results.push({
                category: 'Exposed Secrets',
                test: `${name} not hardcoded`,
                severity: 'critical',
                passed: false,
                message: `Potential ${name} found in: ${path.relative(projectRoot, file)}`,
                details: `Line ${lineIndex + 1}: ${line.trim()}`,
                recommendation: 'Move to environment variables or remove hardcoded secrets'
              });
              console.log(`${colors.red}✗ CRITICAL${colors.reset}: Potential ${name} in ${path.relative(projectRoot, file)}:${lineIndex + 1}`);
            }
          });
        }
      });
    });
  });

  if (!foundSecrets) {
    results.push({
      category: 'Exposed Secrets',
      test: 'No hardcoded secrets',
      severity: 'critical',
      passed: true,
      message: 'No hardcoded secrets found in client code'
    });
    console.log(`${colors.green}✓ PASS${colors.reset}: No hardcoded secrets found`);
  }
}

// ============================================
// AUDIT 3: API Route Authentication
// ============================================

function auditAPIAuthentication() {
  console.log(`\n${colors.blue}${colors.bold}Audit 3: API Route Authentication${colors.reset}`);
  console.log('Checking API routes for proper authentication...\n');

  const apiDir = path.join(projectRoot, 'app', 'api');
  if (!fs.existsSync(apiDir)) {
    results.push({
      category: 'API Auth',
      test: 'API directory exists',
      severity: 'medium',
      passed: false,
      message: 'No API routes found'
    });
    console.log(`${colors.yellow}⚠ WARNING${colors.reset}: No API routes found`);
    return;
  }

  const apiRoutes = getAllFilesRecursive(apiDir, ['.ts', '.tsx', '.js', '.jsx']);

  // Routes that should require authentication
  const protectedRoutes = [
    'process-image',
    'process-image-nsfw',
    'generate-canvas',
    'roast'
  ];

  apiRoutes.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const routeName = path.relative(apiDir, file);

    // Check if route is protected
    const shouldBeProtected = protectedRoutes.some(r => routeName.includes(r));

    if (shouldBeProtected) {
      // Check for rate limiting
      const hasRateLimiting = content.includes('rate_limit') || content.includes('rateLimit') || content.includes('kv.incr');

      // Check for IP validation
      const hasIPValidation = content.includes('x-forwarded-for') || content.includes('x-real-ip');

      if (hasRateLimiting && hasIPValidation) {
        results.push({
          category: 'API Auth',
          test: `${routeName} has rate limiting`,
          severity: 'high',
          passed: true,
          message: `Route has rate limiting and IP validation`
        });
        console.log(`${colors.green}✓ PASS${colors.reset}: ${routeName} has rate limiting`);
      } else {
        results.push({
          category: 'API Auth',
          test: `${routeName} has rate limiting`,
          severity: 'high',
          passed: false,
          message: `Route may be missing rate limiting or IP validation`,
          recommendation: 'Add rate limiting using Vercel KV'
        });
        console.log(`${colors.red}✗ FAIL${colors.reset}: ${routeName} may be missing rate limiting`);
      }
    }

    // Check for admin-only routes
    if (routeName.includes('admin')) {
      const hasEmailCheck = content.includes('derek.bobola@gmail.com');

      if (hasEmailCheck) {
        results.push({
          category: 'API Auth',
          test: `${routeName} restricted to admin`,
          severity: 'critical',
          passed: true,
          message: 'Admin route properly restricted'
        });
        console.log(`${colors.green}✓ PASS${colors.reset}: ${routeName} restricted to admin`);
      } else {
        results.push({
          category: 'API Auth',
          test: `${routeName} restricted to admin`,
          severity: 'critical',
          passed: false,
          message: 'Admin route may not be properly restricted',
          recommendation: 'Add email check: user.email === "derek.bobola@gmail.com"'
        });
        console.log(`${colors.red}✗ CRITICAL${colors.reset}: ${routeName} not restricted`);
      }
    }
  });
}

// ============================================
// AUDIT 4: CORS Configuration
// ============================================

function auditCORSConfiguration() {
  console.log(`\n${colors.blue}${colors.bold}Audit 4: CORS Configuration${colors.reset}`);
  console.log('Checking CORS settings...\n');

  const apiDir = path.join(projectRoot, 'app', 'api');
  if (!fs.existsSync(apiDir)) return;

  const apiRoutes = getAllFilesRecursive(apiDir, ['.ts', '.tsx', '.js', '.jsx']);

  let foundWildcardCORS = false;

  apiRoutes.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const routeName = path.relative(apiDir, file);

    // Check for wildcard CORS (*)
    if (content.includes("'Access-Control-Allow-Origin': '*'") ||
        content.includes('"Access-Control-Allow-Origin": "*"')) {
      foundWildcardCORS = true;
      results.push({
        category: 'CORS',
        test: `${routeName} CORS not wildcard`,
        severity: 'high',
        passed: false,
        message: 'Route uses wildcard CORS (*) - security risk',
        recommendation: 'Restrict to specific origins: https://picforge.com'
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: ${routeName} uses wildcard CORS`);
    }
  });

  if (!foundWildcardCORS) {
    results.push({
      category: 'CORS',
      test: 'No wildcard CORS',
      severity: 'high',
      passed: true,
      message: 'CORS properly restricted (no wildcard *)'
    });
    console.log(`${colors.green}✓ PASS${colors.reset}: CORS properly restricted`);
  }
}

// ============================================
// AUDIT 5: XSS Vulnerability Scan
// ============================================

function auditXSSVulnerabilities() {
  console.log(`\n${colors.blue}${colors.bold}Audit 5: XSS Vulnerability Scan${colors.reset}`);
  console.log('Scanning for potential XSS vulnerabilities...\n');

  const componentFiles = getAllFilesRecursive(path.join(projectRoot, 'app'), ['.tsx', '.jsx']);
  componentFiles.push(...getAllFilesRecursive(path.join(projectRoot, 'components'), ['.tsx', '.jsx']));

  let foundXSS = false;

  componentFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const fileName = path.relative(projectRoot, file);

    // Check for dangerous patterns
    const dangerousPatterns = [
      { name: 'dangerouslySetInnerHTML', pattern: /dangerouslySetInnerHTML/g },
      { name: 'innerHTML', pattern: /\.innerHTML\s*=/g },
      { name: 'eval()', pattern: /eval\s*\(/g },
      { name: 'document.write()', pattern: /document\.write\s*\(/g }
    ];

    dangerousPatterns.forEach(({ name, pattern }) => {
      if (pattern.test(content)) {
        foundXSS = true;
        results.push({
          category: 'XSS',
          test: `${fileName} avoids ${name}`,
          severity: 'high',
          passed: false,
          message: `Potential XSS risk: ${name} found in ${fileName}`,
          recommendation: 'Sanitize user input or use React\'s built-in XSS protection'
        });
        console.log(`${colors.red}✗ FAIL${colors.reset}: ${name} found in ${fileName}`);
      }
    });
  });

  if (!foundXSS) {
    results.push({
      category: 'XSS',
      test: 'No XSS vulnerabilities',
      severity: 'high',
      passed: true,
      message: 'No obvious XSS vulnerabilities found'
    });
    console.log(`${colors.green}✓ PASS${colors.reset}: No obvious XSS vulnerabilities`);
  }
}

// ============================================
// AUDIT 6: File Upload Validation
// ============================================

function auditFileUploadValidation() {
  console.log(`\n${colors.blue}${colors.bold}Audit 6: File Upload Validation${colors.reset}`);
  console.log('Checking file upload security...\n');

  const uploadComponents = [
    'components/ImageUpload.tsx',
    'components/BatchUploader.tsx',
    'app/components/BatchUploader.tsx'
  ];

  let hasValidation = false;

  uploadComponents.forEach(compPath => {
    const fullPath = path.join(projectRoot, compPath);
    if (!fs.existsSync(fullPath)) return;

    const content = fs.readFileSync(fullPath, 'utf-8');

    // Check for file type validation
    const hasTypeValidation = content.includes('accept=') || content.includes('image/');

    // Check for file size validation
    const hasSizeValidation = content.includes('maxSize') || content.includes('MAX_FILE_SIZE');

    if (hasTypeValidation && hasSizeValidation) {
      hasValidation = true;
      results.push({
        category: 'File Upload',
        test: `${compPath} has validation`,
        severity: 'high',
        passed: true,
        message: 'File upload has type and size validation'
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: ${compPath} has validation`);
    } else {
      results.push({
        category: 'File Upload',
        test: `${compPath} has validation`,
        severity: 'high',
        passed: false,
        message: 'File upload may be missing validation',
        recommendation: 'Add file type (image/* only) and size (max 10MB) validation'
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: ${compPath} missing validation`);
    }
  });

  if (!hasValidation) {
    console.log(`${colors.yellow}⚠ WARNING${colors.reset}: No upload components found or validated`);
  }
}

// ============================================
// AUDIT 7: Admin Access Verification
// ============================================

function auditAdminAccess() {
  console.log(`\n${colors.blue}${colors.bold}Audit 7: Admin Access Verification${colors.reset}`);
  console.log('Checking admin panel security...\n');

  const adminPages = [
    'app/admin/page.tsx',
    'app/dashboard/admin/page.tsx'
  ];

  let foundAdminPage = false;

  adminPages.forEach(adminPath => {
    const fullPath = path.join(projectRoot, adminPath);
    if (!fs.existsSync(fullPath)) return;

    foundAdminPage = true;
    const content = fs.readFileSync(fullPath, 'utf-8');

    // Check for email restriction
    const hasEmailRestriction = content.includes('derek.bobola@gmail.com');

    // Check for redirect on unauthorized
    const hasRedirect = content.includes('redirect') || content.includes('router.push');

    if (hasEmailRestriction && hasRedirect) {
      results.push({
        category: 'Admin Access',
        test: `${adminPath} properly secured`,
        severity: 'critical',
        passed: true,
        message: 'Admin page restricted to authorized email only'
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: ${adminPath} properly secured`);
    } else {
      results.push({
        category: 'Admin Access',
        test: `${adminPath} properly secured`,
        severity: 'critical',
        passed: false,
        message: 'Admin page may not be properly secured',
        recommendation: 'Add email check and redirect unauthorized users'
      });
      console.log(`${colors.red}✗ CRITICAL${colors.reset}: ${adminPath} not secured`);
    }
  });

  if (!foundAdminPage) {
    results.push({
      category: 'Admin Access',
      test: 'Admin pages found',
      severity: 'low',
      passed: true,
      message: 'No admin pages found (or moved to different location)'
    });
    console.log(`${colors.green}✓ PASS${colors.reset}: No admin pages found`);
  }
}

// ============================================
// Helper Functions
// ============================================

function getAllFilesRecursive(dir: string, extensions: string[]): string[] {
  let files: string[] = [];

  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, .git, .next
      if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
        files = files.concat(getAllFilesRecursive(fullPath, extensions));
      }
    } else if (stat.isFile()) {
      if (extensions.some(ext => fullPath.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  });

  return files;
}

// ============================================
// Print Summary
// ============================================

function printSummary() {
  console.log(`\n${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bold}SECURITY AUDIT SUMMARY${colors.reset}`);
  console.log(`${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  const critical = results.filter(r => r.severity === 'critical');
  const high = results.filter(r => r.severity === 'high');
  const medium = results.filter(r => r.severity === 'medium');
  const low = results.filter(r => r.severity === 'low');

  const criticalFailed = critical.filter(r => !r.passed).length;
  const highFailed = high.filter(r => !r.passed).length;
  const mediumFailed = medium.filter(r => !r.passed).length;
  const lowFailed = low.filter(r => !r.passed).length;

  console.log(`${colors.red}${colors.bold}CRITICAL Issues: ${criticalFailed}${colors.reset}`);
  console.log(`${colors.yellow}${colors.bold}HIGH Issues: ${highFailed}${colors.reset}`);
  console.log(`${colors.blue}MEDIUM Issues: ${mediumFailed}${colors.reset}`);
  console.log(`${colors.cyan}LOW Issues: ${lowFailed}${colors.reset}\n`);

  const totalIssues = criticalFailed + highFailed + mediumFailed + lowFailed;

  if (totalIssues === 0) {
    console.log(`${colors.green}${colors.bold}✓ NO SECURITY ISSUES FOUND${colors.reset}`);
    console.log(`${colors.green}Application is ready for launch!${colors.reset}\n`);
  } else {
    console.log(`${colors.red}${colors.bold}✗ ${totalIssues} SECURITY ISSUES FOUND${colors.reset}\n`);

    if (criticalFailed > 0) {
      console.log(`${colors.red}${colors.bold}CRITICAL ISSUES (FIX BEFORE LAUNCH):${colors.reset}`);
      critical.filter(r => !r.passed).forEach(r => {
        console.log(`\n${colors.red}✗ ${r.test}${colors.reset}`);
        console.log(`  Category: ${r.category}`);
        console.log(`  Message: ${r.message}`);
        if (r.details) console.log(`  Details: ${r.details}`);
        if (r.recommendation) console.log(`  ${colors.yellow}→ Recommendation: ${r.recommendation}${colors.reset}`);
      });
    }

    if (highFailed > 0) {
      console.log(`\n${colors.yellow}${colors.bold}HIGH PRIORITY ISSUES:${colors.reset}`);
      high.filter(r => !r.passed).forEach(r => {
        console.log(`\n${colors.yellow}⚠ ${r.test}${colors.reset}`);
        console.log(`  Message: ${r.message}`);
        if (r.recommendation) console.log(`  ${colors.yellow}→ Recommendation: ${r.recommendation}${colors.reset}`);
      });
    }
  }

  console.log(`\n${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Export results to JSON
  const reportPath = path.join(projectRoot, 'security-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`${colors.cyan}Full report saved to: security-audit-report.json${colors.reset}\n`);

  // Exit with error code if critical issues found
  process.exit(criticalFailed > 0 ? 1 : 0);
}

// ============================================
// Main Execution
// ============================================

function main() {
  console.log(`${colors.bold}${colors.magenta}`);
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║            PicForge Security Audit Suite                 ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  console.log('\nThis audit will check:');
  console.log('  1. Environment variable configuration');
  console.log('  2. Exposed secrets in client code');
  console.log('  3. API route authentication');
  console.log('  4. CORS configuration');
  console.log('  5. XSS vulnerabilities');
  console.log('  6. File upload validation');
  console.log('  7. Admin access security');

  auditEnvironmentVariables();
  auditExposedSecrets();
  auditAPIAuthentication();
  auditCORSConfiguration();
  auditXSSVulnerabilities();
  auditFileUploadValidation();
  auditAdminAccess();

  printSummary();
}

main();
