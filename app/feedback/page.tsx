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
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-black border-4 border-brutal-cyan shadow-brutal-lg p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-heading text-3xl font-black uppercase text-brutal-cyan mb-3 tracking-tight">
            Thanks for your feedback!
          </h2>
          <p className="text-white mb-6 font-bold">
            We read every submission and use it to improve the experience.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-pink transition-all shadow-brutal"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-black border-4 border-brutal-cyan shadow-brutal-lg overflow-hidden">
          <div className="px-6 py-6 border-b-4 border-brutal-cyan flex items-center gap-3">
            <div className="p-2 bg-brutal-cyan text-black border-4 border-black">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-black uppercase text-brutal-cyan tracking-tight">Share your feedback</h1>
              <p className="text-sm text-white font-bold">Tell us what you love and what we can improve.</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="px-6 py-6">
            {error && (
              <div className="mb-4 p-3 bg-brutal-pink border-4 border-black text-black text-sm font-black shadow-brutal">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-black uppercase text-brutal-cyan mb-2">
                  Name (optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border-4 border-brutal-cyan text-white focus:border-brutal-pink outline-none transition-all placeholder-gray-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-black uppercase text-brutal-cyan mb-2">
                  Email (optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border-4 border-brutal-cyan text-white focus:border-brutal-pink outline-none transition-all placeholder-gray-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-black uppercase text-brutal-cyan mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as FeedbackFormData['category'] })}
                  className="w-full px-4 py-3 bg-gray-900 border-4 border-brutal-cyan text-white focus:border-brutal-pink outline-none transition-all font-bold"
                >
                  <option value="idea">💡 Feature Idea</option>
                  <option value="bug">🐛 Bug Report</option>
                  <option value="praise">🎉 Praise</option>
                  <option value="other">💭 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-black uppercase text-brutal-cyan mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1,2,3,4,5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: n })}
                      className={`p-2 border-4 transition ${formData.rating >= n ? 'bg-brutal-yellow border-black text-black' : 'bg-gray-900 border-brutal-cyan text-gray-500'}`}
                      aria-label={`Rate ${n} star${n>1 ? 's' : ''}`}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="block text-sm font-black uppercase text-brutal-cyan mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900 border-4 border-brutal-cyan text-white focus:border-brutal-pink outline-none transition-all resize-none placeholder-gray-500"
                placeholder="What works well? What could be better?"
              />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <Link href="/contact" className="text-sm text-brutal-cyan hover:text-brutal-pink font-bold uppercase">
                Prefer email? Contact us
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-pink transition-all disabled:opacity-60 shadow-brutal"
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


