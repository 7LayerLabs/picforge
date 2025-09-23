import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { kv } from '@vercel/kv'

// Simple in-memory storage for development
const visitorData: { count: number; ips: Set<string> } = {
  count: 0,
  ips: new Set()
}

export async function GET() {
  try {
    const headersList = await headers()

    // Get IP address from various headers (Vercel provides these)
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
               headersList.get('x-real-ip') ||
               headersList.get('cf-connecting-ip') ||
               'unknown'

    // Use Vercel KV in production, fallback to in-memory for development
    if (process.env.KV_URL) {
      // Production with Vercel KV
      const count = await kv.incr('visitor_count')
      await kv.sadd('visitor_ips', ip)
      const uniqueIps = await kv.scard('visitor_ips')

      return NextResponse.json({
        totalVisits: count,
        uniqueVisitors: uniqueIps,
        yourIp: ip,
        timestamp: new Date().toISOString()
      })
    } else {
      // Development with in-memory storage
      visitorData.count++
      visitorData.ips.add(ip)

      return NextResponse.json({
        totalVisits: visitorData.count,
        uniqueVisitors: visitorData.ips.size,
        yourIp: ip,
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers()
    const body = await request.json()

    // Get IP and user agent
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
               headersList.get('x-real-ip') ||
               headersList.get('cf-connecting-ip') ||
               'unknown'

    const userAgent = headersList.get('user-agent') || 'unknown'

    // Log visit details
    console.log('Visit tracked:', {
      ip,
      userAgent,
      page: body.page || '/',
      timestamp: new Date().toISOString()
    })

    // Use Vercel KV in production, fallback to in-memory for development
    if (process.env.KV_URL) {
      // Production with Vercel KV
      const count = await kv.incr('visitor_count')
      await kv.sadd('visitor_ips', ip)
      const uniqueIps = await kv.scard('visitor_ips')

      // Store visit details
      await kv.lpush('recent_visits', JSON.stringify({
        ip,
        userAgent,
        page: body.page || '/',
        timestamp: new Date().toISOString()
      }))

      // Keep only last 100 visits
      await kv.ltrim('recent_visits', 0, 99)

      return NextResponse.json({
        success: true,
        totalVisits: count,
        uniqueVisitors: uniqueIps
      })
    } else {
      // Development with in-memory storage
      visitorData.count++
      visitorData.ips.add(ip)

      return NextResponse.json({
        success: true,
        totalVisits: visitorData.count,
        uniqueVisitors: visitorData.ips.size
      })
    }
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    )
  }
}