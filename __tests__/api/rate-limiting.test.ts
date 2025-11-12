/**
 * Rate Limiting Tests
 * 
 * Tests for rate limiting functionality across API routes.
 */

import { NextRequest } from 'next/server';
import { checkRateLimitKv, getClientIdentifier } from '@/lib/rateLimitKv';

// Mock Vercel KV
jest.mock('@vercel/kv', () => ({
  kv: {
    incr: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  },
}));

import { kv } from '@vercel/kv';

const mockKv = kv as jest.Mocked<typeof kv>;

describe('Rate Limiting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.KV_REST_API_URL = 'https://test.kv.vercel.app';
    process.env.KV_REST_API_TOKEN = 'test-token';
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    delete process.env.KV_REST_API_URL;
    delete process.env.KV_REST_API_TOKEN;
  });

  describe('getClientIdentifier', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const request = new NextRequest('http://localhost/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        },
      });

      const identifier = getClientIdentifier(request);
      expect(identifier).toBe('ip:192.168.1.1');
    });

    it('should fall back to x-real-ip header', () => {
      const request = new NextRequest('http://localhost/api/test', {
        headers: {
          'x-real-ip': '192.168.1.2',
        },
      });

      const identifier = getClientIdentifier(request);
      expect(identifier).toBe('ip:192.168.1.2');
    });

    it('should use unknown when no IP headers present', () => {
      const request = new NextRequest('http://localhost/api/test');

      const identifier = getClientIdentifier(request);
      expect(identifier).toBe('ip:unknown');
    });
  });

  describe('checkRateLimitKv', () => {
    it('should allow request when under limit', async () => {
      mockKv.incr.mockResolvedValue(5);
      mockKv.expire.mockResolvedValue(1);
      mockKv.ttl.mockResolvedValue(86400);

      const result = await checkRateLimitKv('ip:192.168.1.1', 500, 86400000);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(495);
      expect(result.limit).toBe(500);
    });

    it('should deny request when limit exceeded', async () => {
      mockKv.incr.mockResolvedValue(501);
      mockKv.expire.mockResolvedValue(1);
      mockKv.ttl.mockResolvedValue(86400);

      const result = await checkRateLimitKv('ip:192.168.1.1', 500, 86400000);

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.limit).toBe(500);
    });

    it('should set expiration on first request', async () => {
      mockKv.incr.mockResolvedValue(1);
      mockKv.expire.mockResolvedValue(1);
      mockKv.ttl.mockResolvedValue(86400);

      await checkRateLimitKv('ip:192.168.1.1', 500, 86400000);

      expect(mockKv.expire).toHaveBeenCalledWith('rate-limit:ip:192.168.1.1', 86400);
    });

    it('should handle KV connection errors gracefully in development', async () => {
      process.env.NODE_ENV = 'development';
      mockKv.incr.mockRejectedValue(new Error('KV connection failed'));

      const result = await checkRateLimitKv('ip:192.168.1.1', 500, 86400000);

      // In development, should allow with warning
      expect(result.allowed).toBe(true);
    });

    it('should fail closed in production on KV errors', async () => {
      process.env.NODE_ENV = 'production';
      process.env.VERCEL_ENV = 'production';
      mockKv.incr.mockRejectedValue(new Error('KV connection failed'));

      const result = await checkRateLimitKv('ip:192.168.1.1', 500, 86400000);

      // In production, should deny for security
      expect(result.allowed).toBe(false);
    });
  });
});

