'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Clock, Sparkles, ArrowLeft } from 'lucide-react'

const EditorNSFW = dynamic(() => import('../components/EditorNSFW'), {
  ssr: false
})

export default function EditorNSFWPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-xl w-full">
        {/* Coming Soon Ribbon - Top Right Corner */}
        <div className="absolute -top-2 -right-2 z-20 overflow-hidden" style={{ width: '120px', height: '120px' }}>
          <div className="absolute top-0 right-0">
            {/* Ribbon */}
            <div className="bg-gradient-to-r from-coral-600 via-coral-500 to-teal-500 text-white font-bold px-8 py-2 shadow-2xl transform rotate-45 translate-x-6 translate-y-6">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-sm tracking-wider whitespace-nowrap">COMING SOON</span>
              </div>
            </div>
            {/* Ribbon shadow */}
            <div className="absolute inset-0 bg-black/20 blur-md transform rotate-45 translate-x-6 translate-y-7 -z-10" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-coral-500/30 relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-coral-500/5 via-transparent to-teal-500/5 pointer-events-none" />

          {/* Shield Icon */}
          <div className="relative flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-coral-500/20 to-teal-500/20 rounded-full flex items-center justify-center border-2 border-coral-500/30 shadow-lg">
              <Sparkles className="w-12 h-12 text-red-400 animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-teal-400 to-red-400 mb-2 animate-gradient">
              18+ Unrestricted Editor
            </h1>
            <p className="text-lg text-gray-400 font-semibold">
              Opening Soon
            </p>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-gray-900/80 to-black/60 rounded-2xl p-6 mb-6 border border-coral-500/20 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-red-400">🔥</span>
              What&apos;s Coming
            </h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400 flex-shrink-0">•</span>
                <span><strong className="text-white">Unrestricted AI Transformations</strong> - No content filters, no limitations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 flex-shrink-0">•</span>
                <span><strong className="text-white">Adult Content Support</strong> - Safe, private processing for mature themes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 flex-shrink-0">•</span>
                <span><strong className="text-white">Horror & Gore Effects</strong> - Dark, intense, and uncensored transformations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 flex-shrink-0">•</span>
                <span><strong className="text-white">Complete Privacy</strong> - No storage, no tracking, ephemeral processing</span>
              </li>
            </ul>
          </div>

          {/* Legal Notice */}
          <div className="bg-coral-500/10 border-2 border-coral-500/30 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-300 text-center leading-relaxed">
              <span className="font-bold text-red-400">18+ Only.</span> This editor will require age verification and is intended for legal adult use only.
              All content must comply with applicable laws. Users are solely responsible for content created.
            </p>
          </div>

          {/* Notify Me Section */}
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-3 rounded-xl border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">Want early access?</p>
              <p className="text-white font-semibold text-sm">Follow us on social media for launch updates</p>
            </div>
          </div>

          {/* Action Button */}
          <div>
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl transition-all shadow-lg border border-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Regular Editor
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-4">
          <p className="text-gray-500 text-xs">
            Currently in development • Expected launch: Q1 2026
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}

