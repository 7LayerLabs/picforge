'use client'

import { useState, useRef, useEffect, createContext, useContext } from 'react'
import ChatTutorial from './ChatTutorial'
import { db } from '@/lib/instantdb'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  promptVariations?: string[]
  imageContext?: ImageContext
}

interface ImageContext {
  type: string
  subject: string
  setting: string
  mood: string
  colors: string[]
  lighting: string
  style: string
  suggestions: string
}

// Context for prompt insertion
interface PromptContextType {
  insertPrompt: (prompt: string) => void
}

const PromptContext = createContext<PromptContextType | null>(null)

export const usePromptInsertion = () => {
  const context = useContext(PromptContext)
  return context
}

export const PromptInsertionProvider = ({ children }: { children: React.ReactNode }) => {
  const [, setTrigger] = useState(0)

  const insertPrompt = (prompt: string) => {
    // Dispatch custom event that editors can listen to
    window.dispatchEvent(new CustomEvent('insertPrompt', { detail: { prompt } }))
    setTrigger(prev => prev + 1)
  }

  return (
    <PromptContext.Provider value={{ insertPrompt }}>
      {children}
    </PromptContext.Provider>
  )
}

export default function PromptAssistantChat() {
  const { user } = db.useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [imageContext, setImageContext] = useState<ImageContext | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hey! I\'m your AI prompt assistant. Tell me what vibe you\'re going for, and I\'ll help you create the perfect prompt.',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Check user tier for Pro-only access
  const { data: usageData } = db.useQuery(
    (user
      ? { usage: { $: { where: { userId: user.id } } } }
      : null) as any
  )

  const usage = (usageData as any)?.usage?.[0]
  const isPro = usage?.tier === 'pro' || usage?.tier === 'unlimited'
  const isAuthenticated = !!user

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current && isPro) {
      inputRef.current.focus()
    }
  }, [isOpen, isPro])

  // Check for first-time use (only for Pro users)
  useEffect(() => {
    if (isOpen && isPro) {
      const hasSeenTutorial = localStorage.getItem('chatTutorialSeen')
      if (!hasSeenTutorial) {
        setShowTutorial(true)
      }
    }
  }, [isOpen, isPro])

  // Listen for image uploads to provide context
  useEffect(() => {
    if (!isPro) return // Don't listen if not Pro

    const handleImageUpload = async (event: Event) => {
      const customEvent = event as CustomEvent
      const imageData = customEvent.detail?.imageData

      if (imageData) {
        try {
          const response = await fetch('/api/analyze-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData }),
          })

          if (response.ok) {
            const data = await response.json()
            setImageContext(data.analysis)

            // Add context message
            const contextMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: `I can see you uploaded a ${data.analysis.type} image! ${data.analysis.suggestions}\n\nWhat kind of transformation are you thinking?`,
              imageContext: data.analysis,
            }
            setMessages((prev) => [...prev, contextMessage])
          }
        } catch (error) {
          console.error('Failed to analyze image:', error)
        }
      }
    }

    window.addEventListener('imageUploaded', handleImageUpload)
    return () => window.removeEventListener('imageUploaded', handleImageUpload)
  }, [isPro])

  const handleSend = async () => {
    if (!input.trim() || isLoading || !isPro) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: userMessage.content,
          imageContext: imageContext, // Include image context for better prompts
        }),
      })

      if (!response.ok) throw new Error('Failed to enhance prompt')

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.explanation || 'Here are some optimized prompts for you:',
        promptVariations: data.prompts || [],
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error enhancing prompt:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Oops! Something went wrong. Try rephrasing your request.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const useThisPrompt = (prompt: string) => {
    // Dispatch event for editors to listen to
    window.dispatchEvent(new CustomEvent('insertPrompt', { detail: { prompt } }))

    // Show feedback
    setCopiedId('inserted')
    setTimeout(() => setCopiedId(null), 2000)

    // Optionally close chat after insertion
    setTimeout(() => setIsOpen(false), 1500)
  }

  const closeTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem('chatTutorialSeen', 'true')
  }

  // Render paywall if not Pro
  const renderPaywall = () => (
    <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-500 p-6 text-center">
        <div className="text-5xl mb-3">✨</div>
        <h3 className="text-white font-bold text-xl mb-2">AI Prompt Assistant</h3>
        <p className="text-purple-100 text-sm">Pro Feature</p>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-900 text-base mb-4 leading-relaxed">
          Get AI-powered help creating perfect prompts with:
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🧠</div>
            <div>
              <div className="font-semibold text-gray-900">Smart Context Detection</div>
              <div className="text-sm text-gray-600">Automatically analyzes your images</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">✍️</div>
            <div>
              <div className="font-semibold text-gray-900">3 Optimized Variations</div>
              <div className="text-sm text-gray-600">Get multiple prompt options to choose from</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">⚡</div>
            <div>
              <div className="font-semibold text-gray-900">One-Click Insertion</div>
              <div className="text-sm text-gray-600">Instant prompt insertion into editor</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">💬</div>
            <div>
              <div className="font-semibold text-gray-900">Conversational Help</div>
              <div className="text-sm text-gray-600">Just describe your vision in plain English</div>
            </div>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="space-y-3">
            <Link
              href="/pricing"
              className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all"
            >
              Upgrade to Pro
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="block w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              href="/pricing"
              className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all"
            >
              Upgrade to Pro
            </Link>
            <Link
              href="/profile"
              className="block w-full px-6 py-3 border-2 border-teal-500 text-teal-600 rounded-lg font-semibold text-center hover:bg-teal-50 transition-colors"
            >
              Redeem Promo Code
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="block w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Tutorial (only for Pro users) */}
      {showTutorial && isPro && <ChatTutorial onClose={closeTutorial} />}

      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-[9999] w-16 h-16 bg-gradient-to-br from-purple-600 to-teal-500 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group relative"
          aria-label="Open prompt assistant"
        >
          <span className="text-3xl animate-pulse">✨</span>
          {/* Pulse ring effect */}
          <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></span>
          {/* Pro badge */}
          {!isPro && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
              PRO
            </span>
          )}
        </button>
      )}

      {/* Show paywall if not Pro */}
      {isOpen && !isPro && renderPaywall()}

      {/* Chat Panel (only for Pro users) */}
      {isOpen && isPro && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col border-2 border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-teal-500 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="text-white font-bold text-lg">Prompt Assistant</h3>
                <p className="text-purple-100 text-xs">
                  {imageContext ? `Analyzing your ${imageContext.type}` : 'AI-powered prompt helper'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                  {/* Image Context Badge */}
                  {message.imageContext && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-xs bg-white text-purple-600 px-2 py-1 rounded-full">
                        {message.imageContext.subject}
                      </span>
                      <span className="text-xs bg-white text-purple-600 px-2 py-1 rounded-full">
                        {message.imageContext.mood}
                      </span>
                    </div>
                  )}

                  {/* Prompt Variations */}
                  {message.promptVariations && message.promptVariations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.promptVariations.map((prompt, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-gray-200 rounded-lg p-3 text-gray-900"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-purple-600">
                              Option {idx + 1}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => copyToClipboard(prompt, `${message.id}-${idx}`)}
                                className="text-teal-600 hover:text-teal-700 transition-colors"
                                title="Copy to clipboard"
                              >
                                {copiedId === `${message.id}-${idx}` ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                          <p className="text-xs leading-relaxed mb-2">{prompt}</p>

                          {/* Quick Action Button */}
                          <button
                            onClick={() => useThisPrompt(prompt)}
                            className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-teal-500 text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all"
                          >
                            ⚡ Use This Prompt
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            {copiedId === 'inserted' && (
              <div className="mb-2 text-xs text-center text-green-600 font-semibold animate-fade-in">
                ✓ Prompt inserted! Check your editor.
              </div>
            )}
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the vibe you want..."
                className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-teal-500 text-white rounded-lg px-4 py-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none self-end"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  )
}
