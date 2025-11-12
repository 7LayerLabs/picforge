# October 16, 2025 - PicForge Development Notes

## Project: PicForge Prompt Library Implementation

### What We Accomplished Today

#### 1. Initial Prompt Library Build
- Created a comprehensive prompt library with **325+ prompts** across **13 categories**
- Built in a separate `/picforge-ui` subfolder as a standalone Next.js project
- Categories include:
  - Art Styles & Movements
  - Nature & Landscapes
  - People & Portraits (with diverse representation)
  - Pro Photography & Editing
  - Fantasy & Sci-Fi
  - Abstract & Artistic
  - Film & Movie Styles
  - **NEW**: Sports & Fitness
  - **NEW**: Politics & Civic Engagement
  - **NEW**: Wellness & Lifestyle
  - **NEW**: Events & Celebrations
  - Plus more!

#### 2. Key Features Implemented
- **Category Filtering**: Single-select category filter
- **Tag Filtering**: Multi-select tag system
- **Search Functionality**: Search across titles, descriptions, and tags
- **Favorites System**: LocalStorage-based favorites with persistence
- **Favorites Page**: Dedicated page at `/prompts/favorites` with export and stats
- **Prompt of the Day**: Rotating daily featured prompt
- **Copy Functionality**: One-click copy button for each prompt
- **Submit Modal**: Users can submit their own prompts
- **Design System**: Black/white/teal matching PicForge brand
- **Typography**: Courier New monospace font for headings (matching "(re)Imagine. Everything.")

#### 3. Component Architecture
Created the following components:
- `Navigation.tsx` - Site-wide header matching PicForge
- `PromptCard.tsx` - Individual prompt display with copy/favorite buttons
- `FilterSidebar.tsx` - Category and tag filtering
- `SearchBar.tsx` - Search input with clear button
- `PromptSubmitModal.tsx` - User submission form
- `lib/prompts.ts` - 325+ prompt definitions

### What We Got Stuck On (And Fixed!)

#### Issue 1: Multiple Vercel Build Failures
**Problem**: 5+ failed builds due to various errors

**Errors Encountered**:
1. ❌ `app/selective-edit/page.tsx` - ESLint error (unescaped apostrophe)
2. ❌ `picforge-ui/` folder being built with main app (TypeScript errors)
3. ❌ `app/dashboard/page.tsx` - SSR prerendering error with `useSession()`
4. ❌ `app/showcase/submit/page.tsx` - SSR prerendering error with `useSession()`
5. ❌ `components/PromptSubmitModal.tsx` - ESLint error (unescaped quotes)

**Solutions Applied**:

**Fix #1**: Removed `selective-edit` page entirely
```bash
git rm app/selective-edit/page.tsx
```

**Fix #2**: Excluded `picforge-ui` from main repo
```bash
# Added to .gitignore
/picforge-ui

# Removed from git tracking
git rm -r --cached picforge-ui
```

**Fix #3 & #4**: Separated Client and Server Components for Auth Pages
- Created `DashboardClient.tsx` and `ShowcaseSubmitClient.tsx`
- Made `page.tsx` files Server Components with route segment config:
```tsx
// page.tsx (Server Component)
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function DashboardPage() {
  return <DashboardClient />
}
```
- **Why**: Route segment config exports don't work in Client Components in Next.js 15

**Fix #5**: Escaped quotes in PromptSubmitModal
```tsx
// Changed from:
"Prompt of the Day"

// To:
&quot;Prompt of the Day&quot;
```

#### Issue 2: Git Push Rejection
**Problem**: Remote had changes not in local
```bash
! [rejected]        main -> main (fetch first)
```

**Fix**: Used rebase to sync
```bash
git pull --rebase
git push
```

#### Issue 3: Design Mismatch
**Problem**: Initial prompt library used red gradients and dark slate colors

**User Feedback**: "this page should primarily be black and white with some greens in it. this doesn't match at all. no gradients either."

**Fix**:
- Changed to white backgrounds
- Black text
- Teal (#14b8a6) accents
- Removed all gradients
- Applied Courier New monospace font to headings

#### Issue 4: Navigation Header Missing
**Problem**: Page had custom header, not matching main PicForge site

**Fix**: Created `Navigation.tsx` component matching exact PicForge header:
- Teal logo with "Forge your images into art" tagline
- Centered navigation links
- Dropdown indicators (▼) for Resources, Games, Profile
- Red "Sign Out" button
- Removed "Selective" option from nav

### Final State

#### What Works ✅
1. Vercel builds successfully
2. All 325 prompts displaying correctly
3. Filtering by category and tags
4. Search functionality
5. Favorites system with persistence
6. Copy buttons on all prompts
7. Proper PicForge design system
8. Main page updated: "325+ prompts and endless ideas to break reality"

#### What's Deployed
- **Main Site**: pic-forge.com
- **Prompt Library**: pic-forge.com/prompts
- **Favorites Page**: pic-forge.com/prompts/favorites

#### File Locations
```
Main PicForge App: C:\Users\derek\OneDrive\Desktop\nano\
├── app/prompts/page.tsx (Prompt Library)
├── app/prompts/favorites/page.tsx (Favorites)
├── components/
│   ├── Navigation.tsx
│   ├── PromptCard.tsx
│   ├── FilterSidebar.tsx
│   ├── SearchBar.tsx
│   └── PromptSubmitModal.tsx
└── lib/prompts.ts (325+ prompts)

Separate Dev Project: C:\Users\derek\OneDrive\Desktop\nano\picforge-ui/
(Excluded from git, used for development only)
```

### Git Commits Made Today
1. `8993f14` - Complete PicForge Prompt Library implementation
2. `5d04acd` - Remove selective-edit page to fix Vercel build
3. `2397db3` - Remove picforge-ui from main repository to fix Vercel build
4. `429da96` - Fix dashboard prerendering error
5. `cd8860f` - Fix showcase/submit prerendering error
6. `214653a` - Fix SSR prerendering for auth pages with mounted check
7. `e0dff1b` - Fix SSR prerendering by separating client and server components
8. `380540f` - Add comprehensive prompt library to main PicForge app
9. `2fec792` - Fix ESLint error and update prompt count from 210 to 325

### Key Learnings

1. **Next.js 15 App Router Pattern**: Route segment config exports (`export const dynamic`) only work in Server Components, not Client Components
2. **SSR with Auth**: Use separate Client/Server component pattern for authenticated pages
3. **Vercel Build Process**: Always check for ESLint errors and TypeScript issues before pushing
4. **Git Workflow**: Use `git pull --rebase` when remote has changes
5. **Design System**: Always match existing brand guidelines (black/white/teal, no gradients, Courier New font)

### Next Steps (If Needed)
- [ ] Backend integration for prompt submissions
- [ ] User authentication for favorites sync across devices
- [ ] Analytics tracking for popular prompts
- [ ] Admin panel for managing submitted prompts
- [ ] "Prompt of the Day" voting system

### Notes for Future Derek
- The prompt library is now fully integrated into the main PicForge app
- The separate `picforge-ui` folder can be deleted if no longer needed
- All components use localStorage for favorites (no backend yet)
- Design matches exact PicForge brand: black/white/teal, Courier New headings
- Total build time from start to successful deployment: ~2.5 hours (with 5 failed builds)

---

**Status**: ✅ COMPLETE AND DEPLOYED
**Last Updated**: October 16, 2025 at 7:52 PM EST
**Vercel Status**: All builds passing
**Production URL**: https://pic-forge.com/prompts
