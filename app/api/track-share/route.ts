import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

// In-memory storage for development
const shareData = {
  total: 0,
  twitter: 0,
  instagram: 0,
  tiktok: 0,
  download: 0
}

export async function POST(request: NextRequest) {
  try {
    const { platform } = await request.json()

    // Use Vercel KV in production, fallback to in-memory for development
    if (process.env.KV_URL) {
      // Increment total shares
      await kv.incr('share_count_total')

      // Increment platform-specific count
      if (platform) {
        await kv.incr(`share_count_${platform}`)
      }

      // Track share timestamp for viral coefficient calculation
      await kv.lpush('recent_shares', JSON.stringify({
        platform,
        timestamp: new Date().toISOString()
      }))

      // Keep only last 1000 shares for analysis
      await kv.ltrim('recent_shares', 0, 999)

      const total = await kv.get('share_count_total') || 0

      return NextResponse.json({
        success: true,
        totalShares: Number(total),
        platform
      })
    } else {
      // Development with in-memory storage
      shareData.total++
      if (platform && platform in shareData) {
        shareData[platform as keyof typeof shareData]++
      }

      return NextResponse.json({
        success: true,
        totalShares: shareData.total,
        platform
      })
    }
  } catch (error) {
    console.error('Error tracking share:', error)
    return NextResponse.json(
      { error: 'Failed to track share' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    if (process.env.KV_URL) {
      const total = await kv.get('share_count_total') || 0
      const twitter = await kv.get('share_count_twitter') || 0
      const instagram = await kv.get('share_count_instagram') || 0
      const tiktok = await kv.get('share_count_tiktok') || 0
      const download = await kv.get('share_count_download') || 0

      return NextResponse.json({
        total: Number(total),
        twitter: Number(twitter),
        instagram: Number(instagram),
        tiktok: Number(tiktok),
        download: Number(download)
      })
    } else {
      return NextResponse.json(shareData)
    }
  } catch (error) {
    console.error('Error fetching share stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch share stats' },
      { status: 500 }
    )
  }
}