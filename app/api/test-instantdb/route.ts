import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID

    if (!APP_ID) {
      return NextResponse.json({
        status: 'error',
        message: 'NEXT_PUBLIC_INSTANT_APP_ID is not set',
        appId: null
      })
    }

    // Try to make a simple request to InstantDB
    const response = await fetch(`https://api.instantdb.com/runtime/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'app-id': APP_ID,
        query: { users: {} }
      })
    })

    const data = await response.json()

    return NextResponse.json({
      status: response.ok ? 'success' : 'error',
      statusCode: response.status,
      appId: APP_ID.substring(0, 8) + '...',
      response: data
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID?.substring(0, 8) + '...'
    })
  }
}
