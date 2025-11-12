'use client';

import { useReferral } from '@/hooks/useReferral';
import { Users, Gift, Sparkles, ArrowRight } from 'lucide-react';
import ReferralShareButton from './ReferralShareButton';
import { useState } from 'react';
import Link from 'next/link';

interface ReferralCTAProps {
  variant?: 'banner' | 'modal' | 'compact';
  showStats?: boolean;
}

/**
 * Referral CTA component - Shows after image transformations
 * Encourages users to share and earn bonus images
 */
export default function ReferralCTA({ variant = 'banner', showStats = true }: ReferralCTAProps) {
  const {
    user,
    activeReferralCode,
    referralLink,
    completedReferralsCount,
    totalBonusImages,
  } = useReferral();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!user || !activeReferralCode || !referralLink) {
    return null; // Don't show if not logged in or no code
  }

  // Compact variant - minimal footer CTA
  if (variant === 'compact') {
    return (
      <div className="bg-black border-t-4 border-orange-500 rounded-lg p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-body font-bold text-white text-sm">Love PicForge?</p>
            <p className="font-body text-gray-300 text-xs">Share & earn 10 free images per friend!</p>
          </div>
        </div>
        <Link
          href="/profile"
          className="px-4 py-2 bg-orange-500 text-black rounded-lg font-bold hover:bg-orange-600 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          Share Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Modal variant - overlay after image creation
  if (variant === 'modal') {
    return (
      <div className="bg-black rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <Sparkles className="w-16 h-16 text-teal-500 mx-auto mb-4 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-teal-500 opacity-20 rounded-full animate-ping"></div>
            </div>
          </div>
          <h2 className="font-heading text-3xl font-bold text-teal-500 mb-2">
            Great transformation!
          </h2>
          <p className="font-body text-white text-lg">
            Share PicForge with friends and you both get <span className="text-teal-500 font-bold">10 FREE images</span>
          </p>
        </div>

        {showStats && completedReferralsCount > 0 && (
          <div className="bg-gray-900 rounded-xl p-4 mb-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="font-body text-gray-400 text-sm mb-1">Friends Joined</p>
              <p className="font-heading text-3xl font-bold text-teal-500">{completedReferralsCount}</p>
            </div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div className="text-center">
              <p className="font-body text-gray-400 text-sm mb-1">Bonus Earned</p>
              <p className="font-heading text-3xl font-bold text-teal-500">{totalBonusImages}</p>
            </div>
          </div>
        )}

        <ReferralShareButton referralLink={referralLink} referralCode={activeReferralCode} />
      </div>
    );
  }

  // Banner variant (default) - collapsible banner
  return (
    <div className="bg-black border-t-4 border-orange-500 rounded-xl overflow-hidden">
      {/* Collapsed State */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full p-6 flex items-center justify-between hover:bg-black hover:bg-opacity-10 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 bg-opacity-20 rounded-full p-3">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-left">
              <h3 className="font-heading text-xl font-bold text-white mb-1">
                Invite Friends & Earn Free Images
              </h3>
              <p className="font-body text-gray-300 text-sm">
                Get 10 bonus images for every friend who joins!
              </p>
            </div>
          </div>
          {showStats && completedReferralsCount > 0 && (
            <div className="bg-orange-500 bg-opacity-20 rounded-lg px-4 py-2">
              <p className="font-body text-gray-300 text-xs mb-1">You've earned</p>
              <p className="font-heading text-2xl font-bold text-orange-500">{totalBonusImages}</p>
              <p className="font-body text-gray-300 text-xs">bonus images</p>
            </div>
          )}
          <ArrowRight className="w-6 h-6 text-orange-500 flex-shrink-0 ml-4" />
        </button>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-7 h-7 text-orange-500" />
              Share Your Referral Link
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Code Display */}
            <div>
              <p className="font-body text-gray-300 text-sm mb-2 font-medium">Your Referral Code</p>
              <div className="bg-orange-500 bg-opacity-20 rounded-lg p-3 text-center border border-orange-500">
                <code className="font-mono text-orange-500 text-xl font-bold">{activeReferralCode}</code>
              </div>
            </div>

            {/* Stats */}
            {showStats && (
              <div className="bg-orange-500 bg-opacity-20 rounded-lg p-4 flex items-center justify-around border border-orange-500">
                <div className="text-center">
                  <p className="font-body text-gray-300 text-xs mb-1">Friends</p>
                  <p className="font-heading text-2xl font-bold text-orange-500">{completedReferralsCount}</p>
                </div>
                <div className="w-px h-10 bg-orange-500 bg-opacity-50"></div>
                <div className="text-center">
                  <p className="font-body text-gray-300 text-xs mb-1">Bonus</p>
                  <p className="font-heading text-2xl font-bold text-orange-500">{totalBonusImages}</p>
                </div>
              </div>
            )}
          </div>

          {/* Share Buttons */}
          <div className="bg-gray-900 rounded-xl p-4 border border-orange-500">
            <ReferralShareButton referralLink={referralLink} referralCode={activeReferralCode} />
          </div>
        </div>
      )}
    </div>
  );
}
