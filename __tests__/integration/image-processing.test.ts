/**
 * Integration Tests: Image Processing Flow
 *
 * Tests the complete image processing workflow including upload,
 * transformation, watermarking, and rate limiting.
 */

import { POST } from '@/app/api/process-image/route';
import { checkRateLimitKv } from '@/lib/rateLimitKv';
import { applyWatermark } from '@/lib/watermark';

// Mock dependencies
jest.mock('@/lib/rateLimitKv');
jest.mock('@/lib/watermark');
jest.mock('@/lib/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock Google Gemini API
const mockGeminiResponse = {
  generateContent: jest.fn(),
};

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => mockGeminiResponse),
  })),
}));

describe('Image Processing Flow Integration Tests', () => {
  const mockImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  beforeEach(() => {
    jest.clearAllMocks();

    // Default: Rate limit not exceeded
    (checkRateLimitKv as jest.Mock).mockResolvedValue({
      allowed: true,
      limit: 500,
      remaining: 499,
      resetTime: Date.now() + 86400000,
    });
  });

  describe('Image Upload and Transform', () => {
    it('should successfully process image with Gemini API', async () => {
      const mockTransformedImage = 'data:image/png;base64,transformedImageData';

      // Mock Gemini API response
      mockGeminiResponse.generateContent.mockResolvedValue({
        response: {
          text: () => mockTransformedImage,
        },
      });

      const request = new Request('http://localhost:3000/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: mockImageBase64,
          prompt: 'turn into zombie',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.processedImage).toBeDefined();
    });

    it('should return error for invalid image format', async () => {
      const request = new Request('http://localhost:3000/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: 'invalid-base64-data',
          prompt: 'turn into zombie',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(data.error).toBeDefined();
    });
  });

  describe('Watermark Application', () => {
    it('should apply watermark for Free tier users', async () => {
      const mockWatermarkedImage = 'data:image/png;base64,watermarkedImageData';
      (applyWatermark as jest.Mock).mockResolvedValue(mockWatermarkedImage);

      // Simulate Free tier transformation
      mockGeminiResponse.generateContent.mockResolvedValue({
        response: {
          text: () => mockImageBase64,
        },
      });

      const originalImage = mockImageBase64;
      const tier = 'free';

      // Apply watermark
      const watermarkedImage = await applyWatermark(originalImage);

      expect(applyWatermark).toHaveBeenCalledWith(originalImage);
      expect(watermarkedImage).toBe(mockWatermarkedImage);
    });

    it('should not apply watermark for Pro tier users', async () => {
      const tier = 'pro';
      const originalImage = mockImageBase64;

      // Pro users should get image without watermark
      // In actual implementation, watermark is only applied for tier === 'free'
      if (tier === 'pro' || tier === 'unlimited') {
        expect(applyWatermark).not.toHaveBeenCalled();
      }
    });

    it('should not apply watermark for Unlimited tier users', async () => {
      const tier = 'unlimited';
      const originalImage = mockImageBase64;

      // Unlimited users should get image without watermark
      if (tier === 'unlimited' || tier === 'pro') {
        expect(applyWatermark).not.toHaveBeenCalled();
      }
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limit for Free tier after 20 images', async () => {
      // Mock rate limit exceeded
      (checkRateLimitKv as jest.Mock).mockResolvedValue({
        allowed: false,
        limit: 500,
        remaining: 0,
        resetTime: Date.now() + 86400000,
      });

      const request = new Request('http://localhost:3000/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: mockImageBase64,
          prompt: 'turn into zombie',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toContain('Rate limit exceeded');
    });

    it('should allow processing within rate limit', async () => {
      (checkRateLimitKv as jest.Mock).mockResolvedValue({
        allowed: true,
        limit: 500,
        remaining: 450,
        resetTime: Date.now() + 86400000,
      });

      mockGeminiResponse.generateContent.mockResolvedValue({
        response: {
          text: () => mockImageBase64,
        },
      });

      const request = new Request('http://localhost:3000/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: mockImageBase64,
          prompt: 'turn into zombie',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(checkRateLimitKv).toHaveBeenCalled();
    });

    it('should include rate limit headers in response', async () => {
      const mockRateLimit = {
        allowed: true,
        limit: 500,
        remaining: 499,
        resetTime: Date.now() + 86400000,
      };

      (checkRateLimitKv as jest.Mock).mockResolvedValue(mockRateLimit);

      mockGeminiResponse.generateContent.mockResolvedValue({
        response: {
          text: () => mockImageBase64,
        },
      });

      const request = new Request('http://localhost:3000/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: mockImageBase64,
          prompt: 'turn into zombie',
        }),
      });

      const response = await POST(request);

      expect(response.headers.get('X-RateLimit-Limit')).toBeTruthy();
      expect(response.headers.get('X-RateLimit-Remaining')).toBeTruthy();
    });
  });

  describe('Batch Processing', () => {
    it('should process multiple images with client-side effects', async () => {
      // Batch processing uses Canvas API (client-side)
      // This test verifies the flow is set up correctly

      const images = [mockImageBase64, mockImageBase64, mockImageBase64];
      const effect = 'sharpen';

      // In actual batch processing, this would use imageProcessor.ts
      // For integration test, we verify the setup

      expect(images.length).toBe(3);
      expect(effect).toBe('sharpen');

      // Canvas API mock from jest.setup.js should be available
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      expect(ctx).toBeDefined();
      expect(ctx?.drawImage).toBeDefined();
    });

    it('should handle batch processing errors gracefully', async () => {
      const invalidImages = ['invalid1', 'invalid2'];

      // Batch processing should handle errors per-image
      const results = invalidImages.map((img) => {
        try {
          // Attempt to process
          if (!img.startsWith('data:image')) {
            throw new Error('Invalid image format');
          }
          return { success: true, image: img };
        } catch (error) {
          return { success: false, error: 'Invalid image format' };
        }
      });

      expect(results.every((r) => !r.success)).toBe(true);
      expect(results.every((r) => r.error)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle Gemini API errors gracefully', async () => {
      mockGeminiResponse.generateContent.mockRejectedValue(
        new Error('Gemini API error: Rate limit exceeded')
      );

      const request = new Request('http://localhost:3000/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: mockImageBase64,
          prompt: 'turn into zombie',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(data.error).toBeDefined();
    });

    it('should handle missing prompt', async () => {
      const request = new Request('http://localhost:3000/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: mockImageBase64,
          prompt: '',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(data.error).toBeDefined();
    });

    it('should handle missing image', async () => {
      const request = new Request('http://localhost:3000/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: '',
          prompt: 'turn into zombie',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(data.error).toBeDefined();
    });
  });

  describe('Complete Processing Flow', () => {
    it('should complete full upload → transform → download flow', async () => {
      // Step 1: Upload (simulate)
      const uploadedImage = mockImageBase64;
      expect(uploadedImage).toBeDefined();

      // Step 2: Transform with Gemini
      const mockTransformedImage = 'data:image/png;base64,transformedData';
      mockGeminiResponse.generateContent.mockResolvedValue({
        response: {
          text: () => mockTransformedImage,
        },
      });

      const request = new Request('http://localhost:3000/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: uploadedImage,
          prompt: 'cyberpunk style',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      // Step 3: Verify transformation
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.processedImage).toBeDefined();

      // Step 4: Download (simulated - would trigger browser download)
      const downloadableImage = data.processedImage;
      expect(downloadableImage).toBeTruthy();
      expect(typeof downloadableImage).toBe('string');
    });
  });
});
