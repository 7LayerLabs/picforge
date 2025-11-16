'use client';

import Link from 'next/link';
import { FileText, AlertTriangle, Crown, Ban, DollarSign, Shield, Scale, Users } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-black border-4 border-brutal-cyan shadow-brutal-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-brutal-cyan" />
            <h1 className="text-4xl font-black uppercase text-brutal-cyan tracking-tight" style={{ fontFamily: 'Courier New, monospace' }}>
              Terms of Service
            </h1>
          </div>
          <p className="text-white text-lg mb-4 font-bold">
            The legal agreement for using PicForge. Read carefully before using our services.
          </p>
          <p className="text-sm text-gray-500">
            <strong>Last Updated:</strong> October 23, 2025
          </p>
          <p className="text-sm text-gray-500">
            <strong>Effective Date:</strong> October 23, 2025
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-black border-4 border-brutal-cyan shadow-brutal p-6 mb-8">
          <h2 className="text-lg font-black uppercase text-brutal-cyan mb-3 tracking-tight" style={{ fontFamily: 'Courier New, monospace' }}>
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <a href="#acceptance" className="text-brutal-cyan hover:text-brutal-pink text-sm font-bold">→ Acceptance of Terms</a>
            <a href="#eligibility" className="text-brutal-cyan hover:text-brutal-pink text-sm font-bold">→ Eligibility</a>
            <a href="#account" className="text-brutal-cyan hover:text-brutal-pink text-sm font-bold">→ Account Management</a>
            <a href="#services" className="text-brutal-cyan hover:text-brutal-pink text-sm font-bold">→ Service Description</a>
            <a href="#acceptable-use" className="text-brutal-cyan hover:text-brutal-pink text-sm font-bold">→ Acceptable Use Policy</a>
            <a href="#content" className="text-brutal-cyan hover:text-brutal-pink text-sm font-bold">→ User Content & Ownership</a>
            <a href="#pricing" className="text-brutal-cyan hover:text-brutal-pink text-sm font-bold">→ Pricing & Payments</a>
            <a href="#intellectual-property" className="text-brutal-cyan hover:text-brutal-pink text-sm font-bold">→ Intellectual Property</a>
            <a href="#termination" className="text-brutal-cyan hover:text-brutal-pink text-sm font-bold">→ Termination</a>
            <a href="#liability" className="text-brutal-cyan hover:text-brutal-pink text-sm font-bold">→ Liability & Disclaimers</a>
            <a href="#disputes" className="text-brutal-cyan hover:text-brutal-pink text-sm font-bold">→ Dispute Resolution</a>
            <a href="#contact" className="text-brutal-cyan hover:text-brutal-pink text-sm font-bold">→ Contact Information</a>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border-4 border-black shadow-brutal-lg p-8 space-y-8">
          {/* Acceptance */}
          <section id="acceptance">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Courier New, monospace' }}>
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to PicForge (&quot;Service&quot;, &quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;, or &quot;your&quot;) and Derek Bobola, operator of PicForge.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>By accessing or using PicForge, you agree to be bound by these Terms.</strong> If you do not agree to these Terms, you must immediately discontinue use of the Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              PicForge is operated by Derek Bobola, owner of Bobola&apos;s Restaurant in Nashua, NH. The Service is provided at <strong>picforge.com</strong>.
            </p>
          </section>

          {/* Eligibility */}
          <section id="eligibility">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                2. Eligibility Requirements
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">Age Requirements</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li><strong>General Use:</strong> You must be at least 13 years old to use PicForge</li>
                  <li><strong>Parental Consent:</strong> Users under 18 must have parental or guardian consent</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Other Requirements</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li>You must provide accurate and complete information during registration</li>
                  <li>You must have the legal capacity to enter into binding contracts</li>
                  <li>You must not be prohibited from using the Service under applicable laws</li>
                  <li>You must comply with all local, state, national, and international laws</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Account Management */}
          <section id="account">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                3. Account Registration & Security
              </h2>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Creation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              PicForge uses <strong>magic link authentication</strong> via InstantDB. You will receive a passwordless login link sent to your email address.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Account Responsibilities</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>You are responsible for maintaining the security of your email account</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized access or security breach</li>
              <li>You may not share your account or login credentials with others</li>
              <li>You may not create multiple accounts to circumvent usage limits</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Account Suspension</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or pose a security risk to the platform.
            </p>
          </section>

          {/* Services */}
          <section id="services">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                4. Service Description
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              PicForge is an AI-powered image transformation platform that provides the following features:
            </p>

            <div className="space-y-3">
              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="font-semibold text-gray-800">Single Image Editor</h3>
                <p className="text-gray-700 text-sm">
                  AI-powered image editing with 272+ prompts, custom prompts, and Lock Composition feature
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800">Batch Processor</h3>
                <p className="text-gray-700 text-sm">
                  Process 100+ images simultaneously with bulk operations and 21 client-side effects
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800">AI Canvas</h3>
                <p className="text-gray-700 text-sm">
                  Generate images from text descriptions using DALL-E and alternative AI providers
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800">Gamification Features</h3>
                <p className="text-gray-700 text-sm">
                  Transform Roulette (320 prompts), Roast Mode (3 intensity levels), Prompt Wizard
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">Resource Library</h3>
                <p className="text-gray-700 text-sm">
                  325+ categorized prompts, templates gallery (110+ examples), tips & tricks, favorites system
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="font-semibold text-gray-800">Showcase Gallery</h3>
                <p className="text-gray-700 text-sm">
                  User-submitted transformations with voting, likes, and featured submissions
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-6">
              <h3 className="font-semibold text-blue-900 mb-2">Service Availability</h3>
              <p className="text-gray-700 text-sm">
                We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. Scheduled maintenance will be announced in advance. We reserve the right to modify, suspend, or discontinue any feature at any time without liability.
              </p>
            </div>
          </section>

          {/* Acceptable Use */}
          <section id="acceptable-use">
            <div className="flex items-center gap-2 mb-4">
              <Ban className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                5. Acceptable Use Policy
              </h2>
            </div>

            <div className="bg-red-50 border border-red-300 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-red-900 mb-2">Prohibited Activities</h3>
              <p className="text-gray-700 text-sm mb-2">
                You agree <strong>NOT</strong> to use PicForge for any of the following purposes:
              </p>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-800">Illegal Content</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li>Child sexual abuse material (CSAM) or exploitation imagery</li>
                  <li>Content depicting illegal activities or promoting violence</li>
                  <li>Content that violates intellectual property rights (unauthorized copyrighted images)</li>
                  <li>Content that violates privacy rights (non-consensual intimate images)</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-800">Harmful Content</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li>Content promoting hate speech, discrimination, or harassment</li>
                  <li>Content glorifying self-harm or suicide</li>
                  <li>Content used for doxxing or stalking</li>
                  <li>Deepfakes or manipulated media intended to deceive or harm</li>
                </ul>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-gray-800">Platform Abuse</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li>Attempting to bypass rate limits (500 requests/day/IP)</li>
                  <li>Creating multiple accounts to evade usage restrictions</li>
                  <li>Reverse engineering, scraping, or unauthorized API access</li>
                  <li>Uploading malware, viruses, or malicious code</li>
                  <li>Automated/bot-driven usage without permission</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800">Commercial Restrictions</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li>Reselling PicForge services without authorization</li>
                  <li>Using images for commercial purposes without appropriate licensing</li>
                  <li>Competing directly with PicForge using our infrastructure</li>
                </ul>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mt-6 font-semibold">
              Violation of this Acceptable Use Policy may result in immediate account suspension or termination without refund.
            </p>
          </section>

          {/* User Content */}
          <section id="content">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                6. User Content & Ownership
              </h2>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>You retain all ownership rights</strong> to the images you upload to PicForge. You grant us a limited, non-exclusive, royalty-free license to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              <li>Store and process your images for the purpose of providing the Service</li>
              <li>Use AI models (Gemini, Replicate, DALL-E) to transform your images</li>
              <li>Display your images back to you in the Creative Journey gallery</li>
              <li>Temporarily cache images for performance optimization</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Transformed Images</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>You own the transformed images</strong> created using PicForge. However, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              <li>AI-generated transformations may have limitations on copyright protection under current law</li>
              <li>You are responsible for ensuring you have rights to the original image</li>
              <li>You are responsible for complying with AI provider terms (Gemini, Replicate, OpenAI)</li>
              <li>Free tier images include a &quot;PicForge.com&quot; watermark</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Showcase Submissions</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              By submitting images to the public Showcase gallery, you grant PicForge a <strong>perpetual, worldwide, royalty-free license</strong> to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              <li>Display your submission publicly on picforge.com</li>
              <li>Feature your submission in marketing materials, social media, and promotional content</li>
              <li>Allow other users to view, like, and vote on your submission</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              <strong>You retain ownership</strong> of your submissions and can request removal at any time by contacting derek.bobola@gmail.com.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Content Representations</h3>
            <p className="text-gray-700 leading-relaxed">
              By uploading content, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>You own or have the necessary rights to upload and transform the images</li>
              <li>Your content does not infringe on any third-party intellectual property rights</li>
              <li>Your content complies with all applicable laws and these Terms</li>
              <li>You have obtained necessary consents from any individuals depicted in images</li>
            </ul>
          </section>

          {/* Pricing */}
          <section id="pricing">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                7. Pricing, Payments & Refunds
              </h2>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Tiers</h3>
            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-1">Free Tier</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li><strong>Daily Limit:</strong> 20 images per day (resets every 24 hours)</li>
                  <li><strong>Watermark:</strong> &quot;PicForge.com&quot; watermark on transformed images</li>
                  <li><strong>Features:</strong> Full access to all features except unlimited usage</li>
                  <li><strong>Cost:</strong> Free</li>
                </ul>
              </div>

              <div className="bg-teal-50 p-4 rounded-lg border border-teal-300">
                <h4 className="font-semibold text-teal-800 mb-1">Pro Tier</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li><strong>Daily Limit:</strong> Unlimited images</li>
                  <li><strong>Watermark:</strong> No watermark</li>
                  <li><strong>Features:</strong> Full access to all features</li>
                  <li><strong>Cost:</strong> Subscription-based (pricing available at /pricing)</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-300">
                <h4 className="font-semibold text-purple-800 mb-1">Unlimited Tier (Promo Codes)</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li><strong>Daily Limit:</strong> Unlimited images</li>
                  <li><strong>Watermark:</strong> No watermark</li>
                  <li><strong>Features:</strong> Full access to all features</li>
                  <li><strong>Access:</strong> One-time promo code redemption (non-transferable)</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Payment Processing</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>All payments are processed securely through <strong>Stripe</strong></li>
              <li>We accept major credit cards (Visa, Mastercard, American Express, Discover)</li>
              <li>Payment information is encrypted and never stored on PicForge servers</li>
              <li>Subscriptions auto-renew unless canceled before the renewal date</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Promo Codes</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Promo codes are <strong>one-time use only</strong> and non-transferable</li>
              <li>Promo codes cannot be redeemed for cash or combined with other offers</li>
              <li>We reserve the right to void fraudulent or duplicated promo codes</li>
              <li>Unlimited tier access via promo codes is perpetual (no expiration)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Refund Policy</h3>
            <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
              <p className="text-gray-700 text-sm mb-2">
                <strong>Digital Services:</strong> Due to the nature of digital services, we generally do not offer refunds. However, we may consider refunds on a case-by-case basis for:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                <li>Technical issues preventing service access (documented and unresolved within 7 days)</li>
                <li>Accidental duplicate charges (refunded automatically)</li>
                <li>Service not as described (within 14 days of purchase)</li>
              </ul>
              <p className="text-gray-700 text-sm mt-3">
                To request a refund, contact <a href="mailto:derek.bobola@gmail.com" className="text-teal-600 hover:underline">derek.bobola@gmail.com</a> with your order details within 30 days of purchase.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Price Changes</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify pricing at any time. Active subscriptions will maintain their current pricing until the next renewal period. You will be notified of price changes at least 30 days in advance.
            </p>
          </section>

          {/* Intellectual Property */}
          <section id="intellectual-property">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                8. Intellectual Property Rights
              </h2>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">PicForge Intellectual Property</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All rights, title, and interest in PicForge (including but not limited to software, design, logos, branding, prompts library, and algorithms) are owned by Derek Bobola and protected by copyright, trademark, and intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>PicForge</strong> and the PicForge logo are trademarks of Derek Bobola. You may not use these marks without prior written permission.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">License to Use Service</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and use PicForge for personal or internal business purposes, subject to these Terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">DMCA & Copyright Infringement</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). If you believe your copyrighted work has been infringed:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 text-sm mb-2">
                <strong>Send a DMCA notice to:</strong> derek.bobola@gmail.com
              </p>
              <p className="text-gray-700 text-sm mb-2">
                <strong>Include:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                <li>Description of the copyrighted work claimed to be infringed</li>
                <li>URL or location of the infringing material on PicForge</li>
                <li>Your contact information (name, email, phone number)</li>
                <li>Statement of good faith belief that use is unauthorized</li>
                <li>Statement that the information is accurate and you are the copyright owner or authorized representative</li>
                <li>Physical or electronic signature</li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              We will investigate and remove infringing content within 48 hours of receiving a valid DMCA notice. Repeat infringers will have their accounts terminated.
            </p>
          </section>

          {/* Termination */}
          <section id="termination">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                9. Termination & Account Deletion
              </h2>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Termination by You</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may terminate your account at any time by:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              <li>Emailing <a href="mailto:derek.bobola@gmail.com" className="text-teal-600 hover:underline">derek.bobola@gmail.com</a> with subject &quot;Account Deletion Request&quot;</li>
              <li>Including your registered email address in the request</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              Upon account deletion:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              <li>All personal data will be deleted within 30 days (except as required for legal compliance)</li>
              <li>Uploaded images and transformed images will be permanently deleted</li>
              <li>Showcase submissions will remain unless you request removal</li>
              <li>Active subscriptions will be canceled (no refund for remaining subscription period)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Termination by PicForge</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to suspend or terminate your account immediately, without notice, for:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              <li>Violation of these Terms or Acceptable Use Policy</li>
              <li>Illegal activity or fraudulent behavior</li>
              <li>Abuse of the Service or excessive API usage</li>
              <li>Chargeback or payment disputes</li>
              <li>Any conduct that harms PicForge or other users</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              <strong>No refunds will be provided for terminated accounts.</strong>
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Effect of Termination</h3>
            <p className="text-gray-700 leading-relaxed">
              Upon termination, your right to use the Service immediately ceases. All provisions of these Terms that by their nature should survive termination (including ownership, disclaimers, indemnity, and liability limitations) will survive.
            </p>
          </section>

          {/* Liability */}
          <section id="liability">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                10. Disclaimers & Limitation of Liability
              </h2>
            </div>

            <div className="bg-red-50 border border-red-300 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-red-900 mb-2">Service Provided &quot;AS IS&quot;</h3>
              <p className="text-gray-700 text-sm">
                PicForge is provided <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, title, or non-infringement.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">No Guarantees</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              <li>The Service will be uninterrupted, secure, or error-free</li>
              <li>AI transformations will meet your expectations or be of acceptable quality</li>
              <li>Images will be preserved indefinitely (see data retention policy)</li>
              <li>Third-party APIs (Gemini, Replicate, OpenAI) will always be available</li>
              <li>Showcase submissions will receive engagement or recognition</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">AI-Generated Content Disclaimer</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              AI-generated and AI-transformed images may contain unexpected results, artifacts, or inaccuracies. You acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
              <li>AI models may produce unpredictable or unintended outputs</li>
              <li>PicForge is not responsible for the quality or accuracy of AI transformations</li>
              <li>You should review all AI-generated content before using it publicly or commercially</li>
              <li>AI models may be biased or produce inappropriate content despite our safety measures</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Limitation of Liability</h3>
            <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg mb-4">
              <p className="text-gray-700 text-sm mb-2">
                <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                <li>PicForge and Derek Bobola shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
                <li>This includes damages for loss of profits, revenue, data, use, goodwill, or other intangible losses</li>
                <li>Our total liability shall not exceed the amount you paid to PicForge in the 12 months preceding the claim</li>
                <li>For free tier users, our total liability shall not exceed $100</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Indemnification</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to indemnify, defend, and hold harmless PicForge, Derek Bobola, and our affiliates from any claims, liabilities, damages, losses, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Your use or misuse of the Service</li>
              <li>Your violation of these Terms or applicable laws</li>
              <li>Your content or any infringement of third-party rights</li>
              <li>Your use of AI-generated images in a manner that causes harm or violates rights</li>
            </ul>
          </section>

          {/* Disputes */}
          <section id="disputes">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                11. Dispute Resolution
              </h2>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Governing Law</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms are governed by and construed in accordance with the laws of the <strong>State of New Hampshire, United States</strong>, without regard to conflict of law principles.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Informal Resolution</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Before filing any formal legal action, you agree to first contact us at <a href="mailto:derek.bobola@gmail.com" className="text-teal-600 hover:underline">derek.bobola@gmail.com</a> to attempt to resolve the dispute informally. We will make a good faith effort to resolve disputes within 30 days.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Arbitration Agreement</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <p className="text-gray-700 text-sm mb-2">
                If informal resolution fails, you agree that any disputes arising from these Terms or the Service will be resolved through <strong>binding arbitration</strong> rather than in court, except that:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                <li>You may assert claims in small claims court if they qualify</li>
                <li>We may seek injunctive relief in court for intellectual property infringement</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Class Action Waiver</h3>
            <p className="text-gray-700 leading-relaxed">
              You agree to resolve disputes with PicForge on an individual basis only. <strong>You waive the right to participate in class actions, class arbitrations, or representative proceedings.</strong>
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Jurisdiction</h3>
            <p className="text-gray-700 leading-relaxed">
              Any legal action that is not subject to arbitration shall be brought exclusively in the state or federal courts located in <strong>Hillsborough County, New Hampshire</strong>. You consent to personal jurisdiction in these courts.
            </p>
          </section>

          {/* Miscellaneous */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Courier New, monospace' }}>
              12. Miscellaneous Provisions
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Changes to Terms</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time. Material changes will be communicated via email and/or a prominent notice on the Service. Continued use after changes constitutes acceptance of the updated Terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Severability</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Waiver</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              No waiver of any provision of these Terms shall be deemed a further or continuing waiver of such provision or any other provision. Our failure to enforce any right or provision shall not constitute a waiver.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Entire Agreement</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and PicForge regarding the Service and supersede all prior agreements and understandings.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Assignment</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may not assign or transfer these Terms or your account without our prior written consent. We may assign these Terms to any affiliate or successor without restriction.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Force Majeure</h3>
            <p className="text-gray-700 leading-relaxed">
              PicForge shall not be liable for any failure to perform due to circumstances beyond our reasonable control, including acts of God, war, terrorism, natural disasters, pandemic, or third-party service outages.
            </p>
          </section>

          {/* Contact */}
          <section id="contact">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-teal-500" />
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Courier New, monospace' }}>
                13. Contact Information
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about these Terms or the Service, contact us at:
            </p>

            <div className="bg-teal-50 border border-teal-200 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-3">PicForge Support</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Name:</strong> Derek Bobola</p>
                <p><strong>Company:</strong> Bobola&apos;s Restaurant / PicForge</p>
                <p><strong>Email:</strong> <a href="mailto:derek@pic-forge.com" className="text-teal-600 hover:underline font-semibold">derek@pic-forge.com</a></p>
                <p><strong>Website:</strong> <a href="https://picforge.com" className="text-teal-600 hover:underline">picforge.com</a></p>
                <p><strong>Location:</strong> Nashua, NH, United States</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
              <p className="text-gray-700 text-sm">
                <strong>Business Hours:</strong> We respond to inquiries Monday-Friday, 9am-5pm EST. Emergency security issues are addressed within 24 hours.
              </p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section>
            <div className="bg-gray-900 text-white p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-3" style={{ fontFamily: 'Courier New, monospace' }}>
                Acknowledgment
              </h3>
              <p className="text-gray-300 mb-3">
                BY USING PICFORGE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
              </p>
              <p className="text-gray-300">
                If you do not agree to these Terms, you must immediately discontinue use of the Service.
              </p>
            </div>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/legal/privacy" className="text-brutal-cyan hover:text-brutal-pink hover:underline font-bold">
              Privacy Policy
            </Link>
            <span className="text-gray-400">|</span>
            <Link href="/" className="text-brutal-cyan hover:text-brutal-pink hover:underline font-bold">
              Back to Home
            </Link>
            <span className="text-gray-400">|</span>
            <a href="mailto:support@pic-forge.com" className="text-brutal-cyan hover:text-brutal-pink hover:underline font-bold">
              Contact Support
            </a>
          </div>
          <p className="text-gray-600 text-xs font-bold">
            PicForge is a project by Derek Bobola, owner of Bobola&apos;s Restaurant, Nashua NH
          </p>
        </div>
      </div>
    </div>
  );
}
