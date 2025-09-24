'use client'

import { useState } from 'react'
import { Template, templates, getTrendingTemplates } from '@/lib/templates'

interface TemplateSelectorProps {
  onSelectTemplate: (prompt: string, templateName: string) => void
  currentImage: string | null
}

export default function TemplateSelector({ onSelectTemplate, currentImage }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trending' | Template['category']>('all')
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const categories = [
    { id: 'all', name: 'All Templates', icon: '🎯' },
    { id: 'trending', name: 'Trending', icon: '🔥' },
    { id: 'professional', name: 'Professional', icon: '💼' },
    { id: 'social', name: 'Social Media', icon: '📱' },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛍️' },
    { id: 'personal', name: 'Personal', icon: '✨' },
    { id: 'realestate', name: 'Real Estate', icon: '🏡' }
  ]

  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') return templates
    if (selectedCategory === 'trending') return getTrendingTemplates()
    return templates.filter(t => t.category === selectedCategory)
  }

  const handleSelectTemplate = async (template: Template) => {
    setSelectedTemplate(template.id)
    const fullPrompt = template.prompts.join(' ')
    onSelectTemplate(fullPrompt, template.name)

    // Track template usage
    try {
      await fetch('/api/track-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          templateName: template.name
        })
      })
    } catch (error) {
      console.error('Failed to track template usage:', error)
    }

    // Auto-hide templates after selection
    setTimeout(() => {
      setShowTemplates(false)
    }, 500)
  }

  if (!currentImage) {
    return null // Don't show templates until image is uploaded
  }

  return (
    <div className="w-full space-y-3">
      {/* Toggle Button */}
      <button
        onClick={() => setShowTemplates(!showTemplates)}
        className={`w-full px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${
          showTemplates
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🎨</span>
          <span>Magic Templates</span>
          {selectedTemplate && (
            <span className="px-2 py-1 bg-white/20 rounded-lg text-xs">
              Active: {templates.find(t => t.id === selectedTemplate)?.name}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${showTemplates ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Template Grid */}
      {showTemplates && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 shadow-xl animate-slideDown">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 border-b">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {getFilteredTemplates().map(template => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={`text-left p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                  selectedTemplate === template.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{template.icon}</span>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{template.name}</h3>
                      {template.badge && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-bold rounded-full">
                          {template.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-3">{template.description}</p>

                {/* Quick Preview of Effects */}
                <div className="flex flex-wrap gap-1">
                  {template.settings?.intensity && (
                    <span className="px-2 py-1 bg-gray-100 text-[10px] rounded">
                      {template.settings.intensity} intensity
                    </span>
                  )}
                  {template.settings?.style && (
                    <span className="px-2 py-1 bg-gray-100 text-[10px] rounded">
                      {template.settings.style} style
                    </span>
                  )}
                </div>

                {/* Apply Button */}
                {selectedTemplate === template.id && (
                  <div className="mt-3 text-center">
                    <span className="text-xs text-green-600 font-bold">✓ Applied</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Pro Tip */}
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <p className="text-xs text-gray-700">
              <span className="font-bold">💡 Pro Tip:</span> Select a template to instantly apply professional edits,
              then customize further with your own instructions!
            </p>
          </div>
        </div>
      )}

      {/* Quick Access Bar - Always Visible */}
      {!showTemplates && currentImage && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-gray-500 py-1">Quick:</span>
          {getTrendingTemplates().slice(0, 4).map(template => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <span>{template.icon}</span>
              {template.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Add animation styles to global CSS
const styles = `
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}
`