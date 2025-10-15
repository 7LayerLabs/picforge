'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Sparkles, Crown, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate verification delay
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <p className="text-gray-600">Invalid session. Please try again.</p>
          <Link href="/pricing" className="mt-4 inline-block text-teal-600 hover:underline">
            Return to Pricing
          </Link>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your subscription</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Welcome to PicForge Pro! 🎉
        </h1>

        <p className="text-center text-gray-600 text-lg mb-8">
          Your payment was successful. You now have unlimited access to all Pro features!
        </p>

        {/* Features Unlocked */}
        <div className="bg-teal-50 rounded-xl p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-teal-600" />
            Pro Features Unlocked:
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <span className="text-gray-700"><strong>Unlimited image transformations</strong> - No daily limits!</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <span className="text-gray-700"><strong>No watermarks</strong> on exported images</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <span className="text-gray-700">Access to all 210+ AI templates</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <span className="text-gray-700">Batch processing up to 100 images</span>
            </li>
          </ul>
        </div>

        {/* Next Steps */}
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full px-6 py-4 bg-teal-600 text-white rounded-xl font-bold text-lg text-center hover:bg-teal-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start Creating Images
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/profile"
            className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-200 transition-all"
          >
            View My Account
          </Link>
        </div>

        {/* Receipt Info */}
        <p className="text-center text-gray-500 text-sm mt-8">
          A receipt has been sent to your email. You can manage your subscription anytime from your account settings.
        </p>
      </div>
    </div>
  );
}
