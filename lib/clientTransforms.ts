/**
 * Client-side image transformations for Transform Roulette
 * These provide instant visual effects when AI generation is unavailable
 */

export async function applyClientTransform(
  imageUrl: string,
  prompt: string
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(imageUrl)
        return
      }

      canvas.width = img.width
      canvas.height = img.height

      // Apply base image
      ctx.drawImage(img, 0, 0)

      // Apply transformations based on prompt keywords
      const promptLower = prompt.toLowerCase()

      // Apocalyptic effects
      if (promptLower.includes('zombie') || promptLower.includes('apocalypse')) {
        applyZombieEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('meteor') || promptLower.includes('strike')) {
        applyMeteorEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('nuclear') || promptLower.includes('wasteland')) {
        applyWastelandEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('alien') || promptLower.includes('invasion')) {
        applyAlienEffect(ctx, canvas.width, canvas.height)
      }
      // Surreal effects
      else if (promptLower.includes('melt')) {
        applyMeltEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('candy')) {
        applyCandyEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('underwater')) {
        applyUnderwaterEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('dali') || promptLower.includes('surreal')) {
        applySurrealEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('float') || promptLower.includes('gravity')) {
        applyZeroGravityEffect(ctx, canvas.width, canvas.height)
      }
      // Movie styles
      else if (promptLower.includes('marvel') || promptLower.includes('superhero')) {
        applySuperheroEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('horror')) {
        applyHorrorEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('star wars')) {
        applyStarWarsEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('western')) {
        applyWesternEffect(ctx, canvas.width, canvas.height)
      }
      // Art styles
      else if (promptLower.includes('van gogh') || promptLower.includes('starry')) {
        applyVanGoghEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('renaissance')) {
        applyRenaissanceEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('80s') || promptLower.includes('retro') || promptLower.includes('synthwave')) {
        applyRetroEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('anime')) {
        applyAnimeEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('banksy') || promptLower.includes('street art')) {
        applyStreetArtEffect(ctx, canvas.width, canvas.height)
      }
      // Weird & Wacky
      else if (promptLower.includes('neon') || promptLower.includes('glow')) {
        applyNeonEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('pizza')) {
        applyPizzaEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('robot')) {
        applyRobotEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('taco')) {
        applyTacoEffect(ctx, canvas.width, canvas.height)
      }
      // Nature
      else if (promptLower.includes('tornado')) {
        applyTornadoEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('fire')) {
        applyFireEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('ice') || promptLower.includes('frozen')) {
        applyIceEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('dinosaur')) {
        applyDinosaurEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('enchanted') || promptLower.includes('forest')) {
        applyEnchantedForestEffect(ctx, canvas.width, canvas.height)
      }
      // Time periods
      else if (promptLower.includes('egypt')) {
        applyEgyptEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('3000') || promptLower.includes('future')) {
        applyFutureEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('medieval')) {
        applyMedievalEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('1920')) {
        apply1920sEffect(ctx, canvas.width, canvas.height)
      }
      // Fantasy
      else if (promptLower.includes('dragon')) {
        applyDragonEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('wizard') || promptLower.includes('magic')) {
        applyMagicEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('fairy')) {
        applyFairyTaleEffect(ctx, canvas.width, canvas.height)
      }
      else if (promptLower.includes('unicorn') || promptLower.includes('rainbow')) {
        applyRainbowEffect(ctx, canvas.width, canvas.height)
      }
      // Default crazy effect
      else {
        applyRandomCrazyEffect(ctx, canvas.width, canvas.height)
      }

      // Convert to data URL
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob))
        } else {
          resolve(imageUrl)
        }
      })
    }

    img.onerror = () => {
      resolve(imageUrl)
    }

    img.src = imageUrl
  })
}

// Effect implementations
function applyZombieEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Greenish tint with high contrast
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] * 0.5 // Red
    data[i + 1] = data[i + 1] * 1.2 // Green
    data[i + 2] = data[i + 2] * 0.3 // Blue
  }

  ctx.putImageData(imageData, 0, 0)

  // Add dark vignette
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2)
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(1, 'rgba(20, 40, 20, 0.8)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

function applyMeteorEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Orange/red overlay
  ctx.fillStyle = 'rgba(255, 100, 0, 0.4)'
  ctx.fillRect(0, 0, width, height)

  // Add meteor streaks
  ctx.strokeStyle = 'rgba(255, 200, 0, 0.8)'
  ctx.lineWidth = 3
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.moveTo(Math.random() * width, 0)
    ctx.lineTo(Math.random() * width, height)
    ctx.stroke()
  }
}

function applyWastelandEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Desaturate and add brown tint
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = gray * 1.2 // Red
    data[i + 1] = gray * 0.9 // Green
    data[i + 2] = gray * 0.6 // Blue
  }

  ctx.putImageData(imageData, 0, 0)
}

function applyAlienEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Green tint with high contrast
  ctx.fillStyle = 'rgba(0, 255, 100, 0.3)'
  ctx.fillRect(0, 0, width, height)

  // Add UFO lights
  ctx.fillStyle = 'rgba(100, 255, 200, 0.6)'
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.arc(Math.random() * width, Math.random() * height/2, 50, 0, Math.PI * 2)
    ctx.fill()
  }
}

function applyMeltEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Distort image downward
  const imageData = ctx.getImageData(0, 0, width, height)
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext('2d')!
  tempCtx.putImageData(imageData, 0, 0)

  ctx.clearRect(0, 0, width, height)
  for (let y = 0; y < height; y++) {
    const wave = Math.sin(y / 30) * 10
    ctx.drawImage(tempCanvas, 0, y, width, 1, wave, y + (y / height) * 20, width, 1)
  }
}

function applyCandyEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Super saturated colors
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.5) // Red
    data[i + 1] = Math.min(255, data[i + 1] * 1.5) // Green
    data[i + 2] = Math.min(255, data[i + 2] * 1.5) // Blue
  }

  ctx.putImageData(imageData, 0, 0)

  // Add candy sparkles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  for (let i = 0; i < 50; i++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2)
  }
}

function applyUnderwaterEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Blue-green tint
  ctx.fillStyle = 'rgba(0, 100, 150, 0.4)'
  ctx.fillRect(0, 0, width, height)

  // Add bubbles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  for (let i = 0; i < 20; i++) {
    ctx.beginPath()
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 20 + 5, 0, Math.PI * 2)
    ctx.fill()
  }
}

function applySurrealEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Invert colors partially
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() > 0.5) {
      data[i] = 255 - data[i] // Red
      data[i + 1] = 255 - data[i + 1] // Green
      data[i + 2] = 255 - data[i + 2] // Blue
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

function applyZeroGravityEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Rotate and float pieces
  const pieces = 5
  const pieceHeight = height / pieces

  for (let i = 0; i < pieces; i++) {
    ctx.save()
    ctx.translate(width/2, (i + 0.5) * pieceHeight)
    ctx.rotate((Math.random() - 0.5) * 0.2)
    ctx.translate(-width/2, -(i + 0.5) * pieceHeight)
    ctx.drawImage(ctx.canvas, 0, i * pieceHeight, width, pieceHeight,
                  Math.random() * 20 - 10, i * pieceHeight + Math.random() * 20 - 10,
                  width, pieceHeight)
    ctx.restore()
  }
}

function applySuperheroEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // High contrast with bright colors
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] > 128 ? 255 : data[i] * 0.5 // Red
    data[i + 1] = data[i + 1] > 128 ? 255 : data[i + 1] * 0.5 // Green
    data[i + 2] = data[i + 2] > 128 ? 255 : data[i + 2] * 0.5 // Blue
  }

  ctx.putImageData(imageData, 0, 0)

  // Add action lines
  ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)'
  ctx.lineWidth = 2
  const centerX = width / 2
  const centerY = height / 2
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + Math.cos(angle) * width, centerY + Math.sin(angle) * height)
    ctx.stroke()
  }
}

function applyHorrorEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Dark and red tinted
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] * 1.2 // Red
    data[i + 1] = data[i + 1] * 0.3 // Green
    data[i + 2] = data[i + 2] * 0.3 // Blue
  }

  ctx.putImageData(imageData, 0, 0)

  // Add dark edges
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2)
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

function applyStarWarsEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Blue hologram effect
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = avg * 0.3 // Red
    data[i + 1] = avg * 0.6 // Green
    data[i + 2] = avg * 1.5 // Blue
  }

  ctx.putImageData(imageData, 0, 0)

  // Add scan lines
  ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)'
  ctx.lineWidth = 1
  for (let y = 0; y < height; y += 4) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

function applyWesternEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Sepia tone
  const imageData = ctx.getImageData(0, 0, width, height)
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

function applyVanGoghEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Swirly, painterly effect with blue/yellow
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    // Enhance blues and yellows
    if (data[i + 2] > data[i] && data[i + 2] > data[i + 1]) {
      // Blue dominant
      data[i + 2] = Math.min(255, data[i + 2] * 1.5)
    } else if (data[i] > 150 && data[i + 1] > 150) {
      // Yellow dominant
      data[i] = Math.min(255, data[i] * 1.3)
      data[i + 1] = Math.min(255, data[i + 1] * 1.3)
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

function applyRenaissanceEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Warm, golden tones
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.2) // Red
    data[i + 1] = Math.min(255, data[i + 1] * 1.1) // Green
    data[i + 2] = data[i + 2] * 0.8 // Blue
  }

  ctx.putImageData(imageData, 0, 0)

  // Add vignette
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2)
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(1, 'rgba(50, 30, 0, 0.5)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

function applyRetroEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Neon pink and cyan
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    if (avg > 128) {
      data[i] = 255 // Red
      data[i + 1] = 0 // Green
      data[i + 2] = 255 // Blue
    } else {
      data[i] = 0 // Red
      data[i + 1] = 255 // Green
      data[i + 2] = 255 // Blue
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

function applyAnimeEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // High saturation, smooth gradients
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    // Increase saturation
    const max = Math.max(data[i], data[i + 1], data[i + 2])
    const factor = max > 0 ? 255 / max : 1
    data[i] = Math.min(255, data[i] * factor * 0.9)
    data[i + 1] = Math.min(255, data[i + 1] * factor * 0.9)
    data[i + 2] = Math.min(255, data[i + 2] * factor * 0.9)
  }

  ctx.putImageData(imageData, 0, 0)
}

function applyStreetArtEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // High contrast black and white with red accents
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    if (data[i] > 200 && data[i + 1] < 100 && data[i + 2] < 100) {
      // Keep red
      data[i] = 255
      data[i + 1] = 0
      data[i + 2] = 0
    } else {
      // Black and white
      const bw = avg > 128 ? 255 : 0
      data[i] = bw
      data[i + 1] = bw
      data[i + 2] = bw
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

function applyNeonEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Edge detection with neon colors
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
    if (brightness > 128) {
      data[i] = 255
      data[i + 1] = 0
      data[i + 2] = 255
    } else {
      data[i] = 0
      data[i + 1] = 255
      data[i + 2] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)

  // Add glow
  ctx.shadowColor = 'rgba(255, 0, 255, 0.5)'
  ctx.shadowBlur = 20
}

function applyPizzaEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Add pizza slices overlay
  ctx.globalAlpha = 0.4
  ctx.fillStyle = '#FFD700'
  ctx.fillRect(0, 0, width, height)

  ctx.globalAlpha = 0.8
  ctx.fillStyle = '#FF6347'
  for (let i = 0; i < 10; i++) {
    ctx.beginPath()
    ctx.arc(Math.random() * width, Math.random() * height, 20, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.globalAlpha = 1
}

function applyRobotEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Pixelate and add metallic sheen
  const pixelSize = 10
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const imageData = ctx.getImageData(x, y, 1, 1)
      const data = imageData.data
      ctx.fillStyle = `rgb(${data[0]}, ${data[1]}, ${data[2]})`
      ctx.fillRect(x, y, pixelSize, pixelSize)
    }
  }

  // Metallic overlay
  ctx.fillStyle = 'rgba(192, 192, 192, 0.2)'
  ctx.fillRect(0, 0, width, height)
}

function applyTacoEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Yellow/brown tint with taco shapes
  ctx.fillStyle = 'rgba(255, 200, 100, 0.3)'
  ctx.fillRect(0, 0, width, height)

  // Draw taco shapes
  ctx.fillStyle = 'rgba(139, 69, 19, 0.5)'
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.beginPath()
    ctx.arc(x, y, 30, 0, Math.PI)
    ctx.fill()
  }
}

function applyTornadoEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Swirl effect
  const centerX = width / 2
  const centerY = height / 2
  const imageData = ctx.getImageData(0, 0, width, height)
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext('2d')!
  tempCtx.putImageData(imageData, 0, 0)

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(0.1)
  ctx.translate(-centerX, -centerY)
  ctx.drawImage(tempCanvas, 0, 0)
  ctx.restore()

  // Add gray overlay
  ctx.fillStyle = 'rgba(100, 100, 100, 0.3)'
  ctx.fillRect(0, 0, width, height)
}

function applyFireEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Red/orange gradient
  const gradient = ctx.createLinearGradient(0, height, 0, 0)
  gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)')
  gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.3)')
  gradient.addColorStop(1, 'rgba(255, 200, 0, 0.1)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

function applyIceEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Blue tint with crystalline effect
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] * 0.5 // Red
    data[i + 1] = data[i + 1] * 0.8 // Green
    data[i + 2] = Math.min(255, data[i + 2] * 1.5) // Blue
  }

  ctx.putImageData(imageData, 0, 0)

  // Add frost edges
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.lineWidth = 2
  for (let i = 0; i < 20; i++) {
    ctx.beginPath()
    const x = Math.random() * width
    const y = Math.random() * height
    for (let j = 0; j < 6; j++) {
      const angle = (j / 6) * Math.PI * 2
      ctx.lineTo(x + Math.cos(angle) * 20, y + Math.sin(angle) * 20)
    }
    ctx.closePath()
    ctx.stroke()
  }
}

function applyDinosaurEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Prehistoric green/brown tones
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] * 0.8 // Red
    data[i + 1] = data[i + 1] * 1.1 // Green
    data[i + 2] = data[i + 2] * 0.6 // Blue
  }

  ctx.putImageData(imageData, 0, 0)
}

function applyEnchantedForestEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Mystical green with sparkles
  ctx.fillStyle = 'rgba(0, 255, 100, 0.2)'
  ctx.fillRect(0, 0, width, height)

  // Add magical sparkles
  ctx.fillStyle = 'rgba(255, 255, 200, 0.9)'
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 3
    ctx.fillRect(x, y, size, size)
  }
}

function applyEgyptEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Sandy golden tones
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.3) // Red
    data[i + 1] = Math.min(255, data[i + 1] * 1.2) // Green
    data[i + 2] = data[i + 2] * 0.6 // Blue
  }

  ctx.putImageData(imageData, 0, 0)
}

function applyFutureEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Holographic effect
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const shift = Math.sin(i / 1000) * 50
    data[i] = Math.min(255, data[i] + shift) // Red
    data[i + 1] = Math.min(255, data[i + 1] - shift) // Green
    data[i + 2] = Math.min(255, data[i + 2] + shift * 2) // Blue
  }

  ctx.putImageData(imageData, 0, 0)

  // Add scan lines
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)'
  ctx.lineWidth = 1
  for (let y = 0; y < height; y += 2) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

function applyMedievalEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Dark ages feel
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] * 0.8 // Red
    data[i + 1] = data[i + 1] * 0.7 // Green
    data[i + 2] = data[i + 2] * 0.6 // Blue
  }

  ctx.putImageData(imageData, 0, 0)

  // Add dark vignette
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2)
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

function apply1920sEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Black and white with grain
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3
    const grain = (Math.random() - 0.5) * 30
    data[i] = gray + grain // Red
    data[i + 1] = gray + grain // Green
    data[i + 2] = gray + grain // Blue
  }

  ctx.putImageData(imageData, 0, 0)
}

function applyDragonEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Fiery effect with scales pattern
  applyFireEffect(ctx, width, height)

  // Add scale pattern
  ctx.strokeStyle = 'rgba(100, 50, 0, 0.3)'
  ctx.lineWidth = 1
  for (let y = 0; y < height; y += 20) {
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI)
      ctx.stroke()
    }
  }
}

function applyMagicEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Purple/blue mystical effect
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] * 0.7 // Red
    data[i + 1] = data[i + 1] * 0.5 // Green
    data[i + 2] = Math.min(255, data[i + 2] * 1.5) // Blue
  }

  ctx.putImageData(imageData, 0, 0)

  // Add magic sparkles
  ctx.fillStyle = 'rgba(255, 0, 255, 0.6)'
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.beginPath()
    ctx.arc(x, y, Math.random() * 5, 0, Math.PI * 2)
    ctx.fill()
  }
}

function applyFairyTaleEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Soft, dreamy effect
  ctx.filter = 'blur(2px)'
  ctx.drawImage(ctx.canvas, 0, 0)
  ctx.filter = 'none'

  // Pink overlay
  ctx.fillStyle = 'rgba(255, 200, 200, 0.2)'
  ctx.fillRect(0, 0, width, height)

  // Add sparkles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  for (let i = 0; i < 100; i++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2)
  }
}

function applyRainbowEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Rainbow gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, width, 0)
  gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)')
  gradient.addColorStop(0.17, 'rgba(255, 150, 0, 0.3)')
  gradient.addColorStop(0.33, 'rgba(255, 255, 0, 0.3)')
  gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.3)')
  gradient.addColorStop(0.67, 'rgba(0, 150, 255, 0.3)')
  gradient.addColorStop(0.83, 'rgba(100, 0, 255, 0.3)')
  gradient.addColorStop(1, 'rgba(255, 0, 255, 0.3)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

function applyRandomCrazyEffect(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Random combination of effects
  const effects = [
    applyZombieEffect,
    applyNeonEffect,
    applyRetroEffect,
    applyCandyEffect,
    applyRainbowEffect,
    applyMagicEffect
  ]

  const randomEffect = effects[Math.floor(Math.random() * effects.length)]
  randomEffect(ctx, width, height)
}