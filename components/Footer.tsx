'use client'

import Link from 'next/link'
import { Bug, Upload, Lightbulb, Shield, FileText } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔥</span>
              <h3 className="font-heading text-xl font-bold">
                <span className="bg-gradient-to-r from-teal-500 to-coral-500 bg-clip-text text-transparent">PicForge</span>
              </h3>
            </div>
            <p className="text-gray-500 text-xs">
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
                <Link href="/terms" className="text-gray-400 hover:text-teal-500 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-teal-500 transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-gray-800 text-center text-gray-500 text-xs">
          <p>Made with 🔥 for creators who break reality</p>
        </div>
      </div>
    </footer>
  )
}
