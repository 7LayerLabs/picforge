#!/usr/bin/env tsx

/**
 * GA4 Analytics Testing Script
 *
 * This script helps you verify that Google Analytics 4 is properly configured
 * and that custom events are being tracked correctly.
 *
 * Usage:
 *   npm run dev (in one terminal)
 *   npx tsx scripts/test-analytics.ts (in another terminal)
 *
 * Or visit your production site and use browser DevTools console.
 */

console.log(`
╔═══════════════════════════════════════════════════════════╗
║   PicForge GA4 Analytics Testing Guide                   ║
╚═══════════════════════════════════════════════════════════╝

This is an INTERACTIVE testing guide. Follow the steps below.

══════════════════════════════════════════════════════════════
STEP 1: Verify Environment Variables
══════════════════════════════════════════════════════════════

1. Check your .env.local file contains:
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

2. Verify on Vercel:
   - Go to: https://vercel.com/dashboard
   - Select project: pic-forge
   - Settings → Environment Variables
   - Confirm NEXT_PUBLIC_GA_MEASUREMENT_ID is set

══════════════════════════════════════════════════════════════
STEP 2: Test Cookie Consent Banner
══════════════════════════════════════════════════════════════

Open your browser (incognito mode recommended):

1. Open DevTools (F12)
2. Go to Console tab
3. Visit: http://localhost:3000 or https://pic-forge.com
4. Cookie banner should appear at bottom
5. Check localStorage (Application tab → Local Storage):
   - Should be empty or null for 'cookie-consent'

6. Click "Decline" button
   - Check localStorage: 'cookie-consent' = "declined"
   - Check Network tab: No google-analytics.com requests

7. Clear localStorage: localStorage.clear()
8. Refresh page
9. Click "Accept Cookies" button
   - Check localStorage: 'cookie-consent' = "accepted"
   - Check Network tab: google-analytics.com requests should appear

══════════════════════════════════════════════════════════════
STEP 3: Test GA4 DebugView
══════════════════════════════════════════════════════════════

1. Install GA Debug Chrome Extension:
   https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna

2. Enable the extension (puzzle icon → GA Debugger → turn on)

3. Open DevTools → Console tab

4. Visit your site and accept cookies

5. You should see detailed GA4 logs in console:
   [GA4] event: page_view
   [GA4] event: session_start

6. Go to GA4 Dashboard:
   - Configure → DebugView
   - You should see your session in real-time
   - Click on events to see parameters

══════════════════════════════════════════════════════════════
STEP 4: Test Custom Events
══════════════════════════════════════════════════════════════

Test each feature and watch DebugView:

IMAGE TRANSFORMATION:
1. Visit main editor page (/)
2. Upload an image
3. Select a prompt or enter custom prompt
4. Click "Transform"
5. Check DebugView for: image_transformation event
   Parameters: prompt_category, locked_composition

PROMO CODE REDEMPTION:
1. Sign in (if not already)
2. Go to Profile page
3. Enter promo code: DEREK-FOUNDER-2025
4. Click Redeem
5. Check DebugView for: promo_code_redemption event
   Parameters: code_tier, code_type

BATCH PROCESSING:
1. Go to /batch
2. Upload multiple images
3. Select an effect
4. Click "Start Processing"
5. Check DebugView for: batch_process event
   Parameters: image_count, effect_type

FAVORITE PROMPT:
1. Go to /prompts
2. Click heart icon on any prompt
3. Check DebugView for: favorite_prompt event
   Parameters: action, category

SHOWCASE SUBMISSION:
1. Go to /showcase/submit
2. Fill out form and submit
3. Check DebugView for: showcase_submit event
   Parameters: has_description, prompt_used

══════════════════════════════════════════════════════════════
STEP 5: Verify Real-Time Reports
══════════════════════════════════════════════════════════════

1. Go to GA4 Dashboard:
   https://analytics.google.com/

2. Select your PicForge property

3. Go to: Reports → Realtime

4. Perform actions on your site (transform images, etc.)

5. Watch Real-Time report update:
   - Active users count
   - Page views in last 30 minutes
   - Events by name
   - Conversions (if configured)

══════════════════════════════════════════════════════════════
STEP 6: Browser Console Testing
══════════════════════════════════════════════════════════════

Open browser console on your site and run these tests:

// Check if GA4 is loaded
console.log('GA4 loaded:', typeof window.gtag !== 'undefined');

// Check consent status
console.log('Cookie consent:', localStorage.getItem('cookie-consent'));

// Check dataLayer
console.log('dataLayer:', window.dataLayer);

// Manually trigger a test event
window.gtag && window.gtag('event', 'test_event', {
  event_category: 'testing',
  event_label: 'manual_test',
  value: 1
});

// Watch for the event in DebugView

══════════════════════════════════════════════════════════════
STEP 7: Test Privacy Compliance
══════════════════════════════════════════════════════════════

GDPR Compliance Checklist:

1. Cookie banner shows BEFORE GA4 loads ✓
2. Declining cookies prevents GA4 loading ✓
3. Cookie banner links to Privacy Policy ✓
4. IP anonymization enabled ✓
5. No advertising cookies ✓
6. Consent stored in localStorage ✓
7. User can withdraw consent (clear localStorage) ✓

══════════════════════════════════════════════════════════════
STEP 8: Verify Conversion Tracking
══════════════════════════════════════════════════════════════

After 24-48 hours:

1. Go to GA4 → Configure → Events
2. Find these events and mark as conversions:
   - promo_code_redemption ✓
   - sign_up ✓
   - tier_change ✓

3. Go to Reports → Engagement → Conversions
4. Verify conversions are being tracked

══════════════════════════════════════════════════════════════
TROUBLESHOOTING
══════════════════════════════════════════════════════════════

Problem: GA4 not loading
Solutions:
  - Check NEXT_PUBLIC_GA_MEASUREMENT_ID is set
  - Accept cookie consent banner
  - Disable ad blockers
  - Check browser console for errors

Problem: Events not showing in GA4
Solutions:
  - Wait 24-48 hours for processing
  - Use DebugView for real-time events
  - Verify cookie consent accepted
  - Check event names are correct (case-sensitive)

Problem: Cookie banner not showing
Solutions:
  - Clear localStorage: localStorage.clear()
  - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
  - Try incognito/private window

Problem: DebugView not showing events
Solutions:
  - Enable GA Debug extension
  - Accept cookies
  - Wait 30 seconds after page load
  - Try from production site (Vercel preview)

══════════════════════════════════════════════════════════════
EXPECTED RESULTS
══════════════════════════════════════════════════════════════

✓ Cookie banner appears on first visit
✓ Accepting cookies loads GA4 scripts
✓ Declining cookies blocks GA4 scripts
✓ Events fire in DebugView immediately
✓ Real-Time reports show activity within 30 seconds
✓ Custom events appear in Events dashboard after 24-48 hours
✓ No GA4 requests in Network tab until consent accepted

══════════════════════════════════════════════════════════════
NEXT STEPS
══════════════════════════════════════════════════════════════

1. Monitor Real-Time reports for first week
2. Check custom events after 48 hours
3. Mark key events as conversions
4. Set up custom conversion funnels
5. Review user behavior patterns monthly

══════════════════════════════════════════════════════════════

📚 Full documentation: docs/GA4_SETUP.md
🚀 Quick start guide: docs/GA4_QUICK_START.md
💬 Questions? derek.bobola@gmail.com

══════════════════════════════════════════════════════════════
`);

// Export test functions for programmatic testing
export const testFunctions = {
  checkEnvironment: () => {
    console.log('\n🔍 Checking environment variables...');
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    if (!measurementId) {
      console.error('❌ NEXT_PUBLIC_GA_MEASUREMENT_ID not set');
      return false;
    }

    if (!measurementId.startsWith('G-')) {
      console.error('❌ Invalid Measurement ID format (should start with G-)');
      return false;
    }

    console.log('✅ Measurement ID configured:', measurementId);
    return true;
  },

  checkBrowser: () => {
    console.log('\n🌐 Browser checks (run this in browser console):');
    console.log(`
// Check GA4 loaded
console.log('GA4:', typeof window.gtag !== 'undefined' ? '✅ Loaded' : '❌ Not loaded');

// Check consent
console.log('Consent:', localStorage.getItem('cookie-consent') || '⚠️ Not set');

// Check dataLayer
console.log('DataLayer:', window.dataLayer ? \`✅ \${window.dataLayer.length} events\` : '❌ Missing');
    `);
  }
};

// Run basic checks if running as script
if (require.main === module) {
  console.log('\nRunning basic environment checks...\n');
  testFunctions.checkEnvironment();
  testFunctions.checkBrowser();
}
