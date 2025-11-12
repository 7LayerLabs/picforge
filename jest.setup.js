import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_INSTANT_APP_ID = 'test-instant-app-id'

// Stripe (keys must match validation format: sk_test_<98+ chars>, pk_test_<99+ chars>, whsec_<32+ chars>)
process.env.STRIPE_SECRET_KEY = 'sk_test_' + 'a'.repeat(100)
process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_' + 'a'.repeat(100)
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_' + 'a'.repeat(40)
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_' + 'a'.repeat(100)

// AI Providers
process.env.GEMINI_API_KEY = 'test-gemini-api-key'
process.env.ANTHROPIC_API_KEY = 'test-anthropic-api-key'
process.env.REPLICATE_API_TOKEN = 'test-replicate-token'
process.env.OPENAI_API_KEY = 'test-openai-api-key'

// Vercel KV (optional but prevents warnings)
process.env.KV_URL = 'redis://localhost:6379'
process.env.KV_REST_API_URL = 'http://localhost:8080'
process.env.KV_REST_API_TOKEN = 'test-kv-token'
process.env.KV_REST_API_READ_ONLY_TOKEN = 'test-kv-readonly-token'

// Analytics
process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST12345'

// Mock TextEncoder/TextDecoder for Node.js environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Request and Response for Next.js API routes
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = input
      this.method = init.method || 'GET'
      this.headers = new Map(Object.entries(init.headers || {}))
      this._body = init.body
    }
    async json() {
      return JSON.parse(this._body)
    }
    async text() {
      return this._body
    }
  }
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this._body = body
      this.status = init.status || 200
      this.statusText = init.statusText || 'OK'
      this.headers = new Map(Object.entries(init.headers || {}))
    }
    async json() {
      return JSON.parse(this._body)
    }
    async text() {
      return this._body
    }
    // Static json method for NextResponse.json()
    static json(data, init = {}) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...(init.headers || {})
        }
      })
    }
  }
}

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
  if (contextType === '2d') {
    return {
      drawImage: jest.fn(),
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({
        data: new Uint8ClampedArray(4),
      })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => ({
        data: new Uint8ClampedArray(4),
      })),
      setTransform: jest.fn(),
      resetTransform: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      translate: jest.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      filter: '',
      globalCompositeOperation: '',
      globalAlpha: 1,
    }
  }
  return null
})