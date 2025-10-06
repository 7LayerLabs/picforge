import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// POST - Like/Unlike a showcase entry
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
}