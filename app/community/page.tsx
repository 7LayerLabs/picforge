'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { db } from '@/lib/instantdb'

type Submission = {
  id: string
  title: string
  description?: string
  prompt: string
  transformedImageUrl: string
  likes: number
  views: number
  featured: boolean
  approved: boolean
  timestamp: number
}

export default function CommunityPage() {
  const [search, setSearch] = useState('')

  // Query approved showcase submissions using InstantDB v0.3+ API
  const { data, isLoading } = db.useQuery({
    showcaseSubmissions: {
      $: {
        where: {
          approved: true,
        },
      },
    },
  } as any)

  const typedData = data as any
  const items = (typedData?.showcaseSubmissions || []) as Submission[]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items
      .filter(i => !q || [i.title, i.description, i.prompt].join(' ').toLowerCase().includes(q))
      .sort((a, b) => Number(b.featured) - Number(a.featured) || b.likes - a.likes || b.timestamp - a.timestamp)
  }, [items, search])

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold">Community Gallery</h1>
          <p className="text-sm text-gray-500">User-submitted images approved by moderators</p>
        </div>
        <div className="flex gap-2">
          <input className="border rounded px-3 py-2 w-64" placeholder="Search..." value={search} onChange={(e)=>setSearch(e.target.value)} />
          <Link href="/community/submit" className="px-3 py-2 rounded bg-teal-600 text-white hover:bg-teal-700">Submit Yours</Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-gray-500">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">No submissions yet.</div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {filtered.map(s => (
            <div key={s.id} className="border rounded-lg overflow-hidden bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.transformedImageUrl} alt={s.title} className="w-full h-48 object-cover" />
              <div className="p-3 space-y-1">
                <div className="text-sm font-medium truncate">{s.title}</div>
                <div className="text-xs text-gray-500 truncate" title={s.prompt}>{s.prompt}</div>
                <div className="text-xs text-gray-500">{s.likes} likes · {s.views} views</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


