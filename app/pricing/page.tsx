'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Zap, Crown, Sparkles, Clock, Shield, AlertCircle, Users, Gift } from 'lucide-react'
import { useImageTracking } from '@/hooks/useImageTracking'
import { useReferral } from '@/hooks/useReferral'

export default function PricingPage() {
  const { user, getRemainingImages } = useImageTracking()
  const { completedReferralsCount } = useReferral()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const remainingImages = user ? getRemainingImages() : 500

  // Pricing configuration
  const pricing = {
    monthly: 14,
    yearly: 119, // $9.92/month when billed yearly - 29% savings
  }

  const handleUpgrade = async (tier: 'pro') => {
    // Require user to be signed in
    if (!user) {
      alert('Please sign in to upgrade to Pro');
      window.location.href = '/';
      return;
    }

    setIsProcessing(true);

    try {
      // Get the appropriate price ID based on billing period
      const priceId = billingPeriod === 'monthly'
        ? 'price_1SIcgtDlxrM8ZIxcgNwPSV1Y' // Monthly price ID
        : 'price_1SIchxDlxrM8ZIxcRxrH56WL'; // Yearly price ID

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout URL
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center">
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Stop Wasting Time.
          </h1>

          <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Free gets you started. Pro removes all limits. Unlimited gets you everything + NSFW.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-coral-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 29%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Free</h3>
                <p className="text-sm text-gray-600">Test the waters</p>
              </div>
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500 text-sm">/forever</span>
              </div>
              {user && remainingImages !== null && (
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs text-teal-700 font-medium mt-2">
                  <Clock className="w-3 h-3" />
                  {remainingImages} left today
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-6 min-h-[280px]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700"><strong>20 images/day</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">272+ AI templates</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Batch processing</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Canvas generation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Lock Composition</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400 line-through">No watermark</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400 line-through">Priority processing</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400 line-through">NSFW content</span>
              </li>
            </ul>

            <Link
              href="/"
              className="block w-full text-center px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Start Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-teal-600 rounded-2xl shadow-2xl p-6 relative transform hover:scale-105 transition-all">
            {/* Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Crown className="w-3 h-3" />
                MOST POPULAR
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
                <p className="text-sm text-teal-100">For serious creators</p>
              </div>
              <Crown className="w-8 h-8 text-yellow-300" />
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-white">
                  ${billingPeriod === 'monthly' ? pricing.monthly : pricing.yearly}
                </span>
                <span className="text-teal-100 text-sm">
                  /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
              {billingPeriod === 'yearly' && (
                <p className="text-teal-100 text-xs">
                  Just <strong>$9.92/mo</strong> - Save $49/yr
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-6 min-h-[280px]">
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-500" />
                </div>
                <span className="text-sm text-white"><strong>Unlimited images</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-500" />
                </div>
                <span className="text-sm text-white"><strong>No watermarks</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-500" />
                </div>
                <span className="text-sm text-white"><strong>Priority processing</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-500" />
                </div>
                <span className="text-sm text-white">All 272+ templates</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-500" />
                </div>
                <span className="text-sm text-white">Batch up to 100 images</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-500" />
                </div>
                <span className="text-sm text-white">Canvas generation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-500" />
                </div>
                <span className="text-sm text-white">Lock Composition</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-teal-200 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-teal-100 line-through">NSFW content</span>
              </li>
            </ul>

            <button
              onClick={() => handleUpgrade('pro')}
              disabled={isProcessing}
              className="w-full px-5 py-3 bg-white text-teal-600 rounded-xl font-bold text-base hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Upgrade to Pro'}
            </button>

            {billingPeriod === 'yearly' && (
              <p className="text-center text-teal-100 text-xs mt-3">
                Limited time: 2 months free!
              </p>
            )}
          </div>

          {/* Unlimited Tier */}
          <div className="bg-purple-600 rounded-2xl shadow-2xl p-6 relative border-2 border-purple-400 hover:shadow-purple-500/50 transition-all">
            {/* VIP Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-purple-300 text-purple-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Zap className="w-3 h-3" />
                VIP ACCESS
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Unlimited</h3>
                <p className="text-sm text-purple-100">Everything. Forever.</p>
              </div>
              <Zap className="w-8 h-8 text-purple-300" />
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-white">Promo</span>
              </div>
              <p className="text-purple-100 text-xs">
                Invite-only access via code
              </p>
            </div>

            <ul className="space-y-3 mb-6 min-h-[280px]">
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-purple-500" />
                </div>
                <span className="text-sm text-white"><strong>Everything in Pro</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-purple-500" />
                </div>
                <span className="text-sm text-white"><strong>NSFW content access</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-purple-500" />
                </div>
                <span className="text-sm text-white"><strong>18+ batch processing</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-purple-500" />
                </div>
                <span className="text-sm text-white"><strong>Lifetime access</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-purple-500" />
                </div>
                <span className="text-sm text-white">All future features</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-purple-500" />
                </div>
                <span className="text-sm text-white">Early access to new tools</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-purple-500" />
                </div>
                <span className="text-sm text-white">VIP Discord access</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-purple-500" />
                </div>
                <span className="text-sm text-white">Priority support</span>
              </li>
            </ul>

            <Link
              href="/profile"
              className="block w-full text-center px-5 py-3 bg-white text-purple-600 rounded-xl font-bold text-base hover:bg-gray-50 transition-all shadow-xl"
            >
              Redeem Code
            </Link>

            <p className="text-center text-purple-100 text-xs mt-3">
              Have a code? Redeem in profile
            </p>
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce z-50">
            <Check className="w-6 h-6" />
            <span className="font-semibold">Payment integration coming soon! Stay tuned.</span>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-500" />
            <span>Secure payments</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-500" />
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* Referral Alternative Section */}
        <div className="mt-16 bg-purple-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white bg-opacity-20 rounded-full mb-6">
              <Users className="w-5 h-5 text-white" />
              <span className="font-bold text-white text-sm">SMART ALTERNATIVE</span>
            </div>

            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Or Earn Bonus Images
            </h2>

            <p className="text-xl text-white mb-2 font-medium">
              Invite 10 friends = 100 bonus images
            </p>
            <p className="text-lg text-white mb-8 opacity-90">
              That&apos;s 5 months worth of daily images! (Worth $70)
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white bg-opacity-20 rounded-2xl p-6">
                <Gift className="w-12 h-12 text-white mx-auto mb-3" />
                <h3 className="font-heading text-2xl font-bold text-white mb-2">You Get</h3>
                <p className="text-white text-lg font-medium">10 bonus images per friend</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-2xl p-6">
                <Sparkles className="w-12 h-12 text-white mx-auto mb-3" />
                <h3 className="font-heading text-2xl font-bold text-white mb-2">They Get</h3>
                <p className="text-white text-lg font-medium">10 bonus images to start</p>
              </div>
            </div>

            {completedReferralsCount > 0 ? (
              <div className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6">
                <p className="text-white text-lg font-bold mb-2">
                  🎉 You&apos;ve already invited {completedReferralsCount} {completedReferralsCount === 1 ? 'friend' : 'friends'}!
                </p>
                <p className="text-white">
                  That&apos;s {completedReferralsCount * 10} bonus images earned. Keep sharing!
                </p>
              </div>
            ) : null}

            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-teal-500 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Users className="w-6 h-6" />
              Get Your Referral Link
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Feature Comparison
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Every detail that matters. Choose what fits your needs.
        </p>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Feature</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Free</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-teal-600 bg-teal-50">Pro</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-purple-600 bg-purple-50">Unlimited</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Daily transformations</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">20/day</td>
                <td className="px-6 py-4 text-center text-sm font-semibold text-teal-600 bg-teal-50">Unlimited</td>
                <td className="px-6 py-4 text-center text-sm font-semibold text-purple-600 bg-purple-50">Unlimited</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Watermark removal</td>
                <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-purple-50"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Priority processing</td>
                <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-purple-50"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">AI templates (272+)</td>
                <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-purple-50"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Batch processing</td>
                <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-purple-50"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Canvas generation</td>
                <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-purple-50"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Lock Composition</td>
                <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-purple-50"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50 bg-purple-50/30">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">NSFW content access</td>
                <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-purple-50"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50 bg-purple-50/30">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">18+ batch processing</td>
                <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-purple-50"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50 bg-purple-50/30">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">VIP Discord access</td>
                <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-purple-50"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50 bg-purple-50/30">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Early feature access</td>
                <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-purple-50"><Check className="w-5 h-5 text-purple-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Cost</td>
                <td className="px-6 py-4 text-center text-sm font-bold text-gray-900">$0</td>
                <td className="px-6 py-4 text-center text-sm font-bold text-teal-600 bg-teal-50">$14/mo</td>
                <td className="px-6 py-4 text-center text-sm font-bold text-purple-600 bg-purple-50">Promo Code</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Promo Code Callout */}
        <div className="mt-12 bg-purple-50 border-2 border-purple-200 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-purple-600" />
            <h3 className="text-2xl font-bold text-purple-900">Got a Promo Code?</h3>
          </div>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Unlimited tier is invite-only access. Redeem your exclusive code for lifetime unlimited images, NSFW content, and VIP perks.
          </p>
          <Link
            href="/profile"
            className="inline-block px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Redeem Your Code
          </Link>
        </div>
      </div>


      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Questions? Answered.
        </h2>

        <div className="space-y-6">
          {[
            {
              q: "What's the difference between Free, Pro, and Unlimited?",
              a: "Free gives you 20 images/day with watermarks. Pro removes all limits and watermarks for $14/mo. Unlimited is invite-only access via promo codes - includes everything in Pro PLUS NSFW content, 18+ batch processing, and lifetime VIP perks."
            },
            {
              q: "How do promo codes work?",
              a: "Promo codes unlock the Unlimited tier - lifetime access with no recurring fees. Each code works once and is tied to your account forever. Sign in, go to your profile, and redeem your code. That's it."
            },
            {
              q: "Can I get a promo code?",
              a: "Promo codes are invite-only for early supporters, beta testers, and VIP members. We occasionally release codes through our newsletter and Discord. Stay tuned!"
            },
            {
              q: "Can I cancel my Pro subscription anytime?",
              a: "Yes. Cancel anytime from your account settings. No questions asked, no cancellation fees. Your Pro features remain active until the end of your billing period."
            },
            {
              q: "What happens to my images if I downgrade?",
              a: "All your created images remain accessible forever. You'll just be limited to 20 transformations per day instead of unlimited. Your existing images are never deleted."
            },
            {
              q: "Do you offer refunds?",
              a: "Yes. 30-day money-back guarantee on Pro subscriptions. Not satisfied? Contact us within 30 days for a full refund."
            },
            {
              q: "Can I upgrade from monthly to yearly anytime?",
              a: "Yes. Switch to yearly billing anytime and we'll prorate the difference. The 29% savings makes yearly a smart choice for regular users."
            },
            {
              q: "Is my payment information secure?",
              a: "100%. We use Stripe for payment processing - the same system used by Amazon, Google, and millions of businesses. We never store your credit card details."
            }
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-black rounded-2xl shadow-2xl p-12 text-center border-2 border-teal-500">
          <Crown className="w-16 h-16 text-teal-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Stop Thinking. Start Creating.
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Unlimited images. No watermarks. No daily limits. Just pure creative freedom.
          </p>
          <button
            onClick={() => handleUpgrade('pro')}
            disabled={isProcessing}
            className="px-8 py-4 bg-teal-500 text-black rounded-xl font-bold text-lg hover:bg-teal-400 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : `Upgrade to Pro - $${billingPeriod === 'monthly' ? pricing.monthly : pricing.yearly}/${billingPeriod === 'monthly' ? 'mo' : 'yr'}`}
          </button>
          <p className="text-gray-400 text-sm mt-4">
            30-day money-back guarantee. Cancel anytime. Zero risk.
          </p>
        </div>
      </div>

      {/* Urgency/Scarcity Element */}
      {billingPeriod === 'yearly' && (
        <div className="fixed bottom-6 right-6 bg-teal-600 text-white px-6 py-4 rounded-xl shadow-2xl max-w-sm z-50 hidden md:block border-2 border-teal-400">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold mb-1">Save $49 Yearly</p>
              <p className="text-sm">That&apos;s 2 months FREE. Don&apos;t leave money on the table.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
