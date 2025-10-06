import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// GET - Fetch showcase items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sort = searchParams.get('sort') || 'recent' // recent, popular, featured
    const style = searchParams.get('style') || 'all'

    const skip = (page - 1) * limit

    // Build query conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      approved: true
    }

    if (style !== 'all') {
      where.style = style
    }

    // Build order by
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: 'desc' }
    if (sort === 'popular') {
      orderBy = { likes: 'desc' }
    } else if (sort === 'featured') {
      where.featured = true
    }

    // Fetch showcases with user info
    const showcases = await prisma.showcase.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        likedBy: {
          select: {
            userId: true
          }
        }
      }
    })

    // Get total count for pagination
    const total = await prisma.showcase.count({ where })

    // Get current user's likes if authenticated
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Format response
    const formattedShowcases = showcases.map(showcase => ({
      ...showcase,
      isLiked: userId ? showcase.likedBy.some(like => like.userId === userId) : false,
      likedBy: undefined // Remove raw likedBy data from response
    }))

    return NextResponse.json({
      showcases: formattedShowcases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching showcases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch showcases' },
      { status: 500 }
    )
  }
}

// POST - Create new showcase entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to submit to showcase' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, prompt, originalImage, resultImage, style } = body

    // Validate required fields
    if (!title || !prompt || !originalImage || !resultImage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create showcase entry
    const showcase = await prisma.showcase.create({
      data: {
        userId: session.user.id,
        title,
        description: description || null,
        prompt,
        originalImage,
        resultImage,
        style: style || 'general'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      showcase
    })
  } catch (error) {
    console.error('Error creating showcase:', error)
    return NextResponse.json(
      { error: 'Failed to create showcase entry' },
      { status: 500 }
    )
  }
}