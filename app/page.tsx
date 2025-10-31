'use client'

import Link from 'next/link'
import FeaturedTransformations from '@/components/FeaturedTransformations'
import SocialButtons from '@/components/SocialButtons'

export default function Home() {

  return (
    <div className="min-h-screen bg-white">
      {/* Main content */}
      <div className="p-2 sm:p-4 flex flex-col items-center">
        <div className="max-w-6xl w-full relative z-10 animate-fade-in-up">
          {/* Hero Section */}
          <div className="text-center mb-8 px-4 pt-8">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900 mb-3 leading-tight">
              <span className="inline-block text-3xl md:text-4xl -rotate-12 text-purple-600 mr-1">(re)</span><span className="text-gray-900">Imagine<span className="text-4xl md:text-5xl">.</span> Everything<span className="text-4xl md:text-5xl">.</span></span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed font-bold">
              Your photos deserve better. Make them weird. Make them epic. Make them yours. <span className="text-teal-600">272+ prompts and endless ideas</span> to break reality. <span className="text-purple-600">Zero artistic talent required.</span>
            </p>

            {/* Feature Highlights - Compact Inline Badges */}
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-[0_3px_0_rgba(0,0,0,0.12)] border-2 border-gray-300 hover:shadow-[0_5px_0_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all">
                <span className="text-xl">⚡</span>
                <span className="text-sm font-semibold text-gray-900">Instant Results</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-[0_3px_0_rgba(0,0,0,0.12)] border-2 border-gray-300 hover:shadow-[0_5px_0_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all">
                <span className="text-xl">🎨</span>
                <span className="text-sm font-semibold text-gray-900">272+ Prompts</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-[0_3px_0_rgba(0,0,0,0.12)] border-2 border-gray-300 hover:shadow-[0_5px_0_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all">
                <span className="text-xl">🔒</span>
                <span className="text-sm font-semibold text-gray-900">Private & Secure</span>
              </div>
            </div>

            {/* Primary Hero CTA - Rebellious Edge */}
            <div className="flex justify-center mb-6">
              <Link
                href="/editor"
                className="inline-block px-10 py-5 bg-purple-600 text-white text-xl font-black uppercase rounded-lg border-4 border-black shadow-[0_6px_0_rgba(0,0,0,0.3)] hover:translate-y-1 hover:shadow-[0_4px_0_rgba(0,0,0,0.3)] transition-all duration-150 rotate-1 hover:rotate-0"
              >
                Start Transforming
              </Link>
            </div>

            <div className="flex justify-center mt-4">
              <SocialButtons className="opacity-90" />
            </div>

          </div>

          {/* Featured Transformations */}
          <div className="px-4 pb-12 mb-8">
            <FeaturedTransformations limit={6} variant="grid" showHeader />
          </div>

          {/* Canvas CTA */}
          <div className="max-w-3xl mx-auto mb-12 px-4">
            <Link href="/canvas" className="block p-6 bg-purple-600 rounded-xl border-4 border-purple-800 shadow-[0_6px_0_rgba(88,28,135,0.5)] hover:shadow-[0_10px_0_rgba(88,28,135,0.6)] hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span>🎨</span> Dream It. Type It. Get It.
                  </h3>
                  <p className="text-base text-purple-100">No photo? No problem. Generate anything from thin air.</p>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all text-lg">
                  <span>Hit Canvas</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Links Grid */}
          <div className="max-w-4xl mx-auto mb-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/prompts" className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-400 hover:shadow-lg transition-all group">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Prompts Library</h3>
                <p className="text-sm text-gray-600">272+ ways to break reality</p>
              </Link>

              <Link href="/examples" className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-400 hover:shadow-lg transition-all group">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Templates Gallery</h3>
                <p className="text-sm text-gray-600">Test drive before you commit</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
