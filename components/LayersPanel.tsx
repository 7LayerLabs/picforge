import React from 'react'

export type Layer = {
  id: string
  name: string
  imageUrl: string
  opacity: number
  visible: boolean
  blendMode: GlobalCompositeOperation
}

export function LayersPanel({
  layers,
  onReorder,
  onToggle,
  onOpacity,
  onBlend,
  onRename,
  onRemove,
}: {
  layers: Layer[]
  onReorder: (fromIndex: number, toIndex: number) => void
  onToggle: (id: string, visible: boolean) => void
  onOpacity: (id: string, opacity: number) => void
  onBlend: (id: string, mode: GlobalCompositeOperation) => void
  onRename: (id: string, name: string) => void
  onRemove: (id: string) => void
}) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= layers.length) return
    onReorder(i, j)
  }

  const blendModes: GlobalCompositeOperation[] = [
    'source-over', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light'
  ]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Layers</h3>
      <div className="space-y-2">
        {layers.map((l, i) => (
          <div key={l.id} className="border rounded p-2 bg-white">
            <div className="flex items-center gap-2">
              <button className="text-xs px-2 py-1 border rounded" onClick={() => move(i, -1)}>Up</button>
              <button className="text-xs px-2 py-1 border rounded" onClick={() => move(i, 1)}>Down</button>
              <input
                className="text-sm border rounded px-2 py-1 flex-1"
                value={l.name}
                onChange={(e) => onRename(l.id, e.target.value)}
              />
              <label className="text-xs flex items-center gap-1">
                <input type="checkbox" checked={l.visible} onChange={(e) => onToggle(l.id, e.target.checked)} />
                Visible
              </label>
              <button className="text-xs px-2 py-1 border rounded text-red-600" onClick={() => onRemove(l.id)}>Remove</button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input type="range" min={0} max={1} step={0.01} value={l.opacity} onChange={(e) => onOpacity(l.id, Number(e.target.value))} />
              <span className="text-xs text-gray-600">{Math.round(l.opacity * 100)}%</span>
              <select className="text-xs border rounded px-2 py-1" value={l.blendMode} onChange={(e) => onBlend(l.id, e.target.value as GlobalCompositeOperation)}>
                {blendModes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


