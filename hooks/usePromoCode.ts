'use client';

import { db } from '@/lib/instantdb';
import { id } from '@instantdb/react';
import { useState } from 'react';
import { trackPromoCodeRedemption } from '@/lib/analytics';
import { logger } from '@/lib/logger';

/**
 * Hook to handle promo code redemption
 */
export function usePromoCode() {
  const { user } = db.useAuth();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Query all promo codes (for validation)
   */
  const { data: promoData } = db.useQuery({
    promoCodes: {}
  } as any);

  const promoCodes = (promoData as any)?.promoCodes || [];

  /**
   * Query user's usage data
   */
  const { data: usageData } = db.useQuery(
    (user
      ? { usage: { $: { where: { userId: user.id } } } }
      : null) as any
  );

  const usage = (usageData as any)?.usage?.[0];

  /**
   * Redeem a promo code
   */
  const redeemCode = async (code: string): Promise<boolean> => {
    if (!user) {
      setError('Please sign in to redeem a code');
      return false;
    }

    setIsRedeeming(true);
    setError(null);
    setSuccess(null);

    const upperCode = code.toUpperCase().trim();

    // Find the code
    const codeMatch = promoCodes.find((c: any) => c.code === upperCode);

    if (!codeMatch) {
      setError('Invalid code. Please check and try again.');
      setIsRedeeming(false);
      return false;
    }

    if (codeMatch.isRedeemed) {
      setError('This code has already been redeemed.');
      setIsRedeeming(false);
      return false;
    }

    const now = Date.now();

    try {
      // Create usage record if it doesn't exist
      const usageId = usage?.id || id();

      // Update both the promo code and the user's tier in a single transaction
      await db.transact([
        // Mark code as redeemed
        // @ts-expect-error InstantDB tx type inference issue
        db.tx.promoCodes[codeMatch.id].update({
          isRedeemed: true,
          redeemedBy: user.id,
          redeemedAt: now,
        }),
        // Upgrade user's tier
        // @ts-expect-error InstantDB tx type inference issue
        db.tx.usage[usageId].update({
          userId: user.id,
          tier: codeMatch.tier,
          count: usage?.count || 0,
          lastReset: usage?.lastReset || now,
        })
      ]);

      setSuccess(`Success! You now have ${codeMatch.tier} access with unlimited images!`);

      // Track in Google Analytics
      trackPromoCodeRedemption({
        code_tier: codeMatch.tier,
        code_type: upperCode.includes('FOUNDER') ? 'founder' : upperCode.includes('FAM') ? 'family' : 'beta',
      });

      // Send promo code redeemed email notification
      if (user.email) {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: user.email,
            type: 'promo-redeemed',
            data: {
              userName: user.email.split('@')[0],
              promoCode: upperCode,
              tier: codeMatch.tier,
            },
          }),
        }).catch((error) => {
          logger.error('Failed to send promo redeemed email:', error);
        });
      }

      setIsRedeeming(false);
      return true;
    } catch (error) {
      logger.error('Error redeeming code:', error);
      setError('Failed to redeem code. Please try again.');
      setIsRedeeming(false);
      return false;
    }
  };

  /**
   * Clear messages
   */
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    user,
    usage,
    redeemCode,
    isRedeeming,
    error,
    success,
    clearMessages,
    hasUnlimitedAccess: usage?.tier === 'unlimited' || usage?.tier === 'pro',
  };
}
