import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const samplesDir = path.join(process.cwd(), 'public', 'samples')

    // Read all category folders
    const categories = fs.readdirSync(samplesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    const sampleImages: Record<string, string[]> = {}

    // Read images from each category folder
    for (const category of categories) {
      const categoryPath = path.join(samplesDir, category)
      const files = fs.readdirSync(categoryPath)
        .filter(file => {
          const ext = path.extname(file).toLowerCase()
          return ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'].includes(ext)
        })
        .map(file => `/samples/${category}/${file}`)

      if (files.length > 0) {
        sampleImages[category] = files
      }
    }

    return NextResponse.json({ sampleImages, categories })
  } catch (error) {
    logger.error('Error reading sample images:', error)
    return NextResponse.json({ sampleImages: {}, categories: [] })
  }
}
