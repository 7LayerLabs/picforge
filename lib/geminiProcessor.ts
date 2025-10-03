import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export class GeminiProcessor {
  private model;
  private cache: Map<string, string> = new Map();

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // Convert file to base64
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  }

  // Perceptual hash for caching
  private async getImageHash(file: File): Promise<string> {
    const base64 = await this.fileToBase64(file);
    // Simple hash for demo - in production use proper perceptual hashing
    return btoa(base64.substring(0, 100));
  }

  // Batch process with Gemini (single API call for all images)
  async processBatch(
    files: File[],
    operation: 'remove_background' | 'enhance' | 'object_detection' | 'style_transfer' | 'removeBackground'
  ): Promise<unknown[]> {
    try {
      // Convert all files to base64
      const images = await Promise.all(
        files.map(async (file) => ({
          data: await this.fileToBase64(file),
          mimeType: file.type
        }))
      );

      // Create batch prompt based on operation
      let prompt = '';
      switch (operation) {
        case 'remove_background':
          prompt = `For each image provided, identify the main subject and provide coordinates for background removal. Return a JSON array with bounding boxes for each image.`;
          break;
        case 'enhance':
          prompt = `Analyze each image and provide enhancement parameters (brightness, contrast, saturation, sharpness) to improve quality. Return JSON array with parameters for each image.`;
          break;
        case 'object_detection':
          prompt = `Detect all objects in each image and return their bounding boxes and labels. Return as JSON array.`;
          break;
        case 'style_transfer':
          prompt = `Analyze the artistic style of each image and suggest parameters for style transfer. Return JSON array with style parameters.`;
          break;
      }

      // Single API call for all images
      const result = await this.model.generateContent([
        prompt,
        ...images.map(img => ({
          inlineData: img
        }))
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse and return results
      try {
        return JSON.parse(text);
      } catch {
        // Fallback if response isn't valid JSON
        return files.map(() => ({ success: true, data: text }));
      }
    } catch (error) {
      console.error('Gemini processing error:', error);
      throw error;
    }
  }

  // Background removal using Gemini vision
  async removeBackground(file: File): Promise<string> {
    const hash = await this.getImageHash(file);
    const cacheKey = `bg_${hash}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const base64 = await this.fileToBase64(file);

    const prompt = `Analyze this image and identify the main subject. Provide the exact coordinates (x, y, width, height) of the main subject as a JSON object. Also indicate if the background should be transparent or white.`;

    const result = await this.model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: file.type
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    // Cache result
    this.cache.set(cacheKey, text);

    return text;
  }

  // AI Enhancement
  async enhanceImage(file: File): Promise<string> {
    const base64 = await this.fileToBase64(file);

    const prompt = `Analyze this image and suggest enhancement parameters:
    1. Brightness adjustment (-100 to 100)
    2. Contrast adjustment (-100 to 100)
    3. Saturation adjustment (-100 to 100)
    4. Sharpness level (0 to 100)
    5. Color temperature adjustment (warm/cool)
    6. Any specific filters to apply
    Return as JSON with these parameters.`;

    const result = await this.model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: file.type
        }
      }
    ]);

    const response = await result.response;
    return response.text();
  }

  // Smart crop suggestions
  async getSmartCrop(file: File): Promise<string> {
    const base64 = await this.fileToBase64(file);

    const prompt = `Analyze this image and suggest optimal crop coordinates for:
    1. Square format (Instagram)
    2. 16:9 format (YouTube thumbnail)
    3. 4:5 format (Facebook/Instagram portrait)
    4. Focus on the main subject
    Return as JSON with coordinates for each format.`;

    const result = await this.model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: file.type
        }
      }
    ]);

    const response = await result.response;
    return response.text();
  }

  // Object detection for e-commerce
  async detectProducts(file: File): Promise<string> {
    const base64 = await this.fileToBase64(file);

    const prompt = `Detect all products in this image. For each product provide:
    1. Bounding box coordinates (x, y, width, height)
    2. Product category
    3. Suggested tags
    4. Color information
    5. Best angle for product photo
    Return as JSON array of products.`;

    const result = await this.model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64,
          mimeType: file.type
        }
      }
    ]);

    const response = await result.response;
    return response.text();
  }

  // Generate alt text for SEO
  async generateAltText(files: File[]): Promise<string[]> {
    const images = await Promise.all(
      files.map(async (file) => ({
        data: await this.fileToBase64(file),
        mimeType: file.type
      }))
    );

    const prompt = `Generate SEO-optimized alt text for each image. Make them descriptive, keyword-rich, and under 125 characters. Return as JSON array of strings.`;

    const result = await this.model.generateContent([
      prompt,
      ...images.map(img => ({
        inlineData: img
      }))
    ]);

    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text);
    } catch {
      return files.map((_, i) => `Image ${i + 1}`);
    }
  }
}

// Singleton instance
let geminiInstance: GeminiProcessor | null = null;

export function getGeminiProcessor(): GeminiProcessor {
  if (!geminiInstance) {
    geminiInstance = new GeminiProcessor();
  }
  return geminiInstance;
}