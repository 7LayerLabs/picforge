#!/usr/bin/env tsx
/**
 * Environment Variable Checker - Interactive CLI Tool
 *
 * Checks which environment variables are configured, provides helpful
 * messages about what's missing, and gives direct links to get API keys.
 *
 * Usage:
 *   npm run check-env
 *   or
 *   npx tsx scripts/check-env.ts
 */

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

interface EnvVarInfo {
  key: string;
  required: boolean;
  description: string;
  usedFor: string[];
  getUrl: string;
  format: string;
  cost?: string;
  fallback?: string;
}

// Define all environment variables with detailed info
const envVars: EnvVarInfo[] = [
  // REQUIRED
  {
    key: 'GEMINI_API_KEY',
    required: true,
    description: 'Google Gemini Vision API key',
    usedFor: ['Main image editor', 'Transform Roulette', 'Roast Mode', 'AI image transformations'],
    getUrl: 'https://aistudio.google.com/apikey',
    format: 'AIzaSy... (39 characters)',
    cost: 'Free tier: 1,500 requests/day',
  },
  {
    key: 'REPLICATE_API_TOKEN',
    required: true,
    description: 'Replicate API token',
    usedFor: ['NSFW editor', 'NSFW batch processor', 'Inpainting feature', 'Unrestricted content'],
    getUrl: 'https://replicate.com/account/api-tokens',
    format: 'r8_... (43 characters)',
    cost: '~$0.023 per image (~$2 = 86 images)',
  },
  {
    key: 'NEXT_PUBLIC_INSTANT_APP_ID',
    required: true,
    description: 'InstantDB app ID',
    usedFor: ['User authentication', 'Image tracking', 'Favorites', 'Usage limits', 'All user data'],
    getUrl: 'https://www.instantdb.com/dash',
    format: 'UUID format (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)',
    cost: 'Free tier: 100K reads/writes per month',
  },

  // OPTIONAL - Canvas Generation
  {
    key: 'OPENAI_API_KEY',
    required: false,
    description: 'OpenAI API key (for DALL-E 3)',
    usedFor: ['Premium canvas generation', 'Highest quality images'],
    getUrl: 'https://platform.openai.com/api-keys',
    format: 'sk-... (51+ characters)',
    cost: '~$0.04 per image (expensive)',
    fallback: 'Falls back to Pollinations.ai (free)',
  },
  {
    key: 'TOGETHER_API_KEY',
    required: false,
    description: 'Together AI API key',
    usedFor: ['Affordable canvas generation', 'FLUX.1 model'],
    getUrl: 'https://api.together.xyz/settings/api-keys',
    format: '64-character hex string',
    cost: '~$0.002 per image (affordable)',
    fallback: 'Falls back to Pollinations.ai (free)',
  },
  {
    key: 'HF_API_TOKEN',
    required: false,
    description: 'Hugging Face API token',
    usedFor: ['Stable Diffusion XL', 'Free canvas generation'],
    getUrl: 'https://huggingface.co/settings/tokens',
    format: 'hf_... (37+ characters)',
    cost: 'Free tier available (slower)',
    fallback: 'Falls back to Pollinations.ai (free)',
  },

  // OPTIONAL - Analytics & Tracking
  {
    key: 'KV_URL',
    required: false,
    description: 'Vercel KV URL',
    usedFor: ['Rate limiting (persistent)', 'Visitor tracking', 'Analytics storage'],
    getUrl: 'https://vercel.com/dashboard (Storage → Create KV Database)',
    format: 'redis://... (auto-generated)',
    fallback: 'Uses in-memory storage (resets on restart)',
  },
  {
    key: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    required: false,
    description: 'Google Analytics 4 Measurement ID',
    usedFor: ['User behavior tracking', 'Site analytics', 'Conversion tracking'],
    getUrl: 'https://analytics.google.com/analytics/web/',
    format: 'G-XXXXXXXXXX',
    fallback: 'Analytics disabled',
  },

  // OPTIONAL - Email & Payments
  {
    key: 'RESEND_API_KEY',
    required: false,
    description: 'Resend API key',
    usedFor: ['Welcome emails', 'Limit warnings', 'Weekly digest', 'User notifications'],
    getUrl: 'https://resend.com/api-keys',
    format: 're_... (35+ characters)',
    cost: 'Free tier: 100 emails/day',
    fallback: 'Email notifications disabled',
  },
  {
    key: 'STRIPE_SECRET_KEY',
    required: false,
    description: 'Stripe secret key',
    usedFor: ['Pro tier subscriptions', 'Payment processing'],
    getUrl: 'https://dashboard.stripe.com/apikeys',
    format: 'sk_test_... or sk_live_... (100+ characters)',
    fallback: 'Pro subscriptions disabled (promo codes still work)',
  },
];

/**
 * Check if a value is a placeholder
 */
function isPlaceholder(value: string): boolean {
  const placeholders = [
    'your_api_key_here',
    'your_openai_api_key_here',
    'your_gemini_key',
    'your_replicate_token',
    'your_together_key',
    'your_instantdb_app_id',
    'YOUR_SECRET_HERE',
    'placeholder',
    'replace_me',
    'change_this',
  ];
  return placeholders.some((p) => value.toLowerCase().includes(p.toLowerCase()));
}

/**
 * Format a value for display (show first 10 chars + ...)
 */
function formatValue(value: string): string {
  if (value.length <= 15) {
    return value;
  }
  return `${value.substring(0, 10)}...${value.substring(value.length - 5)}`;
}

/**
 * Main check function
 */
function checkEnvironment() {
  console.log(`\n${colors.bold}${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║         PicForge Environment Configuration Checker        ║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const configured: EnvVarInfo[] = [];
  const missingRequired: EnvVarInfo[] = [];
  const missingOptional: EnvVarInfo[] = [];
  const placeholders: EnvVarInfo[] = [];

  // Check each environment variable
  for (const envVar of envVars) {
    const value = process.env[envVar.key];

    if (!value) {
      if (envVar.required) {
        missingRequired.push(envVar);
      } else {
        missingOptional.push(envVar);
      }
    } else if (isPlaceholder(value)) {
      placeholders.push(envVar);
    } else {
      configured.push(envVar);
    }
  }

  // 1. Show configured variables
  if (configured.length > 0) {
    console.log(`${colors.green}${colors.bold}✓ CONFIGURED (${configured.length}):${colors.reset}\n`);
    for (const envVar of configured) {
      const value = process.env[envVar.key]!;
      console.log(`  ${colors.green}✓${colors.reset} ${colors.bold}${envVar.key}${colors.reset}`);
      console.log(`    ${colors.dim}${envVar.description}${colors.reset}`);
      console.log(`    ${colors.dim}Value: ${formatValue(value)}${colors.reset}`);
      console.log(`    ${colors.dim}Used for: ${envVar.usedFor.join(', ')}${colors.reset}`);
      if (envVar.cost) {
        console.log(`    ${colors.dim}Cost: ${envVar.cost}${colors.reset}`);
      }
      console.log();
    }
  }

  // 2. Show missing REQUIRED variables (CRITICAL)
  if (missingRequired.length > 0) {
    console.log(`${colors.red}${colors.bold}✗ MISSING REQUIRED (${missingRequired.length}):${colors.reset}\n`);
    for (const envVar of missingRequired) {
      console.log(`  ${colors.red}✗${colors.reset} ${colors.bold}${colors.red}${envVar.key}${colors.reset} ${colors.red}(CRITICAL)${colors.reset}`);
      console.log(`    ${colors.dim}${envVar.description}${colors.reset}`);
      console.log(`    ${colors.yellow}Used for: ${envVar.usedFor.join(', ')}${colors.reset}`);
      console.log(`    ${colors.cyan}Get it: ${envVar.getUrl}${colors.reset}`);
      console.log(`    ${colors.dim}Format: ${envVar.format}${colors.reset}`);
      if (envVar.cost) {
        console.log(`    ${colors.dim}Cost: ${envVar.cost}${colors.reset}`);
      }
      console.log();
    }
  }

  // 3. Show placeholder values (INVALID)
  if (placeholders.length > 0) {
    console.log(`${colors.red}${colors.bold}✗ INVALID (Placeholder Values) (${placeholders.length}):${colors.reset}\n`);
    for (const envVar of placeholders) {
      const value = process.env[envVar.key]!;
      console.log(`  ${colors.red}✗${colors.reset} ${colors.bold}${colors.red}${envVar.key}${colors.reset}`);
      console.log(`    ${colors.red}Current value: "${value}"${colors.reset}`);
      console.log(`    ${colors.yellow}This is a placeholder! Replace with a real API key.${colors.reset}`);
      console.log(`    ${colors.cyan}Get it: ${envVar.getUrl}${colors.reset}`);
      console.log();
    }
  }

  // 4. Show missing OPTIONAL variables
  if (missingOptional.length > 0) {
    console.log(`${colors.yellow}${colors.bold}○ MISSING OPTIONAL (${missingOptional.length}):${colors.reset}\n`);
    for (const envVar of missingOptional) {
      console.log(`  ${colors.yellow}○${colors.reset} ${colors.bold}${envVar.key}${colors.reset} ${colors.dim}(optional)${colors.reset}`);
      console.log(`    ${colors.dim}${envVar.description}${colors.reset}`);
      console.log(`    ${colors.dim}Used for: ${envVar.usedFor.join(', ')}${colors.reset}`);
      if (envVar.fallback) {
        console.log(`    ${colors.cyan}Fallback: ${envVar.fallback}${colors.reset}`);
      }
      console.log(`    ${colors.dim}Get it: ${envVar.getUrl}${colors.reset}`);
      if (envVar.cost) {
        console.log(`    ${colors.dim}Cost: ${envVar.cost}${colors.reset}`);
      }
      console.log();
    }
  }

  // Summary
  console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`);
  console.log(`${colors.bold}SUMMARY:${colors.reset}\n`);
  console.log(`  ${colors.green}✓ Configured: ${configured.length}${colors.reset}`);
  console.log(`  ${colors.red}✗ Missing Required: ${missingRequired.length}${colors.reset}`);
  console.log(`  ${colors.red}✗ Invalid (Placeholders): ${placeholders.length}${colors.reset}`);
  console.log(`  ${colors.yellow}○ Missing Optional: ${missingOptional.length}${colors.reset}`);
  console.log();

  // Final verdict
  const hasErrors = missingRequired.length > 0 || placeholders.length > 0;
  if (hasErrors) {
    console.log(`${colors.red}${colors.bold}✗ VALIDATION FAILED${colors.reset}\n`);
    console.log(`${colors.red}Your app will NOT work correctly without the required environment variables.${colors.reset}\n`);
    console.log(`${colors.yellow}To fix:${colors.reset}`);
    console.log(`  1. Copy .env.example to .env.local`);
    console.log(`  2. Replace placeholder values with real API keys from the URLs above`);
    console.log(`  3. Run this check again: ${colors.cyan}npm run check-env${colors.reset}`);
    console.log(`  4. Start your app: ${colors.cyan}npm run dev${colors.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bold}✓ ALL REQUIRED VARIABLES CONFIGURED!${colors.reset}\n`);
    if (missingOptional.length > 0) {
      console.log(`${colors.yellow}Note: ${missingOptional.length} optional feature(s) disabled. App will work but some features unavailable.${colors.reset}\n`);
    } else {
      console.log(`${colors.green}All features enabled! Your app is fully configured.${colors.reset}\n`);
    }
    process.exit(0);
  }
}

// Run the check
checkEnvironment();
