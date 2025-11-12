// Client-side image processing (FREE operations)
export class ImageProcessor {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  constructor() {
    if (typeof window !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d')!;
    }
  }

  async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  async resize(file: File, width: number, height?: number): Promise<Blob> {
    const img = await this.loadImage(file);

    // Calculate height maintaining aspect ratio if not provided
    if (!height) {
      height = Math.floor((width / img.width) * img.height);
    }

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.drawImage(img, 0, 0, width, height);

    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob!), file.type, 0.95);
    });
  }

  async crop(file: File, x: number, y: number, width: number, height: number): Promise<Blob> {
    const img = await this.loadImage(file);

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob!), file.type, 0.95);
    });
  }

  async rotate(file: File, degrees: number): Promise<Blob> {
    const img = await this.loadImage(file);
    const radians = (degrees * Math.PI) / 180;

    // Calculate new dimensions
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));
    const width = Math.floor(img.width * cos + img.height * sin);
    const height = Math.floor(img.width * sin + img.height * cos);

    this.canvas.width = width;
    this.canvas.height = height;

    // Rotate around center
    this.ctx.translate(width / 2, height / 2);
    this.ctx.rotate(radians);
    this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
    this.ctx.resetTransform();

    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob!), file.type, 0.95);
    });
  }

  async adjustBrightness(file: File, value: number): Promise<Blob> {
    const img = await this.loadImage(file);

    this.canvas.width = img.width;
    this.canvas.height = img.height;
    this.ctx.drawImage(img, 0, 0);

    const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] + value);     // Red
      data[i + 1] = Math.min(255, data[i + 1] + value); // Green
      data[i + 2] = Math.min(255, data[i + 2] + value); // Blue
    }

    this.ctx.putImageData(imageData, 0, 0);

    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob!), file.type, 0.95);
    });
  }

  async adjustContrast(file: File, value: number): Promise<Blob> {
    const img = await this.loadImage(file);

    this.canvas.width = img.width;
    this.canvas.height = img.height;
    this.ctx.drawImage(img, 0, 0);

    const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    const factor = (259 * (value + 255)) / (255 * (259 - value));

    for (let i = 0; i < data.length; i += 4) {
      data[i] = factor * (data[i] - 128) + 128;     // Red
      data[i + 1] = factor * (data[i + 1] - 128) + 128; // Green
      data[i + 2] = factor * (data[i + 2] - 128) + 128; // Blue
    }

    this.ctx.putImageData(imageData, 0, 0);

    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob!), file.type, 0.95);
    });
  }

  async applyFilter(file: File, filter: 'grayscale' | 'sepia' | 'blur' | 'sharpen'): Promise<Blob> {
    const img = await this.loadImage(file);

    this.canvas.width = img.width;
    this.canvas.height = img.height;

    // Apply CSS filters for quick processing
    switch (filter) {
      case 'grayscale':
        this.ctx.filter = 'grayscale(100%)';
        break;
      case 'sepia':
        this.ctx.filter = 'sepia(100%)';
        break;
      case 'blur':
        this.ctx.filter = 'blur(5px)';
        break;
      case 'sharpen':
        this.ctx.filter = 'contrast(1.4)';
        break;
    }

    this.ctx.drawImage(img, 0, 0);
    this.ctx.filter = 'none';

    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob!), file.type, 0.95);
    });
  }

  async addWatermark(file: File, text: string, position: 'center' | 'bottom-right' | 'top-left'): Promise<Blob> {
    const img = await this.loadImage(file);

    this.canvas.width = img.width;
    this.canvas.height = img.height;
    this.ctx.drawImage(img, 0, 0);

    // Setup watermark text
    this.ctx.font = `${Math.floor(img.width / 20)}px Arial`;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.lineWidth = 2;

    const textMetrics = this.ctx.measureText(text);
    let x, y;

    switch (position) {
      case 'center':
        x = (img.width - textMetrics.width) / 2;
        y = img.height / 2;
        break;
      case 'bottom-right':
        x = img.width - textMetrics.width - 20;
        y = img.height - 20;
        break;
      case 'top-left':
        x = 20;
        y = 50;
        break;
    }

    this.ctx.strokeText(text, x, y);
    this.ctx.fillText(text, x, y);

    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob!), file.type, 0.95);
    });
  }

  async compress(file: File, quality: number = 0.8): Promise<Blob> {
    const img = await this.loadImage(file);

    this.canvas.width = img.width;
    this.canvas.height = img.height;
    this.ctx.drawImage(img, 0, 0);

    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', quality);
    });
  }

  async convertFormat(file: File, format: 'jpeg' | 'png' | 'webp'): Promise<Blob> {
    const img = await this.loadImage(file);

    this.canvas.width = img.width;
    this.canvas.height = img.height;
    this.ctx.drawImage(img, 0, 0);

    const mimeType = `image/${format}`;
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => resolve(blob!), mimeType, 0.95);
    });
  }

  // Batch processing helper
  async processBatch(
    files: File[],
    operation: (file: File) => Promise<Blob>,
    onProgress?: (current: number, total: number) => void
  ): Promise<Blob[]> {
    const results: Blob[] = [];

    for (let i = 0; i < files.length; i++) {
      const result = await operation(files[i]);
      results.push(result);

      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    }

    return results;
  }
}

// Singleton instance
let processorInstance: ImageProcessor | null = null;

export function getImageProcessor(): ImageProcessor {
  if (!processorInstance && typeof window !== 'undefined') {
    processorInstance = new ImageProcessor();
  }
  return processorInstance!;
}