'use client';

import { useState } from 'react';
import { useImageTracking } from '@/hooks/useImageTracking';
import { usePromoCode } from '@/hooks/usePromoCode';
import { useReferral } from '@/hooks/useReferral';
import { Check, X, Crown, Zap, Sparkles, AlertCircle, Gift, Key, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import ReferralShareButton from '@/components/ReferralShareButton';

export default function ProfilePage() {
  const { user, usage, imageHistory, getRemainingImages } = useImageTracking();
  const { redeemCode, isRedeeming, error, success, clearMessages, hasUnlimitedAccess } = usePromoCode();
  const {
    activeReferralCode,
    referralLink,
    completedReferralsCount,
    totalBonusImages,
    isGenerating
  } = useReferral();

  const [promoCode, setPromoCode] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-black rounded-2xl p-12 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-teal-500 mx-auto mb-6" />
          <h1 className="font-heading text-3xl font-bold text-teal-500 mb-4">Sign In Required</h1>
          <p className="font-body text-white mb-8">
            Please sign in to view your profile and manage your account.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-teal-500 text-black rounded-xl font-bold hover:bg-teal-400 transition-all"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const tier = usage?.tier || 'free';
  const imagesGenerated = imageHistory?.length || 0;
  const remainingImages = getRemainingImages();

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const result = await redeemCode(promoCode);
    if (result) {
      setPromoCode('');
      // Clear success message after 5 seconds
      setTimeout(clearMessages, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-black rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl font-bold text-teal-500 mb-2">Your Profile</h1>
              <p className="font-body text-white">{user.email}</p>
            </div>
            {tier === 'unlimited' || tier === 'pro' ? (
              <Crown className="w-16 h-16 text-teal-500" />
            ) : (
              <Sparkles className="w-16 h-16 text-gray-600" />
            )}
          </div>
        </div>

        {/* Referral Section - Full Width Banner */}
        <div className="bg-purple-600 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="font-heading text-3xl font-semibold text-white mb-2 flex items-center gap-2 justify-center md:justify-start">
                <Users className="w-8 h-8 text-white" />
                Invite Friends, Earn Free Images
              </h2>
              <p className="font-body text-white text-lg">
                Give your friends <span className="font-semibold">10 bonus images</span>, get <span className="font-semibold">10 for yourself</span>!
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-6 text-center">
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-body text-white text-sm mb-1">Friends Joined</p>
                  <p className="font-heading text-4xl font-semibold text-white">{completedReferralsCount}</p>
                </div>
                <div className="w-px h-12 bg-white bg-opacity-30"></div>
                <div>
                  <p className="font-body text-white text-sm mb-1">Bonus Images</p>
                  <p className="font-heading text-4xl font-semibold text-white">{totalBonusImages}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Referral Sharing */}
          <div className="bg-black rounded-2xl p-8">
            <h2 className="font-heading text-2xl font-bold text-teal-500 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-teal-500" />
              Your Referral Link
            </h2>

            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : activeReferralCode && referralLink ? (
              <>
                {/* Referral Code Display */}
                <div className="mb-6">
                  <label className="block text-sm font-body font-medium text-white mb-2">
                    Your Referral Code
                  </label>
                  <div className="bg-gray-900 border-2 border-teal-500 rounded-xl p-4 text-center">
                    <code className="font-mono text-teal-500 text-2xl font-bold">{activeReferralCode}</code>
                  </div>
                </div>

                {/* Referral Link Display */}
                <div className="mb-6">
                  <label className="block text-sm font-body font-medium text-white mb-2">
                    Your Referral Link
                  </label>
                  <div className="bg-gray-900 rounded-xl p-3 break-all">
                    <p className="font-body text-teal-500 text-sm">{referralLink}</p>
                  </div>
                </div>

                {/* Share Buttons */}
                <ReferralShareButton
                  referralLink={referralLink}
                  referralCode={activeReferralCode}
                />

                {/* Stats */}
                {completedReferralsCount > 0 && (
                  <div className="mt-6 p-4 bg-gray-900 border-2 border-teal-500 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-body text-white text-sm">Total Referrals</p>
                        <p className="font-heading text-3xl font-bold text-teal-500">{completedReferralsCount}</p>
                      </div>
                      <Sparkles className="w-12 h-12 text-teal-500 animate-pulse" />
                    </div>
                    <p className="font-body text-gray-400 text-xs mt-2">
                      You&apos;ve earned {totalBonusImages} bonus images so far!
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="font-body text-white">Unable to generate referral code. Please refresh.</p>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-black rounded-2xl p-8">
            <h2 className="font-heading text-2xl font-bold text-teal-500 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-teal-500" />
              Account Status
            </h2>

            <div className="space-y-4">
              {/* Tier */}
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
                <span className="font-body text-white font-medium">Current Plan</span>
                <div className="flex items-center gap-2">
                  {tier === 'unlimited' || tier === 'pro' ? (
                    <Crown className="w-5 h-5 text-teal-500" />
                  ) : null}
                  <span className="font-body font-bold text-teal-500 uppercase">{tier}</span>
                </div>
              </div>

              {/* Images Remaining */}
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
                <span className="font-body text-white font-medium">Daily Limit</span>
                <span className="font-body font-bold text-white">
                  {hasUnlimitedAccess ? (
                    <span className="text-teal-500">Unlimited ✨</span>
                  ) : (
                    `${remainingImages} / 20 remaining`
                  )}
                </span>
              </div>

              {/* Total Images */}
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
                <span className="font-body text-white font-medium">Total Images Generated</span>
                <span className="font-body font-bold text-white">{imagesGenerated.toLocaleString()}</span>
              </div>

              {/* Upgrade CTA (only for free tier) */}
              {tier === 'free' && (
                <div className="mt-6 p-6 bg-gray-900 border-2 border-teal-500 rounded-xl">
                  <Crown className="w-8 h-8 text-teal-500 mb-3" />
                  <h3 className="font-heading font-bold text-lg text-teal-500 mb-2">Upgrade to Pro</h3>
                  <p className="font-body text-white text-sm mb-4">
                    Get unlimited images, priority processing, and no watermarks!
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-block w-full text-center px-6 py-3 bg-teal-500 text-black rounded-lg font-bold hover:bg-teal-400 transition-all"
                  >
                    View Pricing →
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Promo Code Redemption - Full Width */}
        <div className="bg-black rounded-2xl p-8 mt-8">
          <h2 className="font-heading text-2xl font-bold text-teal-500 mb-6 flex items-center gap-2">
            <Gift className="w-6 h-6 text-teal-500" />
            Redeem Promo Code
          </h2>

          {hasUnlimitedAccess ? (
            <div className="p-6 bg-gray-900 rounded-xl border-2 border-teal-500">
              <div className="flex items-center gap-3 mb-3">
                <Check className="w-8 h-8 text-teal-500" />
                <h3 className="font-heading font-bold text-teal-500 text-lg">Unlimited Access Active!</h3>
              </div>
              <p className="font-body text-white">
                You have unlimited image generation. Enjoy creating without limits!
              </p>
            </div>
          ) : (
            <form onSubmit={handleRedeem} className="max-w-2xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="promoCode" className="block text-sm font-body font-medium text-white mb-2">
                    Enter your promo code
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="promoCode"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="DEREK-FOUNDER-2025"
                      className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-xl focus:border-teal-500 focus:outline-none font-mono text-lg uppercase placeholder-gray-500"
                      disabled={isRedeeming}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isRedeeming || !promoCode.trim()}
                    className="w-full mt-4 px-6 py-3 bg-teal-500 text-black rounded-xl font-bold hover:bg-teal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isRedeeming ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Redeeming...
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5" />
                        Redeem Code
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 bg-gray-900 rounded-xl">
                  <h4 className="font-heading font-semibold text-teal-500 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-500" />
                    How it works
                  </h4>
                  <ul className="font-body text-sm text-white space-y-1">
                    <li>• Enter your unique promo code above</li>
                    <li>• Get instant unlimited access</li>
                    <li>• Each code works for one account only</li>
                    <li>• No expiration date</li>
                  </ul>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-900 bg-opacity-20 border border-red-500 rounded-xl flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="font-body text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-4 p-4 bg-gray-900 border-2 border-teal-500 rounded-xl flex items-start gap-3 animate-bounce">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <p className="font-body text-teal-500 text-sm font-semibold">{success}</p>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Link
            href="/favorites"
            className="bg-black rounded-xl p-6 hover:ring-2 hover:ring-teal-500 transition-all group"
          >
            <Crown className="w-8 h-8 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-heading font-bold text-teal-500 mb-2">Favorites</h3>
            <p className="font-body text-white text-sm">Your saved prompts and styles</p>
          </Link>

          <Link
            href="/pricing"
            className="bg-black border-2 border-teal-500 rounded-xl p-6 hover:bg-gray-900 transition-all group"
          >
            <Zap className="w-8 h-8 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-heading font-bold text-teal-500 mb-2">Upgrade</h3>
            <p className="font-body text-white text-sm">Get unlimited access today</p>
          </Link>
        </div>
      </div>
    </div>
  );
}