'use client'

import { useState } from 'react'
import { Template, templates, getTrendingTemplates } from '@/lib/templates'

interface TemplateSelectorProps {
  onSelectTemplate: (prompt: string, templateName: string) => void
  currentImage: string | null
}

export default function TemplateSelector({ onSelectTemplate, currentImage }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trending' | Template['category']>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const categories = [
    { id: 'all', name: 'All', icon: '🎯' },
    { id: 'trending', name: 'Trending', icon: '🔥' },
    { id: 'creative', name: 'Creative', icon: '🎨' },
    { id: 'professional', name: 'Pro', icon: '💼' },
    { id: 'social', name: 'Social', icon: '📱' },
    { id: 'ecommerce', name: 'Shop', icon: '🛍️' },
    { id: 'personal', name: 'Personal', icon: '✨' },
    { id: 'realestate', name: 'Real Estate', icon: '🏡' },
    { id: '3d', name: '3D', icon: '🔮' },
    { id: 'era', name: 'Era', icon: '⏰' },
    { id: 'character', name: 'Character', icon: '👤' },
    { id: 'ar', name: 'AR', icon: '✨' },
    { id: 'comic', name: 'Comic', icon: '📚' }
  ]

  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') return templates
    if (selectedCategory === 'trending') return getTrendingTemplates()
    return templates.filter(t => t.category === selectedCategory)
  }

  const handleSelectTemplate = async (template: Template, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

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
  }

  if (!currentImage) {
    return null
  }

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Magic Templates</h3>
        {selectedTemplate && (
          <span className="px-2 py-1 bg-teal-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-xs font-medium">
            ✓ Loaded
          </span>
        )}
      </div>

      {/* Template Grid - Always visible in sidebar */}
      <div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 pb-2 mb-3 border-b border-gray-200 dark:border-gray-700">
            {categories.map(category => (
              <button
                type="button"
                key={category.id}
                onClick={() => setSelectedCategory(category.id as 'all' | 'trending' | Template['category'])}
                className={`px-2 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Templates List - Single column for sidebar */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
            {getFilteredTemplates().map(template => (
              <button
                type="button"
                key={template.id}
                onClick={(e) => handleSelectTemplate(template, e)}
                className={`group w-full text-left p-2 rounded-lg border transition-all ${
                  selectedTemplate === template.id
                    ? 'border-teal-500 bg-teal-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-teal-600 bg-white dark:bg-gray-700 hover:bg-teal-50/50 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl flex-shrink-0">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold text-xs text-gray-900 dark:text-white truncate">{template.name}</h3>
                      {template.badge && (
                        <span className="px-1.5 py-0.5 bg-teal-500 text-white text-[8px] font-bold rounded">
                          {template.badge.split(' ')[0]}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <span className="text-green-600 dark:text-green-400 flex-shrink-0">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
