'use client'

import { useState } from 'react'
import { EXPORT_PRESETS, getPresetsByCategory, downloadTransparentPNG } from '@/lib/exportFormats'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  imageData: string
  fileName?: string
  batchMode?: boolean
  onBatchExport?: (imageData: string, format: string) => Promise<void>
}

type FileFormat = 'jpg' | 'png'
type UseCase = 'cricut' | 'etsy' | 'print' | 'social'

export default function ExportModal({ isOpen, onClose, imageData, fileName = 'design', batchMode = false, onBatchExport }: ExportModalProps) {
  const [fileFormat, setFileFormat] = useState<FileFormat>('png')
  const [useCase, setUseCase] = useState<UseCase>('etsy')
  const [isDownloading, setIsDownloading] = useState(false)

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

      // Download in selected format
      const fileExtension = fileFormat === 'jpg' ? '.jpg' : '.png'
      const fullFileName = `${fileName}${fileExtension}`

      if (fileFormat === 'jpg') {
        // For JPG, download directly
        const link = document.createElement('a')
        link.href = imageData
        link.download = fullFileName
        link.click()
      } else {
        // For PNG, use the transparent PNG download function
        await downloadTransparentPNG(imageData, 'tshirt', fullFileName)
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
          {/* Format Selection - Simple JPG vs PNG */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Choose Format:
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* JPG Option */}
              <button
                onClick={() => setFileFormat('jpg')}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                  fileFormat === 'jpg'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-400 ring-2 ring-teal-200 dark:ring-teal-800'
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🖼️</div>
                  <div className="font-bold text-gray-900 dark:text-white mb-2">JPG</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Smaller file size<br/>Best for web & sharing
                  </div>
                </div>
              </button>

              {/* PNG Option */}
              <button
                onClick={() => setFileFormat('png')}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                  fileFormat === 'png'
                    ? 'bg-teal-50 border-teal-500 dark:bg-teal-900/20 dark:border-teal-400 ring-2 ring-teal-200 dark:ring-teal-800'
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">✨</div>
                  <div className="font-bold text-gray-900 dark:text-white mb-2">PNG</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    High quality<br/>Transparency support
                  </div>
                </div>
              </button>
            </div>
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
                  Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
