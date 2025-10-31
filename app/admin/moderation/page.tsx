'use client'

import { useEffect, useMemo, useState } from 'react'
import { db } from '@/lib/instantdb'

type Submission = {
  id: string
  title: string
  prompt: string
  originalImageUrl: string
  transformedImageUrl: string
  approved: boolean
  featured: boolean
  timestamp: number
}

export default function ModerationQueuePage() {
  const [items, setItems] = useState<Submission[]>([])
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending')

  useEffect(() => {
    const sub = db.query('showcaseSubmissions').onSnapshot((res) => {
      setItems((res?.items || []) as any)
    })
    return () => sub?.cancel?.()
  }, [])

  const filtered = useMemo(() => {
    return items.filter(i => filter === 'all' ? true : filter === 'approved' ? i.approved : !i.approved)
  }, [items, filter])

  const approve = async (id: string) => {
    await db.update('showcaseSubmissions', id, { approved: true })
  }
  const reject = async (id: string) => {
    await db.delete('showcaseSubmissions', id)
  }
  const toggleFeatured = async (id: string, featured: boolean) => {
    await db.update('showcaseSubmissions', id, { featured })
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">UGC Moderation</h1>
          <p className="text-sm text-gray-500">Review community submissions</p>
        </div>
        <select className="border rounded px-3 py-2" value={filter} onChange={(e)=>setFilter(e.target.value as any)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="all">All</option>
        </select>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {filtered.map(s => (
          <div key={s.id} className="border rounded-lg overflow-hidden bg-white">
            <div className="grid grid-cols-2 gap-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.originalImageUrl} alt="original" className="w-full h-40 object-cover" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.transformedImageUrl} alt="transformed" className="w-full h-40 object-cover" />
            </div>
            <div className="p-3 space-y-2">
              <div className="text-sm font-medium truncate">{s.title}</div>
              <div className="text-xs text-gray-500 truncate" title={s.prompt}>{s.prompt}</div>
              <div className="flex gap-2">
                {!s.approved && (
                  <button onClick={()=>approve(s.id)} className="px-2 py-1 rounded bg-green-600 text-white text-sm">Approve</button>
                )}
                <button onClick={()=>reject(s.id)} className="px-2 py-1 rounded bg-red-600 text-white text-sm">Reject</button>
                {s.approved && (
                  <button onClick={()=>toggleFeatured(s.id, !s.featured)} className="px-2 py-1 rounded border text-sm">{s.featured ? 'Unfeature' : 'Feature'}</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


