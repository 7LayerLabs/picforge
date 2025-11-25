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
      fact: "You can process up to 100 images simultaneously with the Foundry!",
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
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-black hover:text-brutal-cyan font-black uppercase border-4 border-black hover:bg-black hover:text-brutal-cyan transition-all shadow-brutal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Editor
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black border-4 border-brutal-cyan shadow-brutal-lg p-8 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brutal-yellow text-black border-4 border-black mb-4 shadow-brutal">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-black uppercase">Master PicForge</span>
          </div>
          <h1 className="font-heading text-5xl font-black uppercase text-brutal-cyan mb-4 tracking-tight">
            Tips, Tricks & Inspiration
          </h1>
          <p className="font-body text-xl text-white max-w-2xl mx-auto font-bold">
            Unlock the full potential of PicForge with these pro tips, creative prompts, and hidden features
          </p>
        </div>

        {/* Quick Power Tips */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {powerTips.map((tip, index) => (
            <div
              key={index}
              className="bg-black border-4 border-brutal-cyan p-4 shadow-brutal hover:shadow-brutal-lg transition-all hover:translate-x-1 hover:translate-y-1"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brutal-cyan text-black border-4 border-black">
                  {tip.icon}
                </div>
                <h3 className="font-black uppercase text-brutal-cyan text-sm tracking-tight">{tip.title}</h3>
              </div>
              <p className="text-sm text-white font-bold">{tip.description}</p>
            </div>
          ))}
        </div>

        {/* Prompt Library Preview */}
        <div className="mb-12">
          <div className="bg-black border-4 border-brutal-pink shadow-brutal-lg overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-brutal-pink" />
                  <h2 className="font-heading text-3xl font-black uppercase text-brutal-pink tracking-tight">Prompt Library</h2>
                </div>
                <Link
                  href="/prompts"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-yellow transition-all shadow-brutal"
                >
                  Browse All 272+ Prompts
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-white mb-6 font-bold">
                Explore our comprehensive library with prompts for people, products, scenery, styles, social media, and more.
              </p>

              {/* Quick Example Prompts */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickPrompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="group relative p-3 bg-gray-900 hover:bg-brutal-pink transition-colors cursor-pointer border-4 border-brutal-pink"
                    onClick={() => copyPrompt(prompt)}
                  >
                    <p className="text-sm font-bold pr-8 text-white group-hover:text-black">{prompt}</p>
                    <button
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyPrompt(prompt)
                      }}
                    >
                      {copiedPrompt === prompt ? (
                        <Check className="w-4 h-4 text-brutal-cyan" />
                      ) : (
                        <Copy className="w-4 h-4 text-white group-hover:text-black hover:text-brutal-cyan" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-brutal-yellow border-4 border-black shadow-brutal">
                <p className="text-sm text-black flex items-center gap-2 font-black">
                  <Sparkles className="w-4 h-4" />
                  <span className="uppercase">New!</span> Visit our dedicated Prompt Library with search, filters, and categories for easy browsing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Did You Know Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-brutal-yellow" />
            <h2 className="font-heading text-3xl font-black uppercase text-black tracking-tight">Did You Know?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {didYouKnow.map((item, index) => (
              <div
                key={index}
                className="bg-brutal-yellow border-4 border-black p-5 shadow-brutal"
              >
                <h3 className="font-black text-lg text-black mb-2 uppercase tracking-tight">{item.title}</h3>
                <p className="text-black font-bold mb-3">{item.fact}</p>
                <div className="flex items-start gap-2">
                  <span className="text-black mt-1">💡</span>
                  <p className="text-sm text-black font-bold italic">{item.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creative Uses */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Wand2 className="w-6 h-6 text-brutal-cyan" />
            <h2 className="font-heading text-3xl font-black uppercase text-black tracking-tight">Creative Uses for PicForge</h2>
          </div>

          <div className="bg-black border-4 border-brutal-cyan p-6 shadow-brutal-lg">
            <div className="grid md:grid-cols-2 gap-4">
              {creativeUses.map((use, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 hover:bg-brutal-cyan hover:text-black transition-colors border-4 border-transparent hover:border-black"
                >
                  <ArrowRight className="w-4 h-4 text-brutal-cyan flex-shrink-0" />
                  <span className="text-white font-bold">{use}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gemini 3 Pro Image Best Practices */}
        <div className="mb-12">
          <h2 className="text-3xl font-black uppercase text-black mb-6 tracking-tight">✨ Gemini 3 Pro Image Best Practices (2025)</h2>
          <div className="bg-black border-4 border-brutal-yellow p-6 shadow-brutal-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-brutal-yellow p-5 border-4 border-black shadow-brutal">
                <h3 className="font-heading text-lg font-black text-black mb-3 uppercase tracking-tight">✍️ Use Descriptive Sentences, Not Keywords</h3>
                <p className="text-black mb-3 text-sm font-bold">
                  Describe the scene in narrative form—AI understands language deeply, so a paragraph beats a keyword list every time.
                </p>
                <div className="bg-black p-3 text-xs border-4 border-white">
                  <div className="text-brutal-pink mb-2 font-bold">❌ Bad: &quot;sunset, beach, palm trees&quot;</div>
                  <div className="text-brutal-cyan font-bold">✅ Good: &quot;A tropical beach at sunset with golden light casting long shadows across the sand, palm trees swaying gently in the warm breeze&quot;</div>
                </div>
              </div>

              <div className="bg-brutal-cyan p-5 border-4 border-black shadow-brutal">
                <h3 className="font-heading text-lg font-black text-black mb-3 uppercase tracking-tight">📸 For Photorealistic: Use Photography Terms</h3>
                <p className="text-black mb-3 text-sm font-bold">
                  Mention camera angles, lens types, lighting, and technical details to guide toward photorealistic results.
                </p>
                <div className="bg-black p-3 text-xs border-4 border-white">
                  <div className="text-white font-bold">Template: &quot;A photorealistic [shot type] of [subject], [action], set in [environment]. Illuminated by [lighting]. Captured with [camera/lens], emphasizing [details].&quot;</div>
                </div>
              </div>

              <div className="bg-brutal-pink p-5 border-4 border-black shadow-brutal">
                <h3 className="font-heading text-lg font-black text-black mb-3 uppercase tracking-tight">🎨 Iterative Editing Works Best</h3>
                <p className="text-black mb-3 text-sm font-bold">
                  Make single, focused changes per iteration rather than overloading with multiple instructions.
                </p>
                <div className="bg-black p-3 text-xs border-4 border-white">
                  <div className="text-brutal-yellow mb-2 font-bold">❌ Avoid: &quot;Change sky, remove person, add text, adjust colors&quot;</div>
                  <div className="text-brutal-cyan font-bold">✅ Better: First pass - &quot;Make sky more dramatic&quot;, then second pass - &quot;Remove person on left&quot;</div>
                </div>
              </div>

              <div className="bg-gray-900 p-5 border-4 border-brutal-yellow shadow-brutal">
                <h3 className="font-heading text-lg font-black text-brutal-yellow mb-3 uppercase tracking-tight">🚫 Use Semantic Negatives</h3>
                <p className="text-white mb-3 text-sm font-bold">
                  Specify what you DON&apos;T want to avoid unwanted elements in your generation.
                </p>
                <div className="bg-black p-3 text-xs border-4 border-white">
                  <div className="text-white font-bold">&quot;No extra fingers or hands; no text except the title; avoid watermarks; avoid clutter; no distortions&quot;</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Techniques */}
        <div className="bg-black border-4 border-brutal-pink p-8 text-white shadow-brutal-lg">
          <h2 className="text-3xl font-black uppercase mb-6 text-brutal-pink tracking-tight">🚀 Pro Techniques</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-heading text-xl font-black uppercase mb-3 text-brutal-cyan tracking-tight">Advanced Prompt Engineering</h3>
              <ul className="space-y-2 text-white font-bold">
                <li>• Use weight modifiers: &quot;highly detailed&quot;, &quot;subtle&quot;, &quot;extreme&quot;</li>
                <li>• Specify camera settings: &quot;85mm lens&quot;, &quot;f/1.4 bokeh&quot;, &quot;ISO 100&quot;</li>
                <li>• Add mood descriptors: &quot;moody&quot;, &quot;ethereal&quot;, &quot;dramatic&quot;</li>
                <li>• Include art references: &quot;in the style of [artist name]&quot;</li>
                <li>• For localized edits: Be specific about regions and constraints</li>
                <li>• Character consistency: Define ALL details in first prompt</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-xl font-black uppercase mb-3 text-brutal-cyan tracking-tight">Workflow Optimization</h3>
              <ul className="space-y-2 text-white font-bold">
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-pink transition-all shadow-brutal hover:shadow-brutal-lg hover:translate-x-1 hover:translate-y-1"
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