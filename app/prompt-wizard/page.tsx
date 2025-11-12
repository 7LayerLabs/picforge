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
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="bg-black border-4 border-brutal-cyan shadow-brutal-lg p-8 mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-black uppercase mb-4 text-brutal-cyan tracking-tight">
            Prompt Wizard
          </h1>
          <p className="text-lg font-body text-white font-bold">
            Build the perfect AI prompt in 5 easy steps
          </p>
        </div>

        {showTemplates && (
          <div className="mb-8 bg-black border-4 border-brutal-pink shadow-brutal-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-black uppercase text-brutal-pink tracking-tight">Quick Start Templates</h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-sm font-body text-brutal-cyan hover:text-brutal-pink font-bold uppercase"
              >
                Skip to wizard →
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  onClick={() => loadTemplate(template)}
                  className="text-left bg-gray-900 hover:bg-brutal-cyan hover:text-black p-4 border-4 border-brutal-cyan transition-all shadow-brutal"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Wand2 className="w-4 h-4" />
                    <h3 className="font-heading font-black uppercase tracking-tight">{template.name}</h3>
                  </div>
                  <p className="text-sm font-body font-bold">
                    {STYLES.find(s => s.id === template.style)?.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Wizard Form */}
          <div className="bg-black border-4 border-brutal-cyan shadow-brutal-lg p-6">
            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center flex-1">
                    <div
                      className={`w-8 h-8 flex items-center justify-center text-sm font-black border-4 ${
                        index <= currentStep
                          ? 'bg-brutal-cyan text-black border-black'
                          : 'bg-gray-900 text-gray-500 border-gray-700'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-full h-1 mx-2 ${
                          index < currentStep ? 'bg-brutal-cyan' : 'bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-heading font-black uppercase text-brutal-cyan tracking-tight">{steps[currentStep].title}</h3>
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-6 min-h-[300px]">
              {currentStep === 0 && (
                <div>
                  <p className="font-body text-white mb-4 text-sm font-bold">
                    Choose the style that best matches your vision
                  </p>
                  <div className="space-y-2">
                    {STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => handleFieldChange('style', style.id)}
                        className={`w-full text-left p-3 border-4 transition-all ${
                          formData.style === style.id
                            ? 'bg-brutal-cyan text-black border-black shadow-brutal'
                            : 'bg-gray-900 text-white border-brutal-cyan hover:bg-brutal-cyan hover:text-black'
                        }`}
                      >
                        <div className="font-heading font-black uppercase mb-1 text-sm tracking-tight">{style.name}</div>
                        <div className="font-body text-xs font-bold">{style.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <p className="font-body text-white mb-4 text-sm font-bold">
                    Describe what you want to see. Be specific and descriptive.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-body text-sm font-black uppercase mb-2 text-brutal-cyan">
                        Subject (What is the main focus?)
                      </label>
                      <textarea
                        value={formData.subject}
                        onChange={(e) => handleFieldChange('subject', e.target.value)}
                        placeholder="e.g., A majestic lion with flowing mane"
                        className="w-full bg-gray-900 border-4 border-brutal-cyan p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brutal-pink"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block font-body text-sm font-black uppercase mb-2 text-brutal-cyan">
                        Action (Optional)
                      </label>
                      <textarea
                        value={formData.action}
                        onChange={(e) => handleFieldChange('action', e.target.value)}
                        placeholder="e.g., roaring powerfully while standing on a cliff edge"
                        className="w-full bg-gray-900 border-4 border-brutal-cyan p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brutal-pink"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <p className="font-body text-white mb-4 text-sm font-bold">
                    Set the scene. Where is this taking place?
                  </p>
                  <div>
                    <label className="block font-body text-sm font-black uppercase mb-2 text-brutal-cyan">
                      Environment & Setting
                    </label>
                    <textarea
                      value={formData.environment}
                      onChange={(e) => handleFieldChange('environment', e.target.value)}
                      placeholder="e.g., On a rocky mountain peak during golden hour"
                      className="w-full bg-gray-900 border-4 border-brutal-cyan p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brutal-pink"
                      rows={4}
                    />
                    <div className="mt-3 p-3 bg-brutal-yellow border-4 border-black shadow-brutal">
                      <div className="text-xs text-black mb-2 font-black">
                        💡 TIP: Include time of day, weather, and lighting
                      </div>
                      <div className="text-xs text-black font-bold">
                        Examples: &ldquo;golden hour sunset&rdquo; • &ldquo;misty morning fog&rdquo; • &ldquo;dramatic storm clouds&rdquo; • &ldquo;soft indoor lighting&rdquo;
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <p className="font-body text-white mb-4 text-sm font-bold">
                    Add technical details and quality specifications
                  </p>
                  <div>
                    <label className="block font-body text-sm font-black uppercase mb-2 text-brutal-cyan">
                      Specific Details
                    </label>
                    <textarea
                      value={formData.details}
                      onChange={(e) => handleFieldChange('details', e.target.value)}
                      placeholder="e.g., 70-200mm lens, dramatic lighting, cinematic colors, 8K resolution"
                      className="w-full bg-gray-900 border-4 border-brutal-cyan p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brutal-pink"
                      rows={4}
                    />
                    <div className="mt-3 p-3 bg-brutal-yellow border-4 border-black shadow-brutal">
                      <div className="text-xs text-black mb-2 font-black">
                        💡 TIP: Mention lens type, lighting, composition, quality
                      </div>
                      <div className="text-xs text-black font-bold">
                        Examples: &ldquo;85mm portrait lens&rdquo; • &ldquo;dramatic side lighting&rdquo; • &ldquo;cinematic color grading&rdquo; • &ldquo;4K ultra-sharp&rdquo;
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <p className="font-body text-white mb-4 text-sm font-bold">
                    Specify what you DON&apos;T want to see
                  </p>
                  <div>
                    <label className="block font-body text-sm font-black uppercase mb-2 text-brutal-cyan">
                      Negative Prompts
                    </label>
                    <textarea
                      value={formData.negatives}
                      onChange={(e) => handleFieldChange('negatives', e.target.value)}
                      placeholder="e.g., No extra limbs, no blurry details, no watermarks, no text"
                      className="w-full bg-gray-900 border-4 border-brutal-cyan p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brutal-pink"
                      rows={4}
                    />
                    <div className="mt-3 p-3 bg-brutal-pink border-4 border-black shadow-brutal">
                      <div className="text-xs text-black mb-2 font-black">
                        ⚠️ COMMON: extra fingers, blurry, watermarks, distortions
                      </div>
                      <div className="text-xs text-black font-bold">
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
                className="flex items-center gap-2 px-6 py-2 bg-gray-900 hover:bg-brutal-cyan hover:text-black text-white border-4 border-brutal-cyan font-heading font-black uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-brutal"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2 bg-brutal-cyan text-black border-4 border-black font-heading font-black uppercase hover:bg-brutal-pink transition-all shadow-brutal"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={copyPrompt}
                  className="flex items-center gap-2 px-6 py-2 bg-brutal-yellow text-black border-4 border-black font-heading font-black uppercase hover:bg-brutal-pink transition-all shadow-brutal"
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
          <div className="bg-black border-4 border-brutal-pink shadow-brutal-lg p-6">
            <h3 className="text-lg font-heading font-black uppercase mb-4 text-brutal-pink tracking-tight">Your Prompt Preview</h3>

            {generatePrompt() ? (
              <div className="space-y-4">
                <div className="bg-gray-900 p-4 border-4 border-brutal-cyan min-h-[200px] whitespace-pre-wrap font-body text-white text-sm font-bold">
                  {generatePrompt()}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={copyPrompt}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brutal-cyan text-black border-4 border-black font-heading font-black uppercase hover:bg-brutal-yellow transition-all shadow-brutal"
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
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brutal-yellow text-black border-4 border-black font-heading font-black uppercase hover:bg-brutal-pink transition-all shadow-brutal"
                  >
                    <Wand2 className="w-4 h-4" />
                    Use in Canvas
                  </a>
                </div>

                <div className="text-xs font-body text-brutal-cyan space-y-1 font-bold">
                  <div>✅ Using narrative descriptions</div>
                  {formData.negatives && <div>✅ Including negative prompts</div>}
                  {formData.details && <div>✅ Technical details specified</div>}
                  {formData.environment && <div>✅ Environment described</div>}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 p-8 border-4 border-brutal-cyan min-h-[200px] flex items-center justify-center font-body text-white text-center text-sm font-bold">
                Fill out the wizard steps to see your prompt build in real-time
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
