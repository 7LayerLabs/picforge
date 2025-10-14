import { NextResponse } from 'next/server'

// NextAuth has been replaced with InstantDB for authentication
// This route is disabled to prevent errors
export async function GET() {
  return NextResponse.json(
    { error: 'NextAuth is disabled. Using InstantDB for authentication.' },
    { status: 404 }
  )
}

export async function POST() {
  return NextResponse.json(
    { error: 'NextAuth is disabled. Using InstantDB for authentication.' },
    { status: 404 }
  )
}