import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    REPLICATE_API_TOKEN: !!process.env.REPLICATE_API_TOKEN,
    NEXT_PUBLIC_INSTANT_APP_ID: !!process.env.NEXT_PUBLIC_INSTANT_APP_ID,
    KV_URL: !!process.env.KV_URL,
    KV_REST_API_URL: !!process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    KV_REST_API_READ_ONLY_TOKEN: !!process.env.KV_REST_API_READ_ONLY_TOKEN,
  }

  const missing = Object.entries(envCheck)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    envCheck,
    missing,
    status: missing.length === 0 ? 'All environment variables set ✅' : `Missing ${missing.length} variables ❌`
  })
}
