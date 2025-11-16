/**
 * Quick script to check and fix Derek's tier in InstantDB
 *
 * Usage:
 * 1. Open browser console on pic-forge.com
 * 2. Copy and paste this entire script
 * 3. Run: await fixDerekTier()
 */

async function fixDerekTier() {
  console.log('🔍 Checking Derek\'s tier...');

  // Get InstantDB instance from window (available on any Pic-Forge page)
  const db = (window as any).instantDB;

  if (!db) {
    console.error('❌ InstantDB not found. Make sure you\'re on pic-forge.com');
    return;
  }

  const userId = '7676c194-51f6-46a2-9e2b-3b9facb31f2c';

  try {
    // Query current usage
    const query = {
      usage: {
        $: {
          where: {
            userId: userId
          }
        }
      }
    };

    const result = await db.query(query);
    const usage = result?.usage?.[0];

    console.log('📊 Current Usage Record:', usage);

    if (!usage) {
      console.log('⚠️ No usage record found. Creating one with unlimited tier...');

      const usageId = db.id();
      await db.transact([
        db.tx.usage[usageId].update({
          userId: userId,
          tier: 'unlimited',
          count: 0,
          lastReset: Date.now(),
        })
      ]);

      console.log('✅ Created new usage record with unlimited tier!');
      console.log('🎉 You now have unlimited access with no watermarks!');
      return;
    }

    console.log(`Current tier: ${usage.tier || 'NONE (undefined)'}`);

    if (usage.tier === 'unlimited' || usage.tier === 'pro') {
      console.log('✅ Your tier is already set correctly!');
      console.log('🤔 If you\'re still seeing watermarks, try:');
      console.log('   1. Hard refresh the page (Ctrl+Shift+R)');
      console.log('   2. Clear browser cache');
      console.log('   3. Log out and log back in');
      return;
    }

    console.log('❌ Your tier is incorrect. Fixing now...');

    await db.transact([
      db.tx.usage[usage.id].update({
        tier: 'unlimited',
      })
    ]);

    console.log('✅ Fixed! Your tier is now: unlimited');
    console.log('🎉 You now have unlimited access with no watermarks!');
    console.log('🔄 Refresh the page to see changes');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Export for use
(window as any).fixDerekTier = fixDerekTier;

console.log('✅ Script loaded! Run: fixDerekTier()');
