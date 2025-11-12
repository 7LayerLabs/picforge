'use client';

import { useEmailPreferences } from '@/hooks/useEmailPreferences';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EmailPreferencesPage() {
  const {
    user,
    preferences,
    updatePreferences,
    unsubscribeAll,
    isLoading,
  } = useEmailPreferences();

  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Update local state when preferences change
  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleToggle = (key: keyof typeof preferences) => {
    setLocalPreferences({
      ...localPreferences,
      [key]: !localPreferences[key],
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const success = await updatePreferences(localPreferences);

    setSaving(false);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleUnsubscribeAll = async () => {
    if (!confirm('Are you sure you want to unsubscribe from all emails? You can always re-enable them later.')) {
      return;
    }

    setSaving(true);
    const success = await unsubscribeAll();
    setSaving(false);

    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-gray-400">Loading preferences...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-400 mb-6">
            Please sign in to manage your email preferences.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="text-teal-500 hover:text-teal-400 text-sm mb-4 inline-block"
          >
            ← Back to Profile
          </Link>
          <h1 className="text-4xl font-bold mb-2">Email Preferences</h1>
          <p className="text-gray-400">
            Manage what emails you receive from PicForge
          </p>
        </div>

        {/* Email Preferences Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-6">
          <div className="space-y-6">
            {/* Welcome Emails */}
            <div className="flex items-start justify-between pb-6 border-b border-gray-800">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">Welcome Emails</h3>
                <p className="text-gray-400 text-sm">
                  Get started with PicForge basics and tips when you sign up
                </p>
              </div>
              <button
                onClick={() => handleToggle('welcomeEmails')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localPreferences.welcomeEmails ? 'bg-teal-600' : 'bg-gray-700'
                }`}
                disabled={saving}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localPreferences.welcomeEmails ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Limit Warnings */}
            <div className="flex items-start justify-between pb-6 border-b border-gray-800">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">Usage Notifications</h3>
                <p className="text-gray-400 text-sm">
                  Receive alerts when approaching or reaching daily image limits (free tier only)
                </p>
              </div>
              <button
                onClick={() => handleToggle('limitWarnings')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localPreferences.limitWarnings ? 'bg-teal-600' : 'bg-gray-700'
                }`}
                disabled={saving}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localPreferences.limitWarnings ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Weekly Digests */}
            <div className="flex items-start justify-between pb-6 border-b border-gray-800">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">Weekly Digests</h3>
                <p className="text-gray-400 text-sm">
                  Get a weekly summary of your transformations, favorite prompts, and trending styles
                </p>
                <span className="inline-block mt-2 px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded">
                  Coming Soon
                </span>
              </div>
              <button
                onClick={() => handleToggle('weeklyDigests')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localPreferences.weeklyDigests ? 'bg-teal-600' : 'bg-gray-700'
                }`}
                disabled={saving}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localPreferences.weeklyDigests ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Marketing Emails */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">Product Updates</h3>
                <p className="text-gray-400 text-sm">
                  Hear about new features, promotions, and special offers from PicForge
                </p>
              </div>
              <button
                onClick={() => handleToggle('marketingEmails')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localPreferences.marketingEmails ? 'bg-teal-600' : 'bg-gray-700'
                }`}
                disabled={saving}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localPreferences.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-bold transition-colors"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>

              {saved && (
                <span className="text-green-400 font-medium">
                  ✓ Preferences saved!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-3">Important Notes</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>
                Promo code confirmation emails are always sent (even if you opt out of other emails)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>
                Changes may take up to 24 hours to take effect
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-500 mr-2">•</span>
              <span>
                You can update these preferences anytime from your profile
              </span>
            </li>
          </ul>
        </div>

        {/* Unsubscribe All */}
        <div className="bg-red-950 border border-red-900 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-2 text-red-400">
            Unsubscribe from All Emails
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Stop receiving all emails from PicForge (except critical account notifications). You can re-enable emails anytime.
          </p>
          <button
            onClick={handleUnsubscribeAll}
            disabled={saving}
            className="px-6 py-2 bg-red-900 hover:bg-red-800 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-sm"
          >
            Unsubscribe from All
          </button>
        </div>

        {/* CAN-SPAM Compliance */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>
            PicForge is compliant with the CAN-SPAM Act. All emails include clear unsubscribe links.
          </p>
          <p className="mt-2">
            Your email: <span className="text-teal-500">{user.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
