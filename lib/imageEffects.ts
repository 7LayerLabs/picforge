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
        console.log(`Applying effect: ${effect}`)

        // DRAMATIC EFFECTS THAT ARE VISIBLE
        if (effectLower.includes('grayscale') || effectLower.includes('black')) {
          console.log('Applying GRAYSCALE')
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
          console.log('Applying INVERT')
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
          console.log('Applying SEPIA')
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
          console.log('Applying BLUR')
          ctx.filter = 'blur(8px)'
          ctx.drawImage(canvas, 0, 0)
          ctx.filter = 'none'
        }

        if (effectLower.includes('bright')) {
          console.log('Applying BRIGHTNESS')
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
          console.log('Applying DARKNESS')
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
          console.log('Applying RED FILTER')
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
          console.log('Applying BLUE FILTER')
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
          console.log('Applying GREEN FILTER')
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
          console.log('Applying HIGH CONTRAST')
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
          console.log('Applying PIXELATE')
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

        // Get the final result
        const result = canvas.toDataURL('image/png', 1.0)
        console.log(`Effect applied successfully: ${effect}`)
        resolve(result)

      } catch (error) {
        console.error('Error applying effect:', error)
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = imageDataUrl
  })
}