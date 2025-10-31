import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Enforce HTTPS and strip www in non-Vercel local/proxy environments.
export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const proto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol

  // Force HTTPS (but NOT in development on localhost)
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('10.1.10.')
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (!isLocalhost && !isDevelopment && proto !== 'https:' && proto !== 'https') {
    const url = new URL(request.url)
    url.protocol = 'https:'
    return NextResponse.redirect(url, 308)
  }

  // Redirect www -> apex
  if (host.startsWith('www.')) {
    const url = new URL(request.url)
    url.hostname = host.replace(/^www\./, '')
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}


