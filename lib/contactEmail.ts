/**
 * Contact Email Utility
 * 
 * Centralized place for contact email addresses.
 * Uses environment variables with sensible defaults.
 * 
 * For client components: Use NEXT_PUBLIC_SUPPORT_EMAIL
 * For server components/API: Use SUPPORT_EMAIL or ADMIN_EMAIL
 */

import { getEnvVar } from './validateEnv';

/**
 * Get support email address
 */
function getSupportEmail(): string {
  return getEnvVar('SUPPORT_EMAIL', 'support@pic-forge.com');
}

/**
 * Get contact email for legal/business inquiries
 * Defaults to support email if not configured
 * Can be used in both server and client components
 */
export function getContactEmail(): string {
  // Client components: NEXT_PUBLIC_* vars are available at build time
  if (typeof window !== 'undefined') {
    return (process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 
            process.env.NEXT_PUBLIC_ADMIN_EMAIL || 
            'support@pic-forge.com');
  }
  
  // Server-side: use regular env vars
  if (typeof process !== 'undefined') {
    const contactEmail = getEnvVar('CONTACT_EMAIL', '');
    if (contactEmail) return contactEmail;
    
    return getSupportEmail();
  }
  
  // Default fallback
  return 'support@pic-forge.com';
}

/**
 * Get business/hello email address
 */
export function getBusinessEmail(): string {
  return getEnvVar('BUSINESS_EMAIL', 'hello@pic-forge.com');
}

/**
 * Get legal/privacy email address
 */
export function getLegalEmail(): string {
  return getEnvVar('LEGAL_EMAIL', getContactEmail());
}

/**
 * Get showcase submission email
 */
export function getShowcaseEmail(): string {
  return getEnvVar('SHOWCASE_EMAIL', 'showcase@pic-forge.com');
}
