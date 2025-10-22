/**
 * Environment Variable Validation Utilities
 *
 * Ensures required environment variables are present with clear error messages.
 * Use this in API routes to fail fast with helpful messages.
 */

/**
 * API key format validators for common providers
 */
const API_KEY_FORMATS = {
  GEMINI_API_KEY: /^AIza[0-9A-Za-z_-]{35}$/,
  OPENAI_API_KEY: /^sk-[a-zA-Z0-9]{48,}$/,
  REPLICATE_API_TOKEN: /^r8_[a-zA-Z0-9]{40}$/,
  TOGETHER_API_KEY: /^[a-f0-9]{64}$/,
  HF_API_TOKEN: /^hf_[a-zA-Z0-9]{34,}$/,
  RESEND_API_KEY: /^re_[a-zA-Z0-9]{32,}$/,
  STRIPE_SECRET_KEY: /^sk_(test|live)_[a-zA-Z0-9]{98,}$/,
  STRIPE_WEBHOOK_SECRET: /^whsec_[a-zA-Z0-9]{32,}$/,
  KV_REST_API_TOKEN: /^[A-Za-z0-9_-]{40,}$/,
} as const

/**
 * Require an environment variable to be set, throw if missing
 * @param key - Environment variable name
 * @param context - Optional context for better error messages (e.g., 'OpenAI API', 'Gemini')
 * @param validateFormat - Whether to validate API key format (default: true)
 * @returns The environment variable value
 * @throws Error if the variable is not set, is a placeholder, or has invalid format
 */
export function requireEnvVar(
  key: string,
  context?: string,
  validateFormat: boolean = true
): string {
  const value = process.env[key]

  // Check if missing
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}${context ? ` (needed for ${context})` : ''}. ` +
      `Add it to your .env.local file.`
    )
  }

  // Check for common placeholder values
  const placeholders = [
    'your_api_key_here',
    'your_openai_api_key_here',
    'your_gemini_key',
    'your_replicate_token',
    'your_together_key',
    'YOUR_SECRET_HERE',
    'placeholder',
    'replace_me',
    'change_this',
  ]

  if (placeholders.some(placeholder => value.toLowerCase().includes(placeholder.toLowerCase()))) {
    throw new Error(
      `Environment variable ${key} is set to a placeholder value. ` +
      `Please update it with a real API key in .env.local`
    )
  }

  // Validate format if a known key format exists
  if (validateFormat && key in API_KEY_FORMATS) {
    const format = API_KEY_FORMATS[key as keyof typeof API_KEY_FORMATS]
    if (!format.test(value)) {
      throw new Error(
        `Environment variable ${key} has invalid format. ` +
        `Expected format: ${format.toString()}. ` +
        `Please check your API key in .env.local`
      )
    }
  }

  return value
}

/**
 * Get an optional environment variable with a default value
 * @param key - Environment variable name
 * @param defaultValue - Default value if not set
 * @returns The environment variable value or default
 */
export function getEnvVar(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue
}

/**
 * Check if an environment variable is configured (not missing or placeholder)
 * @param key - Environment variable name
 * @returns true if properly configured, false otherwise
 */
export function isEnvVarConfigured(key: string): boolean {
  try {
    requireEnvVar(key)
    return true
  } catch {
    return false
  }
}

/**
 * Validate multiple environment variables at once
 * @param vars - Array of environment variable names or objects with name and context
 * @returns Object with missing/invalid variables and whether all are valid
 */
export function validateEnvVars(
  vars: (string | { key: string; context?: string })[]
): { isValid: boolean; missing: string[]; errors: string[] } {
  const missing: string[] = []
  const errors: string[] = []

  for (const v of vars) {
    const key = typeof v === 'string' ? v : v.key
    const context = typeof v === 'string' ? undefined : v.context

    try {
      requireEnvVar(key, context)
    } catch (error) {
      missing.push(key)
      errors.push(error instanceof Error ? error.message : String(error))
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    errors
  }
}
