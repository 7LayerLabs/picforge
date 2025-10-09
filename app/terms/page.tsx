import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-gray-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Effective Date: October 1, 2025</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing or using PicForge (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                PicForge is an AI-powered image transformation platform that allows users to edit, enhance, and
                transform images using artificial intelligence technology. The Service includes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Image processing and transformation tools</li>
                <li>AI-powered image generation capabilities</li>
                <li>Batch processing features</li>
                <li>Community showcase for sharing creations</li>
                <li>Cloud storage for processed images (for registered users)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                To access certain features, you may need to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Usage Limits</h2>
              <p className="text-gray-600 mb-4">
                PicForge provides the following usage limits:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Free tier: 20 images per day per IP address</li>
                <li>Pro users ($8/month): Unlimited processing (subject to fair use)</li>
                <li>File size limit: 10MB per image</li>
                <li>Batch processing: Up to 100 images per batch</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Acceptable Use Policy</h2>
              <p className="text-gray-600 mb-4">You agree not to use PicForge to:</p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Upload or process illegal, harmful, or offensive content</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Create deepfakes or misleading content intended to harm others</li>
                <li>Generate NSFW or adult content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to bypass usage limits or security measures</li>
                <li>Use automated scripts or bots without permission</li>
                <li>Resell or redistribute the Service without authorization</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Intellectual Property Rights</h2>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Content</h3>
              <p className="text-gray-600 mb-4">
                You retain all ownership rights to images you upload. By using PicForge, you grant us a
                limited license to process and transform your images as necessary to provide the Service.
              </p>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">Generated Content</h3>
              <p className="text-gray-600 mb-4">
                Images created using our AI tools are yours to use, subject to the following:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>You have the necessary rights to the source images</li>
                <li>You comply with applicable laws and these Terms</li>
                <li>You acknowledge that AI-generated content may be similar to other users&apos; creations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">Our Property</h3>
              <p className="text-gray-600 mb-4">
                The PicForge platform, including its design, features, and technology, remains our exclusive property.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Privacy and Data Protection</h2>
              <p className="text-gray-600 mb-4">
                Your use of PicForge is also governed by our Privacy Policy. We are committed to protecting
                your privacy and handling your data responsibly. We:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Process images locally when possible to protect your privacy</li>
                <li>Do not sell your personal data to third parties</li>
                <li>Delete processed images after 30 days (unless saved to your account)</li>
                <li>Use industry-standard security measures to protect your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Payment Terms (Pro Users)</h2>
              <p className="text-gray-600 mb-4">
                If you subscribe to PicForge Pro:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Payments are processed securely through our payment providers</li>
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>You may cancel anytime, with access until the end of your billing period</li>
                <li>Refunds are available within 14 days of purchase if unused</li>
                <li>Prices may change with 30 days notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-gray-600 mb-4">
                PicForge is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>The Service will be uninterrupted or error-free</li>
                <li>AI-generated results will meet your expectations</li>
                <li>All features will be available at all times</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. User Responsibility for Generated Content</h2>
              <p className="text-gray-600 mb-4">
                You are solely responsible for all content you create, generate, or transform using PicForge. By using our Service, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>You are fully accountable for the content you create and how you use it</li>
                <li>You will not hold PicForge responsible for any content created using our platform</li>
                <li>You assume all legal, ethical, and social responsibility for AI-generated images</li>
                <li>You will ensure all generated content complies with applicable laws and regulations</li>
                <li>You will not use generated content to deceive, defraud, harass, or harm others</li>
                <li>You are responsible for obtaining necessary rights, permissions, or licenses for source images</li>
                <li>You will clearly disclose when content is AI-generated where appropriate or required by law</li>
              </ul>
              <p className="text-gray-600 mb-4 font-semibold">
                PicForge is a tool. Like any tool, it can be used responsibly or irresponsibly. You, the user,
                bear full responsibility for how you choose to use it and what you create with it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                To the maximum extent permitted by law, PicForge and its operators shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages resulting from your use
                or inability to use the Service, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Any content created or generated using PicForge</li>
                <li>How you choose to use, distribute, or display generated content</li>
                <li>Any legal consequences arising from your use of generated content</li>
                <li>Claims by third parties related to content you create</li>
                <li>Misuse or unintended results from AI-generated transformations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Indemnification</h2>
              <p className="text-gray-600 mb-4">
                You agree to indemnify and hold harmless PicForge and its operators from any claims, damages,
                or expenses arising from your use of the Service, content you create, or violation of these Terms.
                This includes any claims related to content you generate using PicForge, regardless of how that
                content is used or distributed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Modifications to Service and Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Modify or discontinue any part of the Service</li>
                <li>Update these Terms at any time</li>
                <li>Change pricing with appropriate notice</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Continued use of PicForge after changes constitutes acceptance of modified Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">14. Termination</h2>
              <p className="text-gray-600 mb-4">
                We may terminate or suspend your access to PicForge immediately, without prior notice, for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Violation of these Terms</li>
                <li>Suspected fraudulent or illegal activity</li>
                <li>Extended periods of inactivity</li>
                <li>Request by law enforcement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">15. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the United States
                and the State of California, without regard to conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">16. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul className="list-none text-gray-600 mb-4">
                <li>Email: legal@picforge.com</li>
                <li>Website: https://picforge.com/contact</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">17. Severability</h2>
              <p className="text-gray-600 mb-4">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall
                be limited or eliminated to the minimum extent necessary, and the remaining provisions shall
                remain in full force and effect.
              </p>
            </section>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong> October 1, 2025<br />
                <strong>Version:</strong> 2.0<br />
                By using PicForge, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}