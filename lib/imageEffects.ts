import { logger } from './logger';

// Bulletproof image effects that ACTUALLY WORK
export const applyImageEffect = async (
  imageDataUrl: string,
  effect: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', {
          willReadFrequently: true,
          alpha: true
        })

        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        canvas.width = img.width
        canvas.height = img.height

        // Draw original image
        ctx.drawImage(img, 0, 0)

        const effectLower = effect.toLowerCase()
        logger.log(`Applying effect: ${effect}`)

        // DRAMATIC EFFECTS THAT ARE VISIBLE
        if (effectLower.includes('grayscale') || effectLower.includes('black')) {
          logger.log('Applying GRAYSCALE')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
            data[i] = gray     // red
            data[i + 1] = gray // green
            data[i + 2] = gray // blue
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('invert')) {
          logger.log('Applying INVERT')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]         // red
            data[i + 1] = 255 - data[i + 1] // green
            data[i + 2] = 255 - data[i + 2] // blue
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('sepia') || effectLower.includes('vintage')) {
          logger.log('Applying SEPIA')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]

            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('blur')) {
          logger.log('Applying BLUR')
          ctx.filter = 'blur(8px)'
          ctx.drawImage(canvas, 0, 0)
          ctx.filter = 'none'
        }

        if (effectLower.includes('bright')) {
          logger.log('Applying BRIGHTNESS')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          const factor = 1.5

          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * factor)
            data[i + 1] = Math.min(255, data[i + 1] * factor)
            data[i + 2] = Math.min(255, data[i + 2] * factor)
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('dark')) {
          logger.log('Applying DARKNESS')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          const factor = 0.5

          for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * factor
            data[i + 1] = data[i + 1] * factor
            data[i + 2] = data[i + 2] * factor
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('red')) {
          logger.log('Applying RED FILTER')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.5)     // boost red
            data[i + 1] = data[i + 1] * 0.5             // reduce green
            data[i + 2] = data[i + 2] * 0.5             // reduce blue
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('blue')) {
          logger.log('Applying BLUE FILTER')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * 0.5                     // reduce red
            data[i + 1] = data[i + 1] * 0.7             // reduce green
            data[i + 2] = Math.min(255, data[i + 2] * 1.5) // boost blue
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('green')) {
          logger.log('Applying GREEN FILTER')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * 0.5                     // reduce red
            data[i + 1] = Math.min(255, data[i + 1] * 1.5) // boost green
            data[i + 2] = data[i + 2] * 0.5             // reduce blue
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('contrast')) {
          logger.log('Applying HIGH CONTRAST')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          const factor = 2

          for (let i = 0; i < data.length; i += 4) {
            data[i] = ((data[i] - 128) * factor) + 128
            data[i + 1] = ((data[i + 1] - 128) * factor) + 128
            data[i + 2] = ((data[i + 2] - 128) * factor) + 128

            // Clamp values
            data[i] = Math.max(0, Math.min(255, data[i]))
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1]))
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2]))
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('pixelate')) {
          logger.log('Applying PIXELATE')
          const pixelSize = 10
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          for (let y = 0; y < canvas.height; y += pixelSize) {
            for (let x = 0; x < canvas.width; x += pixelSize) {
              const index = (y * canvas.width + x) * 4
              const r = data[index]
              const g = data[index + 1]
              const b = data[index + 2]

              // Apply to pixel block
              for (let dy = 0; dy < pixelSize && y + dy < canvas.height; dy++) {
                for (let dx = 0; dx < pixelSize && x + dx < canvas.width; dx++) {
                  const blockIndex = ((y + dy) * canvas.width + (x + dx)) * 4
                  data[blockIndex] = r
                  data[blockIndex + 1] = g
                  data[blockIndex + 2] = b
                }
              }
            }
          }

          ctx.putImageData(imageData, 0, 0)
        }

        // NEW EFFECTS

        if (effectLower.includes('sharpen')) {
          logger.log('Applying SHARPEN')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          const width = canvas.width
          const height = canvas.height

          // Sharpening kernel
          const kernel = [
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0
          ]

          const tempData = new Uint8ClampedArray(data)

          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              for (let c = 0; c < 3; c++) {
                let sum = 0
                for (let ky = -1; ky <= 1; ky++) {
                  for (let kx = -1; kx <= 1; kx++) {
                    const idx = ((y + ky) * width + (x + kx)) * 4 + c
                    const kernelIdx = (ky + 1) * 3 + (kx + 1)
                    sum += tempData[idx] * kernel[kernelIdx]
                  }
                }
                const idx = (y * width + x) * 4 + c
                data[idx] = Math.max(0, Math.min(255, sum))
              }
            }
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('vignette')) {
          logger.log('Applying VIGNETTE')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)

          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const dx = x - centerX
              const dy = y - centerY
              const distance = Math.sqrt(dx * dx + dy * dy)
              const vignette = 1 - Math.pow(distance / maxDistance, 2) * 0.7

              const idx = (y * canvas.width + x) * 4
              data[idx] = data[idx] * vignette
              data[idx + 1] = data[idx + 1] * vignette
              data[idx + 2] = data[idx + 2] * vignette
            }
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('saturation')) {
          logger.log('Applying SATURATION')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          const saturation = effectLower.includes('reduce') ? 0.3 : 1.8

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]

            const gray = 0.299 * r + 0.587 * g + 0.114 * b

            data[i] = Math.max(0, Math.min(255, gray + saturation * (r - gray)))
            data[i + 1] = Math.max(0, Math.min(255, gray + saturation * (g - gray)))
            data[i + 2] = Math.max(0, Math.min(255, gray + saturation * (b - gray)))
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('warm')) {
          logger.log('Applying WARM TONE')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.15)     // boost red
            data[i + 1] = Math.min(255, data[i + 1] * 1.05) // slight boost green
            data[i + 2] = data[i + 2] * 0.9             // reduce blue
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('cool')) {
          logger.log('Applying COOL TONE')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          for (let i = 0; i < data.length; i += 4) {
            data[i] = data[i] * 0.9                     // reduce red
            data[i + 1] = Math.min(255, data[i + 1] * 1.05) // slight boost green
            data[i + 2] = Math.min(255, data[i + 2] * 1.15) // boost blue
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('grain') || effectLower.includes('film')) {
          logger.log('Applying VINTAGE FILM GRAIN')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 30
            data[i] = Math.max(0, Math.min(255, data[i] + noise))
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('glitch') || effectLower.includes('vhs')) {
          logger.log('Applying GLITCH/VHS')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          // RGB channel shift
          for (let i = 0; i < data.length; i += 4) {
            if (i + 12 < data.length) {
              data[i] = data[i + 8]       // shift red
              data[i + 2] = data[i + 4]   // shift blue
            }
          }

          // Add scanlines
          for (let y = 0; y < canvas.height; y += 3) {
            for (let x = 0; x < canvas.width; x++) {
              const idx = (y * canvas.width + x) * 4
              data[idx] = data[idx] * 0.8
              data[idx + 1] = data[idx + 1] * 0.8
              data[idx + 2] = data[idx + 2] * 0.8
            }
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('sketch')) {
          logger.log('Applying SKETCH')
          // First convert to grayscale
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
            data[i] = gray
            data[i + 1] = gray
            data[i + 2] = gray
          }

          // Edge detection
          const width = canvas.width
          const height = canvas.height
          const tempData = new Uint8ClampedArray(data)

          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              const idx = (y * width + x) * 4
              const gx = -tempData[((y-1) * width + (x-1)) * 4] + tempData[((y-1) * width + (x+1)) * 4]
                       -2 * tempData[(y * width + (x-1)) * 4] + 2 * tempData[(y * width + (x+1)) * 4]
                       -tempData[((y+1) * width + (x-1)) * 4] + tempData[((y+1) * width + (x+1)) * 4]

              const gy = -tempData[((y-1) * width + (x-1)) * 4] - 2 * tempData[((y-1) * width + x) * 4] - tempData[((y-1) * width + (x+1)) * 4]
                       +tempData[((y+1) * width + (x-1)) * 4] + 2 * tempData[((y+1) * width + x) * 4] + tempData[((y+1) * width + (x+1)) * 4]

              const magnitude = 255 - Math.min(255, Math.sqrt(gx * gx + gy * gy))

              data[idx] = magnitude
              data[idx + 1] = magnitude
              data[idx + 2] = magnitude
            }
          }

          ctx.putImageData(imageData, 0, 0)
        }

        if (effectLower.includes('resize')) {
          logger.log('Applying RESIZE')
          // Resize to max 1920px width while maintaining aspect ratio
          const maxWidth = 1920
          if (canvas.width > maxWidth) {
            const ratio = maxWidth / canvas.width
            const newWidth = maxWidth
            const newHeight = canvas.height * ratio

            const tempCanvas = document.createElement('canvas')
            tempCanvas.width = newWidth
            tempCanvas.height = newHeight
            const tempCtx = tempCanvas.getContext('2d')

            if (tempCtx) {
              tempCtx.drawImage(canvas, 0, 0, newWidth, newHeight)
              canvas.width = newWidth
              canvas.height = newHeight
              ctx.drawImage(tempCanvas, 0, 0)
            }
          }
        }

        if (effectLower.includes('enhance') || effectLower.includes('auto')) {
          logger.log('Applying AUTO-ENHANCE')
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          // Auto-levels: stretch histogram
          let min = 255, max = 0
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
            if (avg < min) min = avg
            if (avg > max) max = avg
          }

          const range = max - min
          if (range > 0) {
            for (let i = 0; i < data.length; i += 4) {
              data[i] = ((data[i] - min) / range) * 255
              data[i + 1] = ((data[i + 1] - min) / range) * 255
              data[i + 2] = ((data[i + 2] - min) / range) * 255
            }
          }

          ctx.putImageData(imageData, 0, 0)
        }

        // Get the final result
        const result = canvas.toDataURL('image/png', 1.0)
        logger.log(`Effect applied successfully: ${effect}`)
        resolve(result)

      } catch (error) {
        logger.error('Error applying effect:', error)
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = imageDataUrl
  })
}