'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FaGoogle } from 'react-icons/fa'

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider)
    try {
      await signIn(provider, { callbackUrl: '/' })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-gray-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
              Welcome to PicForge
            </h1>
            <p className="text-gray-600">
              Sign in to save your creations and unlock Pro features
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleSignIn('google')}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
            >
              {isLoading === 'google' ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaGoogle className="w-4 h-4 text-red-500" />
              )}
              <span className="whitespace-nowrap text-sm">Sign in with Google</span>
            </button>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl">
            <h3 className="font-semibold text-sm mb-2">Why sign in?</h3>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• Save your image history</li>
              <li>• Create collections and favorites</li>
              <li>• Sync settings across devices</li>
              <li>• Get 500 free images per day</li>
              <li>• Unlock batch processing</li>
            </ul>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-orange-600 hover:underline">
              Terms
            </Link>
            {' and '}
            <Link href="/privacy" className="text-orange-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}