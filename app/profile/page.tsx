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
        <div className="bg-black p-12 max-w-md text-center border-4 border-brutal-cyan shadow-brutal-lg">
          <AlertCircle className="w-16 h-16 text-brutal-cyan mx-auto mb-6" />
          <h1 className="font-heading text-3xl font-black uppercase text-brutal-cyan mb-4 tracking-tight">Sign In Required</h1>
          <p className="font-body text-white mb-8 font-bold">
            Please sign in to view your profile and manage your account.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-pink hover:text-white transition-all shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1"
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
        <div className="bg-black p-8 mb-8 border-4 border-brutal-cyan shadow-brutal-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl font-black uppercase text-brutal-cyan mb-2 tracking-tight">Your Profile</h1>
              <p className="font-body text-white font-bold">{user.email}</p>
            </div>
            {tier === 'unlimited' || tier === 'pro' ? (
              <Crown className="w-16 h-16 text-brutal-yellow" />
            ) : (
              <Sparkles className="w-16 h-16 text-gray-400" />
            )}
          </div>
        </div>

        {/* Referral Section - Full Width Banner */}
        <div className="bg-brutal-pink p-8 mb-8 border-4 border-black shadow-brutal-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="font-heading text-3xl font-black uppercase text-black mb-2 flex items-center gap-2 justify-center md:justify-start tracking-tight">
                <Users className="w-8 h-8 text-black" />
                Invite Friends, Earn Free Images
              </h2>
              <p className="font-body text-black text-lg font-bold">
                Give your friends <span className="font-black">10 bonus images</span>, get <span className="font-black">10 for yourself</span>!
              </p>
            </div>
            <div className="bg-black p-6 text-center border-4 border-brutal-yellow">
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-body text-brutal-pink text-sm mb-1 font-bold">Friends Joined</p>
                  <p className="font-heading text-4xl font-black text-brutal-yellow">{completedReferralsCount}</p>
                </div>
                <div className="w-px h-12 bg-brutal-yellow"></div>
                <div>
                  <p className="font-body text-brutal-pink text-sm mb-1 font-bold">Bonus Images</p>
                  <p className="font-heading text-4xl font-black text-brutal-yellow">{totalBonusImages}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Referral Sharing */}
          <div className="bg-black p-8 border-4 border-brutal-cyan shadow-brutal">
            <h2 className="font-heading text-2xl font-black uppercase text-brutal-cyan mb-6 flex items-center gap-2 tracking-tight">
              <TrendingUp className="w-6 h-6 text-brutal-cyan" />
              Your Referral Link
            </h2>

            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-brutal-cyan border-t-transparent animate-spin"></div>
              </div>
            ) : activeReferralCode && referralLink ? (
              <>
                {/* Referral Code Display */}
                <div className="mb-6">
                  <label className="block text-sm font-body font-black uppercase text-white mb-2">
                    Your Referral Code
                  </label>
                  <div className="bg-gray-900 border-4 border-brutal-cyan p-4 text-center shadow-brutal">
                    <code className="font-mono text-brutal-cyan text-2xl font-black">{activeReferralCode}</code>
                  </div>
                </div>

                {/* Referral Link Display */}
                <div className="mb-6">
                  <label className="block text-sm font-body font-black uppercase text-white mb-2">
                    Your Referral Link
                  </label>
                  <div className="bg-gray-900 p-3 break-all border-4 border-brutal-cyan">
                    <p className="font-body text-brutal-cyan text-sm font-bold">{referralLink}</p>
                  </div>
                </div>

                {/* Share Buttons */}
                <ReferralShareButton
                  referralLink={referralLink}
                  referralCode={activeReferralCode}
                />

                {/* Stats */}
                {completedReferralsCount > 0 && (
                  <div className="mt-6 p-4 bg-gray-900 border-4 border-brutal-cyan shadow-brutal">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-body text-white text-sm font-bold">Total Referrals</p>
                        <p className="font-heading text-3xl font-black text-brutal-cyan">{completedReferralsCount}</p>
                      </div>
                      <Sparkles className="w-12 h-12 text-brutal-cyan animate-pulse" />
                    </div>
                    <p className="font-body text-gray-400 text-xs mt-2 font-bold">
                      You&apos;ve earned {totalBonusImages} bonus images so far!
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-brutal-pink mx-auto mb-4" />
                <p className="font-body text-white font-bold">Unable to generate referral code. Please refresh.</p>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-black p-8 border-4 border-brutal-cyan shadow-brutal">
            <h2 className="font-heading text-2xl font-black uppercase text-brutal-cyan mb-6 flex items-center gap-2 tracking-tight">
              <Zap className="w-6 h-6 text-brutal-cyan" />
              Account Status
            </h2>

            <div className="space-y-4">
              {/* Tier */}
              <div className="flex items-center justify-between p-4 bg-gray-900 border-4 border-black">
                <span className="font-body text-white font-black uppercase">Current Plan</span>
                <div className="flex items-center gap-2">
                  {tier === 'unlimited' || tier === 'pro' ? (
                    <Crown className="w-5 h-5 text-brutal-yellow" />
                  ) : null}
                  <span className="font-body font-black text-brutal-cyan uppercase">{tier}</span>
                </div>
              </div>

              {/* Images Remaining */}
              <div className="flex items-center justify-between p-4 bg-gray-900 border-4 border-black">
                <span className="font-body text-white font-black uppercase">Daily Limit</span>
                <span className="font-body font-black text-white">
                  {hasUnlimitedAccess ? (
                    <span className="text-brutal-cyan uppercase">Unlimited ✨</span>
                  ) : (
                    `${remainingImages} / 20 remaining`
                  )}
                </span>
              </div>

              {/* Total Images */}
              <div className="flex items-center justify-between p-4 bg-gray-900 border-4 border-black">
                <span className="font-body text-white font-black uppercase">Total Images Generated</span>
                <span className="font-body font-black text-white">{imagesGenerated.toLocaleString()}</span>
              </div>

              {/* Upgrade CTA (only for free tier) */}
              {tier === 'free' && (
                <div className="mt-6 p-6 bg-gray-900 border-4 border-brutal-cyan shadow-brutal">
                  <Crown className="w-8 h-8 text-brutal-yellow mb-3" />
                  <h3 className="font-heading font-black text-lg text-brutal-cyan mb-2 uppercase tracking-tight">Upgrade to Pro</h3>
                  <p className="font-body text-white text-sm mb-4 font-bold">
                    Get unlimited images, priority processing, and no watermarks!
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-block w-full text-center px-6 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-pink hover:text-white transition-all shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1"
                  >
                    View Pricing →
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Promo Code Redemption - Full Width */}
        <div className="bg-black p-8 mt-8 border-4 border-brutal-cyan shadow-brutal-lg">
          <h2 className="font-heading text-2xl font-black uppercase text-brutal-cyan mb-6 flex items-center gap-2 tracking-tight">
            <Gift className="w-6 h-6 text-brutal-cyan" />
            Redeem Promo Code
          </h2>

          {hasUnlimitedAccess ? (
            <div className="p-6 bg-gray-900 border-4 border-brutal-cyan shadow-brutal">
              <div className="flex items-center gap-3 mb-3">
                <Check className="w-8 h-8 text-brutal-cyan" />
                <h3 className="font-heading font-black text-brutal-cyan text-lg uppercase tracking-tight">Unlimited Access Active!</h3>
              </div>
              <p className="font-body text-white font-bold">
                You have unlimited image generation. Enjoy creating without limits!
              </p>
            </div>
          ) : (
            <form onSubmit={handleRedeem} className="max-w-2xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="promoCode" className="block text-sm font-body font-black uppercase text-white mb-2">
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
                      className="w-full pl-12 pr-4 py-3 bg-gray-900 border-4 border-brutal-cyan text-white focus:border-brutal-pink focus:outline-none font-mono text-lg uppercase placeholder-gray-500"
                      disabled={isRedeeming}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isRedeeming || !promoCode.trim()}
                    className="w-full mt-4 px-6 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-pink hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1"
                  >
                    {isRedeeming ? (
                      <>
                        <div className="w-5 h-5 border-4 border-black border-t-transparent animate-spin" />
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

                <div className="p-4 bg-gray-900 border-4 border-brutal-cyan">
                  <h4 className="font-heading font-black text-brutal-cyan mb-2 flex items-center gap-2 uppercase tracking-tight">
                    <Sparkles className="w-4 h-4 text-brutal-cyan" />
                    How it works
                  </h4>
                  <ul className="font-body text-sm text-white space-y-1 font-bold">
                    <li>• Enter your unique promo code above</li>
                    <li>• Get instant unlimited access</li>
                    <li>• Each code works for one account only</li>
                    <li>• No expiration date</li>
                  </ul>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-black border-4 border-brutal-pink shadow-brutal flex items-start gap-3">
                  <X className="w-5 h-5 text-brutal-pink flex-shrink-0 mt-0.5" />
                  <p className="font-body text-brutal-pink text-sm font-bold">{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-4 p-4 bg-gray-900 border-4 border-brutal-cyan shadow-brutal flex items-start gap-3 animate-bounce">
                  <Check className="w-5 h-5 text-brutal-cyan flex-shrink-0 mt-0.5" />
                  <p className="font-body text-brutal-cyan text-sm font-black">{success}</p>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Link
            href="/favorites"
            className="bg-black p-6 border-4 border-brutal-cyan shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all group"
          >
            <Crown className="w-8 h-8 text-brutal-yellow mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-heading font-black text-brutal-cyan mb-2 uppercase tracking-tight">Favorites</h3>
            <p className="font-body text-white text-sm font-bold">Your saved prompts and styles</p>
          </Link>

          <Link
            href="/pricing"
            className="bg-black border-4 border-brutal-pink p-6 shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all group"
          >
            <Zap className="w-8 h-8 text-brutal-pink mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-heading font-black text-brutal-pink mb-2 uppercase tracking-tight">Upgrade</h3>
            <p className="font-body text-white text-sm font-bold">Get unlimited access today</p>
          </Link>
        </div>
      </div>
    </div>
  );
}