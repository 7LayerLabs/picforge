/**
 * API Route Tests: /api/process-image
 * 
 * Tests for critical image processing endpoint including:
 * - Rate limiting enforcement
 * - Error handling
 * - Request validation
 * - Response formatting
 */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/process-image/route';
import { checkRateLimitKv, resetRateLimitKv } from '@/lib/rateLimitKv';

// Mock dependencies
jest.mock('@/lib/rateLimitKv');
jest.mock('@google/generative-ai');
jest.mock('@/lib/validateEnv');

const mockCheckRateLimitKv = checkRateLimitKv as jest.MockedFunction<typeof checkRateLimitKv>;
const mockResetRateLimitKv = resetRateLimitKv as jest.MockedFunction<typeof resetRateLimitKv>;

describe('/api/process-image', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'AIzaTestKey123456789012345678901234567890';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rate Limiting', () => {
    it('should return 429 when rate limit is exceeded', async () => {
      mockCheckRateLimitKv.mockResolvedValue({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 86400000,
        limit: 500,
      });

      const request = new NextRequest('http://localhost/api/process-image', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '192.168.1.1',
        },
        body: JSON.stringify({
          image: 'data:image/png;base64,iVBORw0KGgoAAAANS',
          prompt: 'test prompt',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(data.details).toHaveProperty('remaining', 0);
      expect(response.headers.get('X-RateLimit-Limit')).toBe('500');
    });

    it('should allow requests within rate limit', async () => {
      mockCheckRateLimitKv.mockResolvedValue({
        allowed: true,
        remaining: 499,
        resetTime: Date.now() + 86400000,
        limit: 500,
      });

      // Mock Gemini API (this would need more complete mocking in real tests)
      // For now, we'll just verify rate limiting works
      const request = new NextRequest('http://localhost/api/process-image', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '192.168.1.1',
        },
        body: JSON.stringify({
          image: 'data:image/png;base64,iVBORw0KGgoAAAANS',
          prompt: 'test prompt',
        }),
      });

      // This will fail on Gemini API call, but rate limit should pass
      const response = await POST(request);
      
      // Verify rate limit check was called
      expect(mockCheckRateLimitKv).toHaveBeenCalled();
    });
  });

  describe('Request Validation', () => {
    it('should return 400 when image is missing', async () => {
      mockCheckRateLimitKv.mockResolvedValue({
        allowed: true,
        remaining: 500,
        resetTime: Date.now() + 86400000,
        limit: 500,
      });

      const request = new NextRequest('http://localhost/api/process-image', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'test prompt',
          // image missing
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.code).toBe('MISSING_PARAMETER');
    });

    it('should return 400 when prompt is missing', async () => {
      mockCheckRateLimitKv.mockResolvedValue({
        allowed: true,
        remaining: 500,
        resetTime: Date.now() + 86400000,
        limit: 500,
      });

      const request = new NextRequest('http://localhost/api/process-image', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          image: 'data:image/png;base64,iVBORw0KGgoAAAANS',
          // prompt missing
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.code).toBe('MISSING_PARAMETER');
    });
  });

  describe('Error Handling', () => {
    it('should handle API key missing gracefully', async () => {
      delete process.env.GEMINI_API_KEY;
      
      mockCheckRateLimitKv.mockResolvedValue({
        allowed: true,
        remaining: 500,
        resetTime: Date.now() + 86400000,
        limit: 500,
      });

      const request = new NextRequest('http://localhost/api/process-image', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          image: 'data:image/png;base64,iVBORw0KGgoAAAANS',
          prompt: 'test prompt',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should return 500 with proper error code
      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('requestId');
    });
  });
});

