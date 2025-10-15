'use client';

import { useState } from 'react';
import { useImageTracking } from '@/hooks/useImageTracking';
import { usePromoCode } from '@/hooks/usePromoCode';
import { Check, X, Crown, Zap, Sparkles, AlertCircle, Gift, Key } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, usage, imageHistory, getRemainingImages } = useImageTracking();
  const { redeemCode, isRedeeming, error, success, clearMessages, hasUnlimitedAccess } = usePromoCode();

  const [promoCode, setPromoCode] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-coral-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to view your profile and manage your account.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all"
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-teal-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
              <p className="text-teal-100">{user.email}</p>
            </div>
            {tier === 'unlimited' || tier === 'pro' ? (
              <Crown className="w-16 h-16 text-yellow-300" />
            ) : (
              <Sparkles className="w-16 h-16 text-teal-100" />
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Account Info */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-teal-500" />
              Account Status
            </h2>

            <div className="space-y-4">
              {/* Tier */}
              <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl">
                <span className="text-gray-700 font-medium">Current Plan</span>
                <div className="flex items-center gap-2">
                  {tier === 'unlimited' || tier === 'pro' ? (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  ) : null}
                  <span className="font-bold text-teal-600 uppercase">{tier}</span>
                </div>
              </div>

              {/* Images Remaining */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700 font-medium">Daily Limit</span>
                <span className="font-bold text-gray-900">
                  {hasUnlimitedAccess ? (
                    <span className="text-teal-600">Unlimited ✨</span>
                  ) : (
                    `${remainingImages} / 20 remaining`
                  )}
                </span>
              </div>

              {/* Total Images */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700 font-medium">Total Images Generated</span>
                <span className="font-bold text-gray-900">{imagesGenerated.toLocaleString()}</span>
              </div>

              {/* Upgrade CTA (only for free tier) */}
              {tier === 'free' && (
                <div className="mt-6 p-6 bg-teal-600 rounded-xl text-white">
                  <Crown className="w-8 h-8 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Upgrade to Pro</h3>
                  <p className="text-teal-100 text-sm mb-4">
                    Get unlimited images, priority processing, and no watermarks!
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-block w-full text-center px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    View Pricing →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Promo Code Redemption */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Gift className="w-6 h-6 text-coral-500" />
              Redeem Promo Code
            </h2>

            {hasUnlimitedAccess ? (
              <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <Check className="w-8 h-8 text-green-600" />
                  <h3 className="font-bold text-green-900 text-lg">Unlimited Access Active!</h3>
                </div>
                <p className="text-green-700">
                  You have unlimited image generation. Enjoy creating without limits!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRedeem} className="space-y-4">
                <div>
                  <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none font-mono text-lg uppercase"
                      disabled={isRedeeming}
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3 animate-bounce">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-700 text-sm font-semibold">{success}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isRedeeming || !promoCode.trim()}
                  className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isRedeeming ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Redeeming...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5" />
                      Redeem Code
                    </>
                  )}
                </button>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-500" />
                    How it works
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Enter your unique promo code above</li>
                    <li>• Get instant unlimited access</li>
                    <li>• Each code works for one account only</li>
                    <li>• No expiration date</li>
                  </ul>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link
            href="/my-images"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <Sparkles className="w-8 h-8 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-900 mb-2">My Images</h3>
            <p className="text-gray-600 text-sm">View all your created images</p>
          </Link>

          <Link
            href="/favorites"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <Crown className="w-8 h-8 text-coral-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-900 mb-2">Favorites</h3>
            <p className="text-gray-600 text-sm">Your saved prompts and styles</p>
          </Link>

          <Link
            href="/pricing"
            className="bg-teal-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group text-white"
          >
            <Zap className="w-8 h-8 text-yellow-300 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold mb-2">Upgrade</h3>
            <p className="text-teal-100 text-sm">Get unlimited access today</p>
          </Link>
        </div>
      </div>
    </div>
  );
}