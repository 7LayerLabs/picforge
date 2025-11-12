'use client';

import { useState, useEffect } from 'react';
import { useEmailPreferences } from '@/hooks/useEmailPreferences';
import AuthButton from '@/components/AuthButton';

export default function EmailPreferencesPage() {
  const { user, preferences, isLoading, updatePreferences, unsubscribeAll } = useEmailPreferences();
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const success = await updatePreferences(localPrefs);

    setSaving(false);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleUnsubscribeAll = async () => {
    if (confirm('Are you sure you want to unsubscribe from all emails?')) {
      setSaving(true);
      await unsubscribeAll();
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full bg-white text-black p-8 rounded-lg shadow-xl">
          <h1 className="text-4xl font-bold mb-4 text-center">Email Preferences</h1>
          <p className="text-gray-600 mb-6 text-center">
            Sign in to manage your email preferences
          </p>
          <div className="flex justify-center">
            <AuthButton />
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading preferences...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white text-black p-8 rounded-lg shadow-xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-2 text-center">
            Email Preferences
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Control what emails you receive from PicForge
          </p>

          <div className="space-y-6">
            {/* Welcome Emails */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="welcomeEmails"
                checked={localPrefs.welcomeEmails}
                onChange={(e) =>
                  setLocalPrefs({ ...localPrefs, welcomeEmails: e.target.checked })
                }
                className="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <div className="flex-1">
                <label htmlFor="welcomeEmails" className="font-semibold text-lg cursor-pointer">
                  Welcome Emails
                </label>
                <p className="text-gray-600 text-sm mt-1">
                  Get a welcome email when you sign up, introducing you to PicForge features
                </p>
              </div>
            </div>

            {/* Limit Warnings */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="limitWarnings"
                checked={localPrefs.limitWarnings}
                onChange={(e) =>
                  setLocalPrefs({ ...localPrefs, limitWarnings: e.target.checked })
                }
                className="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <div className="flex-1">
                <label htmlFor="limitWarnings" className="font-semibold text-lg cursor-pointer">
                  Daily Limit Warnings
                </label>
                <p className="text-gray-600 text-sm mt-1">
                  Get notified when you&apos;re approaching your daily image limit (free tier only)
                </p>
              </div>
            </div>

            {/* Weekly Digests */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="weeklyDigests"
                checked={localPrefs.weeklyDigests}
                onChange={(e) =>
                  setLocalPrefs({ ...localPrefs, weeklyDigests: e.target.checked })
                }
                className="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <div className="flex-1">
                <label htmlFor="weeklyDigests" className="font-semibold text-lg cursor-pointer">
                  Weekly Digests
                </label>
                <p className="text-gray-600 text-sm mt-1">
                  Get a weekly summary of your transformations, favorite prompts, and trending content
                </p>
              </div>
            </div>

            {/* Marketing Emails */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="marketingEmails"
                checked={localPrefs.marketingEmails}
                onChange={(e) =>
                  setLocalPrefs({ ...localPrefs, marketingEmails: e.target.checked })
                }
                className="mt-1 w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <div className="flex-1">
                <label htmlFor="marketingEmails" className="font-semibold text-lg cursor-pointer">
                  Marketing & Updates
                </label>
                <p className="text-gray-600 text-sm mt-1">
                  Receive updates about new features, special offers, and PicForge news
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
            </button>
            <button
              onClick={handleUnsubscribeAll}
              disabled={saving}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Unsubscribe All
            </button>
          </div>

          {saved && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
              Your preferences have been saved successfully!
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">About Email Notifications</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You can change your preferences at any time</li>
              <li>• Transactional emails (receipts, confirmations) will always be sent</li>
              <li>• All marketing emails include an unsubscribe link</li>
              <li>• Your email address is never shared with third parties</li>
            </ul>
          </div>

          {/* Back to Profile */}
          <div className="mt-8 text-center">
            <a
              href="/profile"
              className="text-teal-600 hover:text-teal-700 font-semibold underline"
            >
              ← Back to Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
