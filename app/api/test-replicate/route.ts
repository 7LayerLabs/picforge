import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const hasToken = !!process.env.REPLICATE_API_TOKEN
  const tokenPrefix = process.env.REPLICATE_API_TOKEN?.substring(0, 10)

  return NextResponse.json({
    hasToken,
    tokenPrefix,
    message: hasToken ? 'Replicate token is configured' : 'Replicate token is MISSING'
  })
}
