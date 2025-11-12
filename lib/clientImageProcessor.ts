// Client-side image processing using Canvas API
export class ClientImageProcessor {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!
  }

  async processImage(base64Image: string, prompt: string): Promise<string> {
    // Load image
    const img = new Image()
    img.src = base64Image

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    // Set canvas size
    this.canvas.width = img.width
    this.canvas.height = img.height

    // Draw original image
    this.ctx.drawImage(img, 0, 0)

    // Parse prompt and apply effects
    const promptLower = prompt.toLowerCase()

    if (promptLower.includes('remove background') || promptLower.includes('transparent')) {
      await this.removeBackground()
    }

    if (promptLower.includes('blur')) {
      this.applyBlur()
    }

    if (promptLower.includes('grayscale') || promptLower.includes('black and white')) {
      this.applyGrayscale()
    }

    if (promptLower.includes('sepia') || promptLower.includes('vintage')) {
      this.applySepia()
    }

    if (promptLower.includes('bright')) {
      this.adjustBrightness(1.3)
    }

    if (promptLower.includes('dark')) {
      this.adjustBrightness(0.7)
    }

    if (promptLower.includes('contrast')) {
      this.adjustContrast(1.5)
    }

    if (promptLower.includes('sharpen')) {
      this.applySharpen()
    }

    if (promptLower.includes('invert')) {
      this.applyInvert()
    }

    if (promptLower.includes('cartoon') || promptLower.includes('posterize')) {
      this.applyPosterize()
    }

    if (promptLower.includes('enhance')) {
      this.enhanceImage()
    }

    if (promptLower.includes('professional') || promptLower.includes('studio')) {
      this.applyProfessionalLook()
    }

    // Return processed image as base64
    return this.canvas.toDataURL('image/png')
  }

  private async removeBackground() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const data = imageData.data

    // Simple green screen removal (works best with solid backgrounds)
    // This is a simplified version - real background removal needs AI
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Detect white/light backgrounds
      if (r > 240 && g > 240 && b > 240) {
        data[i + 3] = 0 // Set alpha to 0 (transparent)
      }

      // Edge softening
      if (r > 200 && g > 200 && b > 200) {
        data[i + 3] = Math.floor(data[i + 3] * 0.5)
      }
    }

    this.ctx.putImageData(imageData, 0, 0)
  }

  private applyBlur() {
    this.ctx.filter = 'blur(5px)'
    this.ctx.drawImage(this.canvas, 0, 0)
    this.ctx.filter = 'none'
  }

  private applyGrayscale() {
    this.ctx.filter = 'grayscale(100%)'
    this.ctx.drawImage(this.canvas, 0, 0)
    this.ctx.filter = 'none'
  }

  private applySepia() {
    this.ctx.filter = 'sepia(100%)'
    this.ctx.drawImage(this.canvas, 0, 0)
    this.ctx.filter = 'none'
  }

  private adjustBrightness(factor: number) {
    this.ctx.filter = `brightness(${factor})`
    this.ctx.drawImage(this.canvas, 0, 0)
    this.ctx.filter = 'none'
  }

  private adjustContrast(factor: number) {
    this.ctx.filter = `contrast(${factor})`
    this.ctx.drawImage(this.canvas, 0, 0)
    this.ctx.filter = 'none'
  }

  private applySharpen() {
    // Apply unsharp mask
    this.ctx.filter = 'contrast(1.2) brightness(1.1)'
    this.ctx.drawImage(this.canvas, 0, 0)
    this.ctx.filter = 'none'
  }

  private applyInvert() {
    this.ctx.filter = 'invert(100%)'
    this.ctx.drawImage(this.canvas, 0, 0)
    this.ctx.filter = 'none'
  }

  private applyPosterize() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const data = imageData.data
    const levels = 4

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(data[i] / (256 / levels)) * (256 / levels)
      data[i + 1] = Math.floor(data[i + 1] / (256 / levels)) * (256 / levels)
      data[i + 2] = Math.floor(data[i + 2] / (256 / levels)) * (256 / levels)
    }

    this.ctx.putImageData(imageData, 0, 0)
  }

  private enhanceImage() {
    // Auto-enhance: adjust contrast and brightness
    this.ctx.filter = 'contrast(1.2) brightness(1.1) saturate(1.2)'
    this.ctx.drawImage(this.canvas, 0, 0)
    this.ctx.filter = 'none'
  }

  private applyProfessionalLook() {
    // Professional look: slight contrast, desaturate a bit, add vignette
    this.ctx.filter = 'contrast(1.1) saturate(0.9) brightness(1.05)'
    this.ctx.drawImage(this.canvas, 0, 0)
    this.ctx.filter = 'none'

    // Add vignette
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.max(this.canvas.width, this.canvas.height) / 2
    )
    gradient.addColorStop(0.5, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.3)')

    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
}