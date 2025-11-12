/**
 * Admin Authentication Utilities
 * 
 * Centralized admin authorization using environment variables.
 * Replaces hardcoded email addresses with configurable admin emails.
 */

import { getEnvVar } from './validateEnv';

/**
 * Get list of admin email addresses from environment variable
 * Supports comma-separated list: ADMIN_EMAILS="admin1@example.com,admin2@example.com"
 */
export function getAdminEmails(): string[] {
  const adminEmailsEnv = getEnvVar('ADMIN_EMAILS', '');
  
  if (!adminEmailsEnv) {
    // Fallback for backward compatibility during migration
    // TODO: Remove this fallback once ADMIN_EMAILS is set in production
    const fallbackEmail = process.env.ADMIN_EMAIL_FALLBACK || '';
    if (fallbackEmail) {
      return [fallbackEmail];
    }
    return [];
  }

  return adminEmailsEnv
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);
}

/**
 * Check if an email address is an admin
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }

  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) {
    // If no admin emails configured, deny access for security
    return false;
  }

  return adminEmails.includes(email.toLowerCase());
}

/**
 * Require admin access - throws error if user is not admin
 */
export function requireAdmin(email: string | null | undefined): void {
  if (!isAdminEmail(email)) {
    throw new Error('Admin access required');
  }
}

/**
 * Get admin email configuration status
 * Useful for startup checks and debugging
 */
export function getAdminEmailStatus(): {
  configured: boolean;
  count: number;
  emails: string[];
} {
  const emails = getAdminEmails();
  return {
    configured: emails.length > 0,
    count: emails.length,
    emails: emails, // In production, you might want to hide this
  };
}

