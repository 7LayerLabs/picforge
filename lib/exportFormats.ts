// Export format utilities for Cricut/Etsy sellers
// Handles PNG transparent, SVG, PDF, and high-resolution exports

import { saveAs } from 'file-saver'
import JSZip from 'jszip'

export interface ExportPreset {
  name: string
  width: number
  height: number
  dpi: number
  category: 'cricut' | 'etsy' | 'print' | 'social'
}

export const EXPORT_PRESETS: Record<string, ExportPreset> = {
  // Cricut Presets
  'cricut-12x12': { name: 'Cricut Vinyl 12"×12"', width: 3600, height: 3600, dpi: 300, category: 'cricut' },
  'cricut-12x24': { name: 'Cricut Vinyl 12"×24"', width: 3600, height: 7200, dpi: 300, category: 'cricut' },
  'cricut-cardstock': { name: 'Card Stock 8.5"×11"', width: 2550, height: 3300, dpi: 300, category: 'cricut' },
  'cricut-sticker': { name: 'Small Sticker 4"×4"', width: 1200, height: 1200, dpi: 300, category: 'cricut' },

  // Etsy/Print-on-Demand Presets
  'tshirt': { name: 'T-Shirt Print 12"×16"', width: 3600, height: 4800, dpi: 300, category: 'etsy' },
  'wallart-8x10': { name: 'Wall Art 8"×10"', width: 2400, height: 3000, dpi: 300, category: 'etsy' },
  'wallart-11x14': { name: 'Poster 11"×14"', width: 3300, height: 4200, dpi: 300, category: 'etsy' },
  'postcard': { name: 'Postcard 4"×6"', width: 1200, height: 1800, dpi: 300, category: 'etsy' },
  'canvas-16x20': { name: 'Large Canvas 16"×20"', width: 4800, height: 6000, dpi: 300, category: 'print' },
  'sticker-sheet': { name: 'Sticker Sheet 4.5"×4.5"', width: 1350, height: 1350, dpi: 300, category: 'etsy' },
  'mug': { name: 'Mug Wrap 7.5"×3.25"', width: 2250, height: 975, dpi: 300, category: 'etsy' },

  // Social Media Presets
  'instagram': { name: 'Instagram Square', width: 1080, height: 1080, dpi: 72, category: 'social' },
  'instagram-story': { name: 'Instagram Story', width: 1080, height: 1920, dpi: 72, category: 'social' },
  'facebook': { name: 'Facebook Post', width: 1200, height: 630, dpi: 72, category: 'social' },
}

/**
 * Remove white/light backgrounds from image data
 */
function removeWhiteBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  // Remove white/light backgrounds (works best with solid backgrounds)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Detect white/very light backgrounds (threshold: RGB > 240)
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0 // Set alpha to 0 (fully transparent)
    }
    // Edge softening for semi-light pixels (threshold: RGB > 200)
    else if (r > 200 && g > 200 && b > 200) {
      data[i + 3] = Math.floor(data[i + 3] * 0.5) // 50% transparent
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

/**
 * Download image with transparent background (for Etsy/print-on-demand)
 * Automatically removes white/light backgrounds
 */
export async function downloadTransparentPNG(
  imageData: string,
  preset: string,
  filename: string = 'design-transparent.png'
): Promise<void> {
  try {
    const presetConfig = EXPORT_PRESETS[preset]
    if (!presetConfig) {
      throw new Error('Invalid preset selected')
    }

    // Create canvas for processing
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = imageData
    })

    const canvas = document.createElement('canvas')
    canvas.width = presetConfig.width
    canvas.height = presetConfig.height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    if (!ctx) {
      throw new Error('Canvas context not available')
    }

    // Calculate dimensions to maintain aspect ratio
    const scale = Math.min(
      canvas.width / img.width,
      canvas.height / img.height
    )
    const x = (canvas.width - img.width * scale) / 2
    const y = (canvas.height - img.height * scale) / 2

    // Draw image on canvas
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

    // Apply background removal to make white areas transparent
    removeWhiteBackground(ctx, canvas.width, canvas.height)

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, filename)
      }
    }, 'image/png')
  } catch (error) {
    console.error('Error creating transparent PNG:', error)
    throw error
  }
}

/**
 * Convert image to SVG (for Cricut cutting)
 * Note: This is a simplified version - for production, integrate with potrace or VectorMagic API
 */
export async function downloadSVG(
  imageData: string,
  preset: string,
  filename: string = 'design-cricut.svg'
): Promise<void> {
  try {
    const presetConfig = EXPORT_PRESETS[preset]
    if (!presetConfig) {
      throw new Error('Invalid preset selected')
    }

    // For MVP: Create a basic SVG wrapper with embedded image
    // TODO: Integrate real vectorization (potrace, VectorMagic API)
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = imageData
    })

    // Create basic SVG with embedded image
    // This is a placeholder - real implementation needs vectorization
    const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${presetConfig.width / 300}in"
  height="${presetConfig.height / 300}in"
  viewBox="0 0 ${presetConfig.width} ${presetConfig.height}">
  <title>PicForge Design</title>
  <desc>Created with PicForge - Ready for Cricut</desc>
  <image
    x="0"
    y="0"
    width="${presetConfig.width}"
    height="${presetConfig.height}"
    xlink:href="${imageData}"
  />
</svg>`

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    saveAs(blob, filename)

    // Show upgrade message for better SVG quality
    console.warn('Basic SVG exported. Upgrade to Pro for vectorized SVG with clean cut lines.')
  } catch (error) {
    console.error('Error creating SVG:', error)
    throw error
  }
}

/**
 * Download print-ready PDF
 */
export async function downloadPDF(
  imageData: string,
  preset: string,
  filename: string = 'design-print.pdf'
): Promise<void> {
  try {
    // For MVP: Convert to high-res PNG and inform user about PDF
    // TODO: Integrate jsPDF or similar for real PDF generation

    await downloadTransparentPNG(imageData, preset, filename.replace('.pdf', '.png'))

    console.warn('High-resolution PNG downloaded. Pro users get true PDF format.')
    alert('High-resolution PNG downloaded! Upgrade to Pro tier for print-ready PDF format.')
  } catch (error) {
    console.error('Error creating PDF:', error)
    throw error
  }
}

/**
 * Download complete pack (multiple formats at once)
 */
export async function downloadExportPack(
  imageData: string,
  preset: string,
  formats: {
    pngTransparent?: boolean
    pngWhiteBg?: boolean
    svg?: boolean
    pdf?: boolean
  },
  packName: string = 'cricut-pack'
): Promise<void> {
  try {
    const zip = new JSZip()
    const presetConfig = EXPORT_PRESETS[preset]

    if (!presetConfig) {
      throw new Error('Invalid preset selected')
    }

    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = imageData
    })

    // PNG Transparent
    if (formats.pngTransparent) {
      const canvas = document.createElement('canvas')
      canvas.width = presetConfig.width
      canvas.height = presetConfig.height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })

      if (ctx) {
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        )
        const x = (canvas.width - img.width * scale) / 2
        const y = (canvas.height - img.height * scale) / 2
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

        // Apply background removal to make white areas transparent
        removeWhiteBackground(ctx, canvas.width, canvas.height)

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/png')
        })
        zip.file('design-transparent.png', blob)
      }
    }

    // PNG White Background
    if (formats.pngWhiteBg) {
      const canvas = document.createElement('canvas')
      canvas.width = presetConfig.width
      canvas.height = presetConfig.height
      const ctx = canvas.getContext('2d')

      if (ctx) {
        // Fill white background
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        )
        const x = (canvas.width - img.width * scale) / 2
        const y = (canvas.height - img.height * scale) / 2
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/png')
        })
        zip.file('design-white-bg.png', blob)
      }
    }

    // SVG
    if (formats.svg) {
      const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${presetConfig.width / 300}in"
  height="${presetConfig.height / 300}in"
  viewBox="0 0 ${presetConfig.width} ${presetConfig.height}">
  <title>PicForge Design</title>
  <image
    x="0"
    y="0"
    width="${presetConfig.width}"
    height="${presetConfig.height}"
    xlink:href="${imageData}"
  />
</svg>`
      zip.file('design-cricut.svg', svgContent)
    }

    // Add README with license info
    const readme = `PicForge Export Package
========================

Preset: ${presetConfig.name}
Resolution: ${presetConfig.width}×${presetConfig.height} (${presetConfig.dpi} DPI)

Files Included:
${formats.pngTransparent ? '✓ design-transparent.png - For print-on-demand, stickers, sublimation\n' : ''}${formats.pngWhiteBg ? '✓ design-white-bg.png - Preview/reference image\n' : ''}${formats.svg ? '✓ design-cricut.svg - For Cricut cutting machines\n' : ''}
Commercial Use:
- Free tier: Personal use only
- Creator/Pro tier: Full commercial license included

Need help? Visit pic-forge.com

Generated by PicForge.com
`
    zip.file('README.txt', readme)

    // Generate and download ZIP
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `${packName}.zip`)
  } catch (error) {
    console.error('Error creating export pack:', error)
    throw error
  }
}

/**
 * Upscale image to higher resolution (for print quality)
 * Note: For MVP, this uses canvas scaling. For production, integrate Real-ESRGAN or similar
 */
export async function upscaleImage(
  imageData: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      // Use high-quality image smoothing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageData
  })
}

/**
 * Get preset by use case
 */
export function getPresetsByCategory(category: 'cricut' | 'etsy' | 'print' | 'social'): Array<{key: string, preset: ExportPreset}> {
  return Object.entries(EXPORT_PRESETS)
    .filter(([, preset]) => preset.category === category)
    .map(([key, preset]) => ({ key, preset }))
}
