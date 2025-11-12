'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { db } from '@/lib/instantdb'

type LibraryAsset = {
  id: string
  title?: string
  description?: string
  categories: string[]
  tags: string[]
  url: string
  width: number
  height: number
  dominantColor?: string
  qualityScore?: number
  downloads: number
  views: number
}

export default function LibraryPage() {
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')

  // Query approved library assets using InstantDB v0.3+ API
  const { data, isLoading } = db.useQuery({
    libraryAssets: {
      $: {
        where: {
          status: 'approved',
        },
      },
    },
  } as any)

  const typedData = data as any
  const assets = (typedData?.libraryAssets || []) as LibraryAsset[]

  const categories = useMemo(() => {
    const set = new Set<string>()
    assets.forEach(a => a.categories?.forEach(c => set.add(c)))
    return ['all', ...Array.from(set).sort()]
  }, [assets])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return assets
      .filter(a => category === 'all' || a.categories?.includes(category))
      .filter(a => !q || [a.title, a.description, ...(a.tags||[])].join(' ').toLowerCase().includes(q))
      .sort((a,b) => (b.qualityScore ?? 0) - (a.qualityScore ?? 0))
  }, [assets, category, search])

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Curated Image Library</h1>
          <p className="text-sm text-gray-500">High-resolution, diverse images vetted for quality</p>
        </div>
        <div className="flex gap-2">
          <input
            className="border rounded-md px-3 py-2 w-64"
            placeholder="Search tags, titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border rounded-md px-3 py-2"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
            ))}
          </select>
          <Link href="/library/submit" className="px-3 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700">Contribute</Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-500">Loading library...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">No images match your filters.</div>
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
        >
          {filtered.map((a) => (
            <div key={a.id} className="rounded-lg overflow-hidden border bg-white">
              <div className="relative" style={{ background: a.dominantColor || '#f3f4f6' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.url}
                  alt={a.title || 'Library image'}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                {typeof a.qualityScore === 'number' && (
                  <div className="absolute top-2 left-2 text-xs bg-black/70 text-white rounded px-2 py-0.5">
                    Q{Math.round(a.qualityScore)}
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col gap-2">
                <div className="text-sm font-medium truncate" title={a.title}>{a.title || 'Untitled'}</div>
                <div className="text-xs text-gray-500 truncate" title={a.description}>{a.description || ''}</div>
                <div className="flex flex-wrap gap-1">
                  {(a.tags || []).slice(0, 5).map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full">{t}</span>
                  ))}
                </div>
                <div className="text-xs text-gray-500">{a.width}×{a.height}</div>
                <div className="flex justify-between items-center pt-2">
                  <a
                    href={a.url}
                    download
                    className="text-sm px-2 py-1 border rounded hover:bg-gray-50"
                  >Download</a>
                  <span className="text-xs text-gray-500">{a.views} views · {a.downloads} dl</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


