'use client'

import { useState } from 'react'
import { EXPORT_PRESETS, getPresetsByCategory, downloadTransparentPNG, downloadSVG, downloadPDF, downloadExportPack } from '@/lib/exportFormats'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  imageData: string
  fileName?: string
  batchMode?: boolean
  onBatchExport?: (imageData: string, preset: string, formats: any) => Promise<void>
}

type UseCase = 'cricut' | 'etsy' | 'print' | 'social' | 'custom'

export default function ExportModal({ isOpen, onClose, imageData, fileName = 'design', batchMode = false, onBatchExport }: ExportModalProps) {
  const [useCase, setUseCase] = useState<UseCase>('etsy')
  const [selectedPreset, setSelectedPreset] = useState('tshirt')
  const [formats, setFormats] = useState({
    pngTransparent: true,
    pngWhiteBg: false,
    svg: false,
    pdf: false,
  })
  const [isDownloading, setIsDownloading] = useState(false)

  if (!isOpen) return null

  // Auto-select preset based on use case
  const presetsForCategory = getPresetsByCategory(
    useCase === 'custom' ? 'etsy' : useCase
  )

  const handleUseCaseChange = (newUseCase: UseCase) => {
    setUseCase(newUseCase)

    // Auto-configure formats based on use case
    switch (newUseCase) {
      case 'cricut':
        setFormats({ pngTransparent: true, pngWhiteBg: false, svg: true, pdf: false })
        setSelectedPreset('cricut-12x12')
        break
      case 'etsy':
        setFormats({ pngTransparent: true, pngWhiteBg: false, svg: false, pdf: false })
        setSelectedPreset('tshirt')
        break
      case 'print':
        setFormats({ pngTransparent: false, pngWhiteBg: true, svg: false, pdf: true })
        setSelectedPreset('wallart-8x10')
        break
      case 'social':
        setFormats({ pngTransparent: false, pngWhiteBg: true, svg: false, pdf: false })
        setSelectedPreset('instagram')
        break
      default:
        break
    }
  }

  const handleDownload = async () => {
    if (!imageData) return

    setIsDownloading(true)
    try {
      // If batch mode, use the batch export handler
      if (batchMode && onBatchExport) {
        await onBatchExport(imageData, selectedPreset, formats)
        onClose()
        return
      }

      const hasMultipleFormats = Object.values(formats).filter(Boolean).length > 1

      if (hasMultipleFormats) {
        // Download as pack (ZIP file)
        await downloadExportPack(imageData, selectedPreset, formats, `${fileName}-${useCase}-pack`)
      } else {
        // Download single format
        if (formats.pngTransparent) {
          await downloadTransparentPNG(imageData, selectedPreset, `${fileName}-transparent.png`)
        } else if (formats.pngWhiteBg) {
          await downloadTransparentPNG(imageData, selectedPreset, `${fileName}.png`)
        } else if (formats.svg) {
          await downloadSVG(imageData, selectedPreset, `${fileName}.svg`)
        } else if (formats.pdf) {
          await downloadPDF(imageData, selectedPreset, `${fileName}.pdf`)
        }
      }

      // Close modal after successful download
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const presetConfig = EXPORT_PRESETS[selectedPreset]
  const hasMultipleFormats = Object.values(formats).filter(Boolean).length > 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{batchMode ? '📦' : '📥'}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {batchMode ? 'Batch Export - All Images' : 'Download Your Design'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {batchMode ? 'Export all completed images in selected formats' : 'Choose format and size for your project'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Use Case Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              I'm making this for:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'cricut', icon: '✂️', label: 'Cricut Project', desc: 'SVG + PNG' },
                { id: 'etsy', icon: '🛍️', label: 'Etsy Product', desc: 'High-res PNG' },
                { id: 'print', icon: '🖨️', label: 'Print', desc: '300 DPI' },
                { id: 'social', icon: '📱', label: 'Social Media', desc: '1080px' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleUseCaseChange(option.id as UseCase)}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    useCase === option.id
                      ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-400'
                      : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">{option.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-200 dark:border-gray-700" />

          {/* Size Preset Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Size Preset:
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {presetsForCategory.map(({ key, preset }) => (
                <option key={key} value={key}>
                  {preset.name} - {preset.width}×{preset.height}px ({preset.dpi} DPI)
                </option>
              ))}
            </select>

            {/* Preset Info */}
            {presetConfig && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Print size:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {(presetConfig.width / presetConfig.dpi).toFixed(1)}" × {(presetConfig.height / presetConfig.dpi).toFixed(1)}"
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600 dark:text-gray-400">Quality:</span>
                  <span className="font-semibold text-teal-600">{presetConfig.dpi} DPI {presetConfig.dpi >= 300 ? '(Print Quality ✓)' : ''}</span>
                </div>
              </div>
            )}
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Formats to include:
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={formats.pngTransparent}
                  onChange={(e) => setFormats({ ...formats, pngTransparent: e.target.checked })}
                  className="w-5 h-5 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">PNG (Transparent Background)</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Removes white backgrounds • Perfect for Etsy, print-on-demand, stickers</div>
                </div>
                <span className="text-teal-600 font-semibold">✓ Recommended</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={formats.pngWhiteBg}
                  onChange={(e) => setFormats({ ...formats, pngWhiteBg: e.target.checked })}
                  className="w-5 h-5 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white">PNG (White Background)</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Preview/reference image</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={formats.svg}
                  onChange={(e) => setFormats({ ...formats, svg: e.target.checked })}
                  className="w-5 h-5 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    SVG (Vector - Cricut Ready)
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full font-semibold">PRO</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">For Cricut cutting machines</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={formats.pdf}
                  onChange={(e) => setFormats({ ...formats, pdf: e.target.checked })}
                  className="w-5 h-5 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    PDF (Print-Ready)
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full font-semibold">PRO</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Professional printing</div>
                </div>
              </label>
            </div>
          </div>

          {/* Download Info */}
          {hasMultipleFormats && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <div className="font-semibold text-blue-900 dark:text-blue-300">Multiple Formats Selected</div>
                  <div className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    All files will be downloaded as a ZIP package with README included.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pro Feature Notice */}
          {(formats.svg || formats.pdf) && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="font-semibold text-purple-900 dark:text-purple-300">Pro Feature</div>
                  <div className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                    {useCase === 'cricut' && 'SVG exports are available on Creator tier ($19/mo) and above.'}
                    {useCase === 'print' && 'Print-ready PDF exports are available on Pro tier ($49/mo).'}
                  </div>
                  <button className="mt-2 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-all">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Download Button */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 p-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading || !Object.values(formats).some(Boolean)}
              className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Preparing Download...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  {batchMode
                    ? 'Export All Images (ZIP)'
                    : hasMultipleFormats
                      ? 'Download Pack (ZIP)'
                      : 'Download'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
