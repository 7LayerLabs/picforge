'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-8 border-brutal-yellow">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Brand */}
          <div>
            <h3 className="font-black text-2xl mb-3 uppercase">
              <span className="text-brutal-yellow">Pic-Forge</span>
            </h3>
            <p className="text-white text-sm font-bold">
              Made with 🔥 for creators who break reality
            </p>
            <p className="text-white text-xs mt-2">
              © 2025 PicForge. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-black text-lg mb-3 uppercase text-brutal-pink">Quick Links</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li>
                <Link href="/contact" className="text-white hover:text-brutal-yellow transition-colors">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-white hover:text-brutal-yellow transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-white hover:text-brutal-yellow transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-lg mb-3 uppercase text-brutal-cyan">Get in Touch</h4>
            <p className="text-sm font-bold text-white">
              Questions? Email us at{' '}
              <a href="mailto:hello@pic-forge.com" className="text-brutal-yellow hover:text-brutal-pink underline">
                hello@pic-forge.com
              </a>
            </p>
            <div className="mt-4">
              <div className="flex gap-4 text-sm font-bold">
                <a href="https://twitter.com/picforge" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brutal-yellow">X/Twitter</a>
                <a href="https://instagram.com/picforge" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brutal-pink">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
