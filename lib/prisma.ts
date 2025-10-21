/**
 * @deprecated This file is deprecated as of 2025-10-21 (Issue #12)
 *
 * PicForge has migrated from Prisma to InstantDB for all database operations.
 *
 * MIGRATION NOTES:
 * - Showcase feature now uses InstantDB directly (see app/showcase/page.tsx)
 * - All user authentication uses InstantDB (see lib/instantdb.ts)
 * - Image tracking, favorites, and usage limits use InstantDB (see hooks/useImageTracking.ts)
 *
 * LEGACY USAGE:
 * - This file is kept for backward compatibility and rollback safety
 * - NextAuth still uses PrismaAdapter but that's being phased out
 * - DO NOT use this for new features
 *
 * ROLLBACK PROCEDURE (if needed):
 * 1. Revert app/showcase/page.tsx to use /api/showcase routes
 * 2. Revert app/showcase/submit/ShowcaseSubmitClient.tsx to use API
 * 3. Restore API route files to original Prisma implementation
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma