'use client'

import { useEffect, useMemo, useState } from 'react'
import { db } from '@/lib/instantdb'

type Asset = {
  id: string
  title?: string
  url: string
  width: number
  height: number
  categories: string[]
  tags: string[]
  status: 'pending' | 'approved' | 'rejected'
  qualityScore?: number
  rejectionReason?: string
  createdAt: number
}

export default function LibraryModerationPage() {
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [assets, setAssets] = useState<Asset[]>([])

  useEffect(() => {
    const sub = db
      .query('libraryAssets')
      .onSnapshot((res) => {
        const items = (res?.items || []) as any[]
        setAssets(items as unknown as Asset[])
      })
    return () => sub?.cancel?.()
  }, [])

  const filtered = useMemo(() => {
    return assets.filter(a => statusFilter === 'all' ? true : a.status === statusFilter)
  }, [assets, statusFilter])

  const approve = async (id: string) => {
    await db.update('libraryAssets', id, {
      status: 'approved',
      reviewedAt: Date.now(),
    })
  }

  const reject = async (id: string, reason: string) => {
    await db.update('libraryAssets', id, {
      status: 'rejected',
      rejectionReason: reason,
      reviewedAt: Date.now(),
    })
  }

  const setQuality = async (id: string, score: number) => {
    await db.update('libraryAssets', id, { qualityScore: score })
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Library Moderation</h1>
          <p className="text-sm text-gray-500">Review and approve partner submissions</p>
        </div>
        <select className="border rounded px-3 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {filtered.map(a => (
          <div key={a.id} className="border rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.url} alt={a.title || 'asset'} className="w-full h-48 object-cover" />
            <div className="p-3 space-y-2">
              <div className="text-sm font-medium truncate">{a.title || 'Untitled'}</div>
              <div className="text-xs text-gray-500">{a.width}×{a.height} · {a.categories.join(', ')}</div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={a.qualityScore ?? 80}
                  className="w-20 border rounded px-2 py-1 text-sm"
                  onBlur={(e) => setQuality(a.id, Number(e.target.value))}
                  aria-label="Quality score"
                />
                <span className="text-xs text-gray-500">Quality</span>
              </div>
              <div className="flex gap-2">
                {a.status !== 'approved' && (
                  <button onClick={() => approve(a.id)} className="px-2 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700">Approve</button>
                )}
                {a.status !== 'rejected' && (
                  <button
                    onClick={() => {
                      const reason = prompt('Rejection reason?') || 'Does not meet quality standards'
                      reject(a.id, reason)
                    }}
                    className="px-2 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                  >Reject</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


