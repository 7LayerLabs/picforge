'use client';

import { useState } from 'react';
import { useImageTracking } from '@/hooks/useImageTracking';
import { createPromoCode, generatePromoCode } from '@/lib/promoCodes';
import { Check, X, Key, Sparkles, Crown, Gift, AlertCircle, Copy } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user } = useImageTracking();
  const [customCode, setCustomCode] = useState('');
  const [tier, setTier] = useState<'unlimited' | 'pro'>('unlimited');
  const [isCreating, setIsCreating] = useState(false);
  const [createdCode, setCreatedCode] = useState('');
  const [error, setError] = useState('');

  // Only allow Derek's email
  const isAdmin = user?.email === 'derek.bobola@gmail.com';

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            Please sign in to access the admin panel.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-gray-900">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">
            You don&apos;t have permission to access this page.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const handleGenerateRandom = async () => {
    setIsCreating(true);
    setError('');

    try {
      const code = generatePromoCode('PICFORGE');
      await createPromoCode(code, tier, user.id);
      setCreatedCode(code);
      setCustomCode('');
    } catch (err) {
      setError('Failed to create promo code');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateCustom = async () => {
    if (!customCode.trim()) {
      setError('Please enter a code');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const code = customCode.toUpperCase().trim();
      await createPromoCode(code, tier, user.id);
      setCreatedCode(code);
      setCustomCode('');
    } catch (err) {
      setError('Failed to create promo code. Code may already exist.');
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdCode);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
              <p className="text-gray-300">Generate promo codes for PicForge</p>
            </div>
            <Crown className="w-16 h-16 text-yellow-400" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Generate Random Code */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-teal-500" />
              Generate Random Code
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as 'unlimited' | 'pro')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  disabled={isCreating}
                >
                  <option value="unlimited">Unlimited (Free Forever)</option>
                  <option value="pro">Pro</option>
                </select>
              </div>

              <button
                onClick={handleGenerateRandom}
                disabled={isCreating}
                className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    Generate Random Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Create Custom Code */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Key className="w-6 h-6 text-coral-500" />
              Create Custom Code
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Code
                </label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  placeholder="DEREK-FOUNDER-2025"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-coral-500 focus:outline-none font-mono text-lg uppercase"
                  disabled={isCreating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as 'unlimited' | 'pro')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-coral-500 focus:outline-none"
                  disabled={isCreating}
                >
                  <option value="unlimited">Unlimited (Free Forever)</option>
                  <option value="pro">Pro</option>
                </select>
              </div>

              <button
                onClick={handleCreateCustom}
                disabled={isCreating || !customCode.trim()}
                className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    Create Custom Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
            <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {createdCode && (
          <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Check className="w-8 h-8 text-green-600" />
              <h3 className="font-bold text-green-900 text-lg">Code Created Successfully!</h3>
            </div>
            <div className="flex items-center gap-2 p-4 bg-white rounded-lg border border-green-200">
              <code className="flex-1 text-2xl font-mono font-bold text-gray-900">{createdCode}</code>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
            <p className="text-green-700 text-sm mt-3">
              Share this code with the user. They can redeem it in their Profile page.
            </p>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong className="text-gray-900">Step 1:</strong> Generate a code using either the random generator or create a custom code above.
            </p>
            <p>
              <strong className="text-gray-900">Step 2:</strong> Copy the generated code and share it securely with the user.
            </p>
            <p>
              <strong className="text-gray-900">Step 3:</strong> Users can redeem codes on their Profile page.
            </p>
            <p className="text-sm text-amber-600 border-l-4 border-amber-400 pl-4">
              ⚠️ <strong>Security Note:</strong> Never commit promo codes to the codebase or share them publicly. Each code can only be used once.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Link
            href="/profile"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <Crown className="w-8 h-8 text-teal-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-900 mb-2">Your Profile</h3>
            <p className="text-gray-600 text-sm">View your account status</p>
          </Link>

          <Link
            href="/pricing"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <Gift className="w-8 h-8 text-coral-500 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-gray-900 mb-2">Pricing Page</h3>
            <p className="text-gray-600 text-sm">View public pricing</p>
          </Link>

          <Link
            href="/"
            className="bg-teal-600 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group text-white"
          >
            <Sparkles className="w-8 h-8 text-yellow-300 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold mb-2">Editor</h3>
            <p className="text-teal-100 text-sm">Go to main editor</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
