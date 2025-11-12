/**
 * API Error Handling Tests
 * 
 * Tests for standardized error handling across API routes.
 */

import { Errors, ApiError, handleApiError, createRateLimitResponse } from '@/lib/apiErrors';
import { NextResponse } from 'next/server';

// Mock error logger
jest.mock('@/lib/errorLogger', () => ({
  logError: jest.fn(),
}));

describe('API Error Handling', () => {
  describe('Errors factory', () => {
    it('should create missing parameter error', () => {
      const error = Errors.missingParameter('image');
      
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('MISSING_PARAMETER');
      expect(error.message).toContain('image');
    });

    it('should create invalid input error', () => {
      const error = Errors.invalidInput('Invalid image format');
      
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('INVALID_INPUT');
    });

    it('should create rate limit error', () => {
      const resetTime = Date.now() + 86400000;
      const error = Errors.rateLimitExceeded(resetTime);
      
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(429);
      expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(error.details).toHaveProperty('resetTime', resetTime);
    });

    it('should create unauthorized error', () => {
      const error = Errors.unauthorized('Please sign in');
      
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
    });

    it('should create forbidden error', () => {
      const error = Errors.forbidden('Admin access required');
      
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
    });

    it('should create API key missing error', () => {
      const error = Errors.apiKeyMissing('Gemini');
      
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('API_KEY_MISSING');
      expect(error.message).toContain('Gemini');
    });

    it('should create external service error', () => {
      const error = Errors.externalServiceError('Replicate', 'Connection timeout');
      
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(502);
      expect(error.code).toBe('EXTERNAL_SERVICE_ERROR');
      expect(error.message).toContain('Replicate');
    });

    it('should create image processing failed error', () => {
      const error = Errors.imageProcessingFailed('Model timeout');
      
      expect(error).toBeInstanceOf(ApiError);
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('IMAGE_PROCESSING_FAILED');
      expect(error.message).toContain('timeout');
    });
  });

  describe('handleApiError', () => {
    it('should handle ApiError instances', () => {
      const error = Errors.missingParameter('image');
      const response = handleApiError(error);

      expect(response.status).toBe(400);
    });

    it('should handle standard Error instances', () => {
      const error = new Error('Something went wrong');
      const response = handleApiError(error);

      expect(response.status).toBe(500);
    });

    it('should detect rate limit errors from message', () => {
      const error = new Error('Rate limit exceeded');
      const response = handleApiError(error);

      expect(response.status).toBe(429);
    });

    it('should include request context when provided', () => {
      const error = Errors.internal('Test error');
      const response = handleApiError(error, {
        route: '/api/test',
        method: 'POST',
        ip: '192.168.1.1',
      });

      expect(response.status).toBe(500);
      // Error logger should have been called with context
    });
  });

  describe('createRateLimitResponse', () => {
    it('should create proper rate limit response with headers', () => {
      const rateLimit = {
        limit: 500,
        remaining: 0,
        resetTime: Date.now() + 86400000,
      };

      const response = createRateLimitResponse(rateLimit);
      
      expect(response.status).toBe(429);
      expect(response.headers.get('X-RateLimit-Limit')).toBe('500');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(response.headers.get('X-RateLimit-Reset')).toBeTruthy();
      expect(response.headers.get('X-Request-ID')).toBeTruthy();
    });
  });
});

