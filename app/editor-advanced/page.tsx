'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { FiltersPanel, type FilterSettings } from '@/components/FiltersPanel'
import { LayersPanel, type Layer } from '@/components/LayersPanel'
import { v4 as uuid } from 'uuid'

function applyCssFilters(ctx: CanvasRenderingContext2D, filters: FilterSettings) {
  const f = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`
  ctx.filter = f
}

export default function AdvancedEditorPage() {
  const [baseImage, setBaseImage] = useState<string | null>(null)
  const [layers, setLayers] = useState<Layer[]>([])
  const [filters, setFilters] = useState<FilterSettings>({ brightness: 100, contrast: 100, saturation: 100, blur: 0 })

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Render pipeline
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imgs: HTMLImageElement[] = []
    const sources: { img: HTMLImageElement; layer?: Layer }[] = []

    const add = (src: string, layer?: Layer) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = src
      imgs.push(img)
      sources.push({ img, layer })
    }

    if (baseImage) add(baseImage)
    layers.filter(l => l.visible).forEach(l => add(l.imageUrl, l))

    Promise.all(imgs.map(i => new Promise<void>(res => { if (i.complete) res(); else i.onload = () => res() }))).then(() => {
      const w = imgs[0]?.naturalWidth || 1024
      const h = imgs[0]?.naturalHeight || 1024
      canvas.width = w
      canvas.height = h
      ctx.clearRect(0,0,w,h)

      // Base image with filters
      if (imgs[0]) {
        applyCssFilters(ctx, filters)
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
        ctx.drawImage(imgs[0], 0, 0, w, h)
      }

      // Layers
      applyCssFilters(ctx, { brightness: 100, contrast: 100, saturation: 100, blur: 0 })
      for (let i = 1; i < sources.length; i++) {
        const s = sources[i]
        const lay = s.layer!
        ctx.globalAlpha = lay.opacity
        ctx.globalCompositeOperation = lay.blendMode
        ctx.drawImage(s.img, 0, 0, w, h)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      ctx.filter = 'none'
    })
  }, [baseImage, layers, filters])

  const addLayerFromFile = (file: File) => {
    const url = URL.createObjectURL(file)
    setLayers(prev => [...prev, { id: uuid(), name: file.name, imageUrl: url, opacity: 1, visible: true, blendMode: 'source-over' }])
  }

  const onUploadBase = (file: File) => {
    const url = URL.createObjectURL(file)
    setBaseImage(url)
  }

  const reorder = (from: number, to: number) => {
    setLayers(prev => {
      const copy = [...prev]
      const [m] = copy.splice(from, 1)
      copy.splice(to, 0, m)
      return copy
    })
  }

  const updateToggle = (id: string, visible: boolean) => setLayers(prev => prev.map(l => l.id === id ? { ...l, visible } : l))
  const updateOpacity = (id: string, opacity: number) => setLayers(prev => prev.map(l => l.id === id ? { ...l, opacity } : l))
  const updateBlend = (id: string, mode: GlobalCompositeOperation) => setLayers(prev => prev.map(l => l.id === id ? { ...l, blendMode: mode } : l))
  const updateRename = (id: string, name: string) => setLayers(prev => prev.map(l => l.id === id ? { ...l, name } : l))
  const removeLayer = (id: string) => setLayers(prev => prev.filter(l => l.id !== id))

  const downloadPng = () => {
    const c = canvasRef.current
    if (!c) return
    const url = c.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'advanced-edit.png'
    a.click()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-6 px-6 py-8">
      {/* Left tools */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold">Base Image</h2>
          <input type="file" accept="image/*" onChange={e => e.target.files && onUploadBase(e.target.files[0])} />
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-semibold">Add Layer</h2>
          <input type="file" accept="image/*" onChange={e => e.target.files && addLayerFromFile(e.target.files[0])} />
        </div>
        <FiltersPanel value={filters} onChange={setFilters} />
        <button onClick={downloadPng} className="w-full px-3 py-2 rounded bg-teal-600 text-white text-sm hover:bg-teal-700">Download PNG</button>
      </div>

      {/* Canvas */}
      <div className="flex items-center justify-center bg-gray-50 rounded border min-h-[60vh]">
        <canvas ref={canvasRef} className="max-w-full h-auto" />
      </div>

      {/* Layers */}
      <div>
        <LayersPanel
          layers={layers}
          onReorder={reorder}
          onToggle={updateToggle}
          onOpacity={updateOpacity}
          onBlend={updateBlend}
          onRename={updateRename}
          onRemove={removeLayer}
        />
      </div>
    </div>
  )
}


