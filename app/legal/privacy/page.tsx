'use client';

import Link from 'next/link';
import { Shield, Lock, Eye, Database, Cookie, Mail, FileText, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-teal-500" />
            <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
              Privacy Policy
            </h1>
          </div>
          <p className="text-gray-600 text-lg mb-4">
            Your privacy matters. We&apos;re transparent about what we collect and why.
          </p>
          <p className="text-sm text-gray-500">
            <strong>Last Updated:</strong> October 23, 2025
          </p>
          <p className="text-sm text-gray-500">
            <strong>Effective Date:</strong> October 23, 2025
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-teal-900 mb-3" style={{ fontFamily: 'Courier New, monospace' }}>
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <a href="#data-collection" className="text-teal-700 hover:text-teal-900 text-sm">→ Data We Collect</a>
            <a href="#how-we-use" className="text-teal-700 hover:text-teal-900 text-sm">→ How We Use Data</a>
            <a href="#third-party" className="text-teal-700 hover:text-teal-900 text-sm">→ Third-Party Services</a>
            <a href="#your-rights" className="text-teal-700 hover:text-teal-900 text-sm">→ Your Privacy Rights</a>
            <a href="#cookies" className="text-teal-700 hover:text-teal-900 text-sm">→ Cookies & Tracking</a>
            <a href="#security" className="text-teal-700 hover:text-teal-900 text-sm">→ Data Security</a>
            <a href="#retention" className="text-teal-700 hover:text-teal-900 text-sm">→ Data Retention</a>
            <a href="#contact" className="text-teal-700 hover:text-teal-900 text-sm">→ Contact Us</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Courier New, monospace' }}>
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to PicForge (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered image transformation platform at <strong>picforge.com</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              PicForge is operated by Derek Bobola, owner of Bobola&apos;s Restaurant in Nashua, NH. We built PicForge to make AI image editing accessible, fun, and powerful for everyone.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>If you do not agree with this policy, please do not use our services.</strong>
            </p>
          </section>

          {/* Data Collection */}
          <section id="data-collection">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                Data We Collect
              </h2>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">1. Information You Provide Directly</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Account Information:</strong> Email address (for magic link authentication via InstantDB), optional name
              </li>
              <li>
                <strong>Payment Information:</strong> Credit card details processed securely through Stripe (we never store full card numbers)
              </li>
              <li>
                <strong>Images:</strong> Photos you upload for transformation (stored temporarily, see retention policy)
              </li>
              <li>
                <strong>Prompts:</strong> AI transformation instructions you provide
              </li>
              <li>
                <strong>Showcase Submissions:</strong> Titles, descriptions, and images you submit to our public gallery
              </li>
              <li>
                <strong>Feedback:</strong> Messages, support requests, or feature suggestions you send us
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2. Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Usage Data:</strong> Image generation count, daily limits, feature usage patterns (tracked via InstantDB)
              </li>
              <li>
                <strong>Device Information:</strong> IP address, browser type, operating system, device identifiers
              </li>
              <li>
                <strong>Analytics Data:</strong> Page views, session duration, referral sources (via Google Analytics)
              </li>
              <li>
                <strong>Cookies & Tracking:</strong> Session cookies, analytics cookies, preference cookies (see Cookies section)
              </li>
              <li>
                <strong>API Usage:</strong> Request timestamps, processing times, error logs
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3. Information from Third Parties</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Payment Processor (Stripe):</strong> Payment status, subscription details, billing information
              </li>
              <li>
                <strong>AI Providers:</strong> Processing metadata from Google Gemini and Replicate APIs (no personal data shared)
              </li>
            </ul>
          </section>

          {/* How We Use Data */}
          <section id="how-we-use">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                How We Use Your Data
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              We use your personal information for the following purposes:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Service Delivery</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li>Process and transform your images using AI models</li>
                  <li>Manage your account and authentication</li>
                  <li>Enforce daily usage limits (20 images/day for free tier)</li>
                  <li>Enable features like Lock Composition, favorites, and image history</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Billing & Payments</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li>Process subscription payments (Free, Pro, Unlimited tiers)</li>
                  <li>Handle promo code redemptions</li>
                  <li>Send payment receipts and billing notifications</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Communication</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li>Send magic link authentication emails</li>
                  <li>Notify you about daily limit warnings (if opted in)</li>
                  <li>Send product updates, new features, and tips (if opted in)</li>
                  <li>Respond to support requests</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Analytics & Improvement</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li>Analyze feature usage and user behavior patterns</li>
                  <li>Monitor API performance and error rates</li>
                  <li>Improve AI transformation quality</li>
                  <li>Develop new features based on usage data</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Legal & Security</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li>Prevent fraud, abuse, and unauthorized access</li>
                  <li>Enforce our Terms of Service</li>
                  <li>Comply with legal obligations and law enforcement requests</li>
                  <li>Protect intellectual property rights</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Legal Basis (GDPR):</strong> We process your data based on (1) your consent, (2) contractual necessity to provide services, (3) our legitimate interests in improving the platform, and (4) legal compliance requirements.
            </p>
          </section>

          {/* Third-Party Services */}
          <section id="third-party">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                Third-Party Services
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              We use the following third-party services that may collect your data:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="font-semibold text-gray-800">InstantDB</h3>
                <p className="text-gray-700 text-sm">
                  <strong>Purpose:</strong> User authentication (magic links) and database storage
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Data Shared:</strong> Email address, user ID, images, favorites, usage stats
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Privacy Policy:</strong> <a href="https://www.instantdb.com/privacy" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">instantdb.com/privacy</a>
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800">Stripe</h3>
                <p className="text-gray-700 text-sm">
                  <strong>Purpose:</strong> Payment processing for Pro subscriptions
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Data Shared:</strong> Payment information, billing address, email
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Compliance:</strong> PCI DSS Level 1 certified
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Privacy Policy:</strong> <a href="https://stripe.com/privacy" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800">Google Gemini API</h3>
                <p className="text-gray-700 text-sm">
                  <strong>Purpose:</strong> AI image transformation and processing
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Data Shared:</strong> Uploaded images, transformation prompts
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Note:</strong> Gemini filters NSFW content (see NSFW editor for unrestricted processing)
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800">Replicate API</h3>
                <p className="text-gray-700 text-sm">
                  <strong>Purpose:</strong> NSFW/unrestricted image processing (18+ editor and batch)
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Data Shared:</strong> Uploaded images, transformation prompts
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Cost:</strong> Approximately $0.023 per image transformation
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Privacy Policy:</strong> <a href="https://replicate.com/privacy" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">replicate.com/privacy</a>
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">Google Analytics</h3>
                <p className="text-gray-700 text-sm">
                  <strong>Purpose:</strong> Website traffic analysis and user behavior tracking
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Data Shared:</strong> IP address, page views, session data, device information
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Privacy Policy:</strong> <a href="https://policies.google.com/privacy" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-800">Resend</h3>
                <p className="text-gray-700 text-sm">
                  <strong>Purpose:</strong> Transactional email delivery
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Data Shared:</strong> Email address, email content
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Privacy Policy:</strong> <a href="https://resend.com/privacy" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">resend.com/privacy</a>
                </p>
              </div>

              <div className="border-l-4 border-gray-500 pl-4">
                <h3 className="font-semibold text-gray-800">Vercel (Hosting & KV Storage)</h3>
                <p className="text-gray-700 text-sm">
                  <strong>Purpose:</strong> Website hosting and analytics tracking
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Data Shared:</strong> Visitor counts, share tracking, template usage
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Privacy Policy:</strong> <a href="https://vercel.com/legal/privacy-policy" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mt-4 italic text-sm">
              Note: We do not control these third-party services and are not responsible for their privacy practices. Please review their privacy policies directly.
            </p>
          </section>

          {/* Your Rights */}
          <section id="your-rights">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                Your Privacy Rights
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you have the following rights regarding your personal data:
            </p>

            <div className="space-y-4">
              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">GDPR Rights (EU/EEA Residents)</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
                  <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request deletion of your data</li>
                  <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format (JSON export)</li>
                  <li><strong>Right to Object:</strong> Object to processing for direct marketing or legitimate interests</li>
                  <li><strong>Right to Restriction:</strong> Limit how we use your data</li>
                  <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time (doesn&apos;t affect prior processing)</li>
                  <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">CCPA Rights (California Residents)</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li><strong>Right to Know:</strong> Request details about data collected in the past 12 months</li>
                  <li><strong>Right to Delete:</strong> Request deletion of personal information</li>
                  <li><strong>Right to Opt-Out:</strong> Opt-out of the &quot;sale&quot; of personal information (we do not sell data)</li>
                  <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of exercising privacy rights</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">How to Exercise Your Rights</h3>
                <p className="text-gray-700 text-sm mb-2">
                  To exercise any of these rights, contact us at:
                </p>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-gray-800 font-semibold">Email: <a href="mailto:derek.bobola@gmail.com" className="text-teal-600 hover:underline">derek.bobola@gmail.com</a></p>
                  <p className="text-gray-700 text-sm">Subject: &quot;Privacy Rights Request - PicForge&quot;</p>
                </div>
                <p className="text-gray-700 text-sm mt-3">
                  <strong>Response Time:</strong> We will respond within 30 days (GDPR) or 45 days (CCPA).
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>Identity Verification:</strong> We may request additional information to verify your identity before processing requests.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section id="cookies">
            <div className="flex items-center gap-2 mb-4">
              <Cookie className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                Cookies & Tracking Technologies
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience and analyze usage patterns.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Types of Cookies We Use</h3>

            <div className="space-y-3">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-800">Essential Cookies (Required)</h4>
                <p className="text-gray-700 text-sm">
                  Session authentication, user preferences, account security. <strong>Cannot be disabled.</strong>
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">Analytics Cookies (Optional)</h4>
                <p className="text-gray-700 text-sm">
                  Google Analytics tracking for feature usage, page views, and performance monitoring.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-800">LocalStorage</h4>
                <p className="text-gray-700 text-sm">
                  Favorites, image history, UI preferences stored in your browser (not sent to servers).
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Managing Cookies</h3>
            <p className="text-gray-700 text-sm mb-2">
              You can control cookies through:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
              <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies</li>
              <li><strong>Google Analytics Opt-Out:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">Install the opt-out browser extension</a></li>
              <li><strong>Do Not Track:</strong> We respect DNT browser signals</li>
            </ul>
          </section>

          {/* Security */}
          <section id="security">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                Data Security
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your data:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Encryption</h3>
                <p className="text-gray-700 text-sm">
                  TLS/SSL encryption for all data in transit. Database encryption at rest via InstantDB.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Access Controls</h3>
                <p className="text-gray-700 text-sm">
                  Role-based access, admin-only promo code generation (derek.bobola@gmail.com).
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Payment Security</h3>
                <p className="text-gray-700 text-sm">
                  Stripe handles all payment processing (PCI DSS Level 1). We never store card details.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Monitoring</h3>
                <p className="text-gray-700 text-sm">
                  Automated error logging, rate limiting (500 requests/day/IP), abuse detection.
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mt-4 italic text-sm">
              <strong>Important:</strong> No security system is 100% secure. While we strive to protect your data, we cannot guarantee absolute security. Use strong passwords and enable two-factor authentication when available.
            </p>

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mt-4">
              <h3 className="font-semibold text-red-800 mb-2">Data Breach Notification</h3>
              <p className="text-gray-700 text-sm">
                In the event of a data breach affecting your personal information, we will notify you within 72 hours (GDPR requirement) via email and provide details about the breach, affected data, and steps we&apos;re taking to resolve it.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section id="retention">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                Data Retention
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your data for as long as necessary to provide services and comply with legal obligations:
            </p>

            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-800 font-semibold">Account Data (email, name)</span>
                <span className="text-teal-600 font-mono text-sm">Until account deletion</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-800 font-semibold">Uploaded Images</span>
                <span className="text-teal-600 font-mono text-sm">30 days after upload</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-800 font-semibold">Transformed Images</span>
                <span className="text-teal-600 font-mono text-sm">90 days or account deletion</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-800 font-semibold">Showcase Submissions</span>
                <span className="text-teal-600 font-mono text-sm">Indefinitely (public gallery)</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-800 font-semibold">Usage Statistics</span>
                <span className="text-teal-600 font-mono text-sm">2 years (anonymized after 1 year)</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-800 font-semibold">Payment Records</span>
                <span className="text-teal-600 font-mono text-sm">7 years (tax/legal compliance)</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-800 font-semibold">Email Logs</span>
                <span className="text-teal-600 font-mono text-sm">90 days</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-800 font-semibold">Error Logs</span>
                <span className="text-teal-600 font-mono text-sm">30 days</span>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mt-4 text-sm">
              <strong>Automatic Deletion:</strong> Uploaded images are automatically deleted after 30 days. Transformed images in your account are deleted after 90 days or upon account deletion.
            </p>

            <p className="text-gray-700 leading-relaxed text-sm">
              <strong>NSFW Editor:</strong> Images processed through the 18+ editor (/editor-nsfw and /batch-nsfw) are <strong>never stored</strong> and are deleted immediately after processing (ephemeral processing only).
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Courier New, monospace' }}>
              Children&apos;s Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              PicForge is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>18+ Content:</strong> The NSFW editor and batch processor require users to be 18 years or older. By accessing these features, you confirm that you meet this age requirement.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you believe we have inadvertently collected data from a child under 13, please contact us immediately at <a href="mailto:derek.bobola@gmail.com" className="text-teal-600 hover:underline">derek.bobola@gmail.com</a> and we will delete it.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                International Data Transfers
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your data may be transferred to and processed in the United States and other countries where our service providers operate.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>EU/EEA Users:</strong> We rely on Standard Contractual Clauses (SCCs) approved by the European Commission for data transfers outside the EEA. Our service providers (InstantDB, Stripe, Vercel) have implemented appropriate safeguards to protect your data.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using PicForge, you consent to the transfer of your data to countries with different data protection laws than your country of residence.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                Changes to This Policy
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Notification:</strong> Material changes will be communicated via:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              <li>Email notification (for registered users)</li>
              <li>Prominent notice on our website</li>
              <li>Updated &quot;Last Updated&quot; date at the top of this policy</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              <strong>Continued use of PicForge after changes constitutes acceptance of the updated policy.</strong>
            </p>
          </section>

          {/* Contact */}
          <section id="contact">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                Contact Us
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              For privacy-related questions, requests, or concerns, please contact:
            </p>

            <div className="bg-teal-50 border border-teal-200 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">Data Protection Contact</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Name:</strong> Derek Bobola</p>
                <p><strong>Company:</strong> Bobola&apos;s Restaurant / PicForge</p>
                <p><strong>Email:</strong> <a href="mailto:derek@pic-forge.com" className="text-teal-600 hover:underline font-semibold">derek@pic-forge.com</a></p>
                <p><strong>Subject Line:</strong> &quot;Privacy Request - PicForge&quot;</p>
                <p><strong>Location:</strong> Nashua, NH, United States</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mt-4 text-sm">
              <strong>Response Time:</strong> We aim to respond to all privacy inquiries within 2-3 business days, with formal requests processed within 30 days (GDPR) or 45 days (CCPA).
            </p>

            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">EU Representative</h3>
              <p className="text-gray-700 text-sm">
                If you are located in the EU/EEA and need to contact a representative, please email <a href="mailto:derek@pic-forge.com" className="text-teal-600 hover:underline">derek@pic-forge.com</a> with subject &quot;EU Data Protection Inquiry&quot;.
              </p>
            </div>
          </section>

          {/* Complaints */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Courier New, monospace' }}>
              Filing a Complaint
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are not satisfied with how we handle your privacy concerns, you have the right to lodge a complaint with your local data protection authority:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>EU/EEA:</strong> Contact your national data protection authority (list available at <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">edpb.europa.eu</a>)
              </li>
              <li>
                <strong>UK:</strong> Information Commissioner&apos;s Office (ICO) - <a href="https://ico.org.uk" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">ico.org.uk</a>
              </li>
              <li>
                <strong>California:</strong> California Attorney General&apos;s Office - <a href="https://oag.ca.gov/privacy" className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer">oag.ca.gov/privacy</a>
              </li>
            </ul>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/legal/terms" className="text-teal-600 hover:text-teal-800 hover:underline">
              Terms of Service
            </Link>
            <span className="text-gray-400">|</span>
            <Link href="/" className="text-teal-600 hover:text-teal-800 hover:underline">
              Back to Home
            </Link>
            <span className="text-gray-400">|</span>
            <a href="mailto:support@pic-forge.com" className="text-teal-600 hover:text-teal-800 hover:underline">
              Contact Support
            </a>
          </div>
          <p className="text-gray-500 text-xs">
            PicForge is a project by Derek Bobola, owner of Bobola&apos;s Restaurant, Nashua NH
          </p>
        </div>
      </div>
    </div>
  );
}
