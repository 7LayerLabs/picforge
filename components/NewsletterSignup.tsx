'use client'

import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setMessage('You are subscribed! Check your inbox soon.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Subscription failed. Please try again.')
    }
  }

  return (
    <div>
      <h4 className="font-heading font-bold text-lg mb-3">Get updates</h4>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 px-3 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-teal-500"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-black font-semibold disabled:opacity-60"
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p className={`mt-2 text-xs ${status === 'error' ? 'text-red-400' : 'text-gray-300'}`}>{message}</p>
      )}
      <p className="mt-2 text-[10px] text-gray-500">No spam. Unsubscribe anytime.</p>
    </div>
  )
}


