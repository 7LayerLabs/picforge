import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { handleApiError } from '@/lib/apiErrors'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const normalized = String(email).trim().toLowerCase()

    // Store subscription in KV
    const key = `newsletter:sub:${normalized}`
    const exists = await kv.exists(key)
    if (!exists) {
      await kv.hset(key, {
        email: normalized,
        subscribedAt: new Date().toISOString()
      })
      await kv.sadd('newsletter:subs:set', normalized)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, { route: '/api/newsletter', method: 'POST' })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    const normalized = String(email).trim().toLowerCase()
    const key = `newsletter:sub:${normalized}`
    await kv.del(key)
    await kv.srem('newsletter:subs:set', normalized)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, { route: '/api/newsletter', method: 'DELETE' })
  }
}


