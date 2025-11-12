'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'

export default function IdeasPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ideaType: 'feature',
    title: '',
    description: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create mailto link with form data
    const subject = `PicForge - Feature Idea: ${formData.title}`
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nType: ${formData.ideaType}\n\nIdea:\n${formData.description}`
    const mailtoLink = `mailto:ideas@pic-forge.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    window.location.href = mailtoLink
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">💡</div>
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
            Thanks for the idea!
          </h2>
          <p className="text-gray-600 mb-6">
            Your email client should have opened. We love hearing from creators like you. Your idea helps shape the future of PicForge!
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
            <div className="text-6xl mb-4">💡</div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Got a Wild Idea?
            </h1>
            <p className="text-xl text-gray-700 font-bold">
              Features. Templates. Whatever chaos you&apos;re dreaming up. Tell us and we might build it.
            </p>
          </div>

          <div className="bg-teal-100 rounded-xl p-6 mb-8">
            <h3 className="font-heading font-bold text-lg mb-3">Ideas we love:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>💡 New template ideas (styles, themes, effects)</li>
              <li>🎨 Feature requests (tools you wish we had)</li>
              <li>⚡ Workflow improvements (make things faster/easier)</li>
              <li>🔥 Wild ideas that break the rules</li>
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
                  placeholder="Your name"
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

              {/* Idea Type */}
              <div>
                <label htmlFor="ideaType" className="block text-sm font-medium text-gray-700 mb-2">
                  What kind of idea?
                </label>
                <select
                  id="ideaType"
                  value={formData.ideaType}
                  onChange={(e) => setFormData({ ...formData, ideaType: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="feature">✨ New Feature</option>
                  <option value="template">🎨 Template Idea</option>
                  <option value="improvement">⚡ Improvement</option>
                  <option value="other">💭 Something Else</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Idea Title
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., 'Anime Style Template' or 'Batch Export Feature'"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Tell us more
                </label>
                <textarea
                  id="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Describe your idea. What would it do? Why would it be awesome?"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-coral-500 text-white rounded-xl font-semibold hover:bg-coral-600 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Send className="w-5 h-5" />
                Submit Idea
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
