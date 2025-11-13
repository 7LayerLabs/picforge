'use client'

import Link from 'next/link'
import FeaturedTransformations from '@/components/FeaturedTransformations'
import SocialButtons from '@/components/SocialButtons'

export default function Home() {

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Headline */}
            <div>
              <h1 className="font-heading text-6xl md:text-7xl font-black leading-tight mb-6">
                <span className="text-black">(re)Imagine</span>
                <span className="text-5xl md:text-6xl">.</span>
                <br />
                <span className="text-brutal-pink">Everything</span>
                <span className="text-5xl md:text-6xl text-brutal-pink">.</span>
              </h1>
              <p className="text-xl md:text-2xl font-bold text-black mb-8 max-w-xl">
                Your photos deserve better. Make them <span className="text-brutal-pink">weird</span>. Make them <span className="text-brutal-cyan">epic</span>. Make them <span className="text-brutal-yellow bg-black px-2">yours</span>. 272+ prompts and endless ideas to break reality. Zero artistic talent required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/forge"
                  className="inline-block px-8 py-4 bg-brutal-pink text-white text-lg font-black uppercase border-4 border-black shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  Start Transforming
                </Link>
                <Link
                  href="/examples"
                  className="inline-block px-8 py-4 bg-white text-black text-lg font-black uppercase border-4 border-black shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  View Templates
                </Link>
              </div>
            </div>

            {/* Right - Tilted Card */}
            <div className="hidden lg:block relative">
              <div className="bg-brutal-cyan border-4 border-black shadow-brutal-lg rotate-2 p-12 relative">
                <div className="bg-white border-4 border-black p-8 -rotate-1 relative">
                  <div className="text-4xl md:text-5xl font-black text-black leading-tight text-center">
                    <div className="mb-3"><span className="text-brutal-pink">Upload</span>.</div>
                    <div className="mb-3"><span className="text-brutal-cyan">Transform</span>.</div>
                    <div className="mb-3"><span className="text-brutal-yellow bg-black px-2">Break Reality</span>.</div>
                  </div>
                  <img src="/mascots/pixxy.png" alt="Pixie" className="absolute -bottom-2 -right-2 w-32 h-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-black px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black text-white text-center mb-12">
            Why <span className="text-brutal-yellow">Pic-Forge?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Yellow Card */}
            <div className="bg-brutal-yellow border-4 border-white p-8">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-3xl font-black text-black mb-4 uppercase">Instant Results</h3>
              <p className="text-lg font-bold text-black">
                AI transformations in seconds. No waiting around. Your weird vision becomes reality instantly.
              </p>
            </div>

            {/* Pink Card */}
            <div className="bg-brutal-pink border-4 border-white p-8">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-3xl font-black text-black mb-4 uppercase">272+ Prompts</h3>
              <p className="text-lg font-bold text-black">
                Turn into zombie, cyberpunk, oil painting, or anything else. The creativity is endless.
              </p>
            </div>

            {/* Cyan Card */}
            <div className="bg-brutal-cyan border-4 border-white p-8">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-3xl font-black text-black mb-4 uppercase">Private & Secure</h3>
              <p className="text-lg font-bold text-black">
                Your images stay yours. We don&apos;t train on your data or sell it. Ever.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-brutal-yellow px-6 py-16 border-t-8 border-b-8 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white border-4 border-black shadow-brutal p-6 text-center">
              <div className="text-5xl md:text-6xl font-black text-black mb-2">272+</div>
              <div className="text-sm md:text-base font-bold text-black uppercase">AI Prompts</div>
            </div>
            <div className="bg-white border-4 border-black shadow-brutal p-6 text-center">
              <div className="text-5xl md:text-6xl font-black text-black mb-2">100%</div>
              <div className="text-sm md:text-base font-bold text-black uppercase">Free to Start</div>
            </div>
            <div className="bg-white border-4 border-black shadow-brutal p-6 text-center">
              <div className="text-5xl md:text-6xl font-black text-black mb-2">∞</div>
              <div className="text-sm md:text-base font-bold text-black uppercase">Possibilities</div>
            </div>
            <div className="bg-white border-4 border-black shadow-brutal p-6 text-center">
              <div className="text-5xl md:text-6xl font-black text-black mb-2">0</div>
              <div className="text-sm md:text-base font-bold text-black uppercase">Boring Images</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brutal-pink px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-7xl font-black text-white mb-4 uppercase leading-tight">
            Ready to
            <br />
            <span className="text-black">Break Reality?</span>
          </h2>
          <Link
            href="/forge"
            className="inline-block mt-8 px-12 py-6 bg-brutal-yellow text-black text-2xl font-black uppercase border-4 border-black shadow-brutal-lg hover:shadow-brutal hover:translate-x-2 hover:translate-y-2 transition-all"
          >
            Start Transforming →
          </Link>
        </div>
      </div>

      {/* Featured Transformations */}
      <div className="bg-white px-6 py-12 pb-16">
        <div className="max-w-7xl mx-auto">
          <FeaturedTransformations limit={6} variant="grid" showHeader />
        </div>
      </div>
    </div>
  )
}
