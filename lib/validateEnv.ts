/**
 * Environment Variable Validation Utilities
 *
 * Ensures required environment variables are present with clear error messages.
 * Use this in API routes to fail fast with helpful messages.
 */

/**
 * Require an environment variable to be set, throw if missing
 * @param key - Environment variable name
 * @param context - Optional context for better error messages (e.g., 'OpenAI API', 'Gemini')
 * @returns The environment variable value
 * @throws Error if the variable is not set or is a placeholder
 */
export function requireEnvVar(key: string, context?: string): string {
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
    'placeholder'
  ]

  if (placeholders.some(placeholder => value.toLowerCase().includes(placeholder.toLowerCase()))) {
    throw new Error(
      `Environment variable ${key} is set to a placeholder value. ` +
      `Please update it with a real API key in .env.local`
    )
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
