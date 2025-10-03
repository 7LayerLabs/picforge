'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Lightbulb, Zap, Palette, Camera, Wand2, Star, ArrowRight, Copy, Check } from 'lucide-react'

export default function TipsPage() {
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    setCopiedPrompt(prompt)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  // Simple prompt examples for quick access
  const quickPrompts = [
    "Professional LinkedIn headshot with studio lighting",
    "Product on white background with subtle shadow",
    "Transform to anime style with cel-shading",
    "Golden hour landscape with warm lighting",
    "Instagram-worthy flat lay with perfect overhead angle",
    "Virtual staging with modern furniture"
  ]

  const didYouKnow = [
    {
      title: "Batch Processing Power",
      fact: "You can process up to 10 images simultaneously with our Batch Style Generator!",
      tip: "Perfect for creating consistent social media content or product variations."
    },
    {
      title: "AI Background Magic",
      fact: "PicForge can intelligently detect and replace backgrounds while preserving hair details and edges.",
      tip: "Try 'tropical beach sunset' or 'modern office interior' for instant scene changes."
    },
    {
      title: "Style Mixing",
      fact: "Combine multiple templates for unique effects!",
      tip: "Try mixing '80s Synthwave' with 'Anime Style' for a retro-futuristic anime look."
    },
    {
      title: "Smart Object Removal",
      fact: "Remove unwanted objects by describing what to keep.",
      tip: "Instead of saying 'remove the car', say 'keep only the person and building'."
    },
    {
      title: "Time Travel Effects",
      fact: "The Era Transformation can make photos look like they're from different decades.",
      tip: "Try '1920s vintage photograph' or '1980s polaroid with faded edges'."
    },
    {
      title: "Professional Headshots",
      fact: "Transform casual selfies into LinkedIn-ready professional photos.",
      tip: "Use 'professional headshot with studio lighting on grey background'."
    }
  ]

  const powerTips = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Layer Your Edits",
      description: "Start with basic adjustments, then apply style transforms for best results."
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Color Harmony",
      description: "Use 'complementary color scheme' in prompts for visually balanced images."
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Lighting Keywords",
      description: "Add 'golden hour', 'soft box', or 'rim lighting' for professional effects."
    },
    {
      icon: <Wand2 className="w-5 h-5" />,
      title: "Detail Preservation",
      description: "Include 'maintain facial features' or 'preserve details' in transformations."
    }
  ]

  const creativeUses = [
    "🎭 Create multiple personas from a single headshot",
    "🌍 Virtual travel photos - place yourself anywhere",
    "👕 Test clothing/hair colors before committing",
    "🏠 Virtual home staging for real estate",
    "📚 Generate book cover variations",
    "🎮 Create game avatars and character concepts",
    "💼 A/B test marketing visuals",
    "🎨 Turn photos into different art styles",
    "🌟 Create seasonal variations of products",
    "📸 Fix old/damaged photo restoration"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 font-medium hover:bg-orange-50 rounded-xl transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Editor
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Master PicForge</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Tips, Tricks & Inspiration
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of PicForge with these pro tips, creative prompts, and hidden features
          </p>
        </div>

        {/* Quick Power Tips */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {powerTips.map((tip, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-lg">
                  {tip.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{tip.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>

        {/* Prompt Library Preview */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-orange-600" />
                  <h2 className="text-3xl font-bold text-gray-900">Prompt Library</h2>
                </div>
                <Link
                  href="/prompts"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-pink-600 transition-all hover:scale-105"
                >
                  Browse All 210+ Prompts
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-gray-600 mb-6">
                Explore our comprehensive library with prompts for people, products, scenery, styles, social media, and more.
              </p>

              {/* Quick Example Prompts */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickPrompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="group relative p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer border border-gray-200"
                    onClick={() => copyPrompt(prompt)}
                  >
                    <p className="text-sm text-gray-700 pr-8">{prompt}</p>
                    <button
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyPrompt(prompt)
                      }}
                    >
                      {copiedPrompt === prompt ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500 hover:text-orange-600" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">New!</span> Visit our dedicated Prompt Library with search, filters, and categories for easy browsing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Did You Know Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900">Did You Know?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {didYouKnow.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200"
              >
                <h3 className="font-bold text-lg text-purple-900 mb-2">{item.title}</h3>
                <p className="text-gray-700 mb-3">{item.fact}</p>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-1">💡</span>
                  <p className="text-sm text-purple-700 italic">{item.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creative Uses */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Wand2 className="w-6 h-6 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Creative Uses for PicForge</h2>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="grid md:grid-cols-2 gap-4">
              {creativeUses.map((use, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{use}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nano Banana Best Practices */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">🍌 Nano Banana Best Practices (2025)</h2>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">✍️ Use Descriptive Sentences, Not Keywords</h3>
                <p className="text-gray-700 mb-3 text-sm">
                  Describe the scene in narrative form—AI understands language deeply, so a paragraph beats a keyword list every time.
                </p>
                <div className="bg-white p-3 rounded text-xs">
                  <div className="text-red-600 mb-2">❌ Bad: &quot;sunset, beach, palm trees&quot;</div>
                  <div className="text-green-600">✅ Good: &quot;A tropical beach at sunset with golden light casting long shadows across the sand, palm trees swaying gently in the warm breeze&quot;</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-lg border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">📸 For Photorealistic: Use Photography Terms</h3>
                <p className="text-gray-700 mb-3 text-sm">
                  Mention camera angles, lens types, lighting, and technical details to guide toward photorealistic results.
                </p>
                <div className="bg-white p-3 rounded text-xs">
                  <div className="text-gray-700">Template: &quot;A photorealistic [shot type] of [subject], [action], set in [environment]. Illuminated by [lighting]. Captured with [camera/lens], emphasizing [details].&quot;</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-teal-50 p-5 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">🎨 Iterative Editing Works Best</h3>
                <p className="text-gray-700 mb-3 text-sm">
                  Make single, focused changes per iteration rather than overloading with multiple instructions.
                </p>
                <div className="bg-white p-3 rounded text-xs">
                  <div className="text-red-600 mb-2">❌ Avoid: &quot;Change sky, remove person, add text, adjust colors&quot;</div>
                  <div className="text-green-600">✅ Better: First pass - &quot;Make sky more dramatic&quot;, then second pass - &quot;Remove person on left&quot;</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-red-50 p-5 rounded-lg border border-pink-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">🚫 Use Semantic Negatives</h3>
                <p className="text-gray-700 mb-3 text-sm">
                  Specify what you DON&apos;T want to avoid unwanted elements in your generation.
                </p>
                <div className="bg-white p-3 rounded text-xs">
                  <div className="text-gray-700">&quot;No extra fingers or hands; no text except the title; avoid watermarks; avoid clutter; no distortions&quot;</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Techniques */}
        <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">🚀 Pro Techniques</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Advanced Prompt Engineering</h3>
              <ul className="space-y-2 text-orange-50">
                <li>• Use weight modifiers: &quot;highly detailed&quot;, &quot;subtle&quot;, &quot;extreme&quot;</li>
                <li>• Specify camera settings: &quot;85mm lens&quot;, &quot;f/1.4 bokeh&quot;, &quot;ISO 100&quot;</li>
                <li>• Add mood descriptors: &quot;moody&quot;, &quot;ethereal&quot;, &quot;dramatic&quot;</li>
                <li>• Include art references: &quot;in the style of [artist name]&quot;</li>
                <li>• For localized edits: Be specific about regions and constraints</li>
                <li>• Character consistency: Define ALL details in first prompt</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Workflow Optimization</h3>
              <ul className="space-y-2 text-orange-50">
                <li>• Save your favorite prompts for quick access</li>
                <li>• Use batch processing for consistent branding</li>
                <li>• Start with low-res tests, then apply to high-res</li>
                <li>• Combine multiple passes for complex edits</li>
                <li>• Apply stepwise edits instead of overloading instructions</li>
                <li>• Use templates and add custom instructions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            Start Creating Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}