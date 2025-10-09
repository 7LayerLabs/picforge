'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Send } from 'lucide-react'

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    template: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create mailto link with form data
    const subject = 'PicForge - Submit My Creation'
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nTemplate Used: ${formData.template}\n\nDescription:\n${formData.description}\n\nPlease attach your before/after images to this email!`
    const mailtoLink = `mailto:submissions@pic-forge.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    window.location.href = mailtoLink
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
            Almost there!
          </h2>
          <p className="text-gray-600 mb-6">
            Your email client should have opened. Please attach your before/after images and hit send. We can&apos;t wait to see what you created!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-6 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-teal-600 font-medium hover:bg-teal-50 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto mt-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎨</div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Show Off Your Work
            </h1>
            <p className="text-xl text-gray-700 font-bold">
              Made something sick? Weird? Epic? Share it and inspire the chaos.
            </p>
          </div>

          <div className="bg-teal-100 rounded-xl p-6 mb-8">
            <h3 className="font-heading font-bold text-lg mb-3">What we&apos;re looking for:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✅ Before & after images</li>
              <li>✅ Clear description of what you created</li>
              <li>✅ Template/prompt you used</li>
              <li>✅ Cool, weird, or inspiring transformations</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  placeholder="How should we credit you?"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {/* Template */}
              <div>
                <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
                  Template/Prompt Used
                </label>
                <input
                  type="text"
                  id="template"
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., 'American Comic Book' or custom prompt"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Tell us about your creation. What did you transform? Why is it cool?"
                />
              </div>

              {/* Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Upload className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <strong>Next step:</strong> After clicking submit, your email will open. Don&apos;t forget to attach your before and after images!
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Send className="w-5 h-5" />
                Submit Your Creation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
