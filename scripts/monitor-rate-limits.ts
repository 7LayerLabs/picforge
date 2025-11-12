#!/usr/bin/env tsx

/**
 * Rate Limit Monitoring Script
 *
 * Shows current rate limit status for all active IPs.
 * Useful for checking who's hitting limits and when they reset.
 *
 * Usage:
 *   npm run monitor:rate-limits
 *   npm run monitor:rate-limits -- --watch (updates every 5 seconds)
 */

import { kv } from '@vercel/kv'
import * as fs from 'fs'
import * as path from 'path'

// Configuration
const WATCH_MODE = process.argv.includes('--watch')
const WATCH_INTERVAL = 5000 // 5 seconds

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
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
  console.log('\n' + '='.repeat(70))
  log(message, 'bright')
  console.log('='.repeat(70) + '\n')
}

// Load environment variables
function loadEnv() {
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
}

// Check if KV is configured
function checkKvConfigured(): boolean {
  const requiredVars = ['KV_REST_API_URL', 'KV_REST_API_TOKEN']
  const missing = requiredVars.filter(varName => !process.env[varName])

  if (missing.length > 0) {
    log('❌ Vercel KV not configured', 'red')
    log(`   Missing: ${missing.join(', ')}`, 'red')
    log('\n💡 Add KV environment variables to .env.local or Vercel Dashboard', 'yellow')
    log('   See docs/VERCEL_KV_SETUP.md for instructions', 'yellow')
    return false
  }

  return true
}

// Get all rate limit keys
async function getRateLimitKeys(): Promise<string[]> {
  try {
    // Scan for all rate-limit keys
    const keys = await kv.keys('rate-limit:*')
    return keys
  } catch (error) {
    log('❌ Error fetching rate limit keys', 'red')
    console.error(error)
    return []
  }
}

// Get rate limit details for a key
interface RateLimitDetails {
  key: string
  ip: string
  count: number
  ttl: number
  resetTime: Date
  percentUsed: number
  limit: number
}

async function getRateLimitDetails(key: string, defaultLimit: number = 500): Promise<RateLimitDetails | null> {
  try {
    const count = await kv.get<number>(key)
    const ttl = await kv.ttl(key)

    if (count === null || ttl === null) {
      return null
    }

    const resetTime = new Date(Date.now() + (ttl * 1000))
    const ip = key.replace('rate-limit:ip:', '')
    const percentUsed = (count / defaultLimit) * 100

    return {
      key,
      ip,
      count,
      ttl,
      resetTime,
      percentUsed,
      limit: defaultLimit
    }
  } catch (error) {
    console.error(`Error getting details for ${key}:`, error)
    return null
  }
}

// Format time remaining
function formatTimeRemaining(seconds: number): string {
  if (seconds < 0) return 'expired'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

// Get color based on usage percentage
function getUsageColor(percent: number): keyof typeof colors {
  if (percent >= 90) return 'red'
  if (percent >= 75) return 'yellow'
  if (percent >= 50) return 'magenta'
  return 'green'
}

// Display rate limit statistics
async function displayRateLimits() {
  const keys = await getRateLimitKeys()

  if (keys.length === 0) {
    log('No active rate limits found.', 'dim')
    log('This means either:', 'dim')
    log('  - No one has made requests yet', 'dim')
    log('  - All rate limit counters have expired', 'dim')
    return
  }

  // Get details for all keys
  const details: RateLimitDetails[] = []
  for (const key of keys) {
    const detail = await getRateLimitDetails(key)
    if (detail) {
      details.push(detail)
    }
  }

  // Sort by count (highest first)
  details.sort((a, b) => b.count - a.count)

  // Display table
  log('Active Rate Limits:', 'cyan')
  console.log('')
  console.log('IP Address          | Count | Limit | Used  | Resets In | Reset Time')
  console.log('--------------------+-------+-------+-------+-----------+-------------------')

  for (const detail of details) {
    const ipPadded = detail.ip.padEnd(19)
    const countStr = detail.count.toString().padStart(5)
    const limitStr = detail.limit.toString().padStart(5)
    const percentStr = `${detail.percentUsed.toFixed(0)}%`.padStart(5)
    const resetIn = formatTimeRemaining(detail.ttl).padEnd(9)
    const resetTimeStr = detail.resetTime.toLocaleString()

    const color = getUsageColor(detail.percentUsed)

    log(
      `${ipPadded} | ${countStr} | ${limitStr} | ${percentStr} | ${resetIn} | ${resetTimeStr}`,
      color
    )
  }

  // Summary statistics
  console.log('')
  log('Summary:', 'cyan')
  console.log(`  Total IPs tracked: ${details.length}`)
  console.log(`  Total requests: ${details.reduce((sum, d) => sum + d.count, 0)}`)
  console.log(`  Average requests/IP: ${(details.reduce((sum, d) => sum + d.count, 0) / details.length).toFixed(1)}`)

  const highUsage = details.filter(d => d.percentUsed >= 75)
  if (highUsage.length > 0) {
    log(`  ⚠️  High usage IPs (≥75%): ${highUsage.length}`, 'yellow')
  }

  const maxedOut = details.filter(d => d.count >= d.limit)
  if (maxedOut.length > 0) {
    log(`  🚫 Rate limited IPs (100%): ${maxedOut.length}`, 'red')
  }
}

// Main monitoring loop
async function monitor() {
  header(`Rate Limit Monitor${WATCH_MODE ? ' (Watch Mode)' : ''}`)

  if (!checkKvConfigured()) {
    process.exit(1)
  }

  log('✓ Vercel KV connected', 'green')
  console.log('')

  if (WATCH_MODE) {
    log('Press Ctrl+C to stop watching', 'dim')
    console.log('')

    // Display initial data
    await displayRateLimits()

    // Update every 5 seconds
    setInterval(async () => {
      // Clear screen
      console.clear()
      header(`Rate Limit Monitor (Watch Mode) - ${new Date().toLocaleTimeString()}`)
      log('Press Ctrl+C to stop watching', 'dim')
      console.log('')
      await displayRateLimits()
    }, WATCH_INTERVAL)
  } else {
    // Single display
    await displayRateLimits()
  }
}

// Run
loadEnv()
monitor().catch(error => {
  log('\n❌ Error:', 'red')
  console.error(error)
  process.exit(1)
})
