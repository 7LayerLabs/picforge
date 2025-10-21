// Export format utilities for Cricut/Etsy sellers
// Handles PNG transparent, SVG, PDF, TIFF, ICO, WebP, and high-resolution exports

import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { jsPDF } from 'jspdf'

export interface ExportPreset {
  name: string
  width: number
  height: number
  dpi: number
  category: 'cricut' | 'etsy' | 'print' | 'social'
}

export interface PDFOptions {
  pageSize: 'letter' | 'a4' | 'custom'
  orientation: 'portrait' | 'landscape'
  customWidth?: number
  customHeight?: number
  includeMetadata?: boolean
}

export interface SVGOptions {
  vectorize?: boolean
  precision?: number
  simplify?: boolean
}

export interface ExportOptions {
  quality?: number
  transparent?: boolean
  watermark?: boolean
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
 * Includes basic vectorization using edge detection
 */
export async function downloadSVG(
  imageData: string,
  preset: string,
  filename: string = 'design-cricut.svg',
  options: SVGOptions = {}
): Promise<void> {
  try {
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

    let svgContent: string

    if (options.vectorize) {
      // Advanced SVG vectorization using edge detection
      svgContent = await vectorizeImage(img, presetConfig, options)
    } else {
      // Basic SVG with embedded raster image
      svgContent = createBasicSVG(img, presetConfig, imageData)
    }

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    saveAs(blob, filename)

    if (!options.vectorize) {
      console.info('Basic SVG exported with embedded image. Enable vectorization for true vector paths.')
    }
  } catch (error) {
    console.error('Error creating SVG:', error)
    throw error
  }
}

/**
 * Create basic SVG with embedded image
 */
function createBasicSVG(img: HTMLImageElement, preset: ExportPreset, imageData: string): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${preset.width / preset.dpi}in"
  height="${preset.height / preset.dpi}in"
  viewBox="0 0 ${preset.width} ${preset.height}">
  <title>PicForge Design</title>
  <desc>Created with PicForge - Cricut Ready</desc>
  <image
    x="0"
    y="0"
    width="${preset.width}"
    height="${preset.height}"
    xlink:href="${imageData}"
    preserveAspectRatio="xMidYMid meet"
  />
</svg>`
}

/**
 * Vectorize image using edge detection and path tracing
 * Simplified client-side vectorization for basic shapes
 */
async function vectorizeImage(
  img: HTMLImageElement,
  preset: ExportPreset,
  options: SVGOptions
): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  if (!ctx) {
    throw new Error('Canvas context not available')
  }

  ctx.drawImage(img, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  // Convert to grayscale and detect edges
  const edges = detectEdges(imageData)

  // Convert edges to SVG paths
  const paths = tracePaths(edges, canvas.width, canvas.height, options.precision || 1)

  // Generate SVG with vectorized paths
  const pathsString = paths.map(path =>
    `<path d="${path}" fill="black" stroke="none"/>`
  ).join('\n  ')

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${preset.width / preset.dpi}in"
  height="${preset.height / preset.dpi}in"
  viewBox="0 0 ${canvas.width} ${canvas.height}">
  <title>PicForge Vectorized Design</title>
  <desc>Created with PicForge - Vectorized for Cricut cutting</desc>
  <g id="vectorized">
    ${pathsString}
  </g>
</svg>`
}

/**
 * Detect edges in image using Sobel operator
 */
function detectEdges(imageData: ImageData): boolean[] {
  const width = imageData.width
  const height = imageData.height
  const data = imageData.data
  const edges: boolean[] = new Array(width * height).fill(false)

  // Sobel kernels
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4
          const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3
          const kernelIdx = (ky + 1) * 3 + (kx + 1)
          gx += gray * sobelX[kernelIdx]
          gy += gray * sobelY[kernelIdx]
        }
      }

      const magnitude = Math.sqrt(gx * gx + gy * gy)
      edges[y * width + x] = magnitude > 50
    }
  }

  return edges
}

/**
 * Trace paths from edge detection
 */
function tracePaths(edges: boolean[], width: number, height: number, precision: number): string[] {
  const paths: string[] = []
  const visited = new Set<number>()

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      if (edges[idx] && !visited.has(idx)) {
        const path = traceContour(edges, width, height, x, y, visited, precision)
        if (path) paths.push(path)
      }
    }
  }

  return paths
}

/**
 * Trace a single contour starting from a point
 */
function traceContour(
  edges: boolean[],
  width: number,
  height: number,
  startX: number,
  startY: number,
  visited: Set<number>,
  precision: number
): string | null {
  const points: Array<{ x: number; y: number }> = []
  let x = startX
  let y = startY

  // Simple contour following (clockwise)
  const directions = [
    { dx: 1, dy: 0 },   // right
    { dx: 1, dy: 1 },   // down-right
    { dx: 0, dy: 1 },   // down
    { dx: -1, dy: 1 },  // down-left
    { dx: -1, dy: 0 },  // left
    { dx: -1, dy: -1 }, // up-left
    { dx: 0, dy: -1 },  // up
    { dx: 1, dy: -1 },  // up-right
  ]

  let steps = 0
  const maxSteps = 1000

  while (steps < maxSteps) {
    const idx = y * width + x
    visited.add(idx)

    if (steps % precision === 0) {
      points.push({ x, y })
    }

    let found = false
    for (const dir of directions) {
      const nx = x + dir.dx
      const ny = y + dir.dy

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nidx = ny * width + nx
        if (edges[nidx] && !visited.has(nidx)) {
          x = nx
          y = ny
          found = true
          break
        }
      }
    }

    if (!found || (x === startX && y === startY && steps > 0)) break
    steps++
  }

  if (points.length < 3) return null

  // Convert points to SVG path
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`
  }
  d += ' Z'

  return d
}

/**
 * Download print-ready PDF with full control
 */
export async function downloadPDF(
  imageData: string,
  preset: string,
  filename: string = 'design-print.pdf',
  pdfOptions: PDFOptions = { pageSize: 'letter', orientation: 'portrait' }
): Promise<void> {
  try {
    const presetConfig = EXPORT_PRESETS[preset]
    if (!presetConfig) {
      throw new Error('Invalid preset selected')
    }

    // Load image
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = imageData
    })

    // Calculate page dimensions in mm
    let pageWidth = 215.9  // Letter width in mm
    let pageHeight = 279.4 // Letter height in mm

    if (pdfOptions.pageSize === 'a4') {
      pageWidth = 210
      pageHeight = 297
    } else if (pdfOptions.pageSize === 'custom' && pdfOptions.customWidth && pdfOptions.customHeight) {
      pageWidth = pdfOptions.customWidth
      pageHeight = pdfOptions.customHeight
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: pdfOptions.orientation,
      unit: 'mm',
      format: pdfOptions.pageSize === 'custom' ? [pageWidth, pageHeight] : pdfOptions.pageSize,
    })

    // Calculate image dimensions to fit page
    const imgWidthMm = (presetConfig.width / presetConfig.dpi) * 25.4
    const imgHeightMm = (presetConfig.height / presetConfig.dpi) * 25.4

    const scale = Math.min(
      pageWidth / imgWidthMm,
      pageHeight / imgHeightMm
    )

    const finalWidth = imgWidthMm * scale
    const finalHeight = imgHeightMm * scale
    const x = (pageWidth - finalWidth) / 2
    const y = (pageHeight - finalHeight) / 2

    // Add image to PDF
    pdf.addImage(imageData, 'PNG', x, y, finalWidth, finalHeight)

    // Add metadata if requested
    if (pdfOptions.includeMetadata) {
      pdf.setProperties({
        title: 'PicForge Design',
        subject: `${presetConfig.name} - Print Ready`,
        author: 'PicForge.com',
        keywords: 'design, print, cricut, etsy',
        creator: 'PicForge Image Editor',
      })
    }

    // Save PDF
    pdf.save(filename)

    console.info(`PDF created: ${pageWidth}x${pageHeight}mm, ${pdfOptions.orientation}`)
  } catch (error) {
    console.error('Error creating PDF:', error)
    throw error
  }
}

/**
 * Download as WebP (modern web format with smaller file sizes)
 */
export async function downloadWebP(
  imageData: string,
  preset: string,
  filename: string = 'design.webp',
  quality: number = 0.9
): Promise<void> {
  try {
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

    const canvas = document.createElement('canvas')
    canvas.width = presetConfig.width
    canvas.height = presetConfig.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas context not available')
    }

    const scale = Math.min(
      canvas.width / img.width,
      canvas.height / img.height
    )
    const x = (canvas.width - img.width * scale) / 2
    const y = (canvas.height - img.height * scale) / 2

    ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, filename)
      }
    }, 'image/webp', quality)
  } catch (error) {
    console.error('Error creating WebP:', error)
    throw error
  }
}

/**
 * Download as ICO (for favicon generation)
 */
export async function downloadICO(
  imageData: string,
  filename: string = 'favicon.ico',
  sizes: number[] = [16, 32, 48, 64]
): Promise<void> {
  try {
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = imageData
    })

    // Create multiple sizes for ICO
    const iconImages: Blob[] = []

    for (const size of sizes) {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')

      if (!ctx) continue

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, size, size)

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png')
      })
      iconImages.push(blob)
    }

    // Create ZIP with all icon sizes
    const zip = new JSZip()
    sizes.forEach((size, idx) => {
      zip.file(`icon-${size}x${size}.png`, iconImages[idx])
    })

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, filename.replace('.ico', '-icons.zip'))

    console.info(`Icon pack created with sizes: ${sizes.join(', ')}px`)
  } catch (error) {
    console.error('Error creating ICO:', error)
    throw error
  }
}

/**
 * Estimate file size for export format
 */
export function estimateFileSize(
  width: number,
  height: number,
  format: 'png' | 'jpg' | 'webp' | 'svg' | 'pdf'
): string {
  const pixels = width * height
  let bytes: number

  switch (format) {
    case 'png':
      bytes = pixels * 3 // Rough estimate for PNG
      break
    case 'jpg':
      bytes = pixels * 0.5 // JPG is more compressed
      break
    case 'webp':
      bytes = pixels * 0.3 // WebP is highly compressed
      break
    case 'svg':
      bytes = pixels * 0.1 // SVG with embedded image
      break
    case 'pdf':
      bytes = pixels * 1.5 // PDF with metadata
      break
    default:
      bytes = pixels
  }

  // Convert to human-readable format
  if (bytes < 1024) return `${bytes.toFixed(0)} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
    webp?: boolean
  },
  packName: string = 'cricut-pack',
  onProgress?: (current: number, total: number) => void
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

    let completed = 0
    const total = Object.values(formats).filter(Boolean).length

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

        removeWhiteBackground(ctx, canvas.width, canvas.height)

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/png')
        })
        zip.file('design-transparent.png', blob)
      }
      completed++
      onProgress?.(completed, total)
    }

    // PNG White Background
    if (formats.pngWhiteBg) {
      const canvas = document.createElement('canvas')
      canvas.width = presetConfig.width
      canvas.height = presetConfig.height
      const ctx = canvas.getContext('2d')

      if (ctx) {
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
      completed++
      onProgress?.(completed, total)
    }

    // SVG
    if (formats.svg) {
      const svgContent = createBasicSVG(img, presetConfig, imageData)
      zip.file('design-cricut.svg', svgContent)
      completed++
      onProgress?.(completed, total)
    }

    // WebP
    if (formats.webp) {
      const canvas = document.createElement('canvas')
      canvas.width = presetConfig.width
      canvas.height = presetConfig.height
      const ctx = canvas.getContext('2d')

      if (ctx) {
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        )
        const x = (canvas.width - img.width * scale) / 2
        const y = (canvas.height - img.height * scale) / 2
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/webp', 0.9)
        })
        zip.file('design.webp', blob)
      }
      completed++
      onProgress?.(completed, total)
    }

    // PDF
    if (formats.pdf) {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
      })

      const pageWidth = 215.9
      const pageHeight = 279.4
      const imgWidthMm = (presetConfig.width / presetConfig.dpi) * 25.4
      const imgHeightMm = (presetConfig.height / presetConfig.dpi) * 25.4

      const scale = Math.min(pageWidth / imgWidthMm, pageHeight / imgHeightMm)
      const finalWidth = imgWidthMm * scale
      const finalHeight = imgHeightMm * scale
      const x = (pageWidth - finalWidth) / 2
      const y = (pageHeight - finalHeight) / 2

      pdf.addImage(imageData, 'PNG', x, y, finalWidth, finalHeight)
      const pdfBlob = pdf.output('blob')
      zip.file('design-print.pdf', pdfBlob)
      completed++
      onProgress?.(completed, total)
    }

    // Add README with license info
    const readme = `PicForge Export Package
========================

Preset: ${presetConfig.name}
Resolution: ${presetConfig.width}×${presetConfig.height} (${presetConfig.dpi} DPI)

Files Included:
${formats.pngTransparent ? '- design-transparent.png - For print-on-demand, stickers, sublimation\n' : ''}${formats.pngWhiteBg ? '- design-white-bg.png - Preview/reference image\n' : ''}${formats.svg ? '- design-cricut.svg - For Cricut cutting machines\n' : ''}${formats.webp ? '- design.webp - Modern web format (smaller file size)\n' : ''}${formats.pdf ? '- design-print.pdf - Print-ready PDF\n' : ''}
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
