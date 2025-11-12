'use client'

import { useState, useRef, useEffect, createContext, useContext } from 'react'
import ChatTutorial from './ChatTutorial'
import { logger } from '@/lib/logger'

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Check for first-time use
  useEffect(() => {
    if (isOpen) {
      const hasSeenTutorial = localStorage.getItem('chatTutorialSeen')
      if (!hasSeenTutorial) {
        setShowTutorial(true)
      }
    }
  }, [isOpen])

  // Listen for image uploads to provide context
  useEffect(() => {
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
          logger.error('Failed to analyze image:', error)
        }
      }
    }

    window.addEventListener('imageUploaded', handleImageUpload)
    return () => window.removeEventListener('imageUploaded', handleImageUpload)
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

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
      logger.error('Error enhancing prompt:', error)
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
      logger.error('Failed to copy:', error)
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

  return (
    <>
      {/* Tutorial */}
      {showTutorial && <ChatTutorial onClose={closeTutorial} />}

      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-purple-600 to-teal-500 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
          aria-label="Open prompt assistant"
        >
          <span className="text-3xl animate-pulse">✨</span>
          {/* Pulse ring effect */}
          <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-20"></span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
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
