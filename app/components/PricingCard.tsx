'use client';

import React from 'react';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingTier {
  name: string;
  price: number;
  images: string;
  features: string[];
  highlighted?: boolean;
  icon: React.ReactNode;
}

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 29,
    images: '100 images/month',
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      'Basic editing tools',
      'Standard templates',
      '5 saved templates',
      'Email support',
      'JPEG/PNG export'
    ]
  },
  {
    name: 'Professional',
    price: 99,
    images: '1,000 images/month',
    icon: <Zap className="w-6 h-6" />,
    highlighted: true,
    features: [
      'All basic features',
      'AI-powered tools',
      'Background removal',
      'Unlimited templates',
      'Priority processing',
      'API access',
      'All export formats'
    ]
  },
  {
    name: 'Enterprise',
    price: 499,
    images: 'Unlimited images',
    icon: <Crown className="w-6 h-6" />,
    features: [
      'Everything in Pro',
      'Custom AI models',
      'White-label option',
      'Dedicated support',
      'SLA guarantee',
      'Team collaboration',
      'Custom integrations'
    ]
  }
];

export default function PricingCard({ onSelectPlan }: { onSelectPlan?: (plan: string) => void }) {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-gray-600">
          Process hundreds of images in seconds. 99% profit margins guaranteed.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-2xl p-8 ${
              tier.highlighted
                ? 'bg-teal-600 text-white shadow-2xl scale-105'
                : 'bg-white border border-gray-200 shadow-lg'
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-2xl font-bold ${
                  tier.highlighted ? 'text-white' : 'text-gray-900'
                }`}>
                  {tier.name}
                </h3>
                <p className={`text-sm mt-1 ${
                  tier.highlighted ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {tier.images}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                tier.highlighted ? 'bg-white/20' : 'bg-blue-100'
              }`}>
                {tier.icon}
              </div>
            </div>

            <div className="mb-6">
              <span className={`text-4xl font-bold ${
                tier.highlighted ? 'text-white' : 'text-gray-900'
              }`}>
                ${tier.price}
              </span>
              <span className={`text-sm ${
                tier.highlighted ? 'text-blue-100' : 'text-gray-500'
              }`}>
                /month
              </span>
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    tier.highlighted ? 'text-yellow-300' : 'text-green-500'
                  }`} />
                  <span className={`text-sm ${
                    tier.highlighted ? 'text-white' : 'text-gray-700'
                  }`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectPlan?.(tier.name)}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                tier.highlighted
                  ? 'bg-white text-blue-600 hover:bg-gray-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Get Started
            </button>

            {/* Cost breakdown */}
            <div className={`mt-4 pt-4 border-t ${
              tier.highlighted ? 'border-white/20' : 'border-gray-200'
            }`}>
              <p className={`text-xs text-center ${
                tier.highlighted ? 'text-blue-100' : 'text-gray-500'
              }`}>
                Cost per image: ${(tier.price / parseInt(tier.images) || 0.05).toFixed(3)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-green-50 rounded-xl">
        <div className="text-center">
          <h3 className="text-lg font-bold text-green-900 mb-2">
            🚀 Why Our Margins Are 99%+
          </h3>
          <p className="text-sm text-green-700">
            80% of operations run client-side (FREE) • Gemini API batch processing ($0.00004/image) •
            No GPU servers needed • Smart caching reduces API calls by 95%
          </p>
        </div>
      </div>
    </div>
  );
}