import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { handleApiError } from '@/lib/apiErrors'

// In-memory storage for development
const shareData = {
  total: 0,
  twitter: 0,
  instagram: 0,
  'instagram-story': 0,
  tiktok: 0,
  facebook: 0,
  download: 0
}

export async function POST(request: NextRequest) {
  try {
    const { platform, userId, earnedBonus, timestamp } = await request.json()

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
        userId: userId || 'anonymous',
        timestamp: timestamp || new Date().toISOString(),
        earnedBonus: earnedBonus || false
      }))

      // Keep only last 1000 shares for analysis
      await kv.ltrim('recent_shares', 0, 999)

      // Track share bonus if applicable
      if (earnedBonus && userId) {
        await kv.set(`share_bonus_${userId}`, {
          timestamp: timestamp || new Date().toISOString(),
          platform,
          bonusAmount: 5
        }, {
          ex: 86400 * 30 // 30 days expiration
        })

        // Increment bonus redemptions counter
        await kv.incr('share_bonus_total')
      }

      const total = await kv.get('share_count_total') || 0

      return NextResponse.json({
        success: true,
        totalShares: Number(total),
        platform,
        bonusGranted: earnedBonus || false
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
        platform,
        bonusGranted: earnedBonus || false
      })
    }
  } catch (error) {
    return handleApiError(error, {
      route: '/api/track-share',
      method: 'POST',
    })
  }
}

export async function GET() {
  try {
    if (process.env.KV_URL) {
      const total = await kv.get('share_count_total') || 0
      const twitter = await kv.get('share_count_twitter') || 0
      const instagram = await kv.get('share_count_instagram') || 0
      const instagramStory = await kv.get('share_count_instagram-story') || 0
      const tiktok = await kv.get('share_count_tiktok') || 0
      const facebook = await kv.get('share_count_facebook') || 0
      const download = await kv.get('share_count_download') || 0
      const bonusTotal = await kv.get('share_bonus_total') || 0

      return NextResponse.json({
        total: Number(total),
        twitter: Number(twitter),
        instagram: Number(instagram),
        'instagram-story': Number(instagramStory),
        tiktok: Number(tiktok),
        facebook: Number(facebook),
        download: Number(download),
        bonuses_granted: Number(bonusTotal)
      })
    } else {
      return NextResponse.json(shareData)
    }
  } catch (error) {
    return handleApiError(error, {
      route: '/api/track-share',
      method: 'GET',
    })
  }
}