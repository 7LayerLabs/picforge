'use client'

import { useState } from 'react'
import { logger } from '@/lib/logger'
import {
  downloadTransparentPNG,
  downloadSVG,
  downloadPDF,
  downloadWebP,
  downloadJPG,
  SVGOptions
} from '@/lib/exportFormats'
import { addWatermarkIfFree } from '@/lib/watermark'
import { useImageTracking } from '@/hooks/useImageTracking'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  imageData: string
  fileName?: string
  batchMode?: boolean
  onBatchExport?: (imageData: string, format: string) => Promise<void>
}

type FileFormat = 'jpg' | 'png' | 'webp' | 'svg' | 'pdf'

const formats = [
  { id: 'png' as FileFormat, label: 'PNG', desc: 'Transparent', icon: '✨', recommended: true },
  { id: 'jpg' as FileFormat, label: 'JPG', desc: 'Smallest file', icon: '🖼️', recommended: false },
  { id: 'webp' as FileFormat, label: 'WebP', desc: 'Modern web', icon: '🚀', recommended: false },
  { id: 'svg' as FileFormat, label: 'SVG', desc: 'For Cricut', icon: '✂️', recommended: false },
  { id: 'pdf' as FileFormat, label: 'PDF', desc: 'Print ready', icon: '📄', recommended: false },
]

export default function ExportModal({
  isOpen,
  onClose,
  imageData,
  fileName = 'design',
  batchMode = false,
  onBatchExport
}: ExportModalProps) {
  const { usage } = useImageTracking()
  const [fileFormat, setFileFormat] = useState<FileFormat>('png')
  const [isDownloading, setIsDownloading] = useState(false)

  if (!isOpen) return null

  const handleDownload = async () => {
    if (!imageData) return

    setIsDownloading(true)
    try {
      if (batchMode && onBatchExport) {
        await onBatchExport(imageData, fileFormat)
        onClose()
        return
      }

      const finalImageData = await addWatermarkIfFree(imageData, usage?.tier)
      const preset = 'tshirt'

      switch (fileFormat) {
        case 'png':
          await downloadTransparentPNG(finalImageData, preset, `${fileName}.png`)
          break
        case 'jpg':
          await downloadJPG(finalImageData, preset, `${fileName}.jpg`, 0.9)
          break
        case 'webp':
          await downloadWebP(finalImageData, preset, `${fileName}.webp`, 0.9)
          break
        case 'svg':
          const svgOptions: SVGOptions = { vectorize: false, precision: 2, simplify: true }
          await downloadSVG(finalImageData, preset, `${fileName}.svg`, svgOptions)
          break
        case 'pdf':
          await downloadPDF(finalImageData, preset, `${fileName}.pdf`, {
            pageSize: 'letter',
            orientation: 'portrait',
            includeMetadata: true
          })
          break
      }

      setTimeout(onClose, 300)
    } catch (error) {
      logger.error('Download error:', error)
      alert('Failed to download. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Download Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Format Selection */}
          <div className="space-y-2">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setFileFormat(format.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${fileFormat === format.id
                    ? 'bg-teal-50 border-teal-500'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <span className="text-2xl">{format.icon}</span>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{format.label}</span>
                    {format.recommended && (
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{format.desc}</span>
                </div>
                {fileFormat === format.id && (
                  <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
  )
}
