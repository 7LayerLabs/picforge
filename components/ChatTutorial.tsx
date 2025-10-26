'use client'

import { useState, useEffect } from 'react'

interface ChatTutorialProps {
  onClose: () => void
}

export default function ChatTutorial({ onClose }: ChatTutorialProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "Welcome to Your AI Prompt Assistant! ✨",
      content: "Thanks for being a Pro member! Not sure what to ask for? Just describe the vibe you want in plain English, and I'll help you create the perfect prompt.",
      example: "Try: 'I want a cozy K-Pop themed bedroom but not too intense'",
    },
    {
      title: "Smart Image Analysis 🧠",
      content: "I automatically detect what's in your images! Upload a bedroom photo and I'll know it's a bedroom. This helps me create more relevant, specific prompts.",
      example: "Context-aware prompts = better transformations!",
    },
    {
      title: "3 Optimized Variations 🎨",
      content: "For each description, I'll generate 3 different prompt variations tailored to your image. Pick the one that matches your vision best.",
      example: "Each option has a copy button for easy use!",
    },
    {
      title: "One-Click Insertion ⚡",
      content: "See a prompt you love? Click 'Use This Prompt' to instantly insert it into your active transformation. No copy-pasting needed!",
      example: "Let's create something amazing!",
    },
  ]

  const currentStep = steps[step]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onClose()
    }
  }

  const handleSkip = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">✨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStep.title}</h2>

          {/* Progress Dots */}
          <div className="flex gap-2 justify-center mt-4">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === step
                    ? 'w-8 bg-gradient-to-r from-purple-600 to-teal-500'
                    : idx < step
                    ? 'w-2 bg-teal-400'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 text-base leading-relaxed mb-4">
            {currentStep.content}
          </p>

          {/* Example Box */}
          <div className="bg-gradient-to-br from-purple-50 to-teal-50 border-2 border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800 font-medium">
              💡 {currentStep.example}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {step < steps.length - 1 ? (
            <>
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Skip Tutorial
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Next ({step + 1}/{steps.length})
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Get Started! 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
