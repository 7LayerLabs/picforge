'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Send } from 'lucide-react'

export default function ShowcaseSubmitPage() {
  const { status } = useSession()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prompt: '',
    style: 'general'
  })
  const [originalImage, setOriginalImage] = useState<string>('')
  const [resultImage, setResultImage] = useState<string>('')

  // Get images from sessionStorage if coming from editor
  useEffect(() => {
    const storedOriginal = sessionStorage.getItem('showcaseOriginal')
    const storedResult = sessionStorage.getItem('showcaseResult')
    const storedPrompt = sessionStorage.getItem('showcasePrompt')

    if (storedOriginal) {
      setOriginalImage(storedOriginal)
      sessionStorage.removeItem('showcaseOriginal')
    }
    if (storedResult) {
      setResultImage(storedResult)
      sessionStorage.removeItem('showcaseResult')
    }
    if (storedPrompt) {
      setFormData(prev => ({ ...prev, prompt: storedPrompt }))
      sessionStorage.removeItem('showcasePrompt')
    }
  }, [])

  // Redirect if not signed in
  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  // Handle image upload
  const handleImageUpload = (file: File, type: 'original' | 'result') => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      if (type === 'original') {
        setOriginalImage(base64)
      } else {
        setResultImage(base64)
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!originalImage || !resultImage || !formData.title || !formData.prompt) {
      alert('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/showcase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          originalImage,
          resultImage
        })
      })

      if (res.ok) {
        router.push('/showcase')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to submit')
      }
    } catch (error) {
      console.error('Error submitting:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/showcase"
          className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Showcase
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
            Submit to Showcase
          </h1>
          <p className="text-gray-600 mb-8">
            Share your amazing transformation with the community
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="Give your creation a catchy title"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Tell us more about your creation"
                rows={3}
                maxLength={500}
              />
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt Used <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Share the exact prompt you used"
                rows={3}
              />
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style Category
              </label>
              <select
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              >
                <option value="general">General</option>
                <option value="anime">Anime</option>
                <option value="realistic">Realistic</option>
                <option value="artistic">Artistic</option>
                <option value="cartoon">Cartoon</option>
                <option value="3d">3D Render</option>
                <option value="abstract">Abstract</option>
              </select>
            </div>

            {/* Images */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Image <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {originalImage ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setOriginalImage('')}
                        className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="block aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file, 'original')
                        }}
                      />
                      <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <Upload className="w-8 h-8 mb-2" />
                        <p className="text-sm">Upload original image</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Result Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transformed Image <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {resultImage ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={resultImage}
                        alt="Result"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setResultImage('')}
                        className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="block aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file, 'result')
                        }}
                      />
                      <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <Upload className="w-8 h-8 mb-2" />
                        <p className="text-sm">Upload transformed image</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit to Showcase
                  </>
                )}
              </button>

              <Link
                href="/showcase"
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </Link>
            </div>
          </form>

          {/* Tips */}
          <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-purple-50 rounded-xl">
            <h3 className="font-semibold text-sm mb-2">Tips for a great submission:</h3>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• Use high-quality images that clearly show the transformation</li>
              <li>• Share the exact prompt so others can learn and experiment</li>
              <li>• Choose the right style category to help others find similar work</li>
              <li>• Add a description to explain your creative process</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}