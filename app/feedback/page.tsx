'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, ArrowLeft, MessageSquare, Star } from 'lucide-react'

interface FeedbackFormData {
  name: string
  email: string
  category: 'bug' | 'idea' | 'praise' | 'other'
  rating: number
  message: string
}

export default function FeedbackPage() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    email: '',
    category: 'idea',
    rating: 5,
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data?.message || 'Failed to submit feedback')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">
            Thanks for your feedback!
          </h2>
          <p className="text-gray-600 mb-6">
            We read every submission and use it to improve the experience.
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
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">Share your feedback</h1>
              <p className="text-sm text-gray-600">Tell us what you love and what we can improve.</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="px-6 py-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name (optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email (optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as FeedbackFormData['category'] })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="idea">💡 Feature Idea</option>
                  <option value="bug">🐛 Bug Report</option>
                  <option value="praise">🎉 Praise</option>
                  <option value="other">💭 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: n })}
                      className={`p-2 rounded-lg border transition ${formData.rating >= n ? 'bg-yellow-50 border-yellow-300 text-yellow-600' : 'bg-white border-gray-300 text-gray-400'}`}
                      aria-label={`Rate ${n} star${n>1 ? 's' : ''}`}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="What works well? What could be better?"
              />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700 underline">
                Prefer email? Contact us
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all disabled:opacity-60"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'Sending...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


