'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Heart, Eye, Copy, TrendingUp, Clock, Award, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ShowcaseItem {
  id: string
  title: string
  description: string | null
  prompt: string
  originalImage: string
  resultImage: string
  style: string | null
  likes: number
  views: number
  featured: boolean
  createdAt: string
  isLiked: boolean
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

export default function ShowcasePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showcases, setShowcases] = useState<ShowcaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<'recent' | 'popular' | 'featured'>('popular')
  const [style, setStyle] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedShowcase, setSelectedShowcase] = useState<ShowcaseItem | null>(null)

  // Fetch showcases
  const fetchShowcases = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sort,
        style
      })

      const res = await fetch(`/api/showcase?${params}`)
      const data = await res.json()

      if (data.showcases) {
        setShowcases(data.showcases)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching showcases:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShowcases()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, style, page])

  // Handle like/unlike
  const handleLike = async (showcaseId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    // Authentication disabled - likes not available
    if (!session) {
      // Show toast notification that likes require sign-in
      const toast = document.createElement('div')
      toast.className = 'fixed bottom-4 right-4 bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in'
      toast.textContent = 'Sign-in feature coming soon!'
      document.body.appendChild(toast)
      setTimeout(() => toast.remove(), 2000)
      return
    }

    try {
      const res = await fetch(`/api/showcase/${showcaseId}/like`, {
        method: 'POST'
      })

      if (res.ok) {
        const data = await res.json()
        setShowcases(prev => prev.map(item =>
          item.id === showcaseId
            ? { ...item, isLiked: data.liked, likes: item.likes + (data.liked ? 1 : -1) }
            : item
        ))
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  // Copy prompt to clipboard
  const copyPrompt = (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(prompt)

    // Show toast notification
    const toast = document.createElement('div')
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in'
    toast.textContent = 'Prompt copied!'
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
  }

  // Try this prompt - redirect to editor with prompt
  const tryPrompt = (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // Store prompt in sessionStorage
    sessionStorage.setItem('tryPrompt', prompt)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
                Community Showcase
              </h1>
              <p className="text-gray-600">
                Discover amazing transformations created by our community
              </p>
            </div>

            {session && (
              <Link
                href="/showcase/submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                Submit Your Work
              </Link>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            {/* Sort buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSort('popular')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  sort === 'popular'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Popular
              </button>
              <button
                onClick={() => setSort('recent')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  sort === 'recent'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                Recent
              </button>
              <button
                onClick={() => setSort('featured')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  sort === 'featured'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Award className="w-4 h-4" />
                Featured
              </button>
            </div>

            {/* Style filter */}
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Styles</option>
              <option value="anime">Anime</option>
              <option value="realistic">Realistic</option>
              <option value="artistic">Artistic</option>
              <option value="cartoon">Cartoon</option>
              <option value="3d">3D Render</option>
              <option value="abstract">Abstract</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : showcases.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No showcases yet</h2>
            <p className="text-gray-600 mb-6">Be the first to share your amazing creation!</p>
            {session && (
              <Link
                href="/showcase/submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                Submit Your Work
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {showcases.map((showcase) => (
              <div
                key={showcase.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setSelectedShowcase(showcase)}
              >
                {/* Image with before/after hover effect */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={showcase.resultImage}
                    alt={showcase.title}
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-0"
                  />
                  <img
                    src={showcase.originalImage}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Hover text */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded-full">
                      Hover to see original
                    </span>
                  </div>

                  {/* Featured badge */}
                  {showcase.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {showcase.title}
                  </h3>

                  {/* User info */}
                  <div className="flex items-center gap-2 mb-3">
                    {showcase.user.image ? (
                      <img
                        src={showcase.user.image}
                        alt={showcase.user.name || 'User'}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                        {showcase.user.name?.[0] || 'U'}
                      </div>
                    )}
                    <span className="text-sm text-gray-600 line-clamp-1">
                      {showcase.user.name || 'Anonymous'}
                    </span>
                  </div>

                  {/* Stats and actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleLike(showcase.id, e)}
                        className={`flex items-center gap-1 transition-colors ${
                          showcase.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${showcase.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm">{showcase.likes}</span>
                      </button>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{showcase.views}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => copyPrompt(showcase.prompt, e)}
                      className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
                      title="Copy prompt"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    page === i + 1
                      ? 'bg-orange-500 text-white'
                      : 'bg-white shadow-lg hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedShowcase && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedShowcase(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="font-heading text-2xl font-bold mb-4">{selectedShowcase.title}</h2>

              {/* Images comparison */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Original</p>
                  <img
                    src={selectedShowcase.originalImage}
                    alt="Original"
                    className="w-full rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Transformed</p>
                  <img
                    src={selectedShowcase.resultImage}
                    alt="Result"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>

              {/* Prompt */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-600 mb-2">Prompt Used:</p>
                <p className="text-gray-900 mb-3">{selectedShowcase.prompt}</p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => copyPrompt(selectedShowcase.prompt, e)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Prompt
                  </button>
                  <button
                    onClick={(e) => tryPrompt(selectedShowcase.prompt, e)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    Try This Prompt
                  </button>
                </div>
              </div>

              {/* Description */}
              {selectedShowcase.description && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-600 mb-2">Description:</p>
                  <p className="text-gray-900">{selectedShowcase.description}</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedShowcase.user.image ? (
                    <img
                      src={selectedShowcase.user.image}
                      alt={selectedShowcase.user.name || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                      {selectedShowcase.user.name?.[0] || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{selectedShowcase.user.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedShowcase.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedShowcase(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}