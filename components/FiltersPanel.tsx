import React from 'react'

export type FilterSettings = {
  brightness: number
  contrast: number
  saturation: number
  blur: number
}

export function FiltersPanel({ value, onChange }: { value: FilterSettings; onChange: (v: FilterSettings) => void }) {
  const set = (k: keyof FilterSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, [k]: Number(e.target.value) })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Filters</h3>
      <div className="space-y-2">
        <label className="text-xs text-gray-600">Brightness ({value.brightness}%)</label>
        <input type="range" min={0} max={200} value={value.brightness} onChange={set('brightness')} className="w-full" />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-gray-600">Contrast ({value.contrast}%)</label>
        <input type="range" min={0} max={200} value={value.contrast} onChange={set('contrast')} className="w-full" />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-gray-600">Saturation ({value.saturation}%)</label>
        <input type="range" min={0} max={200} value={value.saturation} onChange={set('saturation')} className="w-full" />
      </div>
      <div className="space-y-2">
        <label className="text-xs text-gray-600">Blur ({value.blur}px)</label>
        <input type="range" min={0} max={20} value={value.blur} onChange={set('blur')} className="w-full" />
      </div>
    </div>
  )
}


