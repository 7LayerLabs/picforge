import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Enforce HTTPS in production
// Note: www -> apex redirect is handled in next.config.ts
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || url.hostname

  // Get actual protocol from Vercel header (NOT url.protocol which is always http internally)
  const proto = request.headers.get('x-forwarded-proto') || 'http'

  // Skip redirects in development
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1') || hostname.includes('10.1.10.')
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (isLocalhost || isDevelopment) {
    return NextResponse.next()
  }

  // Only enforce HTTPS (domain redirect handled by next.config.ts)
  if (proto !== 'https') {
    url.protocol = 'https:'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}


