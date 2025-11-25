'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Crown, Sparkles, Clock, Shield, AlertCircle, Zap, Star, Flame, Rocket } from 'lucide-react'

import { useImageTracking } from '@/hooks/useImageTracking'
import { logger } from '@/lib/logger'

export default function PricingPage() {
  const { user, getRemainingImages } = useImageTracking()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [isProcessing, setIsProcessing] = useState(false)

  const remainingImages = user ? getRemainingImages() : null

  // Pricing configuration - credit-based tiers
  const pricing = {
    starter: { monthly: 7, yearly: 59, images: 100 },
    creator: { monthly: 19, yearly: 159, images: 500 },
    pro: { monthly: 39, yearly: 329, images: 2000 },
    unlimited: { monthly: 79, yearly: 669, images: 'Unlimited' },
  }

  // Calculate yearly savings
  const getSavings = (tier: keyof typeof pricing) => {
    const p = pricing[tier]
    if (typeof p.images === 'string') return 30 // Unlimited tier
    const monthlyCost = p.monthly * 12
    const yearlyCost = p.yearly
    return Math.round((1 - yearlyCost / monthlyCost) * 100)
  }

  const handleUpgrade = async (tier: 'starter' | 'creator' | 'pro' | 'unlimited') => {
    if (!user) {
      alert('Please sign in to upgrade')
      window.location.href = '/'
      return
    }

    setIsProcessing(true)

    try {
      // Map tier to Stripe price IDs (you'll need to create these in Stripe)
      const priceIds: Record<string, { monthly: string; yearly: string }> = {
        starter: {
          monthly: 'price_starter_monthly', // Replace with actual Stripe price ID
          yearly: 'price_starter_yearly',
        },
        creator: {
          monthly: 'price_creator_monthly',
          yearly: 'price_creator_yearly',
        },
        pro: {
          monthly: 'price_1SIcgtDlxrM8ZIxcgNwPSV1Y', // Your existing Pro monthly
          yearly: 'price_1SIchxDlxrM8ZIxcRxrH56WL', // Your existing Pro yearly
        },
        unlimited: {
          monthly: 'price_unlimited_monthly',
          yearly: 'price_unlimited_yearly',
        },
      }

      const priceId = billingPeriod === 'monthly'
        ? priceIds[tier].monthly
        : priceIds[tier].yearly

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          userEmail: user.email,
          tier,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      logger.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="text-center">
          <h1 className="font-heading text-5xl md:text-6xl font-black uppercase text-black mb-6 tracking-tight">
            Pay for What You Use.
          </h1>

          <p className="font-body text-xl text-black max-w-3xl mx-auto mb-8 font-bold">
            Start free. Scale when you need to. <span className="text-brutal-cyan">No surprises.</span>
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-3 font-black uppercase border-4 border-black transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-brutal-cyan text-black shadow-brutal'
                  : 'bg-white text-black hover:bg-gray-100 shadow-brutal-hover'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-3 font-black uppercase border-4 border-black transition-all relative ${
                billingPeriod === 'yearly'
                  ? 'bg-brutal-cyan text-black shadow-brutal'
                  : 'bg-white text-black hover:bg-gray-100 shadow-brutal-hover'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-brutal-yellow text-black text-xs px-2 py-0.5 border-2 border-black font-black">
                Save 30%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

          {/* Free Tier */}
          <div className="bg-white p-6 border-4 border-black shadow-brutal hover:shadow-brutal-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black uppercase text-black mb-1">Free</h3>
                <p className="text-sm text-gray-600 font-bold">Test the waters</p>
              </div>
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black text-gray-900">$0</span>
                <span className="text-gray-500 text-sm">/forever</span>
              </div>
              {user && remainingImages !== null && (
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 border border-gray-300 rounded-full text-xs text-gray-600 font-medium mt-2">
                  <Clock className="w-3 h-3" />
                  {remainingImages} left today
                </div>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700"><strong>10 images/day</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">272+ AI templates</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Basic batch (5 images)</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">No watermark</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">Priority queue</span>
              </li>
            </ul>

            <Link
              href="/forge"
              className="block w-full text-center px-5 py-3 bg-white text-black border-4 border-black font-black uppercase hover:bg-gray-100 transition-all shadow-brutal hover:shadow-brutal-hover"
            >
              Start Free
            </Link>
          </div>

          {/* Starter Tier */}
          <div className="bg-white p-6 border-4 border-black shadow-brutal hover:shadow-brutal-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black uppercase text-black mb-1">Starter</h3>
                <p className="text-sm text-gray-600 font-bold">For hobbyists</p>
              </div>
              <Star className="w-8 h-8 text-brutal-yellow" />
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black text-gray-900">
                  ${billingPeriod === 'monthly' ? pricing.starter.monthly : Math.round(pricing.starter.yearly / 12)}
                </span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              {billingPeriod === 'yearly' && (
                <p className="text-xs text-teal-600 font-bold">
                  Billed ${pricing.starter.yearly}/yr - Save {getSavings('starter')}%
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700"><strong>100 images/month</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">272+ AI templates</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Batch up to 20 images</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700"><strong>No watermark</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">Priority queue</span>
              </li>
            </ul>

            <button
              onClick={() => handleUpgrade('starter')}
              disabled={isProcessing}
              className="w-full px-5 py-3 bg-brutal-yellow text-black border-4 border-black font-black uppercase hover:bg-yellow-400 transition-all shadow-brutal hover:shadow-brutal-hover disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Get Starter'}
            </button>
          </div>

          {/* Creator Tier - MOST POPULAR */}
          <div className="bg-brutal-cyan p-6 border-4 border-black shadow-brutal-lg relative transform hover:shadow-brutal transition-all">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-brutal-yellow text-black px-3 py-1 border-2 border-black text-xs font-black flex items-center gap-1 shadow-brutal uppercase">
                <Crown className="w-3 h-3" />
                BEST VALUE
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 mt-2">
              <div>
                <h3 className="text-xl font-black uppercase text-black mb-1">Creator</h3>
                <p className="text-sm text-black font-bold">For serious creators</p>
              </div>
              <Flame className="w-8 h-8 text-black" />
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black text-black">
                  ${billingPeriod === 'monthly' ? pricing.creator.monthly : Math.round(pricing.creator.yearly / 12)}
                </span>
                <span className="text-black text-sm font-bold">/mo</span>
              </div>
              {billingPeriod === 'yearly' && (
                <p className="text-xs text-black font-bold">
                  Billed ${pricing.creator.yearly}/yr - Save {getSavings('creator')}%
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-500" />
                </div>
                <span className="text-sm text-white"><strong>500 images/month</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-500" />
                </div>
                <span className="text-sm text-white">272+ AI templates</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-500" />
                </div>
                <span className="text-sm text-white">Batch up to 50 images</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-500" />
                </div>
                <span className="text-sm text-white"><strong>No watermark</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-teal-500" />
                </div>
                <span className="text-sm text-white"><strong>Priority queue</strong></span>
              </li>
            </ul>

            <button
              onClick={() => handleUpgrade('creator')}
              disabled={isProcessing}
              className="w-full px-5 py-3 bg-brutal-pink text-white border-4 border-black font-black uppercase hover:bg-brutal-yellow hover:text-black transition-all shadow-brutal hover:shadow-brutal-hover disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Get Creator'}
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-white p-6 border-4 border-black shadow-brutal hover:shadow-brutal-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-black uppercase text-black mb-1">Pro</h3>
                <p className="text-sm text-gray-600 font-bold">For power users</p>
              </div>
              <Rocket className="w-8 h-8 text-brutal-pink" />
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black text-gray-900">
                  ${billingPeriod === 'monthly' ? pricing.pro.monthly : Math.round(pricing.pro.yearly / 12)}
                </span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              {billingPeriod === 'yearly' && (
                <p className="text-xs text-teal-600 font-bold">
                  Billed ${pricing.pro.yearly}/yr - Save {getSavings('pro')}%
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700"><strong>2,000 images/month</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">272+ AI templates</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Batch up to 100 images</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700"><strong>No watermark</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700"><strong>Priority queue</strong></span>
              </li>
            </ul>

            <button
              onClick={() => handleUpgrade('pro')}
              disabled={isProcessing}
              className="w-full px-5 py-3 bg-brutal-pink text-white border-4 border-black font-black uppercase hover:bg-brutal-cyan hover:text-black transition-all shadow-brutal hover:shadow-brutal-hover disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Get Pro'}
            </button>
          </div>
        </div>

        {/* Unlimited Tier - Full Width */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-black p-8 border-4 border-brutal-cyan shadow-brutal-lg relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-brutal-cyan text-black px-4 py-1 border-2 border-black text-sm font-black flex items-center gap-2 shadow-brutal uppercase">
                <Zap className="w-4 h-4" />
                UNLIMITED POWER
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black uppercase text-white mb-2">Unlimited</h3>
                <p className="text-gray-300 font-bold mb-4">For agencies & heavy users. No limits. No compromises.</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-white">
                    <Check className="w-4 h-4 text-brutal-cyan" />
                    <span><strong>Unlimited</strong> image generations</span>
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <Check className="w-4 h-4 text-brutal-cyan" />
                    <span>Batch up to <strong>200 images</strong></span>
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <Check className="w-4 h-4 text-brutal-cyan" />
                    <span><strong>API access</strong> (coming soon)</span>
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <Check className="w-4 h-4 text-brutal-cyan" />
                    <span><strong>Dedicated support</strong></span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <div className="flex items-baseline gap-2 mb-2 justify-center">
                  <span className="text-5xl font-black text-brutal-cyan">
                    ${billingPeriod === 'monthly' ? pricing.unlimited.monthly : Math.round(pricing.unlimited.yearly / 12)}
                  </span>
                  <span className="text-gray-300 text-sm">/mo</span>
                </div>
                {billingPeriod === 'yearly' && (
                  <p className="text-xs text-brutal-yellow font-bold mb-4">
                    Billed ${pricing.unlimited.yearly}/yr - Save {getSavings('unlimited')}%
                  </p>
                )}
                <button
                  onClick={() => handleUpgrade('unlimited')}
                  disabled={isProcessing}
                  className="px-8 py-4 bg-brutal-cyan text-black border-4 border-brutal-cyan font-black uppercase hover:bg-brutal-yellow transition-all shadow-brutal hover:shadow-brutal-hover disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Go Unlimited'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-500" />
            <span>Secure payments via Stripe</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-500" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-500" />
            <span>Credits rollover</span>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-black uppercase text-center text-black mb-4 tracking-tight">
          Compare Plans
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-bold">
          Every detail that matters. Pick your perfect plan.
        </p>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden overflow-x-auto border-4 border-black">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 border-b-4 border-black">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-black text-gray-900 uppercase">Feature</th>
                <th className="px-4 py-4 text-center text-sm font-black text-gray-900 uppercase">Free</th>
                <th className="px-4 py-4 text-center text-sm font-black text-gray-900 uppercase">Starter</th>
                <th className="px-4 py-4 text-center text-sm font-black text-brutal-cyan uppercase bg-cyan-50">Creator</th>
                <th className="px-4 py-4 text-center text-sm font-black text-gray-900 uppercase">Pro</th>
                <th className="px-4 py-4 text-center text-sm font-black text-gray-900 uppercase">Unlimited</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">Monthly Images</td>
                <td className="px-4 py-4 text-center text-sm text-gray-600">10/day</td>
                <td className="px-4 py-4 text-center text-sm text-gray-600">100</td>
                <td className="px-4 py-4 text-center text-sm font-bold text-brutal-cyan bg-cyan-50">500</td>
                <td className="px-4 py-4 text-center text-sm text-gray-600">2,000</td>
                <td className="px-4 py-4 text-center text-sm font-bold text-gray-900">Unlimited</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">Batch Processing</td>
                <td className="px-4 py-4 text-center text-sm text-gray-600">5</td>
                <td className="px-4 py-4 text-center text-sm text-gray-600">20</td>
                <td className="px-4 py-4 text-center text-sm font-bold text-brutal-cyan bg-cyan-50">50</td>
                <td className="px-4 py-4 text-center text-sm text-gray-600">100</td>
                <td className="px-4 py-4 text-center text-sm font-bold text-gray-900">200</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">Watermark-Free</td>
                <td className="px-4 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center bg-cyan-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">Priority Queue</td>
                <td className="px-4 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-4 py-4 text-center bg-cyan-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">AI Templates (272+)</td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center bg-cyan-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">Canvas Generation</td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center bg-cyan-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">API Access</td>
                <td className="px-4 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-4 py-4 text-center bg-cyan-50"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-4 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-4 py-4 text-center text-xs text-gray-500">Coming Soon</td>
              </tr>
              <tr className="hover:bg-gray-50 bg-gray-50">
                <td className="px-6 py-4 text-sm font-black text-gray-900">Price</td>
                <td className="px-4 py-4 text-center text-sm font-black text-gray-900">$0</td>
                <td className="px-4 py-4 text-center text-sm font-black text-gray-900">${pricing.starter.monthly}/mo</td>
                <td className="px-4 py-4 text-center text-sm font-black text-brutal-cyan bg-cyan-50">${pricing.creator.monthly}/mo</td>
                <td className="px-4 py-4 text-center text-sm font-black text-gray-900">${pricing.pro.monthly}/mo</td>
                <td className="px-4 py-4 text-center text-sm font-black text-gray-900">${pricing.unlimited.monthly}/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-black uppercase text-center text-black mb-12 tracking-tight">
          Questions? Answered.
        </h2>

        <div className="space-y-6">
          {[
            {
              q: "What happens if I run out of credits?",
              a: "You can upgrade to a higher tier anytime, or wait until your credits reset next month. We'll never charge you automatically for overages."
            },
            {
              q: "Do unused credits roll over?",
              a: "Yes! Unused credits roll over to the next month (up to 2x your monthly limit). Use them or lose them after that."
            },
            {
              q: "Can I cancel my subscription anytime?",
              a: "Absolutely. Cancel anytime from your account settings. Your plan stays active until the end of your billing period. No cancellation fees, ever."
            },
            {
              q: "What's the difference between tiers?",
              a: "Higher tiers get more monthly images, larger batch processing, priority queue access, and (for Unlimited) API access. All paid tiers remove watermarks."
            },
            {
              q: "Do you offer refunds?",
              a: "Yes. 14-day money-back guarantee on all paid plans. Not satisfied? Contact us for a full refund."
            },
            {
              q: "Is my payment information secure?",
              a: "100%. We use Stripe for payment processing - the same system used by Amazon, Google, and millions of businesses. We never store your card details."
            }
          ].map((faq, i) => (
            <div key={i} className="bg-white p-6 border-4 border-black shadow-brutal hover:shadow-brutal-lg transition-all">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-brutal-cyan flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-black text-gray-900 mb-2 uppercase">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-black p-12 text-center border-4 border-brutal-cyan shadow-brutal-lg">
          <Crown className="w-16 h-16 text-brutal-cyan mx-auto mb-6" />
          <h2 className="text-4xl font-black uppercase text-white mb-4 tracking-tight">
            Stop Thinking. Start Creating.
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-bold">
            Join thousands of creators breaking reality. <span className="text-brutal-yellow">Pick your plan and go.</span>
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/forge"
              className="px-8 py-4 bg-white text-black border-4 border-black font-black uppercase text-lg hover:bg-gray-100 transition-all shadow-brutal hover:shadow-brutal-hover"
            >
              Start Free
            </Link>
            <button
              onClick={() => handleUpgrade('creator')}
              disabled={isProcessing}
              className="px-8 py-4 bg-brutal-cyan text-black border-4 border-black font-black uppercase text-lg hover:bg-brutal-yellow transition-all shadow-brutal hover:shadow-brutal-hover disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Get Creator - $19/mo'}
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-6 font-bold">
            14-day money-back guarantee. Cancel anytime. Zero risk.
          </p>
        </div>
      </div>
    </div>
  )
}
