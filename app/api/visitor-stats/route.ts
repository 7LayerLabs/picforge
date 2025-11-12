import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { handleApiError } from '@/lib/apiErrors'

export async function GET() {
  try {
    // Use Vercel KV in production, fallback to mock data for development
    if (process.env.KV_URL) {
      const totalVisits = await kv.get('visitor_count') || 0
      const uniqueIps = await kv.scard('visitor_ips') || 0

      return NextResponse.json({
        totalVisits: Number(totalVisits),
        uniqueVisitors: Number(uniqueIps),
        lastUpdated: new Date().toISOString()
      })
    } else {
      // Development mock data
      return NextResponse.json({
        totalVisits: 42,
        uniqueVisitors: 12,
        lastUpdated: new Date().toISOString()
      })
    }
  } catch (error) {
    return handleApiError(error, {
      route: '/api/visitor-stats',
      method: 'GET',
    })
  }
}