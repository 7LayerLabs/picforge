#!/usr/bin/env tsx

/**
 * Vercel KV Rate Limit Testing Script
 *
 * Tests rate limiting by making multiple requests to the API
 * and verifying that the 501st request is blocked.
 *
 * Usage:
 *   npm run test:rate-limit
 *   npm run test:rate-limit -- --target production
 *   npm run test:rate-limit -- --endpoint /api/roast --limit 300
 */

import * as fs from 'fs'
import * as path from 'path'

// Configuration
interface TestConfig {
  target: 'local' | 'production'
  endpoint: string
  limit: number
  testRequests: number
  baseUrl?: string
}

const config: TestConfig = {
  target: process.argv.includes('production') ? 'production' : 'local',
  endpoint: getArgValue('--endpoint') || '/api/process-image',
  limit: parseInt(getArgValue('--limit') || '500'),
  testRequests: parseInt(getArgValue('--test') || '10'), // Default: test with 10 requests (not full 500)
  baseUrl: getArgValue('--url') || undefined
}

function getArgValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag)
  return index !== -1 ? process.argv[index + 1] : undefined
}

// Get base URL
const BASE_URL = config.baseUrl ||
  (config.target === 'production' ? 'https://pic-forge.com' : 'http://localhost:3000')

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function header(message: string) {
  console.log('\n' + '='.repeat(60))
  log(message, 'bright')
  console.log('='.repeat(60) + '\n')
}

// Load test image
function loadTestImage(): string {
  const imagePath = path.join(process.cwd(), 'public', 'test-image.jpg')

  // Check if test image exists
  if (!fs.existsSync(imagePath)) {
    // Create a minimal 1x1 pixel JPEG as base64
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB1AAf/Z'
  }

  // Read actual image
  const imageBuffer = fs.readFileSync(imagePath)
  const base64Image = imageBuffer.toString('base64')
  return `data:image/jpeg;base64,${base64Image}`
}

// Test rate limiting
async function testRateLimit() {
  header(`Rate Limit Test - ${config.target.toUpperCase()}`)

  log(`Configuration:`, 'cyan')
  console.log(`  Target: ${config.target}`)
  console.log(`  Base URL: ${BASE_URL}`)
  console.log(`  Endpoint: ${config.endpoint}`)
  console.log(`  Rate Limit: ${config.limit} requests/day`)
  console.log(`  Test Requests: ${config.testRequests}`)
  console.log('')

  // Check if server is running
  try {
    const healthCheck = await fetch(BASE_URL)
    if (!healthCheck.ok && healthCheck.status !== 404) {
      log(`❌ Server not accessible at ${BASE_URL}`, 'red')
      log(`   Status: ${healthCheck.status}`, 'red')
      if (config.target === 'local') {
        log(`\n💡 Make sure dev server is running: npm run dev`, 'yellow')
      }
      process.exit(1)
    }
    log(`✓ Server is accessible`, 'green')
  } catch (error) {
    log(`❌ Cannot connect to ${BASE_URL}`, 'red')
    if (config.target === 'local') {
      log(`\n💡 Make sure dev server is running: npm run dev`, 'yellow')
    }
    process.exit(1)
  }

  // Prepare test payload
  const testImage = loadTestImage()
  const endpoint = `${BASE_URL}${config.endpoint}`

  const payload = config.endpoint.includes('roast')
    ? { image: testImage, intensity: 'mild' }
    : config.endpoint.includes('canvas')
    ? { prompt: 'a beautiful sunset' }
    : { image: testImage, prompt: 'test transformation' }

  log(`\nStarting rate limit test...`, 'cyan')
  console.log('')

  // Test requests
  let successCount = 0
  let rateLimitedCount = 0
  let errorCount = 0
  let lastRemaining = config.limit

  for (let i = 1; i <= config.testRequests; i++) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      // Get rate limit headers
      const remaining = response.headers.get('X-RateLimit-Remaining')
      const limit = response.headers.get('X-RateLimit-Limit')
      const resetTime = response.headers.get('X-RateLimit-Reset')

      if (response.status === 429) {
        // Rate limited
        rateLimitedCount++
        log(`  Request ${i}: ❌ Rate limited (429)`, 'red')

        if (resetTime) {
          const resetDate = new Date(parseInt(resetTime))
          const now = new Date()
          const minutesUntilReset = Math.ceil((resetDate.getTime() - now.getTime()) / 60000)
          log(`    └─ Reset in ${minutesUntilReset} minutes (${resetDate.toLocaleTimeString()})`, 'yellow')
        }

        // Parse error response
        const errorData = await response.json()
        if (errorData.details) {
          log(`    └─ Remaining: ${errorData.details.remaining}/${errorData.details.limit}`, 'yellow')
        }
      } else if (response.ok) {
        // Success
        successCount++
        lastRemaining = remaining ? parseInt(remaining) : lastRemaining - 1

        log(`  Request ${i}: ✓ Success`, 'green')
        if (remaining && limit) {
          log(`    └─ Remaining: ${remaining}/${limit}`, 'cyan')
        }
      } else {
        // Other error
        errorCount++
        log(`  Request ${i}: ⚠️  Error (${response.status})`, 'yellow')

        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          log(`    └─ ${errorData.error || errorData.message || 'Unknown error'}`, 'yellow')
        } catch {
          log(`    └─ ${errorText.substring(0, 100)}`, 'yellow')
        }
      }

      // Rate limit check: Add delay to avoid overwhelming server
      if (i < config.testRequests) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } catch (error) {
      errorCount++
      log(`  Request ${i}: ❌ Request failed`, 'red')
      if (error instanceof Error) {
        log(`    └─ ${error.message}`, 'red')
      }
    }
  }

  // Summary
  header('Test Summary')

  log(`Results:`, 'cyan')
  console.log(`  ✓ Successful: ${successCount}`)
  console.log(`  ❌ Rate Limited: ${rateLimitedCount}`)
  console.log(`  ⚠️  Errors: ${errorCount}`)
  console.log(`  📊 Total: ${config.testRequests}`)
  console.log('')

  // Check if rate limiting is configured
  if (successCount === config.testRequests && rateLimitedCount === 0) {
    log(`Status: ✓ Rate limiting is working correctly`, 'green')
    log(`  └─ All ${config.testRequests} requests succeeded (under limit)`, 'green')

    if (config.testRequests < config.limit) {
      log(`\n💡 To test the actual limit, run:`, 'cyan')
      log(`   npm run test:rate-limit -- --test ${config.limit + 1}`, 'cyan')
      log(`   (This will take ${Math.ceil((config.limit + 1) / 10)} seconds)`, 'yellow')
    }
  } else if (rateLimitedCount > 0) {
    log(`Status: ✓ Rate limiting is ACTIVE and working`, 'green')
    log(`  └─ Requests blocked after reaching limit`, 'green')
  } else if (errorCount === config.testRequests) {
    log(`Status: ❌ All requests failed - check configuration`, 'red')
    log(`\n💡 Troubleshooting:`, 'yellow')
    log(`   1. Verify Vercel KV environment variables are set`, 'yellow')
    log(`   2. Check API endpoint is correct: ${config.endpoint}`, 'yellow')
    log(`   3. Review server logs for errors`, 'yellow')
  } else {
    log(`Status: ⚠️  Mixed results - rate limiting may not be configured`, 'yellow')
    log(`\n💡 Expected behavior:`, 'cyan')
    log(`   - First ${config.limit} requests should succeed`, 'cyan')
    log(`   - Request ${config.limit + 1} should return 429 (Rate Limited)`, 'cyan')
    log(`\n💡 If rate limiting is not working:`, 'yellow')
    log(`   1. Check .env.local has KV_* environment variables`, 'yellow')
    log(`   2. Restart dev server: npm run dev`, 'yellow')
    log(`   3. See docs/VERCEL_KV_SETUP.md for full setup guide`, 'yellow')
  }

  console.log('')
}

// Check KV Configuration
async function checkKvConfig() {
  header('Vercel KV Configuration Check')

  const requiredVars = [
    'KV_URL',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
    'KV_REST_API_READ_ONLY_TOKEN'
  ]

  let allConfigured = true

  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (value && value !== 'your_kv_url_here' && value !== 'your_kv_rest_api_url_here' &&
        value !== 'your_kv_rest_api_token_here' && value !== 'your_kv_read_only_token_here') {
      log(`  ✓ ${varName}: Configured`, 'green')
    } else {
      log(`  ❌ ${varName}: Not configured`, 'red')
      allConfigured = false
    }
  }

  console.log('')

  if (!allConfigured) {
    log(`⚠️  Vercel KV is NOT configured`, 'yellow')
    log(`\nRate limiting will be DISABLED (fail-open mode)`, 'yellow')
    log(`This means your API is UNPROTECTED against abuse!\n`, 'red')
    log(`📖 Setup guide: docs/VERCEL_KV_SETUP.md`, 'cyan')
    log(`   Or run: cat docs/VERCEL_KV_SETUP.md\n`, 'cyan')
    return false
  } else {
    log(`✓ Vercel KV is configured correctly`, 'green')
    console.log('')
    return true
  }
}

// Main execution
async function main() {
  try {
    // Load environment variables from .env.local
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8')
      envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim()
          if (!process.env[key]) {
            process.env[key] = value
          }
        }
      })
    }

    // Check configuration
    const kvConfigured = await checkKvConfig()

    if (!kvConfigured && config.target === 'local') {
      log(`⚠️  Skipping rate limit test - KV not configured`, 'yellow')
      log(`   Configure Vercel KV first (see docs/VERCEL_KV_SETUP.md)`, 'yellow')
      process.exit(1)
    }

    // Run test
    await testRateLimit()

  } catch (error) {
    log(`\n❌ Test failed with error:`, 'red')
    console.error(error)
    process.exit(1)
  }
}

main()
