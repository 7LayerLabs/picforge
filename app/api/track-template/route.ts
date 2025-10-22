import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { Errors, handleApiError } from '@/lib/apiErrors'

// In-memory storage for development
const templateUsage: Record<string, number> = {}

export async function POST(request: NextRequest) {
  try {
    const { templateId, templateName } = await request.json()

    if (!templateId) {
      throw Errors.missingParameter('templateId')
    }

    // Use Vercel KV in production, fallback to in-memory for development
    if (process.env.KV_URL) {
      // Increment template usage count
      await kv.incr(`template_usage_${templateId}`)

      // Track overall template usage
      await kv.incr('template_usage_total')

      // Store recent template usage for trending calculation
      await kv.lpush('recent_template_usage', JSON.stringify({
        templateId,
        templateName,
        timestamp: new Date().toISOString()
      }))

      // Keep only last 1000 template uses
      await kv.ltrim('recent_template_usage', 0, 999)

      const usageCount = await kv.get(`template_usage_${templateId}`) || 0

      return NextResponse.json({
        success: true,
        templateId,
        usageCount: Number(usageCount)
      })
    } else {
      // Development with in-memory storage
      templateUsage[templateId] = (templateUsage[templateId] || 0) + 1

      return NextResponse.json({
        success: true,
        templateId,
        usageCount: templateUsage[templateId]
      })
    }
  } catch (error) {
    return handleApiError(error, {
      route: '/api/track-template',
      method: 'POST',
    })
  }
}

export async function GET() {
  try {
    if (process.env.KV_URL) {
      // Get top templates from production
      const templates = [
        'linkedin-pro',
        'instagram-story',
        'ecommerce-product',
        'dating-profile',
        'realestate-enhancer',
        'passport-photo',
        'food-instagram',
        'fitness-transformation',
        'vintage-filter',
        'anime-style'
      ]

      const usage: Record<string, number> = {}

      for (const templateId of templates) {
        const count = await kv.get(`template_usage_${templateId}`) || 0
        usage[templateId] = Number(count)
      }

      // Sort by usage
      const topTemplates = Object.entries(usage)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, count]) => ({ id, count }))

      return NextResponse.json({
        topTemplates,
        totalUsage: await kv.get('template_usage_total') || 0
      })
    } else {
      // Development response
      const topTemplates = Object.entries(templateUsage)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, count]) => ({ id, count }))

      return NextResponse.json({
        topTemplates,
        totalUsage: Object.values(templateUsage).reduce((a, b) => a + b, 0)
      })
    }
  } catch (error) {
    return handleApiError(error, {
      route: '/api/track-template',
      method: 'GET',
    })
  }
}