'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [instructions, setInstructions] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !instructions) {
      setSubmitMessage('Please select an image and enter instructions')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('prompt', instructions)

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage(`Success! Image size: ${(data.imageSize / 1024).toFixed(2)} KB`)
        console.log('Response from server:', data)
      } else {
        setSubmitMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setSelectedFile(null)
    setInstructions('')
    setSubmitMessage('')
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        <h1 className="text-3xl font-bold text-center">Image Upload</h1>

        {!selectedImage ? (
          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Choose Image
            </label>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="relative w-full max-w-3xl h-[600px] border-2 border-gray-200 rounded-lg overflow-hidden">
              <Image
                src={selectedImage}
                alt="Uploaded thumbnail"
                fill
                className="object-contain"
              />
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter instructions for editing the thumbnail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              />

              <div className="flex gap-4 justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                >
                  Upload New Image
                </button>
              </div>

              {submitMessage && (
                <div className={`text-center p-3 rounded-lg ${
                  submitMessage.includes('Error') || submitMessage.includes('Failed')
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  )
}