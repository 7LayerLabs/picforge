'use client';

import { useState } from 'react';
import { useImageTracking } from '@/hooks/useImageTracking';
import { usePromoCode } from '@/hooks/usePromoCode';
import { useReferral } from '@/hooks/useReferral';
import { getAIModel, TierType } from '@/lib/tierConfig';
import { Check, X, Crown, Zap, Sparkles, AlertCircle, Gift, Key, Users, Copy, ExternalLink, Cpu, Image as ImageIcon, Star } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-12 max-w-md text-center rounded-2xl shadow-xl border border-gray-200">
          <AlertCircle className="w-16 h-16 text-teal-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to view your profile and manage your account.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 transition-all shadow-lg hover:shadow-xl"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const tier = (usage?.tier || 'free') as TierType;
  const imagesGenerated = imageHistory?.length || 0;
  const remainingImages = getRemainingImages();
  const aiModel = getAIModel(tier);
  const isElite = tier === 'elite';
  const isPremium = tier === 'unlimited' || tier === 'pro' || tier === 'elite';

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const result = await redeemCode(promoCode);
    if (result) {
      setPromoCode('');
      setTimeout(clearMessages, 5000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tierColors = {
    free: 'from-gray-500 to-gray-600',
    starter: 'from-blue-500 to-blue-600',
    creator: 'from-green-500 to-green-600',
    pro: 'from-amber-500 to-orange-500',
    unlimited: 'from-teal-500 to-emerald-500',
    elite: 'from-purple-500 to-pink-500',
  };

  const tierBadgeColors = {
    free: 'bg-gray-100 text-gray-700',
    starter: 'bg-blue-100 text-blue-700',
    creator: 'bg-green-100 text-green-700',
    pro: 'bg-amber-100 text-amber-700',
    unlimited: 'bg-teal-100 text-teal-700',
    elite: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile Header Card */}
        <div className={`bg-gradient-to-r ${tierColors[tier]} rounded-2xl p-6 text-white shadow-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                {isElite ? (
                  <Crown className="w-8 h-8 text-yellow-300" />
                ) : isPremium ? (
                  <Crown className="w-8 h-8 text-white" />
                ) : (
                  <Sparkles className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.email?.split('@')[0] || 'User'}</h1>
                <p className="text-white/80 text-sm">{user.email}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">
                {isElite && <Crown className="w-4 h-4" />}
                {tier.toUpperCase()} TIER
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{imagesGenerated}</p>
                <p className="text-xs text-gray-500 uppercase font-medium">Images Created</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {hasUnlimitedAccess ? '∞' : remainingImages}
                </p>
                <p className="text-xs text-gray-500 uppercase font-medium">Remaining Today</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedReferralsCount}</p>
                <p className="text-xs text-gray-500 uppercase font-medium">Referrals</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalBonusImages}</p>
                <p className="text-xs text-gray-500 uppercase font-medium">Bonus Images</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Left Column */}
          <div className="space-y-6">

            {/* Plan Details Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-teal-500" />
                  Your Plan
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Tier</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${tierBadgeColors[tier]}`}>
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">AI Model</span>
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <Cpu className="w-4 h-4 text-gray-400" />
                    {isElite ? 'Gemini 3 Pro' : 'Gemini 2.5 Flash'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Daily Limit</span>
                  <span className="text-sm font-bold text-gray-900">
                    {hasUnlimitedAccess ? 'Unlimited ✨' : `${remainingImages} / 20`}
                  </span>
                </div>

                {!isPremium && (
                  <Link
                    href="/pricing"
                    className="block w-full text-center mt-4 px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg"
                  >
                    Upgrade Plan →
                  </Link>
                )}
              </div>
            </div>

            {/* Promo Code Card */}
            {!isElite && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-500" />
                    Redeem Code
                  </h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handleRedeem} className="space-y-4">
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter promo code"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 font-mono uppercase focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                        disabled={isRedeeming}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isRedeeming || !promoCode.trim()}
                      className="w-full px-4 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isRedeeming ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                          Redeeming...
                        </>
                      ) : (
                        <>
                          <Gift className="w-5 h-5" />
                          Redeem
                        </>
                      )}
                    </button>
                  </form>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                      <X className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      {success}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Elite Badge */}
            {isElite && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Crown className="w-8 h-8 text-yellow-300" />
                  <h3 className="text-xl font-bold">Elite Member</h3>
                </div>
                <p className="text-white/90 text-sm">
                  You have access to Gemini 3 Pro (Nano Banana Pro) — our most advanced AI with improved text rendering and photorealism.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Referrals */}
          <div className="space-y-6">

            {/* Referral Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Invite Friends
                </h2>
                <p className="text-sm text-gray-600 mt-1">Give 10 images, get 10 images!</p>
              </div>
              <div className="p-6 space-y-4">

                {isGenerating ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent animate-spin rounded-full" />
                  </div>
                ) : activeReferralCode && referralLink ? (
                  <>
                    {/* Referral Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Your Code</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-4 py-3 bg-gray-100 rounded-xl font-mono font-bold text-gray-900 text-center">
                          {activeReferralCode}
                        </div>
                        <button
                          onClick={() => copyToClipboard(activeReferralCode)}
                          className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                          title="Copy code"
                        >
                          <Copy className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Referral Link */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Share Link</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-sm text-gray-700 truncate">
                          {referralLink}
                        </div>
                        <button
                          onClick={() => copyToClipboard(referralLink)}
                          className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                          title="Copy link"
                        >
                          <Copy className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      {copied && (
                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Copied!
                        </p>
                      )}
                    </div>

                    {/* Share Buttons */}
                    <div className="pt-2">
                      <ReferralShareButton
                        referralLink={referralLink}
                        referralCode={activeReferralCode}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Unable to generate referral code. Please refresh.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/favorites"
            className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-teal-200 transition-all group"
          >
            <Star className="w-8 h-8 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-900 mb-1">Favorites</h3>
            <p className="text-sm text-gray-500">Saved prompts & styles</p>
          </Link>

          <Link
            href="/forge"
            className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-teal-200 transition-all group"
          >
            <Sparkles className="w-8 h-8 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-900 mb-1">Create Images</h3>
            <p className="text-sm text-gray-500">Start transforming</p>
          </Link>
        </div>

      </div>
    </div>
  );
}