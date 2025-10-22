# Prisma/NextAuth Cleanup Plan
**Date:** October 22, 2025
**Issue:** #12 Database Consolidation - Final Cleanup

## Current Status

The InstantDB migration was **ALREADY COMPLETED** on October 21, 2025. However, Prisma and NextAuth dependencies remain in the codebase as "safety rollback" code. Since the migration is successful and stable, we can now safely remove these dependencies.

## Files Analysis

### ✅ Already Migrated to InstantDB
- `app/showcase/page.tsx` - Uses `db.useQuery()` and `db.transact()`
- `app/showcase/submit/ShowcaseSubmitClient.tsx` - Uses `db.transact()`
- `lib/instantdb.ts` - Schema includes `showcaseSubmissions` and `showcaseLikes`
- `hooks/useImageTracking.ts` - All image tracking uses InstantDB
- `hooks/usePromoCode.ts` - Promo codes use InstantDB

### 🗑️ Dead Code to Remove (NextAuth Disabled)
1. **Pages:**
   - `app/dashboard/` - Dashboard using NextAuth (not in Navigation)
   - `app/dashboard/DashboardClient.tsx` - Uses `useSession` hook
   - `app/dashboard/page.tsx` - Server component wrapper
   - `app/auth/signin/page.tsx` - Sign-in page for NextAuth
   - `app/auth/error/page.tsx` - Error page for NextAuth (if exists)

2. **API Routes (Deprecated):**
   - `app/api/auth/[...nextauth]/route.ts` - Returns 404 (NextAuth disabled)
   - `app/api/showcase/route.ts` - Deprecated, returns 410 Gone
   - `app/api/showcase/[id]/like/route.ts` - Deprecated, returns 410 Gone
   - `app/api/user/stats/route.ts` - If exists, used by dashboard

3. **Library Files:**
   - `lib/prisma.ts` - Prisma client (deprecated, marked for removal)
   - `lib/auth.ts` - Helper functions using Prisma
   - `lib/auth-options.ts` - NextAuth configuration

4. **Database Files:**
   - `prisma/schema.prisma` - SQLite schema
   - `prisma/schema.production.prisma` - PostgreSQL schema
   - `prisma/dev.db` - SQLite development database
   - `prisma/dev.db-journal` - SQLite journal (if exists)

5. **Type Definitions:**
   - `types/next-auth.d.ts` - NextAuth type extensions (if exists)

### 📦 Dependencies to Remove from package.json
```json
{
  "dependencies": {
    "@auth/prisma-adapter": "^2.10.0",  // Remove
    "@prisma/client": "^6.16.3",         // Remove
    "next-auth": "^4.24.11",             // Remove
    "prisma": "^6.16.3"                  // Remove
  }
}
```

### 🔧 Scripts to Remove from package.json
```json
{
  "scripts": {
    "build": "prisma generate && next build",  // Change to: "next build"
    "db:push": "...",                          // Remove
    "db:push:prod": "...",                     // Remove
    "db:generate": "...",                      // Remove
    "db:generate:prod": "...",                 // Remove
    "db:studio": "..."                         // Remove
  }
}
```

### ⚠️ Components to Verify (Should Use InstantDB)
These files import NextAuth but may need to be checked:
- `components/AuthButton.tsx` - Should use InstantDB auth only
- `components/UserMenu.tsx` - Should use InstantDB auth only

## Cleanup Steps

### Phase 1: Verify No Active Usage
```bash
# Search for any active imports (excluding deprecated files)
grep -r "useSession\|getServerSession" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules
grep -r "@prisma/client" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules
grep -r "next-auth" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules
```

### Phase 2: Remove Dead Code Files
1. Delete deprecated API routes
2. Delete dashboard pages
3. Delete auth signin/error pages
4. Delete library files (prisma.ts, auth.ts, auth-options.ts)
5. Delete Prisma schema and database files
6. Delete NextAuth type definitions

### Phase 3: Clean Dependencies
1. Remove dependencies from package.json
2. Remove scripts from package.json
3. Update build script to remove `prisma generate`
4. Run `npm install` to update package-lock.json

### Phase 4: Verification
1. Run `npm run build` to ensure no build errors
2. Test showcase page (already uses InstantDB)
3. Test showcase submit page (already uses InstantDB)
4. Test image tracking (already uses InstantDB)
5. Test promo code redemption (already uses InstantDB)
6. Verify no console errors in browser

### Phase 5: Documentation Update
1. Update CLAUDE.md to remove Prisma references
2. Update AUTH_STATUS.md to reflect InstantDB-only setup
3. Add migration completion note to COMPREHENSIVE_REVIEW_2025.md
4. Archive old setup documentation (AUTH_SETUP.md, SUPABASE_SETUP.md)

## Risk Assessment

### Low Risk ✅
- All showcase functionality already migrated and tested
- API routes marked deprecated since Oct 21 (no active usage)
- NextAuth disabled at API level (returns 404)
- Dashboard not linked in Navigation (orphaned page)

### Medium Risk ⚠️
- If any external services still call old API routes (check analytics)
- If users have bookmarks to /dashboard or /auth/signin
- Need to verify UserMenu and AuthButton don't import NextAuth

### Rollback Plan 🔄
If issues arise:
1. Revert commit with `git revert`
2. Run `npm install` to restore dependencies
3. Prisma code is already in git history for reference
4. InstantDB migration is independent and won't be affected

## Expected Outcome

**Before:**
- 2 databases (Prisma + InstantDB)
- 2 auth systems (NextAuth disabled + InstantDB active)
- ~15 deprecated files
- 4 unused dependencies

**After:**
- 1 database (InstantDB only)
- 1 auth system (InstantDB only)
- Clean codebase
- Smaller node_modules (no Prisma client)
- Faster builds (no prisma generate step)

## Next Steps

1. ✅ Create this cleanup plan (DONE)
2. ⏳ Verify no active usage of Prisma/NextAuth
3. ⏳ Remove dead code files
4. ⏳ Update package.json
5. ⏳ Run npm install
6. ⏳ Test build and functionality
7. ⏳ Update documentation
8. ⏳ Create git commit
9. ⏳ Mark issue #12 as complete

---

**Note:** This cleanup is safe because:
1. Migration completed 1 day ago (Oct 21) and tested
2. Deprecated routes returning 410 Gone for 1 day with no issues
3. Dashboard never linked in navigation
4. All active features use InstantDB
5. NextAuth disabled at API level
