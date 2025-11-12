'use client';

import { useEmailPreferences } from '@/hooks/useEmailPreferences';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const typeParam = searchParams.get('type');

  const { user, unsubscribeAll, updatePreferences } = useEmailPreferences();
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Auto-unsubscribe if email matches
  useEffect(() => {
    if (user && emailParam && user.email === emailParam && !unsubscribed) {
      handleUnsubscribe();
    }
  }, [user, emailParam, unsubscribed]);

  const handleUnsubscribe = async () => {
    setProcessing(true);

    let success = false;

    // If specific type is provided, unsubscribe from that type only
    if (typeParam) {
      switch (typeParam) {
        case 'welcome':
          success = await updatePreferences({ welcomeEmails: false });
          break;
        case 'limit-warning':
          success = await updatePreferences({ limitWarnings: false });
          break;
        case 'weekly-digest':
          success = await updatePreferences({ weeklyDigests: false });
          break;
        case 'marketing':
          success = await updatePreferences({ marketingEmails: false });
          break;
        default:
          success = await unsubscribeAll();
      }
    } else {
      // Unsubscribe from all
      success = await unsubscribeAll();
    }

    setProcessing(false);
    if (success) {
      setUnsubscribed(true);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md px-6 text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-gray-900 rounded-full mb-4">
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-3">Unsubscribe from PicForge</h1>
            <p className="text-gray-400 mb-6">
              Please sign in to manage your email preferences.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (unsubscribed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md px-6 text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-green-900 rounded-full mb-4">
              <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-3">You&apos;ve Been Unsubscribed</h1>
            <p className="text-gray-400 mb-4">
              {typeParam
                ? `You won't receive ${typeParam} emails anymore.`
                : `You won't receive any emails from PicForge anymore.`}
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Note: Critical account notifications may still be sent for security purposes.
            </p>

            <div className="space-y-3">
              <Link
                href="/profile/emails"
                className="block px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors font-medium"
              >
                Manage Email Preferences
              </Link>
              <Link
                href="/"
                className="block px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-medium"
              >
                Go to Home
              </Link>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-lg text-left">
            <h3 className="font-bold mb-2 text-sm">Changed your mind?</h3>
            <p className="text-gray-400 text-sm mb-3">
              You can update your preferences anytime from your profile page. We&apos;d love to stay in touch!
            </p>
            <Link
              href="/profile/emails"
              className="text-teal-500 hover:text-teal-400 text-sm font-medium"
            >
              Update Preferences →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md px-6 text-center">
        <div className="mb-6">
          <div className="inline-block p-4 bg-gray-900 rounded-full mb-4">
            <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Unsubscribe from PicForge?</h1>
          <p className="text-gray-400 mb-2">
            We&apos;re sorry to see you go, <span className="text-teal-500">{user.email}</span>
          </p>
          <p className="text-gray-500 text-sm mb-8">
            {typeParam
              ? `You're about to stop receiving ${typeParam} emails.`
              : `You're about to stop receiving all emails from PicForge.`}
          </p>

          <div className="space-y-3 mb-8">
            <button
              onClick={handleUnsubscribe}
              disabled={processing}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
            >
              {processing ? 'Unsubscribing...' : 'Yes, Unsubscribe'}
            </button>
            <Link
              href="/profile/emails"
              className="block px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-medium"
            >
              Manage Preferences Instead
            </Link>
          </div>

          <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg text-left">
            <h3 className="font-bold mb-2 text-sm">What you&apos;ll miss:</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span>Daily limit warnings (free tier only)</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span>New feature announcements</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span>Weekly creative inspiration</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-500 mr-2">•</span>
                <span>Special promotions and offers</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-gray-500 text-xs">
          <p>
            If you have feedback, we&apos;d love to hear it:
            <br />
            <a href="mailto:support@pic-forge.com" className="text-teal-500 hover:text-teal-400">
              support@pic-forge.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="max-w-md px-6 text-center">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
