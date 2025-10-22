'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, Copy, Check, Wand2 } from 'lucide-react'

const STYLES = [
  { id: 'photorealistic', name: 'Photorealistic', description: 'Camera-quality images with technical photography details' },
  { id: 'artistic', name: 'Artistic', description: 'Painterly, illustrated, or stylized creative works' },
  { id: 'cartoon', name: 'Cartoon/Anime', description: 'Animated style with bold colors and expressive features' },
  { id: 'cinematic', name: 'Cinematic', description: 'Movie-quality dramatic lighting and composition' },
  { id: 'abstract', name: 'Abstract', description: 'Non-representational art focused on shapes and colors' },
]

const TEMPLATES = [
  {
    name: 'Photorealistic Portrait',
    style: 'photorealistic',
    fields: {
      subject: 'A professional headshot of a [age] [gender]',
      action: 'looking directly at camera with confident expression',
      environment: 'Studio setting with neutral gray background',
      details: 'Soft studio lighting, 85mm lens, shallow depth of field, sharp focus on eyes',
      negatives: 'No extra fingers, no blurry features, no harsh shadows, no digital artifacts'
    }
  },
  {
    name: 'Epic Landscape',
    style: 'cinematic',
    fields: {
      subject: 'A breathtaking mountain range',
      action: 'peaks touching dramatic clouds',
      environment: 'During golden hour with mist rolling through valleys',
      details: 'Wide-angle shot, vibrant colors, god rays breaking through clouds, 4K quality',
      negatives: 'No people, no buildings, no modern elements, no overexposed areas'
    }
  },
  {
    name: 'Product Photography',
    style: 'photorealistic',
    fields: {
      subject: 'A premium [product type]',
      action: 'floating in mid-air',
      environment: 'Against a clean white backdrop',
      details: 'Professional studio lighting, sharp focus, commercial quality, high-key lighting',
      negatives: 'No shadows, no reflections, no background clutter, no distortions'
    }
  },
  {
    name: 'Fantasy Character',
    style: 'artistic',
    fields: {
      subject: 'A mystical [character type]',
      action: 'wielding magical powers',
      environment: 'In an enchanted forest with glowing elements',
      details: 'Digital painting style, vibrant fantasy colors, detailed costume, atmospheric lighting',
      negatives: 'No modern clothing, no realistic photography style, no extra limbs'
    }
  },
]

export default function PromptWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showTemplates, setShowTemplates] = useState(true)
  const [copied, setCopied] = useState(false)

  const [formData, setFormData] = useState({
    style: '',
    subject: '',
    action: '',
    environment: '',
    details: '',
    negatives: '',
  })

  const steps = [
    { title: 'Choose Style', field: 'style' },
    { title: 'Subject & Action', field: 'subject' },
    { title: 'Environment', field: 'environment' },
    { title: 'Details', field: 'details' },
    { title: 'Negatives', field: 'negatives' },
  ]

  const generatePrompt = () => {
    const { style, subject, action, environment, details, negatives } = formData

    if (!subject) return ''

    let prompt = ''

    if (style === 'photorealistic') {
      prompt = `A photorealistic ${subject}`
      if (action) prompt += `, ${action}`
      if (environment) prompt += `, set in ${environment}`
      if (details) prompt += `. ${details}`
    } else if (style === 'cinematic') {
      prompt = `A cinematic shot of ${subject}`
      if (action) prompt += `, ${action}`
      if (environment) prompt += `, ${environment}`
      if (details) prompt += `. ${details}`
    } else if (style === 'artistic') {
      prompt = `An artistic illustration of ${subject}`
      if (action) prompt += `, ${action}`
      if (environment) prompt += `, in ${environment}`
      if (details) prompt += `. ${details}`
    } else if (style === 'cartoon') {
      prompt = `A vibrant cartoon-style image of ${subject}`
      if (action) prompt += `, ${action}`
      if (environment) prompt += `, set in ${environment}`
      if (details) prompt += `. ${details}`
    } else if (style === 'abstract') {
      prompt = `An abstract representation of ${subject}`
      if (action) prompt += ` ${action}`
      if (environment) prompt += `, inspired by ${environment}`
      if (details) prompt += `. ${details}`
    } else {
      prompt = subject
      if (action) prompt += `, ${action}`
      if (environment) prompt += `, ${environment}`
      if (details) prompt += `. ${details}`
    }

    if (negatives) {
      prompt += `\n\nNegative prompt: ${negatives}`
    }

    return prompt
  }

  const loadTemplate = (template: typeof TEMPLATES[0]) => {
    setFormData({
      style: template.style,
      subject: template.fields.subject,
      action: template.fields.action,
      environment: template.fields.environment,
      details: template.fields.details,
      negatives: template.fields.negatives,
    })
    setShowTemplates(false)
    setCurrentStep(1)
  }

  const copyPrompt = async () => {
    const prompt = generatePrompt()
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4 text-gray-900">
            Prompt Wizard
          </h1>
          <p className="text-lg font-heading text-gray-600">
            Build the perfect AI prompt in 5 easy steps
          </p>
        </div>

        {showTemplates && (
          <div className="mb-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold text-gray-900">Quick Start Templates</h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-sm font-heading text-blue-600 hover:text-blue-700 font-medium"
              >
                Skip to wizard →
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  onClick={() => loadTemplate(template)}
                  className="text-left bg-gray-50 hover:bg-blue-50 p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Wand2 className="w-4 h-4 text-blue-600" />
                    <h3 className="font-heading font-bold text-gray-900">{template.name}</h3>
                  </div>
                  <p className="text-sm font-heading text-gray-600">
                    {STYLES.find(s => s.id === template.style)?.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Wizard Form */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-full h-1 mx-2 ${
                          index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-heading font-bold text-gray-900">{steps[currentStep].title}</h3>
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-6 min-h-[300px]">
              {currentStep === 0 && (
                <div>
                  <p className="font-heading text-gray-600 mb-4 text-sm">
                    Choose the style that best matches your vision
                  </p>
                  <div className="space-y-2">
                    {STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => handleFieldChange('style', style.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          formData.style === style.id
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-heading font-bold text-gray-900 mb-1 text-sm">{style.name}</div>
                        <div className="font-heading text-xs text-gray-600">{style.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <p className="font-heading text-gray-600 mb-4 text-sm">
                    Describe what you want to see. Be specific and descriptive.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-heading text-sm font-bold mb-2 text-gray-900">
                        Subject (What is the main focus?)
                      </label>
                      <textarea
                        value={formData.subject}
                        onChange={(e) => handleFieldChange('subject', e.target.value)}
                        placeholder="e.g., A majestic lion with flowing mane"
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block font-heading text-sm font-bold mb-2 text-gray-900">
                        Action (Optional)
                      </label>
                      <textarea
                        value={formData.action}
                        onChange={(e) => handleFieldChange('action', e.target.value)}
                        placeholder="e.g., roaring powerfully while standing on a cliff edge"
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <p className="font-heading text-gray-600 mb-4 text-sm">
                    Set the scene. Where is this taking place?
                  </p>
                  <div>
                    <label className="block font-heading text-sm font-bold mb-2 text-gray-900">
                      Environment & Setting
                    </label>
                    <textarea
                      value={formData.environment}
                      onChange={(e) => handleFieldChange('environment', e.target.value)}
                      placeholder="e.g., On a rocky mountain peak during golden hour"
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      rows={4}
                    />
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-xs text-blue-700 mb-2">
                        <strong>💡 Tip:</strong> Include time of day, weather, and lighting
                      </div>
                      <div className="text-xs text-gray-500 italic">
                        Examples: &ldquo;golden hour sunset&rdquo; • &ldquo;misty morning fog&rdquo; • &ldquo;dramatic storm clouds&rdquo; • &ldquo;soft indoor lighting&rdquo;
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <p className="font-heading text-gray-600 mb-4 text-sm">
                    Add technical details and quality specifications
                  </p>
                  <div>
                    <label className="block font-heading text-sm font-bold mb-2 text-gray-900">
                      Specific Details
                    </label>
                    <textarea
                      value={formData.details}
                      onChange={(e) => handleFieldChange('details', e.target.value)}
                      placeholder="e.g., 70-200mm lens, dramatic lighting, cinematic colors, 8K resolution"
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      rows={4}
                    />
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-xs text-blue-700 mb-2">
                        <strong>💡 Tip:</strong> Mention lens type, lighting, composition, quality
                      </div>
                      <div className="text-xs text-gray-500 italic">
                        Examples: &ldquo;85mm portrait lens&rdquo; • &ldquo;dramatic side lighting&rdquo; • &ldquo;cinematic color grading&rdquo; • &ldquo;4K ultra-sharp&rdquo;
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <p className="font-heading text-gray-600 mb-4 text-sm">
                    Specify what you DON&apos;T want to see
                  </p>
                  <div>
                    <label className="block font-heading text-sm font-bold mb-2 text-gray-900">
                      Negative Prompts
                    </label>
                    <textarea
                      value={formData.negatives}
                      onChange={(e) => handleFieldChange('negatives', e.target.value)}
                      placeholder="e.g., No extra limbs, no blurry details, no watermarks, no text"
                      className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      rows={4}
                    />
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="text-xs text-yellow-700 mb-2">
                        <strong>⚠️ Common:</strong> extra fingers, blurry, watermarks, distortions
                      </div>
                      <div className="text-xs text-gray-500 italic">
                        Examples: &ldquo;no extra limbs&rdquo; • &ldquo;no text overlays&rdquo; • &ldquo;no blurry details&rdquo; • &ldquo;no harsh shadows&rdquo;
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-heading font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-heading font-medium transition-all"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={copyPrompt}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-heading font-medium transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Prompt
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-heading font-bold mb-4 text-gray-900">Your Prompt Preview</h3>

            {generatePrompt() ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-h-[200px] whitespace-pre-wrap font-heading text-gray-900 text-sm">
                  {generatePrompt()}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={copyPrompt}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-heading font-medium transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>

                  <a
                    href={`/canvas?prompt=${encodeURIComponent(generatePrompt())}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-heading font-medium transition-all"
                  >
                    <Wand2 className="w-4 h-4" />
                    Use in Canvas
                  </a>
                </div>

                <div className="text-xs font-heading text-gray-500 space-y-1">
                  <div>✅ Using narrative descriptions</div>
                  {formData.negatives && <div>✅ Including negative prompts</div>}
                  {formData.details && <div>✅ Technical details specified</div>}
                  {formData.environment && <div>✅ Environment described</div>}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 min-h-[200px] flex items-center justify-center font-heading text-gray-400 text-center text-sm">
                Fill out the wizard steps to see your prompt build in real-time
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
