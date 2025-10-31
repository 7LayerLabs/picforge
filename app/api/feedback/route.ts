import { NextRequest, NextResponse } from 'next/server'
import { Errors, handleApiError } from '@/lib/apiErrors'
import { isEnvVarConfigured } from '@/lib/validateEnv'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    if (!isEnvVarConfigured('RESEND_API_KEY')) {
      throw Errors.apiKeyMissing('Resend email service')
    }

    const body = await request.json()
    const { name, email, category, rating, message } = body || {}

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      throw Errors.invalidInput('Feedback message is required (min 5 characters)')
    }

    const safeName = typeof name === 'string' ? name.trim().slice(0, 120) : ''
    const safeEmail = typeof email === 'string' ? email.trim().slice(0, 160) : ''
    const safeCategory = ['bug', 'idea', 'praise', 'other'].includes(category) ? category : 'other'
    const safeRating = Number.isFinite(Number(rating)) ? Math.max(1, Math.min(5, Number(rating))) : 5
    const safeMessage = String(message).trim().slice(0, 5000)

    const to = process.env.FEEDBACK_TO_EMAIL || 'support@pic-forge.com'

    const result = await sendEmail({
      to,
      // cast after we extend EmailType to include 'feedback'
      // @ts-ignore
      type: 'feedback',
      data: {
        name: safeName,
        email: safeEmail,
        category: safeCategory,
        rating: safeRating,
        message: safeMessage,
        submittedAt: new Date().toISOString(),
        userAgent: request.headers.get('user-agent') || '',
        ip: request.headers.get('x-forwarded-for') || '',
      },
    })

    if (!result.success) {
      throw Errors.externalServiceError('Resend email service', String(result.error))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, {
      route: '/api/feedback',
      method: 'POST',
    })
  }
}


