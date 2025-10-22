'use client';

import { db } from '@/lib/instantdb';
import { id } from '@instantdb/react';
import { useState, useEffect, useCallback } from 'react';

/**
 * Generate a unique referral code for a user
 * Format: USERNAME-ABC123 (first 4 chars of email + random 6-char string)
 */
function generateReferralCode(email: string): string {
  const prefix = email.substring(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

/**
 * Hook to manage referral system
 */
export function useReferral() {
  const { user } = db.useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Query all referrals for the current user (as referrer)
   */
  const { data: myReferralsData } = db.useQuery(
    (user
      ? { referrals: { $: { where: { referrerId: user.id } } } }
      : null) as any
  );

  const myReferrals = (myReferralsData as any)?.referrals || [];

  /**
   * Query all referrals globally (for validation)
   */
  const { data: allReferralsData } = db.useQuery({
    referrals: {}
  } as any);

  const allReferrals = (allReferralsData as any)?.referrals || [];

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
   * Get user's active referral code (pending status)
   */
  const activeReferralCode = myReferrals.find((r: any) => r.status === 'pending');

  /**
   * Get completed referrals (people who used the code)
   */
  const completedReferrals = myReferrals.filter((r: any) => r.status === 'completed');

  /**
   * Calculate total bonus images earned from referrals
   */
  const totalBonusImages = completedReferrals.reduce(
    (sum: number, r: any) => sum + (r.bonusImagesReferrer || 0),
    0
  );

  /**
   * Generate a new referral code for the user
   */
  const generateCode = useCallback(async (): Promise<string | null> => {
    if (!user) {
      setError('Please sign in to generate a referral code');
      return null;
    }

    // Check if user already has an active referral code
    if (activeReferralCode) {
      return activeReferralCode.referralCode;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const referralCode = generateReferralCode(user.email || 'USER');
      const referralId = id();
      const now = Date.now();

      await db.transact([
        // @ts-expect-error InstantDB tx type inference issue
        db.tx.referrals[referralId].update({
          referrerId: user.id,
          referralCode,
          status: 'pending',
          bonusImagesReferrer: 10,
          bonusImagesReferred: 10,
          createdAt: now,
        })
      ]);

      setIsGenerating(false);
      return referralCode;
    } catch (error) {
      console.error('Error generating referral code:', error);
      setError('Failed to generate referral code. Please try again.');
      setIsGenerating(false);
      return null;
    }
  }, [user, activeReferralCode]);

  /**
   * Redeem a referral code (for new users)
   */
  const redeemReferralCode = useCallback(async (code: string): Promise<boolean> => {
    if (!user) {
      setError('Please sign in to redeem a referral code');
      return false;
    }

    setIsRedeeming(true);
    setError(null);
    setSuccess(null);

    const upperCode = code.toUpperCase().trim();

    // Find the referral code
    const referral = allReferrals.find(
      (r: any) => r.referralCode === upperCode && r.status === 'pending'
    );

    if (!referral) {
      setError('Invalid or already used referral code');
      setIsRedeeming(false);
      return false;
    }

    // Prevent self-referral
    if (referral.referrerId === user.id) {
      setError('You cannot use your own referral code');
      setIsRedeeming(false);
      return false;
    }

    // Check if user has already redeemed a referral code
    const hasRedeemedBefore = allReferrals.some(
      (r: any) => r.referredUserId === user.id && r.status === 'completed'
    );

    if (hasRedeemedBefore) {
      setError('You have already redeemed a referral code');
      setIsRedeeming(false);
      return false;
    }

    const now = Date.now();

    try {
      // Create usage record if it doesn't exist
      const usageId = usage?.id || id();
      const currentCount = usage?.count || 0;
      const currentTier = usage?.tier || 'free';

      // Update referral status and give bonus images to both users
      await db.transact([
        // Mark referral as completed
        // @ts-expect-error InstantDB tx type inference issue
        db.tx.referrals[referral.id].update({
          referredUserId: user.id,
          status: 'completed',
          redeemedAt: now,
        }),
        // Give bonus images to the NEW user (reduce their count by 10)
        // This effectively gives them 10 free images
        // @ts-expect-error InstantDB tx type inference issue
        db.tx.usage[usageId].update({
          userId: user.id,
          count: Math.max(0, currentCount - 10), // Give 10 bonus images
          lastReset: usage?.lastReset || now,
          tier: currentTier,
        })
      ]);

      // Now give bonus to the referrer
      // Find referrer's usage record
      const { data: referrerUsageData } = await db.useQuery({
        usage: { $: { where: { userId: referral.referrerId } } }
      } as any);

      const referrerUsage = (referrerUsageData as any)?.usage?.[0];

      if (referrerUsage) {
        const referrerUsageId = referrerUsage.id;
        const referrerCount = referrerUsage.count || 0;

        await db.transact([
          // @ts-expect-error InstantDB tx type inference issue
          db.tx.usage[referrerUsageId].update({
            count: Math.max(0, referrerCount - 10), // Give 10 bonus images
          })
        ]);
      }

      setSuccess('Success! You both got 10 bonus images!');
      setIsRedeeming(false);
      return true;
    } catch (error) {
      console.error('Error redeeming referral code:', error);
      setError('Failed to redeem referral code. Please try again.');
      setIsRedeeming(false);
      return false;
    }
  }, [user, allReferrals, usage]);

  /**
   * Auto-generate referral code on first visit
   */
  useEffect(() => {
    if (user && !activeReferralCode && myReferrals.length === 0 && !isGenerating) {
      generateCode();
    }
  }, [user, activeReferralCode, myReferrals.length, isGenerating, generateCode]);

  /**
   * Clear messages
   */
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  /**
   * Get referral link
   */
  const getReferralLink = () => {
    if (!activeReferralCode) return null;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pic-forge.com';
    return `${baseUrl}/referral?code=${activeReferralCode.referralCode}`;
  };

  return {
    user,
    activeReferralCode: activeReferralCode?.referralCode || null,
    referralLink: getReferralLink(),
    completedReferralsCount: completedReferrals.length,
    totalBonusImages,
    generateCode,
    redeemReferralCode,
    isGenerating,
    isRedeeming,
    error,
    success,
    clearMessages,
  };
}
