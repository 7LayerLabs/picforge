'use client'

import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.'
      case 'AccessDenied':
        return 'You do not have permission to sign in.'
      case 'Verification':
        return 'The verification token has expired or has already been used.'
      case 'OAuthSignin':
        return 'Error in constructing an authorization URL.'
      case 'OAuthCallback':
        return 'Error in handling the response from the OAuth provider.'
      case 'OAuthCreateAccount':
        return 'Could not create OAuth provider user in the database.'
      case 'EmailCreateAccount':
        return 'Could not create email provider user in the database.'
      case 'Callback':
        return 'Error in the OAuth callback handler route.'
      case 'OAuthAccountNotLinked':
        return 'This account is already associated with another user.'
      case 'EmailSignin':
        return 'Check your email address and try again.'
      case 'CredentialsSignin':
        return 'Sign in failed. Check your credentials and try again.'
      case 'SessionRequired':
        return 'Please sign in to access this page.'
      default:
        return 'An unexpected error occurred. Please try again.'
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
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-gray-900 mb-2">
              Authentication Error
            </h1>
            <p className="text-gray-600 mb-6">
              {getErrorMessage()}
            </p>

            <div className="space-y-3">
              <Link
                href="/auth/signin"
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
              >
                Try Again
              </Link>

              <Link
                href="/"
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Go Home
              </Link>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-mono">
                Error code: {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}