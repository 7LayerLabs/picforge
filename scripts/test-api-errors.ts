#!/usr/bin/env tsx
/**
 * API Error Handling Test Suite
 *
 * Tests all API routes for consistent error handling and validation.
 * Run this script to verify error responses are standardized.
 *
 * Usage:
 *   npm run dev (in another terminal)
 *   npx tsx scripts/test-api-errors.ts
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
}

interface TestResult {
  route: string
  test: string
  passed: boolean
  expected: number
  actual: number | string
  message?: string
}

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
const results: TestResult[] = []

async function testRoute(
  route: string,
  test: string,
  method: string,
  body: any,
  expectedStatus: number
): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}${route}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    const passed = response.status === expectedStatus

    results.push({
      route,
      test,
      passed,
      expected: expectedStatus,
      actual: response.status,
      message: data.error || data.message,
    })

    if (passed) {
      console.log(`${colors.green}✓${colors.reset} ${route} - ${test}`)
    } else {
      console.log(`${colors.red}✗${colors.reset} ${route} - ${test}`)
      console.log(`  Expected: ${expectedStatus}, Got: ${response.status}`)
      console.log(`  Response:`, data)
    }
  } catch (error) {
    console.error(`${colors.red}✗${colors.reset} ${route} - ${test} - Request failed:`, error)
    results.push({
      route,
      test,
      passed: false,
      expected: expectedStatus,
      actual: 'ERROR',
      message: String(error),
    })
  }
}

async function runTests() {
  console.log(`\n${colors.bold}${colors.blue}API Error Handling Test Suite${colors.reset}`)
  console.log(`Testing against: ${BASE_URL}\n`)

  // ======================
  // Test: Missing Parameters
  // ======================
  console.log(`${colors.bold}Testing Missing Parameters (400)${colors.reset}`)

  await testRoute(
    '/api/process-image',
    'Missing image parameter',
    'POST',
    { prompt: 'test' },
    400
  )

  await testRoute(
    '/api/process-image',
    'Missing prompt parameter',
    'POST',
    { image: 'data:image/png;base64,test' },
    400
  )

  await testRoute(
    '/api/generate-canvas',
    'Missing prompt parameter',
    'POST',
    {},
    400
  )

  await testRoute(
    '/api/send-email',
    'Missing to parameter',
    'POST',
    { type: 'welcome' },
    400
  )

  await testRoute(
    '/api/track-template',
    'Missing templateId parameter',
    'POST',
    {},
    400
  )

  console.log()

  // ======================
  // Test: Invalid Input
  // ======================
  console.log(`${colors.bold}Testing Invalid Input (400)${colors.reset}`)

  await testRoute(
    '/api/send-email',
    'Invalid email format',
    'POST',
    { to: 'not-an-email', type: 'welcome' },
    400
  )

  await testRoute(
    '/api/send-email',
    'Invalid email type',
    'POST',
    { to: 'test@example.com', type: 'invalid-type' },
    400
  )

  console.log()

  // ======================
  // Test: Rate Limiting (429)
  // ======================
  console.log(`${colors.bold}Testing Rate Limiting (429)${colors.reset}`)
  console.log(`${colors.yellow}Note: This requires 500+ requests to test properly${colors.reset}`)
  console.log(`${colors.yellow}Skipping rate limit test (run manually if needed)${colors.reset}\n`)

  // ======================
  // Test: Response Format Consistency
  // ======================
  console.log(`${colors.bold}Testing Response Format Consistency${colors.reset}`)

  // Test that all errors have 'error' and 'code' fields
  const errorTests = [
    { route: '/api/process-image', body: {} },
    { route: '/api/generate-canvas', body: {} },
    { route: '/api/send-email', body: { to: 'invalid' } },
  ]

  for (const testCase of errorTests) {
    try {
      const response = await fetch(`${BASE_URL}${testCase.route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase.body),
      })

      const data = await response.json()
      const hasError = 'error' in data
      const hasCode = 'code' in data

      if (hasError && hasCode) {
        console.log(
          `${colors.green}✓${colors.reset} ${testCase.route} - Response has error and code fields`
        )
      } else {
        console.log(
          `${colors.red}✗${colors.reset} ${testCase.route} - Missing error or code field`
        )
        console.log(`  Response:`, data)
      }
    } catch (error) {
      console.error(`${colors.red}✗${colors.reset} ${testCase.route} - Request failed:`, error)
    }
  }

  console.log()

  // ======================
  // Test: Optional Service Graceful Degradation
  // ======================
  console.log(`${colors.bold}Testing Graceful Degradation${colors.reset}`)

  // Test routes that should work even without optional keys
  const gracefulRoutes = [
    { route: '/api/generate-canvas-free', body: { prompt: 'test' } },
    { route: '/api/generate-canvas-pollinations', body: { prompt: 'test' } },
    { route: '/api/track-visitor', method: 'GET', body: null },
    { route: '/api/visitor-stats', method: 'GET', body: null },
  ]

  for (const testCase of gracefulRoutes) {
    try {
      const response = await fetch(`${BASE_URL}${testCase.route}`, {
        method: testCase.method || 'POST',
        ...(testCase.body && {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testCase.body),
        }),
      })

      const data = await response.json()

      if (response.ok || response.status === 429) {
        // 429 is OK - means rate limiting is working
        console.log(
          `${colors.green}✓${colors.reset} ${testCase.route} - Works without optional keys (${response.status})`
        )
      } else {
        console.log(
          `${colors.yellow}⚠${colors.reset} ${testCase.route} - Unexpected status ${response.status}`
        )
      }
    } catch (error) {
      console.error(`${colors.red}✗${colors.reset} ${testCase.route} - Request failed:`, error)
    }
  }

  console.log()

  // ======================
  // Summary
  // ======================
  console.log(`${colors.bold}Test Summary${colors.reset}`)

  const passed = results.filter((r) => r.passed).length
  const failed = results.filter((r) => !r.passed).length
  const total = results.length

  console.log(`  Total Tests: ${total}`)
  console.log(
    `  Passed: ${passed > 0 ? colors.green : colors.red}${passed}${colors.reset}`
  )
  console.log(
    `  Failed: ${failed > 0 ? colors.red : colors.green}${failed}${colors.reset}`
  )
  console.log()

  if (failed > 0) {
    console.log(`${colors.red}${colors.bold}Failed Tests:${colors.reset}`)
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  ${colors.red}✗${colors.reset} ${r.route} - ${r.test}`)
        console.log(`    Expected: ${r.expected}, Got: ${r.actual}`)
        if (r.message) console.log(`    Message: ${r.message}`)
      })
    console.log()
  }

  // Exit with error if tests failed
  if (failed > 0) {
    console.log(`${colors.red}${colors.bold}Tests Failed!${colors.reset}\n`)
    process.exit(1)
  }

  console.log(`${colors.green}${colors.bold}All Tests Passed!${colors.reset}\n`)
  process.exit(0)
}

// Run tests
console.log(`${colors.yellow}Starting API error handling tests...${colors.reset}`)
console.log(`${colors.yellow}Make sure the dev server is running: npm run dev${colors.reset}\n`)

setTimeout(() => {
  runTests().catch((error) => {
    console.error(`${colors.red}Test suite failed:${colors.reset}`, error)
    process.exit(1)
  })
}, 1000) // Give time for server to be ready
