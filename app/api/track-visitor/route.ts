import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Simple in-memory storage for development
// In production, you'd use Vercel KV or a database
let visitorData: { count: number; ips: Set<string> } = {
  count: 0,
  ips: new Set()
}

export async function GET(request: NextRequest) {
  try {
    const headersList = headers()

    // Get IP address from various headers (Vercel provides these)
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
               headersList.get('x-real-ip') ||
               headersList.get('cf-connecting-ip') ||
               'unknown'

    // For production with Vercel KV, uncomment and use:
    // const kv = await import('@vercel/kv')
    // const count = await kv.incr('visitor_count')
    // await kv.sadd('visitor_ips', ip)
    // const uniqueIps = await kv.scard('visitor_ips')

    // For now, using in-memory storage
    visitorData.count++
    visitorData.ips.add(ip)

    return NextResponse.json({
      totalVisits: visitorData.count,
      uniqueVisitors: visitorData.ips.size,
      yourIp: ip,
      timestamp: new Date().toISOString()
    })
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
    const headersList = headers()
    const body = await request.json()

    // Get IP and user agent
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
               headersList.get('x-real-ip') ||
               headersList.get('cf-connecting-ip') ||
               'unknown'

    const userAgent = headersList.get('user-agent') || 'unknown'

    // Track the visit
    visitorData.count++
    visitorData.ips.add(ip)

    // Log visit details (in production, save to database)
    console.log('Visit tracked:', {
      ip,
      userAgent,
      page: body.page || '/',
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      totalVisits: visitorData.count,
      uniqueVisitors: visitorData.ips.size
    })
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    )
  }
}