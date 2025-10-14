'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Zap, Crown, Sparkles, TrendingUp, Users, Shield, Clock, Download, Star, Rocket, Gift, AlertCircle } from 'lucide-react'
import { useImageTracking } from '@/hooks/useImageTracking'

export default function PricingPage() {
  const { user, getRemainingImages } = useImageTracking()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const remainingImages = user ? getRemainingImages() : 500

  // Pricing configuration
  const pricing = {
    monthly: 14,
    yearly: 99, // $8.25/month when billed yearly - 41% savings
  }

  const handleUpgrade = (tier: 'pro') => {
    // TODO: Integrate with Stripe or payment processor
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-coral-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full text-teal-700 text-sm font-medium mb-6 animate-bounce">
            <Sparkles className="w-4 h-4" />
            Join 10,000+ creators transforming images daily
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform <span className="bg-gradient-to-r from-teal-500 to-coral-500 bg-clip-text text-transparent">Unlimited</span> Images
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start free with 500 images/day. Upgrade to Pro for unlimited transformations, priority processing, and exclusive features.
          </p>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-coral-400 border-2 border-white" />
                ))}
              </div>
              <span><strong>10,000+</strong> happy users</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span><strong>4.9/5</strong> average rating</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span><strong>2M+</strong> images created</span>
            </div>
          </div>

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
                Save 41%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-gray-600">Perfect for trying things out</p>
              </div>
              <Sparkles className="w-10 h-10 text-gray-400" />
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">/forever</span>
              </div>
              {user && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-sm text-teal-700 font-medium">
                  <Clock className="w-4 h-4" />
                  {remainingImages} images remaining today
                </div>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>500 images/day</strong> - Resets every 24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700"><strong>210+ AI templates</strong> ready to use</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Batch processing (up to 100 images)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Canvas AI image generation</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Lock Composition feature</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Community showcase access</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Priority processing queue</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Remove PicForge watermark</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">API access</span>
              </li>
            </ul>

            <Link
              href="/"
              className="block w-full text-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-teal-500 to-coral-500 rounded-2xl shadow-2xl p-8 relative transform hover:scale-105 transition-all">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                <Crown className="w-4 h-4" />
                MOST POPULAR
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                <p className="text-teal-100">For serious creators</p>
              </div>
              <Crown className="w-10 h-10 text-yellow-300" />
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-white">
                  ${billingPeriod === 'monthly' ? pricing.monthly : pricing.yearly}
                </span>
                <span className="text-teal-100">
                  /{billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingPeriod === 'yearly' && (
                <p className="text-teal-100 text-sm">
                  That's just <strong>$8.25/month</strong> - Save $69/year!
                </p>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-teal-500" />
                </div>
                <span className="text-white"><strong>Unlimited images</strong> - No daily limits!</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-3 h-3 text-yellow-500" />
                </div>
                <span className="text-white"><strong>Priority processing</strong> - 3x faster generations</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-teal-500" />
                </div>
                <span className="text-white"><strong>No watermarks</strong> on exported images</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Download className="w-3 h-3 text-teal-500" />
                </div>
                <span className="text-white"><strong>Bulk downloads</strong> with one click</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Rocket className="w-3 h-3 text-teal-500" />
                </div>
                <span className="text-white"><strong>API access</strong> for integrations</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Gift className="w-3 h-3 text-teal-500" />
                </div>
                <span className="text-white"><strong>Early access</strong> to new features</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-3 h-3 text-teal-500" />
                </div>
                <span className="text-white"><strong>Priority support</strong> - Response in 24h</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="w-3 h-3 text-yellow-500" />
                </div>
                <span className="text-white"><strong>Pro badge</strong> on showcase submissions</span>
              </li>
            </ul>

            <button
              onClick={() => handleUpgrade('pro')}
              className="w-full px-6 py-4 bg-white text-teal-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Upgrade to Pro Now →
            </button>

            {billingPeriod === 'yearly' && (
              <p className="text-center text-teal-100 text-sm mt-4">
                🎉 Limited time: Get 2 months free with yearly plan!
              </p>
            )}
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
            <span>Secure payments via Stripe</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-500" />
            <span>10,000+ satisfied customers</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-500" />
            <span>Cancel anytime, no questions</span>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Compare Plans Side by Side
        </h2>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Free</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-teal-50">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Daily image transformations</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">500/day</td>
                <td className="px-6 py-4 text-center text-sm font-semibold text-teal-600 bg-teal-50">Unlimited</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">AI templates library</td>
                <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Batch processing</td>
                <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Canvas AI generation</td>
                <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Processing speed</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">Standard</td>
                <td className="px-6 py-4 text-center text-sm font-semibold text-teal-600 bg-teal-50">3x Faster</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Watermark removal</td>
                <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Bulk export/download</td>
                <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">API access</td>
                <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Early feature access</td>
                <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                <td className="px-6 py-4 text-center bg-teal-50"><Check className="w-5 h-5 text-teal-500 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Priority support</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">Community</td>
                <td className="px-6 py-4 text-center text-sm font-semibold text-teal-600 bg-teal-50">24h response</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          What Our Pro Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Chen",
              role: "Social Media Manager",
              image: "SC",
              quote: "Pro plan paid for itself in the first week. The unlimited transformations mean I can create content for all my clients without worrying about limits.",
              rating: 5
            },
            {
              name: "Marcus Rodriguez",
              role: "Graphic Designer",
              image: "MR",
              quote: "Priority processing is a game-changer. I can iterate on designs 3x faster and deliver to clients ahead of schedule. Worth every penny!",
              rating: 5
            },
            {
              name: "Emma Thompson",
              role: "Content Creator",
              image: "ET",
              quote: "The watermark removal alone is worth the upgrade. My Instagram posts look so much more professional now. Love the Pro badge too!",
              rating: 5
            }
          ].map((testimonial, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-teal-200 transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-coral-400 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {[
            {
              q: "Can I cancel my Pro subscription anytime?",
              a: "Absolutely! You can cancel anytime from your account settings. No questions asked, no cancellation fees. Your Pro features remain active until the end of your billing period."
            },
            {
              q: "What happens to my images if I downgrade?",
              a: "All your created images remain accessible forever. You'll just be limited to 500 transformations per day instead of unlimited. Your existing images are never deleted."
            },
            {
              q: "Do you offer refunds?",
              a: "Yes! We offer a 30-day money-back guarantee. If you're not satisfied with Pro, contact us within 30 days for a full refund."
            },
            {
              q: "How much faster is priority processing?",
              a: "Pro users get dedicated server resources, resulting in 3x faster generation times on average. During peak hours, the difference is even more noticeable."
            },
            {
              q: "Can I upgrade from monthly to yearly anytime?",
              a: "Yes! You can switch to yearly billing anytime and we'll prorate the difference. The 41% savings makes yearly a no-brainer for regular users."
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
        <div className="bg-gradient-to-br from-teal-500 to-coral-500 rounded-2xl shadow-2xl p-12 text-center">
          <Crown className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Unlimited Images?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators, designers, and businesses using PicForge Pro to transform their visual content at scale.
          </p>
          <button
            onClick={() => handleUpgrade('pro')}
            className="px-8 py-4 bg-white text-teal-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Start Pro Now - ${billingPeriod === 'monthly' ? pricing.monthly : pricing.yearly}/{billingPeriod === 'monthly' ? 'mo' : 'yr'} →
          </button>
          <p className="text-teal-100 text-sm mt-4">
            30-day money-back guarantee • Cancel anytime • No questions asked
          </p>
        </div>
      </div>

      {/* Urgency/Scarcity Element */}
      <div className="fixed bottom-6 right-6 bg-coral-500 text-white px-6 py-4 rounded-xl shadow-2xl max-w-sm animate-bounce z-50 hidden md:block">
        <div className="flex items-start gap-3">
          <Zap className="w-6 h-6 flex-shrink-0 mt-1" />
          <div>
            <p className="font-bold mb-1">Limited Time Offer!</p>
            <p className="text-sm">Get 2 months free with yearly plan. Offer ends soon!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
