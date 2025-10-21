'use client'

import { useState } from 'react'
import {
  EXPORT_PRESETS,
  getPresetsByCategory,
  downloadTransparentPNG,
  downloadSVG,
  downloadPDF,
  downloadWebP,
  downloadICO,
  estimateFileSize,
  downloadExportPack,
  PDFOptions,
  SVGOptions
} from '@/lib/exportFormats'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  imageData: string
  fileName?: string
  batchMode?: boolean
  onBatchExport?: (imageData: string, format: string) => Promise<void>
}

type FileFormat = 'jpg' | 'png' | 'webp' | 'svg' | 'pdf' | 'ico' | 'pack'
type UseCase = 'cricut' | 'etsy' | 'print' | 'social'

export default function ExportModal({
  isOpen,
  onClose,
  imageData,
  fileName = 'design',
  batchMode = false,
  onBatchExport
}: ExportModalProps) {
  const [fileFormat, setFileFormat] = useState<FileFormat>('png')
  const [useCase, setUseCase] = useState<UseCase>('etsy')
  const [isDownloading, setIsDownloading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // PDF options
  const [pdfPageSize, setPdfPageSize] = useState<'letter' | 'a4'>('letter')
  const [pdfOrientation, setPdfOrientation] = useState<'portrait' | 'landscape'>('portrait')

  // SVG options
  const [svgVectorize, setSvgVectorize] = useState(false)

  // Quality slider
  const [quality, setQuality] = useState(90)

  // Export pack options
  const [packFormats, setPackFormats] = useState({
    pngTransparent: true,
    pngWhiteBg: true,
    svg: true,
    pdf: false,
    webp: true
  })

  if (!isOpen) return null

  const handleDownload = async () => {
    if (!imageData) return

    setIsDownloading(true)
    try {
      // If batch mode, use the batch export handler
      if (batchMode && onBatchExport) {
        await onBatchExport(imageData, fileFormat)
        onClose()
        return
      }

      const preset = 'tshirt' // Default preset for now
      const fullFileName = `${fileName}.${fileFormat}`

      // Download based on selected format
      switch (fileFormat) {
        case 'png':
          await downloadTransparentPNG(imageData, preset, `${fileName}.png`)
          break

        case 'jpg':
          const link = document.createElement('a')
          link.href = imageData
          link.download = `${fileName}.jpg`
          link.click()
          break

        case 'webp':
          await downloadWebP(imageData, preset, `${fileName}.webp`, quality / 100)
          break

        case 'svg':
          const svgOptions: SVGOptions = {
            vectorize: svgVectorize,
            precision: 2,
            simplify: true
          }
          await downloadSVG(imageData, preset, `${fileName}.svg`, svgOptions)
          break

        case 'pdf':
          const pdfOptions: PDFOptions = {
            pageSize: pdfPageSize,
            orientation: pdfOrientation,
            includeMetadata: true
          }
          await downloadPDF(imageData, preset, `${fileName}.pdf`, pdfOptions)
          break

        case 'ico':
          await downloadICO(imageData, `${fileName}.ico`, [16, 32, 48, 64, 128])
          break

        case 'pack':
          await downloadExportPack(
            imageData,
            preset,
            packFormats,
            `${fileName}-pack`,
            (current, total) => {
              console.log(`Packing: ${current}/${total}`)
            }
          )
          break

        default:
          throw new Error('Unsupported format')
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

  // Get file size estimate
  const getFileSizeEstimate = () => {
    const presetConfig = EXPORT_PRESETS['tshirt']
    if (fileFormat === 'pack') return 'Multiple files'
    if (fileFormat === 'ico') return '100-500 KB'

    // Map fileFormat to estimateFileSize format type
    const formatMap: Record<string, 'png' | 'jpg' | 'webp' | 'svg' | 'pdf'> = {
      png: 'png',
      jpg: 'jpg',
      webp: 'webp',
      svg: 'svg',
      pdf: 'pdf'
    }

    const format = formatMap[fileFormat as keyof typeof formatMap] || 'png'
    return estimateFileSize(presetConfig.width, presetConfig.height, format)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-200 dark:border-gray-700">
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
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Choose Format:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* JPG */}
              <button
                onClick={() => setFileFormat('jpg')}
                className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                  fileFormat === 'jpg'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-400 ring-2 ring-teal-200'
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🖼️</div>
                  <div className="font-bold text-sm">JPG</div>
                  <div className="text-xs text-gray-500">Small size</div>
                </div>
              </button>

              {/* PNG */}
              <button
                onClick={() => setFileFormat('png')}
                className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                  fileFormat === 'png'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-400 ring-2 ring-teal-200'
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">✨</div>
                  <div className="font-bold text-sm">PNG</div>
                  <div className="text-xs text-gray-500">Transparent</div>
                </div>
              </button>

              {/* WebP */}
              <button
                onClick={() => setFileFormat('webp')}
                className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                  fileFormat === 'webp'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-400 ring-2 ring-teal-200'
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🚀</div>
                  <div className="font-bold text-sm">WebP</div>
                  <div className="text-xs text-gray-500">Modern</div>
                </div>
              </button>

              {/* SVG */}
              <button
                onClick={() => setFileFormat('svg')}
                className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                  fileFormat === 'svg'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-400 ring-2 ring-teal-200'
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">✂️</div>
                  <div className="font-bold text-sm">SVG</div>
                  <div className="text-xs text-gray-500">Cricut</div>
                </div>
              </button>

              {/* PDF */}
              <button
                onClick={() => setFileFormat('pdf')}
                className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                  fileFormat === 'pdf'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-400 ring-2 ring-teal-200'
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">📄</div>
                  <div className="font-bold text-sm">PDF</div>
                  <div className="text-xs text-gray-500">Print ready</div>
                </div>
              </button>

              {/* ICO */}
              <button
                onClick={() => setFileFormat('ico')}
                className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                  fileFormat === 'ico'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-400 ring-2 ring-teal-200'
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="font-bold text-sm">ICO</div>
                  <div className="text-xs text-gray-500">Favicon</div>
                </div>
              </button>

              {/* Export Pack */}
              <button
                onClick={() => setFileFormat('pack')}
                className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                  fileFormat === 'pack'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-400 ring-2 ring-teal-200'
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">📦</div>
                  <div className="font-bold text-sm">Pack</div>
                  <div className="text-xs text-gray-500">All formats</div>
                </div>
              </button>
            </div>
          </div>

          {/* Format-specific options */}
          {fileFormat === 'pdf' && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">PDF Options</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Page Size
                  </label>
                  <select
                    value={pdfPageSize}
                    onChange={(e) => setPdfPageSize(e.target.value as 'letter' | 'a4')}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  >
                    <option value="letter">Letter (8.5&quot; × 11&quot;)</option>
                    <option value="a4">A4 (210mm × 297mm)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Orientation
                  </label>
                  <select
                    value={pdfOrientation}
                    onChange={(e) => setPdfOrientation(e.target.value as 'portrait' | 'landscape')}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {fileFormat === 'svg' && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">SVG Options</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={svgVectorize}
                  onChange={(e) => setSvgVectorize(e.target.checked)}
                  className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Enable vectorization (experimental - better for Cricut cutting)
                </span>
              </label>
              {!svgVectorize && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Basic SVG with embedded image will be created. Enable vectorization for true vector paths.
                </p>
              )}
            </div>
          )}

          {(fileFormat === 'webp' || fileFormat === 'jpg') && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quality: {quality}%</h3>
              <input
                type="range"
                min="60"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          )}

          {fileFormat === 'pack' && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Select Formats to Include</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packFormats.pngTransparent}
                    onChange={(e) => setPackFormats({ ...packFormats, pngTransparent: e.target.checked })}
                    className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">PNG Transparent (for Etsy/print)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packFormats.pngWhiteBg}
                    onChange={(e) => setPackFormats({ ...packFormats, pngWhiteBg: e.target.checked })}
                    className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">PNG White Background (preview)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packFormats.svg}
                    onChange={(e) => setPackFormats({ ...packFormats, svg: e.target.checked })}
                    className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">SVG (for Cricut)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packFormats.webp}
                    onChange={(e) => setPackFormats({ ...packFormats, webp: e.target.checked })}
                    className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">WebP (modern web format)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packFormats.pdf}
                    onChange={(e) => setPackFormats({ ...packFormats, pdf: e.target.checked })}
                    className="w-4 h-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">PDF (print ready)</span>
                </label>
              </div>
            </div>
          )}

          {/* File size estimate */}
          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated file size:</span>
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{getFileSizeEstimate()}</span>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-200 dark:border-gray-700" />

          {/* Use Case Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              I am making this for:
            </label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value as UseCase)}
              className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent font-medium"
            >
              <option value="etsy">Etsy product</option>
              <option value="cricut">Cricut product</option>
              <option value="print">Print</option>
              <option value="social">Social media</option>
            </select>
          </div>
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
              disabled={isDownloading}
              className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Download {fileFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
