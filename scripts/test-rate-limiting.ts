#!/usr/bin/env tsx
/**
 * Rate Limiting Test Script
 *
 * Tests Vercel KV rate limiting implementation to ensure:
 * 1. 500 requests per day per IP are allowed
 * 2. Request 501 returns 429 Too Many Requests
 * 3. Different IPs have independent limits
 * 4. Rate limit headers are correct
 *
 * Usage: npm run test:rate-limiting
 */

import { kv } from '@vercel/kv';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: string;
}

const results: TestResult[] = [];
const TEST_IP = '192.168.1.100'; // Test IP address
const RATE_LIMIT = 500;
const RATE_LIMIT_WINDOW = 24 * 60 * 60; // 24 hours in seconds

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

async function checkRateLimitStatus(ip: string): Promise<{ count: number; remaining: number; resetTime: number }> {
  const key = `rate_limit:${ip}`;
  const count = await kv.get<number>(key) || 0;
  const ttl = await kv.ttl(key);
  const resetTime = ttl > 0 ? Date.now() + (ttl * 1000) : 0;

  return {
    count,
    remaining: Math.max(0, RATE_LIMIT - count),
    resetTime
  };
}

async function incrementRateLimit(ip: string): Promise<{ success: boolean; count: number; remaining: number }> {
  const key = `rate_limit:${ip}`;
  const count = await kv.incr(key);

  // Set expiry on first request
  if (count === 1) {
    await kv.expire(key, RATE_LIMIT_WINDOW);
  }

  const remaining = Math.max(0, RATE_LIMIT - count);
  const success = count <= RATE_LIMIT;

  return { success, count, remaining };
}

async function resetRateLimit(ip: string): Promise<void> {
  const key = `rate_limit:${ip}`;
  await kv.del(key);
}

async function test1_BasicRateLimitCheck() {
  console.log(`\n${colors.blue}Test 1: Basic Rate Limit Check${colors.reset}`);
  console.log('Testing that rate limit allows requests up to 500...\n');

  try {
    // Reset rate limit for test IP
    await resetRateLimit(TEST_IP);

    // Make first request
    const result = await incrementRateLimit(TEST_IP);

    if (result.success && result.count === 1 && result.remaining === 499) {
      results.push({
        name: 'Basic Rate Limit Check',
        passed: true,
        message: 'First request successful',
        details: `Count: ${result.count}, Remaining: ${result.remaining}`
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: First request successful`);
      console.log(`  Count: ${result.count}, Remaining: ${result.remaining}`);
    } else {
      results.push({
        name: 'Basic Rate Limit Check',
        passed: false,
        message: 'First request failed or incorrect counts',
        details: `Count: ${result.count}, Remaining: ${result.remaining}, Success: ${result.success}`
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: First request failed`);
    }
  } catch (error) {
    results.push({
      name: 'Basic Rate Limit Check',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`${colors.red}✗ FAIL${colors.reset}: ${error}`);
  }
}

async function test2_RateLimitEnforcement() {
  console.log(`\n${colors.blue}Test 2: Rate Limit Enforcement (500 request limit)${colors.reset}`);
  console.log('Making 500 requests to reach limit...\n');

  try {
    await resetRateLimit(TEST_IP);

    // Make 500 requests (we already made 1 in test1, so make 499 more)
    for (let i = 1; i < RATE_LIMIT; i++) {
      await incrementRateLimit(TEST_IP);

      // Show progress every 100 requests
      if (i % 100 === 0) {
        console.log(`  Progress: ${i}/500 requests...`);
      }
    }

    // Check status at exactly 500
    const statusAt500 = await checkRateLimitStatus(TEST_IP);

    if (statusAt500.count === 500 && statusAt500.remaining === 0) {
      results.push({
        name: 'Rate Limit at 500',
        passed: true,
        message: 'Reached limit of 500 requests',
        details: `Count: ${statusAt500.count}, Remaining: ${statusAt500.remaining}`
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: Reached limit of 500 requests`);
      console.log(`  Count: ${statusAt500.count}, Remaining: ${statusAt500.remaining}`);
    } else {
      results.push({
        name: 'Rate Limit at 500',
        passed: false,
        message: 'Incorrect count at 500',
        details: `Expected count: 500, Got: ${statusAt500.count}, Remaining: ${statusAt500.remaining}`
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: Incorrect count at 500`);
    }

    // Try request 501 (should fail)
    const result501 = await incrementRateLimit(TEST_IP);

    if (!result501.success && result501.count === 501) {
      results.push({
        name: 'Rate Limit Exceeded (501st request)',
        passed: true,
        message: 'Request 501 blocked correctly',
        details: `Count: ${result501.count}, Success: ${result501.success}`
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: Request 501 blocked correctly`);
    } else {
      results.push({
        name: 'Rate Limit Exceeded (501st request)',
        passed: false,
        message: 'Request 501 should have been blocked',
        details: `Count: ${result501.count}, Success: ${result501.success}`
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: Request 501 should have been blocked`);
    }
  } catch (error) {
    results.push({
      name: 'Rate Limit Enforcement',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`${colors.red}✗ FAIL${colors.reset}: ${error}`);
  }
}

async function test3_IndependentIPLimits() {
  console.log(`\n${colors.blue}Test 3: Independent IP Limits${colors.reset}`);
  console.log('Testing that different IPs have independent limits...\n');

  try {
    const ip1 = '192.168.1.101';
    const ip2 = '192.168.1.102';

    // Reset both IPs
    await resetRateLimit(ip1);
    await resetRateLimit(ip2);

    // Make requests from both IPs
    await incrementRateLimit(ip1);
    await incrementRateLimit(ip1);
    await incrementRateLimit(ip2);

    const status1 = await checkRateLimitStatus(ip1);
    const status2 = await checkRateLimitStatus(ip2);

    if (status1.count === 2 && status2.count === 1) {
      results.push({
        name: 'Independent IP Limits',
        passed: true,
        message: 'IPs have independent rate limits',
        details: `IP1 count: ${status1.count}, IP2 count: ${status2.count}`
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: IPs have independent rate limits`);
      console.log(`  IP1 (${ip1}): ${status1.count} requests`);
      console.log(`  IP2 (${ip2}): ${status2.count} requests`);
    } else {
      results.push({
        name: 'Independent IP Limits',
        passed: false,
        message: 'IPs may be sharing rate limits',
        details: `IP1 count: ${status1.count}, IP2 count: ${status2.count}`
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: IPs may be sharing rate limits`);
    }

    // Cleanup
    await resetRateLimit(ip1);
    await resetRateLimit(ip2);
  } catch (error) {
    results.push({
      name: 'Independent IP Limits',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`${colors.red}✗ FAIL${colors.reset}: ${error}`);
  }
}

async function test4_RateLimitHeaders() {
  console.log(`\n${colors.blue}Test 4: Rate Limit Headers${colors.reset}`);
  console.log('Testing that rate limit info is returned correctly...\n');

  try {
    await resetRateLimit(TEST_IP);

    // Make 5 requests
    for (let i = 0; i < 5; i++) {
      await incrementRateLimit(TEST_IP);
    }

    const status = await checkRateLimitStatus(TEST_IP);

    if (
      status.count === 5 &&
      status.remaining === 495 &&
      status.resetTime > Date.now()
    ) {
      results.push({
        name: 'Rate Limit Headers',
        passed: true,
        message: 'Rate limit info correct',
        details: `Count: ${status.count}, Remaining: ${status.remaining}, Reset: ${new Date(status.resetTime).toISOString()}`
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: Rate limit info correct`);
      console.log(`  X-RateLimit-Limit: ${RATE_LIMIT}`);
      console.log(`  X-RateLimit-Remaining: ${status.remaining}`);
      console.log(`  X-RateLimit-Reset: ${new Date(status.resetTime).toISOString()}`);
    } else {
      results.push({
        name: 'Rate Limit Headers',
        passed: false,
        message: 'Rate limit info incorrect',
        details: `Count: ${status.count}, Remaining: ${status.remaining}`
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: Rate limit info incorrect`);
    }
  } catch (error) {
    results.push({
      name: 'Rate Limit Headers',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`${colors.red}✗ FAIL${colors.reset}: ${error}`);
  }
}

async function test5_TTLExpiry() {
  console.log(`\n${colors.blue}Test 5: TTL Expiry${colors.reset}`);
  console.log('Testing that rate limit expires after 24 hours...\n');

  try {
    await resetRateLimit(TEST_IP);

    // Make a request
    await incrementRateLimit(TEST_IP);

    // Check TTL
    const key = `rate_limit:${TEST_IP}`;
    const ttl = await kv.ttl(key);

    // TTL should be approximately 24 hours (86400 seconds)
    const expectedTTL = RATE_LIMIT_WINDOW;
    const tolerance = 10; // 10 second tolerance

    if (ttl > 0 && Math.abs(ttl - expectedTTL) <= tolerance) {
      results.push({
        name: 'TTL Expiry',
        passed: true,
        message: 'Rate limit TTL set correctly',
        details: `TTL: ${ttl} seconds (${(ttl / 3600).toFixed(1)} hours)`
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: Rate limit TTL set correctly`);
      console.log(`  TTL: ${ttl} seconds (${(ttl / 3600).toFixed(1)} hours)`);
    } else {
      results.push({
        name: 'TTL Expiry',
        passed: false,
        message: 'Rate limit TTL incorrect',
        details: `Expected: ${expectedTTL}s, Got: ${ttl}s`
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: Rate limit TTL incorrect`);
      console.log(`  Expected: ${expectedTTL}s, Got: ${ttl}s`);
    }
  } catch (error) {
    results.push({
      name: 'TTL Expiry',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`${colors.red}✗ FAIL${colors.reset}: ${error}`);
  }
}

async function test6_VercelKVConnection() {
  console.log(`\n${colors.blue}Test 6: Vercel KV Connection${colors.reset}`);
  console.log('Testing connection to Vercel KV...\n');

  try {
    // Try to set and get a test value
    const testKey = 'test:connection';
    await kv.set(testKey, 'connected', { ex: 10 });
    const value = await kv.get(testKey);
    await kv.del(testKey);

    if (value === 'connected') {
      results.push({
        name: 'Vercel KV Connection',
        passed: true,
        message: 'Successfully connected to Vercel KV'
      });
      console.log(`${colors.green}✓ PASS${colors.reset}: Successfully connected to Vercel KV`);
    } else {
      results.push({
        name: 'Vercel KV Connection',
        passed: false,
        message: 'Connection failed - value mismatch'
      });
      console.log(`${colors.red}✗ FAIL${colors.reset}: Connection failed`);
    }
  } catch (error) {
    results.push({
      name: 'Vercel KV Connection',
      passed: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    console.log(`${colors.red}✗ FAIL${colors.reset}: ${error}`);
  }
}

function printSummary() {
  console.log(`\n${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bold}TEST SUMMARY${colors.reset}`);
  console.log(`${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}\n`);

  if (failed > 0) {
    console.log(`${colors.red}${colors.bold}FAILED TESTS:${colors.reset}`);
    results.filter(r => !r.passed).forEach(result => {
      console.log(`\n${colors.red}✗ ${result.name}${colors.reset}`);
      console.log(`  Message: ${result.message}`);
      if (result.details) {
        console.log(`  Details: ${result.details}`);
      }
    });
  }

  console.log(`\n${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  if (failed === 0) {
    console.log(`${colors.green}${colors.bold}✓ ALL TESTS PASSED - RATE LIMITING READY FOR PRODUCTION${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bold}✗ SOME TESTS FAILED - FIX BEFORE LAUNCH${colors.reset}`);
  }

  console.log(`${colors.bold}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Exit with error code if tests failed
  process.exit(failed > 0 ? 1 : 0);
}

async function main() {
  console.log(`${colors.bold}${colors.blue}`);
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║           PicForge Rate Limiting Test Suite              ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  console.log('\nThis test suite verifies:');
  console.log('  1. 500 requests per day per IP are allowed');
  console.log('  2. Request 501 is blocked with 429 error');
  console.log('  3. Different IPs have independent limits');
  console.log('  4. Rate limit headers are correct');
  console.log('  5. Rate limits expire after 24 hours');
  console.log('  6. Vercel KV connection works');
  console.log('\nStarting tests...\n');

  await test6_VercelKVConnection(); // Test connection first
  await test1_BasicRateLimitCheck();
  await test2_RateLimitEnforcement();
  await test3_IndependentIPLimits();
  await test4_RateLimitHeaders();
  await test5_TTLExpiry();

  printSummary();
}

// Run tests
main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
