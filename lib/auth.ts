import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function saveImageToHistory(
  userId: string,
  prompt: string,
  originalUrl: string,
  processedUrl?: string,
  template?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings?: any
) {
  try {
    const image = await prisma.processedImage.create({
      data: {
        userId,
        prompt,
        originalUrl,
        processedUrl,
        template,
        settings: settings || {}
      }
    })
    return image
  } catch (error) {
    console.error('Error saving image to history:', error)
    return null
  }
}

export async function getUserImages(userId: string, limit = 50) {
  try {
    const images = await prisma.processedImage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        favorites: true
      }
    })
    return images
  } catch (error) {
    console.error('Error fetching user images:', error)
    return []
  }
}

export async function toggleFavorite(userId: string, imageId: string) {
  try {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_imageId: {
          userId,
          imageId
        }
      }
    })

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      })
      return { favorited: false }
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          imageId
        }
      })
      return { favorited: true }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return { favorited: false, error: true }
  }
}

export async function getUserFavorites(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        image: true
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return favorites.map((f: any) => f.image)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return []
  }
}

export async function getUserCredits(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, isPro: true }
    })
    return user || { credits: 500, isPro: false }
  } catch (error) {
    console.error('Error fetching user credits:', error)
    return { credits: 500, isPro: false }
  }
}

export async function updateUserCredits(userId: string, amount: number) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: amount
        }
      }
    })
    return user
  } catch (error) {
    console.error('Error updating user credits:', error)
    return null
  }
}