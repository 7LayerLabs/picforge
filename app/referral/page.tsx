'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useReferral } from '@/hooks/useReferral';
import { Gift, Check, X, Sparkles, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import AuthButton from '@/components/AuthButton';

function ReferralContent() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('code');
  const { user, redeemReferralCode, isRedeeming, error, success } = useReferral();
  const [hasAttemptedRedeem, setHasAttemptedRedeem] = useState(false);

  useEffect(() => {
    // Auto-redeem if user is logged in and code is present
    if (user && referralCode && !hasAttemptedRedeem) {
      setHasAttemptedRedeem(true);
      redeemReferralCode(referralCode);
    }
  }, [user, referralCode, hasAttemptedRedeem, redeemReferralCode]);

  if (!referralCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-black rounded-2xl p-12 max-w-md text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="font-heading text-3xl font-bold text-teal-500 mb-4">Invalid Referral Link</h1>
          <p className="font-body text-white mb-8">
            This referral link is missing a code. Please check your link and try again.
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-black rounded-2xl p-12 max-w-xl text-center">
          <Gift className="w-20 h-20 text-teal-500 mx-auto mb-6 animate-bounce" />
          <h1 className="font-heading text-4xl font-bold text-teal-500 mb-4">You&apos;ve Been Invited!</h1>
          <p className="font-body text-white text-lg mb-8">
            A friend wants to give you <span className="text-teal-500 font-bold">10 FREE bonus images</span> on PicForge!
          </p>

          <div className="bg-gray-900 rounded-xl p-6 mb-8">
            <h3 className="font-heading font-bold text-teal-500 mb-4">How It Works:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <p className="font-body text-white text-sm">Sign in to claim your bonus</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <p className="font-body text-white text-sm">You get 10 bonus images instantly</p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                <p className="font-body text-white text-sm">Your friend gets 10 bonus images too</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="font-body text-gray-400 text-sm mb-4">Referral Code:</p>
            <div className="bg-gray-900 border-2 border-teal-500 rounded-xl p-4">
              <code className="font-mono text-teal-500 text-xl font-bold">{referralCode}</code>
            </div>
          </div>

          <AuthButton />

          <p className="font-body text-gray-400 text-xs mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-black rounded-2xl p-12 max-w-xl text-center">
          <div className="relative">
            <Sparkles className="w-20 h-20 text-teal-500 mx-auto mb-6 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-teal-500 opacity-20 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="font-heading text-4xl font-bold text-teal-500 mb-4">Welcome to PicForge!</h1>
          <p className="font-body text-white text-lg mb-2">{success}</p>
          <p className="font-body text-gray-400 mb-8">Start creating amazing images right away.</p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-900 rounded-xl p-4">
              <Zap className="w-8 h-8 text-teal-500 mx-auto mb-2" />
              <p className="font-body text-white text-sm">
                <span className="font-bold text-teal-500">+10</span> Bonus Images
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <Users className="w-8 h-8 text-teal-500 mx-auto mb-2" />
              <p className="font-body text-white text-sm">
                <span className="font-bold text-teal-500">Your Friend</span> Got +10 Too!
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block px-8 py-4 bg-teal-500 text-black rounded-xl font-bold hover:bg-teal-400 transition-all"
            >
              Start Creating Images
            </Link>
            <Link
              href="/profile"
              className="block px-8 py-4 bg-gray-900 text-teal-500 rounded-xl font-bold hover:bg-gray-800 transition-all"
            >
              View My Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-black rounded-2xl p-12 max-w-md text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="font-heading text-3xl font-bold text-teal-500 mb-4">Oops!</h1>
          <p className="font-body text-white mb-8">{error}</p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block px-8 py-3 bg-teal-500 text-black rounded-xl font-bold hover:bg-teal-400 transition-all"
            >
              Go to Homepage
            </Link>
            <Link
              href="/profile"
              className="block px-8 py-3 bg-gray-900 text-teal-500 rounded-xl font-bold hover:bg-gray-800 transition-all"
            >
              View My Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-black rounded-2xl p-12 max-w-md text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="font-heading text-2xl font-bold text-teal-500 mb-4">Processing Your Bonus...</h1>
        <p className="font-body text-white">
          {isRedeeming ? 'Applying referral code...' : 'Please wait...'}
        </p>
      </div>
    </div>
  );
}

export default function ReferralPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ReferralContent />
    </Suspense>
  );
}
