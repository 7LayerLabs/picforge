# Error Handling Usage Examples

## Copy-Paste Examples for Common Scenarios

### Basic API Route

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 100, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    // Parse and validate request
    const { data } = await request.json()

    if (!data) {
      throw Errors.missingParameter('data')
    }

    // Process request
    const result = await processData(data)

    // Return success
    return NextResponse.json({
      success: true,
      data: result,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    })

  } catch (error) {
    return handleApiError(error, {
      route: '/api/example',
      method: 'POST',
    })
  }
}
```

### API Route with Authentication

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Errors, handleApiError } from '@/lib/apiErrors'
import { getServerSession } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession()

    if (!session) {
      throw Errors.unauthorized('Please sign in to continue')
    }

    // Check authorization
    if (session.user.role !== 'admin') {
      throw Errors.forbidden('Admin access required')
    }

    // Process request
    const result = await doAdminThing()

    return NextResponse.json({
      success: true,
      data: result,
    })

  } catch (error) {
    return handleApiError(error, {
      route: '/api/admin',
      method: 'POST',
      userId: session?.user?.id,
    })
  }
}
```

### Image Processing Route

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimit = await checkRateLimitKv(identifier, 500, 24 * 60 * 60 * 1000)

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit)
    }

    // Parse request
    const { image, prompt } = await request.json()

    // Validate image
    if (!image) {
      throw Errors.missingParameter('image')
    }

    // Check image size (example: 10MB limit)
    const imageSize = image.length * 0.75 // Rough base64 size
    if (imageSize > 10 * 1024 * 1024) {
      throw Errors.imageTooLarge('10MB')
    }

    // Validate prompt
    if (!prompt) {
      throw Errors.missingParameter('prompt')
    }

    // Process image
    try {
      const result = await processImage(image, prompt)

      return NextResponse.json({
        success: true,
        generatedImage: result.imageUrl,
        analysis: result.analysis,
        metadata: {
          timestamp: new Date().toISOString(),
          processingTime: result.processingTime,
        },
      })
    } catch (processingError) {
      throw Errors.imageProcessingFailed(
        processingError instanceof Error ? processingError.message : 'Unknown error'
      )
    }

  } catch (error) {
    return handleApiError(error, {
      route: '/api/process',
      method: 'POST',
    })
  }
}
```

### External API Integration

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Errors, handleApiError, createRateLimitResponse } from '@/lib/apiErrors'
import { requireEnvVar } from '@/lib/validateEnv'

export async function POST(request: NextRequest) {
  try {
    // Check API key
    const apiKey = requireEnvVar('EXTERNAL_API_KEY', 'External service')

    // Parse request
    const { prompt } = await request.json()

    if (!prompt) {
      throw Errors.missingParameter('prompt')
    }

    // Call external API
    const response = await fetch('https://api.example.com/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    })

    // Handle external API errors
    if (!response.ok) {
      const errorText = await response.text()

      // Check for specific error types
      if (response.status === 429) {
        throw Errors.quotaExceeded('External API')
      }

      if (response.status === 401 || response.status === 403) {
        throw Errors.apiKeyInvalid('External API')
      }

      if (response.status >= 500) {
        throw Errors.externalServiceError('External API', errorText)
      }

      throw Errors.externalServiceError('External API', `${response.status}: ${errorText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data,
    })

  } catch (error) {
    return handleApiError(error, {
      route: '/api/external',
      method: 'POST',
    })
  }
}
```

### File Upload Route

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Errors, handleApiError } from '@/lib/apiErrors'

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      throw Errors.missingParameter('file')
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw Errors.imageTooLarge('10MB')
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw Errors.unsupportedFormat(file.type)
    }

    // Process file
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Do something with file...
    const result = await processFile(buffer)

    return NextResponse.json({
      success: true,
      data: result,
    })

  } catch (error) {
    return handleApiError(error, {
      route: '/api/upload',
      method: 'POST',
    })
  }
}
```

### Database Operation Route

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Errors, handleApiError } from '@/lib/apiErrors'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get ID from URL
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      throw Errors.missingParameter('id')
    }

    // Query database
    const item = await db.items.findUnique({
      where: { id },
    })

    if (!item) {
      throw Errors.notFound('Item')
    }

    return NextResponse.json({
      success: true,
      data: item,
    })

  } catch (error) {
    return handleApiError(error, {
      route: '/api/items',
      method: 'GET',
    })
  }
}
```

### Webhook Route

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Errors, handleApiError } from '@/lib/apiErrors'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature
    const signature = request.headers.get('x-webhook-signature')

    if (!signature) {
      throw Errors.unauthorized('Missing webhook signature')
    }

    const body = await request.text()
    const expectedSignature = crypto
      .createHmac('sha256', process.env.WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      throw Errors.unauthorized('Invalid webhook signature')
    }

    // Process webhook
    const event = JSON.parse(body)
    await handleWebhookEvent(event)

    return NextResponse.json({ received: true })

  } catch (error) {
    return handleApiError(error, {
      route: '/api/webhooks',
      method: 'POST',
    })
  }
}
```

## Frontend Examples

### React Hook with Error Handling

```typescript
'use client'

import { useState } from 'react'
import { getErrorMessage, isRateLimitError, handleClientError } from '@/lib/clientApiError'
import { ApiErrorResponse } from '@/lib/apiTypes'

export function useApiCall() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const callApi = async (endpoint: string, body: any) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        const apiError = data as ApiErrorResponse

        // Handle specific error types
        if (isRateLimitError(apiError)) {
          setError('Daily limit reached! Upgrade to Pro for unlimited access.')
          return null
        }

        // Get user-friendly message
        const { message, action } = handleClientError(apiError)
        setError(message)

        // Handle suggested actions
        if (action === 'signin') {
          // Redirect to sign in
          window.location.href = '/signin'
        } else if (action === 'upgrade') {
          // Show upgrade modal
        }

        return null
      }

      setData(data)
      return data

    } catch (err) {
      setError('Network error. Please check your connection.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { callApi, loading, error, data }
}

// Usage
function MyComponent() {
  const { callApi, loading, error } = useApiCall()

  const handleSubmit = async () => {
    const result = await callApi('/api/process-image', {
      image: imageData,
      prompt: 'turn into a painting',
    })

    if (result) {
      console.log('Success:', result)
    }
  }

  return (
    <div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
```

### Toast Notification Example

```typescript
'use client'

import { formatErrorForToast } from '@/lib/clientApiError'
import { useToast } from '@/components/ui/use-toast'

export function ImageProcessor() {
  const { toast } = useToast()

  const processImage = async (image: string, prompt: string) => {
    try {
      const response = await fetch('/api/process-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Show error toast
        const { title, description, variant } = formatErrorForToast(data)
        toast({ title, description, variant })
        return
      }

      // Show success toast
      toast({
        title: 'Success!',
        description: 'Your image has been transformed.',
      })

      return data

    } catch (error) {
      // Network error toast
      const { title, description, variant } = formatErrorForToast(error)
      toast({ title, description, variant })
    }
  }

  return (
    <button onClick={() => processImage(myImage, myPrompt)}>
      Process Image
    </button>
  )
}
```

### Error Boundary Example

```typescript
'use client'

import { Component, ReactNode } from 'react'
import { logError } from '@/lib/errorLogger'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log to error logging service
    logError(error, {
      componentStack: errorInfo.componentStack,
      route: window.location.pathname,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage in layout
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

### Retry Logic Example

```typescript
import { handleClientError } from '@/lib/clientApiError'

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: any

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options)

      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response
      }

      // Don't retry successful responses
      if (response.ok) {
        return response
      }

      // Retry server errors (5xx)
      const data = await response.json()
      const { isRetryable } = handleClientError(data)

      if (!isRetryable) {
        return response
      }

      lastError = data

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))

    } catch (error) {
      lastError = error

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }

  throw new Error(`Failed after ${maxRetries} retries: ${lastError}`)
}

// Usage
const response = await fetchWithRetry('/api/process-image', {
  method: 'POST',
  body: JSON.stringify({ image, prompt }),
})
```

## Testing Examples

### API Route Test

```typescript
import { POST } from '@/app/api/example/route'
import { NextRequest } from 'next/server'

describe('POST /api/example', () => {
  it('returns error for missing parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/example', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.code).toBe('MISSING_PARAMETER')
    expect(data.error).toContain('data')
    expect(data.requestId).toBeDefined()
    expect(data.timestamp).toBeDefined()
  })

  it('returns success for valid request', async () => {
    const request = new NextRequest('http://localhost:3000/api/example', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.metadata.timestamp).toBeDefined()
  })
})
```

### Client Error Handler Test

```typescript
import { getErrorMessage, isRateLimitError } from '@/lib/clientApiError'

describe('Client Error Handlers', () => {
  it('identifies rate limit errors', () => {
    const error = {
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
    }

    expect(isRateLimitError(error)).toBe(true)
  })

  it('returns user-friendly messages', () => {
    const error = {
      error: 'Missing required parameter: image',
      code: 'MISSING_PARAMETER',
    }

    const message = getErrorMessage(error)
    expect(message).toBe('Required information is missing. Please check your input.')
  })
})
```
