'use client'

import { useState } from 'react'
import { db } from '@/lib/instantdb'

export default function CommunitySubmitPage() {
  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) {
      setMessage('Please attach an image.')
      return
    }
    setSubmitting(true)
    setMessage(null)
    try {
      // For simplicity, store as data URL; replace with CDN upload in production
      const arrayBuffer = await imageFile.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      const dataUrl = `data:${imageFile.type};base64,${base64}`

      await db.insert('showcaseSubmissions', {
        title: title || 'Untitled',
        description: '',
        prompt,
        originalImageUrl: dataUrl,
        transformedImageUrl: dataUrl,
        likes: 0,
        views: 0,
        featured: false,
        approved: false,
        timestamp: Date.now(),
      })
      setMessage('Submitted! It will appear after moderation.')
      setTitle('')
      setPrompt('')
      setImageFile(null)
      ;(document.getElementById('file-input') as HTMLInputElement)?.value && ((document.getElementById('file-input') as HTMLInputElement).value = '')
    } catch (err: any) {
      setMessage(err?.message || 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Submit to Community</h1>
      <p className="text-sm text-gray-500 mb-6">Share your best results. Submissions are reviewed for quality and relevance.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input className="w-full border rounded px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Prompt</label>
          <textarea className="w-full border rounded px-3 py-2" rows={4} value={prompt} onChange={e=>setPrompt(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input id="file-input" type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0] || null)} required />
          <p className="text-xs text-gray-500 mt-1">Max 10MB. High-resolution preferred.</p>
        </div>
        <button disabled={submitting} className="px-4 py-2 rounded bg-teal-600 text-white disabled:opacity-50">{submitting ? 'Submitting…' : 'Submit'}</button>
      </form>

      {message && <div className="mt-4 text-sm">{message}</div>}

      <div className="mt-8 text-xs text-gray-500 space-y-1">
        <div>Guidelines:</div>
        <ul className="list-disc ml-6 space-y-1">
          <li>Only upload content you own rights to share.</li>
          <li>No adult, violent, or hateful content.</li>
          <li>Prefer 2048px+ on the longest side and low compression.</li>
          <li>Clear, descriptive titles and prompts help other users.</li>
        </ul>
      </div>
    </div>
  )
}


