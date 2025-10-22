'use client'

import Link from 'next/link'
import FeaturedTransformations from '@/components/FeaturedTransformations'
import { prompts } from '@/lib/prompts'

// Get daily rotating prompt - changes every 24 hours, same for all users
const getPromptOfTheDay = () => {
  const daysSinceEpoch = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
  const promptIndex = daysSinceEpoch % prompts.length
  return prompts[promptIndex]
}

export default function Home() {
  // Dynamic Prompt of the Day - rotates daily based on system time
  const dailyPrompt = getPromptOfTheDay()
  const PROMPT_OF_THE_DAY = dailyPrompt.description

  return (
    <div className="min-h-screen">
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-all">
                <span className="text-xl">⚡</span>
                <span className="text-sm font-semibold text-gray-900">Instant Results</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-all">
                <span className="text-xl">🎨</span>
                <span className="text-sm font-semibold text-gray-900">272+ Prompts</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200 hover:shadow-lg transition-all">
                <span className="text-xl">🔒</span>
                <span className="text-sm font-semibold text-gray-900">Private & Secure</span>
              </div>
            </div>

          </div>

          {/* Prompt of the Day Section */}
          <div className="max-w-3xl mx-auto mb-12 px-4">
            <div className="border-2 rounded-xl p-6 shadow-lg bg-teal-50 border-teal-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">✨</span>
                <h2 className="font-bold text-2xl text-gray-900">Prompt of the Day</h2>
              </div>
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{dailyPrompt.title}</h3>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-teal-300 rounded-full text-xs font-medium text-teal-700">
                  {dailyPrompt.category}
                </span>
              </div>
              <p className="text-base text-gray-700 italic mb-6 leading-relaxed">
                &ldquo;{PROMPT_OF_THE_DAY}&rdquo;
              </p>
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-lg transition-all hover:scale-105 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Try This in Editor
              </Link>
            </div>
          </div>

          {/* Featured Transformations */}
          <div className="px-4 pb-12 mb-8">
            <FeaturedTransformations limit={6} variant="grid" showHeader />
          </div>

          {/* Need a Background? CTA */}
          <div className="max-w-3xl mx-auto mb-12 px-4">
            <Link href="/canvas" className="block p-6 bg-purple-600 rounded-xl border-2 border-purple-700 hover:border-purple-800 hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <span>🎨</span> Need a Background?
                  </h3>
                  <p className="text-base text-purple-100">Generate custom AI backgrounds from scratch with Canvas</p>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all text-lg">
                  <span>Try Canvas</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Links Grid */}
          <div className="max-w-4xl mx-auto mb-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/prompts" className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-400 hover:shadow-lg transition-all group">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Prompts Library</h3>
                <p className="text-sm text-gray-600">Browse 272+ creative prompts</p>
              </Link>

              <Link href="/showcase" className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all group">
                <div className="text-4xl mb-3">🎭</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Showcase</h3>
                <p className="text-sm text-gray-600">See what others have created</p>
              </Link>

              <Link href="/examples" className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-teal-400 hover:shadow-lg transition-all group">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Examples</h3>
                <p className="text-sm text-gray-600">110+ samples to try first</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
