'use client'

import Link from 'next/link'
import { Bug, Upload, Lightbulb, Shield, FileText } from 'lucide-react'
import NewsletterSignup from './NewsletterSignup'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔥</span>
              <h3 className="font-heading text-xl font-bold">
                <span className="text-teal-500">PicForge</span>
              </h3>
            </div>
            <p className="text-gray-400 text-xs">
              © 2025 PicForge. All rights reserved.
            </p>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-3">Get in Touch</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-teal-500 transition-colors flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-gray-400 hover:text-teal-500 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Submit Your Creation
                </Link>
              </li>
              <li>
                <Link href="/ideas" className="text-gray-400 hover:text-teal-500 transition-colors flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Submit an Idea
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/terms" className="text-gray-400 hover:text-teal-500 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="text-gray-400 hover:text-teal-500 transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <NewsletterSignup />
            <div className="mt-4">
              <h4 className="font-heading font-bold text-lg mb-3">Follow</h4>
              <div className="flex gap-3 text-sm">
                <a href="https://twitter.com/picforge" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-500">X/Twitter</a>
                <a href="https://instagram.com/picforge" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-500">Instagram</a>
                <a href="https://www.facebook.com/sharer.php?u=https://pic-forge.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-500">Facebook</a>
                <a href="https://www.linkedin.com/company/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-500">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-gray-800 text-center text-gray-400 text-xs">
          <p>Made with 🔥 for creators who break reality</p>
          <p className="mt-2">
            Questions? Email us at{' '}
            <a href="mailto:hello@pic-forge.com" className="text-teal-500 hover:text-teal-400 underline">
              hello@pic-forge.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
