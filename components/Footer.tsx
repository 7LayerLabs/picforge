'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🔥</span>
              <h3 className="font-heading text-2xl font-bold">
                <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">(re)</span>
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">PicForge</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Nothing is real anymore. Make your photos weird, epic, and yours.
            </p>
            <p className="text-gray-500 text-xs">
              © 2025 PicForge. All rights reserved.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/examples" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/prompts" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Prompts
                </Link>
              </li>
              <li>
                <Link href="/tips" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Tips & Tricks
                </Link>
              </li>
              <li>
                <Link href="/canvas" className="text-gray-400 hover:text-orange-500 transition-colors">
                  AI Canvas
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Submit Your Creation
                </Link>
              </li>
              <li>
                <Link href="/ideas" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Submit an Idea
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
          <p>Made with 🔥 for creators who break reality</p>
        </div>
      </div>
    </footer>
  )
}
