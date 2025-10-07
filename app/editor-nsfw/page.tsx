'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Import the actual editor component
import EditorNSFW from '@/app/components/EditorNSFW'

export default function EditorNSFWPage() {
  const [isVerified, setIsVerified] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user has verified before (session storage)
    const verified = sessionStorage.getItem('nsfw_verified')
    if (verified === 'true') {
      setIsVerified(true)
    }
    setIsChecking(false)
  }, [])

  const handleVerify = (confirm: boolean) => {
    if (confirm) {
      sessionStorage.setItem('nsfw_verified', 'true')
      setIsVerified(true)
    } else {
      router.push('/')
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    )
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border-2 border-red-500">
          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center mb-4">
            Adult Content Warning
          </h1>

          {/* Warning Text */}
          <div className="bg-gray-900 rounded-xl p-4 mb-6 space-y-3 text-sm text-gray-300">
            <p className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>This editor allows unrestricted adult, graphic, and gory content</span>
            </p>
            <p className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>You must be 18 years or older to proceed</span>
            </p>
            <p className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>All content must comply with local laws and regulations</span>
            </p>
            <p className="flex items-start gap-2">
              <Shield className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>No illegal content will be processed or stored</span>
            </p>
          </div>

          {/* Age Verification */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-white font-semibold text-center mb-2">
              Are you 18 years or older?
            </p>
            <p className="text-xs text-gray-400 text-center">
              By clicking YES, you confirm you are of legal age in your jurisdiction
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleVerify(false)}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
            >
              NO - Exit
            </button>
            <button
              onClick={() => handleVerify(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
            >
              YES - Enter
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Regular Editor
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // User is verified, show the editor
  return <EditorNSFW />
}
