#!/usr/bin/env tsx
/**
 * Environment Variable Validation Script
 *
 * Run this script during build/startup to ensure all required environment
 * variables are configured correctly.
 *
 * Usage:
 *   npm run validate-env
 *   or
 *   npx tsx scripts/validate-env.ts
 */

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
}

interface EnvVarConfig {
  key: string
  required: boolean
  description: string
  service: string
  defaultOk?: boolean // If true, missing value is OK (graceful degradation)
}

// Define all environment variables used in the app
const envVars: EnvVarConfig[] = [
  // Required for core functionality
  {
    key: 'GEMINI_API_KEY',
    required: true,
    description: 'Google Gemini API key for AI image processing',
    service: 'Gemini Vision API',
  },
  {
    key: 'NEXT_PUBLIC_INSTANT_APP_ID',
    required: true,
    description: 'InstantDB app ID for user authentication and data storage',
    service: 'InstantDB',
  },

  // Required for paid features
  {
    key: 'REPLICATE_API_TOKEN',
    required: true,
    description: 'Replicate API token for NSFW processing and inpainting (~$0.023/image)',
    service: 'Replicate',
  },

  // Optional but recommended
  {
    key: 'OPENAI_API_KEY',
    required: false,
    description: 'OpenAI API key for DALL-E canvas generation',
    service: 'OpenAI DALL-E',
    defaultOk: true,
  },
  {
    key: 'TOGETHER_API_KEY',
    required: false,
    description: 'Together AI API key for free canvas generation',
    service: 'Together AI',
    defaultOk: true,
  },
  {
    key: 'HF_API_TOKEN',
    required: false,
    description: 'Hugging Face API token for Stable Diffusion (optional, slower without it)',
    service: 'Hugging Face',
    defaultOk: true,
  },

  // Analytics and tracking
  {
    key: 'KV_URL',
    required: false,
    description: 'Vercel KV URL for visitor tracking and analytics',
    service: 'Vercel KV',
    defaultOk: true,
  },
  {
    key: 'KV_REST_API_URL',
    required: false,
    description: 'Vercel KV REST API URL',
    service: 'Vercel KV',
    defaultOk: true,
  },
  {
    key: 'KV_REST_API_TOKEN',
    required: false,
    description: 'Vercel KV REST API token',
    service: 'Vercel KV',
    defaultOk: true,
  },
  {
    key: 'KV_REST_API_READ_ONLY_TOKEN',
    required: false,
    description: 'Vercel KV read-only token',
    service: 'Vercel KV',
    defaultOk: true,
  },

  // Email notifications
  {
    key: 'RESEND_API_KEY',
    required: false,
    description: 'Resend API key for email notifications',
    service: 'Resend',
    defaultOk: true,
  },
]

// Placeholder values that should be rejected
const placeholders = [
  'your_api_key_here',
  'your_openai_api_key_here',
  'your_gemini_key',
  'your_replicate_token',
  'your_together_key',
  'YOUR_SECRET_HERE',
  'placeholder',
]

function isPlaceholder(value: string): boolean {
  return placeholders.some(placeholder =>
    value.toLowerCase().includes(placeholder.toLowerCase())
  )
}

function validateEnv() {
  console.log(`\n${colors.bold}${colors.blue}Environment Variable Validation${colors.reset}\n`)

  let hasErrors = false
  let hasWarnings = false
  const missing: EnvVarConfig[] = []
  const invalid: EnvVarConfig[] = []
  const configured: EnvVarConfig[] = []
  const skipped: EnvVarConfig[] = []

  // API key format validators
  const API_KEY_FORMATS: Record<string, RegExp> = {
    GEMINI_API_KEY: /^AIza[0-9A-Za-z_-]{35}$/,
    OPENAI_API_KEY: /^sk-[a-zA-Z0-9]{48,}$/,
    REPLICATE_API_TOKEN: /^r8_[a-zA-Z0-9]{40}$/,
    TOGETHER_API_KEY: /^[a-f0-9]{64}$/,
    HF_API_TOKEN: /^hf_[a-zA-Z0-9]{34,}$/,
    RESEND_API_KEY: /^re_[a-zA-Z0-9]{32,}$/,
    STRIPE_SECRET_KEY: /^sk_(test|live)_[a-zA-Z0-9]{98,}$/,
    STRIPE_WEBHOOK_SECRET: /^whsec_[a-zA-Z0-9]{32,}$/,
    KV_REST_API_TOKEN: /^[A-Za-z0-9_-]{40,}$/,
  }

  // Check each environment variable
  for (const envVar of envVars) {
    const value = process.env[envVar.key]

    if (!value) {
      if (envVar.required) {
        missing.push(envVar)
        hasErrors = true
      } else {
        skipped.push(envVar)
        if (!envVar.defaultOk) {
          hasWarnings = true
        }
      }
      continue
    }

    // Check for placeholder values
    if (isPlaceholder(value)) {
      invalid.push(envVar)
      hasErrors = true
      continue
    }

    // Validate format for known API keys
    if (envVar.key in API_KEY_FORMATS) {
      const format = API_KEY_FORMATS[envVar.key]
      if (!format.test(value)) {
        console.log(`${colors.yellow}⚠${colors.reset} ${envVar.key} - Format validation failed`)
        console.log(`  Expected format: ${format.toString()}`)
        console.log(`  Received prefix: ${value.substring(0, 10)}...`)
        hasWarnings = true
      }
    }

    // Valid configuration
    configured.push(envVar)
  }

  // Print results
  if (configured.length > 0) {
    console.log(`${colors.green}${colors.bold}✓ Configured (${configured.length}):${colors.reset}`)
    for (const envVar of configured) {
      console.log(`  ${colors.green}✓${colors.reset} ${envVar.key} - ${envVar.description}`)
    }
    console.log()
  }

  if (skipped.length > 0) {
    const warningSkipped = skipped.filter(e => !e.defaultOk)
    const optionalSkipped = skipped.filter(e => e.defaultOk)

    if (warningSkipped.length > 0) {
      console.log(`${colors.yellow}${colors.bold}⚠ Missing (Recommended) (${warningSkipped.length}):${colors.reset}`)
      for (const envVar of warningSkipped) {
        console.log(`  ${colors.yellow}⚠${colors.reset} ${envVar.key} - ${envVar.description}`)
      }
      console.log()
    }

    if (optionalSkipped.length > 0) {
      console.log(`${colors.blue}${colors.bold}ℹ Missing (Optional) (${optionalSkipped.length}):${colors.reset}`)
      for (const envVar of optionalSkipped) {
        console.log(`  ${colors.blue}ℹ${colors.reset} ${envVar.key} - ${envVar.description}`)
      }
      console.log()
    }
  }

  if (missing.length > 0) {
    console.log(`${colors.red}${colors.bold}✗ Missing (Required) (${missing.length}):${colors.reset}`)
    for (const envVar of missing) {
      console.log(`  ${colors.red}✗${colors.reset} ${envVar.key} - ${envVar.description}`)
      console.log(`    Service: ${envVar.service}`)
    }
    console.log()
  }

  if (invalid.length > 0) {
    console.log(`${colors.red}${colors.bold}✗ Invalid (Placeholder Values) (${invalid.length}):${colors.reset}`)
    for (const envVar of invalid) {
      console.log(`  ${colors.red}✗${colors.reset} ${envVar.key} - Contains placeholder value`)
      console.log(`    Update with real API key in .env.local`)
    }
    console.log()
  }

  // Summary
  console.log(`${colors.bold}Summary:${colors.reset}`)
  console.log(`  Configured: ${colors.green}${configured.length}${colors.reset}`)
  console.log(`  Missing (Required): ${missing.length > 0 ? colors.red : colors.green}${missing.length}${colors.reset}`)
  console.log(`  Invalid: ${invalid.length > 0 ? colors.red : colors.green}${invalid.length}${colors.reset}`)
  console.log(`  Skipped (Optional): ${colors.blue}${skipped.length}${colors.reset}`)
  console.log()

  // Exit with error if required vars are missing
  if (hasErrors) {
    console.log(`${colors.red}${colors.bold}Validation Failed!${colors.reset}`)
    console.log(`${colors.red}Please configure the missing required environment variables in .env.local${colors.reset}\n`)
    process.exit(1)
  }

  if (hasWarnings) {
    console.log(`${colors.yellow}${colors.bold}Validation Passed with Warnings${colors.reset}`)
    console.log(`${colors.yellow}Some recommended features may not work without optional API keys${colors.reset}\n`)
    process.exit(0)
  }

  console.log(`${colors.green}${colors.bold}✓ All Required Environment Variables Configured!${colors.reset}\n`)
  process.exit(0)
}

// Run validation
validateEnv()
