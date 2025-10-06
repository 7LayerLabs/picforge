import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, UserCheck, AlertTriangle } from 'lucide-react'

export default function PrivacyPage() {
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
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-500 mb-8">Effective Date: October 1, 2025</p>

          {/* Privacy Commitment Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Privacy Commitment</h2>
            <p className="text-gray-700">
              At PicForge, we believe your images and data belong to you. We process images locally whenever possible,
              minimize data collection, and never sell your personal information. This policy explains how we protect
              your privacy while delivering powerful AI image transformation tools.
            </p>
          </div>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-gray-800 m-0">1. Information We Collect</h2>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">Information You Provide</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Account Information:</strong> Email address, name, and profile picture (when using Google Sign-In)</li>
                <li><strong>Images:</strong> Photos you upload for processing</li>
                <li><strong>Prompts & Settings:</strong> Text prompts and transformation settings you use</li>
                <li><strong>Showcase Content:</strong> Images and descriptions you choose to share publicly</li>
                <li><strong>Payment Information:</strong> Processed securely by our payment providers (we don't store card details)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">Information Collected Automatically</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Usage Data:</strong> Features used, processing frequency, and error logs</li>
                <li><strong>Device Information:</strong> Browser type, operating system, screen resolution</li>
                <li><strong>IP Address:</strong> Used for rate limiting and abuse prevention</li>
                <li><strong>Cookies:</strong> Session management and preferences (essential cookies only)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">Information We DON'T Collect</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Tracking cookies or advertising identifiers</li>
                <li>Location data (beyond general region from IP)</li>
                <li>Biometric data or facial recognition profiles</li>
                <li>Contact lists or social media connections</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-gray-800 m-0">2. How We Use Your Information</h2>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">Primary Uses</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Service Delivery:</strong> Process and transform your images as requested</li>
                <li><strong>Account Management:</strong> Maintain your account, history, and preferences</li>
                <li><strong>Communication:</strong> Send service updates, respond to support requests</li>
                <li><strong>Improvement:</strong> Analyze usage patterns to enhance features and fix bugs</li>
                <li><strong>Security:</strong> Prevent abuse, fraud, and unauthorized access</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">AI Processing</h3>
              <p className="text-gray-600 mb-4">
                When you use our AI features:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Images are processed using Google Gemini, OpenAI, or local processing</li>
                <li>We don't use your images to train AI models</li>
                <li>Prompts may be logged for quality improvement (anonymized after 30 days)</li>
                <li>Processed images are deleted from our servers after 30 days unless saved to your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-gray-800 m-0">3. Data Storage and Security</h2>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">Where Your Data Lives</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Local Processing:</strong> Many features run entirely in your browser</li>
                <li><strong>Temporary Storage:</strong> Images in processing queue (deleted after completion)</li>
                <li><strong>Account Data:</strong> Stored securely on Supabase (PostgreSQL database)</li>
                <li><strong>CDN Cache:</strong> Processed images cached for performance (30-day retention)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">Security Measures</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>End-to-end encryption for data transmission (HTTPS/TLS)</li>
                <li>Encrypted database storage</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Rate limiting to prevent abuse</li>
                <li>No storage of payment card details</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-gray-800 m-0">4. Information Sharing</h2>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">We Share Data Only When:</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>You Explicitly Share:</strong> Posting to the community showcase</li>
                <li><strong>Service Providers:</strong> AI processing (Gemini, OpenAI), hosting (Vercel), database (Supabase)</li>
                <li><strong>Legal Requirements:</strong> Court orders, law enforcement requests (we'll notify you when possible)</li>
                <li><strong>Safety:</strong> To prevent harm, fraud, or security threats</li>
                <li><strong>Business Transfer:</strong> If PicForge is acquired (with notice to users)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">We NEVER:</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Sell your personal information</li>
                <li>Share images without your permission</li>
                <li>Use your content for advertising</li>
                <li>Allow third-party tracking</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-gray-800 m-0">5. Your Rights and Controls</h2>
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">You Have the Right To:</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li><strong>Access:</strong> Download your data and processing history</li>
                <li><strong>Correction:</strong> Update incorrect information</li>
                <li><strong>Deletion:</strong> Request account and data deletion</li>
                <li><strong>Portability:</strong> Export your data in standard formats</li>
                <li><strong>Object:</strong> Opt-out of certain data uses</li>
                <li><strong>Restrict:</strong> Limit how we process your data</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">Privacy Controls</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Delete individual images from history</li>
                <li>Clear all processing history</li>
                <li>Make showcase submissions private</li>
                <li>Disable account features while keeping data</li>
                <li>Export all data before deletion</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                PicForge uses only essential cookies for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Session management (keeping you logged in)</li>
                <li>Security tokens (CSRF protection)</li>
                <li>User preferences (theme, settings)</li>
                <li>Rate limiting (preventing abuse)</li>
              </ul>
              <p className="text-gray-600 mb-4">
                We do NOT use advertising cookies, analytics trackers, or third-party cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                PicForge is not intended for children under 13. We do not knowingly collect personal
                information from children. If you believe a child has provided us with personal information,
                please contact us immediately for removal.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-600 mb-4">
                Your data may be processed in the United States where our servers are located. We ensure
                appropriate safeguards are in place for international transfers, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Standard contractual clauses with service providers</li>
                <li>Encryption for all data transfers</li>
                <li>Compliance with GDPR and CCPA requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Data Retention</h2>
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Data Type</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Uploaded images (not saved)</td>
                    <td className="border border-gray-200 px-4 py-2">24 hours</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Processed images (not saved)</td>
                    <td className="border border-gray-200 px-4 py-2">30 days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Saved images (user account)</td>
                    <td className="border border-gray-200 px-4 py-2">Until deleted by user</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Account information</td>
                    <td className="border border-gray-200 px-4 py-2">Until account deletion</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Usage logs</td>
                    <td className="border border-gray-200 px-4 py-2">90 days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2">Payment records</td>
                    <td className="border border-gray-200 px-4 py-2">7 years (legal requirement)</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-semibold text-gray-800 m-0">10. Privacy Policy Changes</h2>
              </div>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy to reflect changes in our practices or legal requirements.
                We will notify you of significant changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Email notification to registered users</li>
                <li>Prominent notice on our website</li>
                <li>In-app notification</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Continued use after changes indicates acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. California Privacy Rights (CCPA)</h2>
              <p className="text-gray-600 mb-4">
                California residents have additional rights under the CCPA:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Right to know what personal information is collected</li>
                <li>Right to know if personal information is sold (we don't sell data)</li>
                <li>Right to opt-out of sale (not applicable as we don't sell data)</li>
                <li>Right to deletion</li>
                <li>Right to non-discrimination for exercising privacy rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. European Privacy Rights (GDPR)</h2>
              <p className="text-gray-600 mb-4">
                If you're in the European Economic Area, you have rights under GDPR including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Legal basis disclosure (we process based on consent and legitimate interests)</li>
                <li>Data protection officer contact (privacy@picforge.com)</li>
                <li>Right to lodge complaints with supervisory authorities</li>
                <li>Automated decision-making disclosure (AI processing with human oversight)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                For privacy concerns, questions, or to exercise your rights, contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@picforge.com<br />
                  <strong>Data Protection Officer:</strong> dpo@picforge.com<br />
                  <strong>Mailing Address:</strong><br />
                  PicForge Privacy Team<br />
                  123 AI Boulevard<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
              </div>
            </section>

            <div className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Privacy at a Glance</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ We process images locally when possible</li>
                <li>✓ We never sell your personal data</li>
                <li>✓ You own your images and creations</li>
                <li>✓ We delete temporary data automatically</li>
                <li>✓ You can delete your account and data anytime</li>
                <li>✓ We use only essential cookies</li>
                <li>✓ We comply with GDPR and CCPA</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Last Updated:</strong> October 1, 2025<br />
                <strong>Version:</strong> 2.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}