/**
 * Run this in browser console at pic-forge.com to add Elite promo code
 * 
 * Steps:
 * 1. Go to https://pic-forge.com
 * 2. Open browser DevTools (F12)
 * 3. Go to Console tab
 * 4. Paste this entire script and press Enter
 */

// Access InstantDB from the app
const db = window.__INSTANT_DB__;

if (!db) {
    console.error('❌ InstantDB not found. Make sure you are on pic-forge.com');
} else {
    // Generate a unique ID
    const codeId = crypto.randomUUID();

    // Add the Elite promo code
    db.transact([
        db.tx.promoCodes[codeId].update({
            code: 'DEREK-ELITE-2025',
            tier: 'elite',
            isRedeemed: false,
            createdAt: Date.now(),
            createdBy: 'admin',
        })
    ]).then(() => {
        console.log('✅ Elite promo code created successfully!');
        console.log('Code: DEREK-ELITE-2025');
        console.log('Tier: elite');
        console.log('');
        console.log('Now go to /profile and redeem this code!');
    }).catch((err) => {
        console.error('❌ Error creating code:', err);
    });
}
