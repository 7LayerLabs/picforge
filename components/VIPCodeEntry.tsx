'use client'

import { useState } from 'react'
import { KeyRound } from 'lucide-react'

export default function VIPCodeEntry() {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [showInput, setShowInput] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setIsSuccess(true)
        // Reload page to apply VIP status
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setMessage(data.error || 'Invalid code')
        setIsSuccess(false)
      }
    } catch (error) {
      setMessage('Failed to validate code')
      setIsSuccess(false)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          title="Enter VIP Code"
        >
          <KeyRound className="w-4 h-4 text-gray-600" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <KeyRound className="w-4 h-4" />
              <span>VIP Access Code</span>
            </div>

            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter VIP code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />

            {message && (
              <p className={`text-xs ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                Activate
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInput(false)
                  setMessage('')
                  setCode('')
                }}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}