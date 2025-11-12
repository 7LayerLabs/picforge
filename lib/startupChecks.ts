/**
 * Startup Validation Checks
 *
 * Validates environment configuration when the application starts.
 * Provides helpful warnings and error messages for missing or misconfigured services.
 *
 * Usage:
 *   import { runStartupChecks } from '@/lib/startupChecks';
 *   runStartupChecks(); // Call early in app initialization
 */

import { isEnvVarConfigured, validateEnvVars } from './validateEnv';

/**
 * Service availability status
 */
export interface ServiceStatus {
  name: string;
  required: boolean;
  available: boolean;
  message: string;
}

/**
 * Check which AI providers are configured
 */
export function checkAIProviders(): ServiceStatus[] {
  const providers: ServiceStatus[] = [];

  // Core AI services
  providers.push({
    name: 'Gemini Vision API',
    required: true,
    available: isEnvVarConfigured('GEMINI_API_KEY'),
    message: isEnvVarConfigured('GEMINI_API_KEY')
      ? 'Main image editor, Roulette, and Roast Mode enabled'
      : 'CRITICAL: Main image editor will not work without GEMINI_API_KEY',
  });

  providers.push({
    name: 'Replicate API',
    required: true,
    available: isEnvVarConfigured('REPLICATE_API_TOKEN'),
    message: isEnvVarConfigured('REPLICATE_API_TOKEN')
      ? 'NSFW editor and Inpainting enabled (~$0.023/image)'
      : 'CRITICAL: NSFW editor and Inpainting will not work without REPLICATE_API_TOKEN',
  });

  // Canvas generation (at least one recommended)
  const hasOpenAI = isEnvVarConfigured('OPENAI_API_KEY');
  const hasTogether = isEnvVarConfigured('TOGETHER_API_KEY');
  const hasHuggingFace = isEnvVarConfigured('HF_API_TOKEN');
  const hasAnyCanvas = hasOpenAI || hasTogether || hasHuggingFace;

  providers.push({
    name: 'OpenAI DALL-E',
    required: false,
    available: hasOpenAI,
    message: hasOpenAI
      ? 'Premium canvas generation enabled (~$0.04/image)'
      : 'Optional: Best quality canvas generation',
  });

  providers.push({
    name: 'Together AI',
    required: false,
    available: hasTogether,
    message: hasTogether
      ? 'Affordable canvas generation enabled (~$0.002/image)'
      : 'Optional: Good quality canvas generation',
  });

  providers.push({
    name: 'Hugging Face',
    required: false,
    available: hasHuggingFace,
    message: hasHuggingFace
      ? 'Stable Diffusion XL canvas generation enabled'
      : 'Optional: Free tier canvas generation',
  });

  // Fallback message
  if (!hasAnyCanvas) {
    providers.push({
      name: 'Pollinations.ai (Fallback)',
      required: false,
      available: true,
      message: 'Using free Pollinations.ai for canvas generation (no API key required)',
    });
  }

  return providers;
}

/**
 * Check database and authentication services
 */
export function checkDatabaseServices(): ServiceStatus[] {
  return [
    {
      name: 'InstantDB',
      required: true,
      available: isEnvVarConfigured('NEXT_PUBLIC_INSTANT_APP_ID'),
      message: isEnvVarConfigured('NEXT_PUBLIC_INSTANT_APP_ID')
        ? 'User authentication and data storage enabled'
        : 'CRITICAL: User authentication and all data persistence will not work without NEXT_PUBLIC_INSTANT_APP_ID',
    },
  ];
}

/**
 * Check optional services (analytics, email, payments)
 */
export function checkOptionalServices(): ServiceStatus[] {
  const services: ServiceStatus[] = [];

  // Vercel KV (rate limiting and analytics)
  const hasKV = isEnvVarConfigured('KV_URL');
  services.push({
    name: 'Vercel KV',
    required: false,
    available: hasKV,
    message: hasKV
      ? 'Rate limiting and visitor tracking using Redis'
      : 'Using in-memory rate limiting (resets on server restart)',
  });

  // Google Analytics
  const hasGA = isEnvVarConfigured('NEXT_PUBLIC_GA_MEASUREMENT_ID');
  services.push({
    name: 'Google Analytics',
    required: false,
    available: hasGA,
    message: hasGA
      ? 'User behavior tracking enabled'
      : 'Analytics tracking disabled',
  });

  // Email service
  const hasEmail = isEnvVarConfigured('RESEND_API_KEY');
  services.push({
    name: 'Resend Email',
    required: false,
    available: hasEmail,
    message: hasEmail
      ? 'Email notifications enabled'
      : 'Email notifications disabled',
  });

  // Stripe payments
  const hasStripe = isEnvVarConfigured('STRIPE_SECRET_KEY');
  services.push({
    name: 'Stripe Payments',
    required: false,
    available: hasStripe,
    message: hasStripe
      ? 'Pro tier subscriptions enabled'
      : 'Pro tier subscriptions disabled (promo codes still work)',
  });

  return services;
}

/**
 * Run all startup checks and log results
 * @param silent - If true, only log errors and critical issues
 * @returns true if all required services are available
 */
export function runStartupChecks(silent: boolean = false): boolean {
  // Only run in server context (not in browser)
  if (typeof window !== 'undefined') {
    return true;
  }

  // Only run in development or when explicitly enabled
  const shouldRun = process.env.NODE_ENV === 'development' || process.env.RUN_STARTUP_CHECKS === 'true';
  if (!shouldRun && silent) {
    return true;
  }

  if (!silent) {
    console.log('\n=== PicForge Startup Checks ===\n');
  }

  // Check all services
  const aiProviders = checkAIProviders();
  const database = checkDatabaseServices();
  const optional = checkOptionalServices();

  const allServices = [...aiProviders, ...database, ...optional];
  const requiredServices = allServices.filter((s) => s.required);
  const missingRequired = requiredServices.filter((s) => !s.available);

  // Log AI providers
  if (!silent) {
    console.log('AI Providers:');
    aiProviders.forEach((service) => {
      const icon = service.available ? '✓' : service.required ? '✗' : '○';
      const color = service.available ? '\x1b[32m' : service.required ? '\x1b[31m' : '\x1b[33m';
      console.log(`  ${color}${icon}\x1b[0m ${service.name}: ${service.message}`);
    });
    console.log();
  }

  // Log database
  if (!silent) {
    console.log('Database & Auth:');
    database.forEach((service) => {
      const icon = service.available ? '✓' : '✗';
      const color = service.available ? '\x1b[32m' : '\x1b[31m';
      console.log(`  ${color}${icon}\x1b[0m ${service.name}: ${service.message}`);
    });
    console.log();
  }

  // Log optional services
  if (!silent) {
    console.log('Optional Services:');
    optional.forEach((service) => {
      const icon = service.available ? '✓' : '○';
      const color = service.available ? '\x1b[32m' : '\x1b[33m';
      console.log(`  ${color}${icon}\x1b[0m ${service.name}: ${service.message}`);
    });
    console.log();
  }

  // Check for critical issues
  if (missingRequired.length > 0) {
    console.error('\x1b[31m\x1b[1m✗ CRITICAL: Missing required services!\x1b[0m\n');
    missingRequired.forEach((service) => {
      console.error(`  \x1b[31m✗\x1b[0m ${service.name}: ${service.message}`);
    });
    console.error('\n\x1b[31mApp may not function correctly. Please configure missing environment variables.\x1b[0m');
    console.error('\x1b[33mRun: npm run check-env (for detailed help)\x1b[0m\n');
    return false;
  }

  if (!silent) {
    console.log('\x1b[32m✓ All required services configured!\x1b[0m\n');
  }

  return true;
}

/**
 * Get a summary of service availability for API responses
 */
export function getServiceSummary() {
  const aiProviders = checkAIProviders();
  const database = checkDatabaseServices();
  const optional = checkOptionalServices();

  return {
    ai: aiProviders.map((s) => ({ name: s.name, available: s.available })),
    database: database.map((s) => ({ name: s.name, available: s.available })),
    optional: optional.map((s) => ({ name: s.name, available: s.available })),
    allRequiredAvailable: [...aiProviders, ...database]
      .filter((s) => s.required)
      .every((s) => s.available),
  };
}
