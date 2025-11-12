import { NextRequest, NextResponse } from 'next/server'
import { isVIPCode, setVIPCookie } from '@/lib/vipCodes'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'No code provided' },
        { status: 400 }
      )
    }

    if (isVIPCode(code)) {
      // Valid VIP code - set cookie and return success
      const response = NextResponse.json(
        {
          success: true,
          message: 'VIP access activated! You now have unlimited image transformations.'
        },
        { status: 200 }
      )

      // Set VIP cookie for 1 year
      response.headers.set('Set-Cookie', setVIPCookie(code))

      return response
    } else {
      return NextResponse.json(
        { error: 'Invalid VIP code' },
        { status: 401 }
      )
    }
  } catch (error) {
    logger.error('VIP code validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate VIP code' },
      { status: 500 }
    )
  }
}