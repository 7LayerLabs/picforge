/**
 * @deprecated This API route is deprecated as of 2025-10-21 (Issue #12)
 *
 * MIGRATION COMPLETE:
 * - Frontend now uses InstantDB directly via db.transact()
 * - See app/showcase/page.tsx handleLike function for new implementation
 * - This file is kept for rollback safety only
 *
 * DO NOT USE THIS ROUTE FOR NEW FEATURES
 *
 * ROLLBACK: If needed, uncomment the Prisma implementation below
 */

import { NextResponse } from 'next/server'
// Kept for rollback - see commented code below
// import { NextRequest } from 'next/server'
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from '@/lib/auth-options'
// import { prisma } from '@/lib/prisma'

// POST - Like/Unlike a showcase entry (DEPRECATED - frontend uses InstantDB directly)
export async function POST() {
  // Return deprecation notice
  return NextResponse.json({
    error: 'This API route is deprecated. Frontend now uses InstantDB directly.',
    migration: 'See app/showcase/page.tsx handleLike function for new implementation'
  }, { status: 410 }) // 410 Gone

  /* LEGACY PRISMA IMPLEMENTATION (kept for rollback):
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to like' },
        { status: 401 }
      )
    }

    const { id: showcaseId } = await params
    const userId = session.user.id

    // Check if already liked
    const existingLike = await prisma.showcaseLike.findUnique({
      where: {
        userId_showcaseId: {
          userId,
          showcaseId
        }
      }
    })

    if (existingLike) {
      // Unlike - remove like and decrement counter
      await prisma.$transaction([
        prisma.showcaseLike.delete({
          where: {
            id: existingLike.id
          }
        }),
        prisma.showcase.update({
          where: { id: showcaseId },
          data: { likes: { decrement: 1 } }
        })
      ])

      return NextResponse.json({
        success: true,
        liked: false,
        message: 'Showcase unliked'
      })
    } else {
      // Like - add like and increment counter
      await prisma.$transaction([
        prisma.showcaseLike.create({
          data: {
            userId,
            showcaseId
          }
        }),
        prisma.showcase.update({
          where: { id: showcaseId },
          data: { likes: { increment: 1 } }
        })
      ])

      return NextResponse.json({
        success: true,
        liked: true,
        message: 'Showcase liked'
      })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
  */
}