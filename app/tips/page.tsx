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

  const promptIdeas = [
    {
      category: "People & Portraits",
      icon: "👤",
      prompts: [
        "Professional LinkedIn headshot with soft studio lighting on neutral grey background",
        "Corporate executive portrait with confident expression, formal attire, and office backdrop",
        "Friendly approachable business casual headshot with warm genuine smile",
        "Transform into oil painting portrait in classical Renaissance style with dramatic lighting",
        "Create cinematic movie poster style portrait with dramatic lighting and film grain",
        "Turn into Disney Pixar 3D animated character with expressive eyes and stylized features",
        "Professional doctor/medical professional portrait with white coat and clinical setting",
        "Fashion magazine editorial style with high-end retouching and dramatic poses",
        "Transform to vintage 1950s portrait with period-appropriate styling and sepia tones",
        "Create superhero comic book version with dynamic pose and action background",
        "Professional realtor headshot with friendly smile and modern office background",
        "Transform into anime/manga character with large eyes and cel-shaded style",
        "Create LinkedIn banner with professional headshot and industry-relevant background",
        "Turn into fantasy RPG character with medieval armor and magical effects",
        "Professional teacher/educator portrait with classroom or library background",
        "Transform to cyberpunk character with neon lights and futuristic augmentations",
        "Create professional dating profile photo with natural outdoor lighting",
        "Turn into classical marble statue bust with museum lighting",
        "Professional musician/artist portrait with creative studio background",
        "Transform to watercolor painting portrait with soft edges and artistic splashes",
        "Create professional Zoom virtual background with home office setting",
        "Turn into retro 80s portrait with neon colors and synthwave aesthetics",
        "Professional athlete/fitness portrait with gym or sports facility background",
        "Transform into chibi/kawaii cute cartoon version with oversized head",
        "Create professional speaker/presenter portrait with conference stage background"
      ]
    },
    {
      category: "Products & E-commerce",
      icon: "📦",
      prompts: [
        "Product on pure white background with professional studio lighting and subtle shadow",
        "Lifestyle product shot in modern minimalist home setting with natural light",
        "360-degree product view with consistent lighting for e-commerce spinner",
        "Product with transparent background (PNG) for flexible marketing use",
        "Luxury product presentation with elegant props and premium packaging display",
        "Product in use demonstration showing hands interacting naturally",
        "Amazon listing hero image with infographic callouts and feature highlights",
        "Product flat lay with complementary accessories and branded elements",
        "Close-up macro detail shot showing textures, materials, and craftsmanship",
        "Product size comparison with common objects for scale reference",
        "Holiday/seasonal themed product shot with festive decorations",
        "Product splash or explosion shot showing dynamic movement and energy",
        "Before/after transformation showing product effectiveness and results",
        "Product packaging shot from multiple angles showing all sides clearly",
        "Minimalist product shot with negative space for text overlay",
        "Product in outdoor lifestyle setting showing real-world usage",
        "Professional jewelry/watch shot with reflective surface and dramatic lighting",
        "Food product shot with appetizing presentation and fresh ingredients visible",
        "Tech product shot with futuristic background and holographic effects",
        "Fashion/clothing ghost mannequin shot showing fit without model",
        "Product bundle or kit layout showing all included items organized",
        "Cosmetic/beauty product shot with texture swatches and color samples",
        "Product comparison grid showing different models or variations",
        "Eco-friendly product shot with natural, sustainable background elements",
        "Product unboxing sequence showing packaging layers and presentation"
      ]
    },
    {
      category: "Scenery & Locations",
      icon: "🏔️",
      prompts: [
        "Golden hour landscape with warm sunset lighting and long shadows",
        "Misty mountain sunrise with fog rolling through valleys and peaks",
        "Tropical beach paradise with crystal clear water and palm trees",
        "Urban cityscape at blue hour with illuminated buildings and traffic trails",
        "Enchanted forest with rays of sunlight filtering through trees",
        "Northern lights (aurora borealis) dancing over snowy wilderness",
        "Japanese cherry blossom garden in full bloom with traditional architecture",
        "Dramatic storm clouds over prairie landscape with lightning strikes",
        "Underwater coral reef scene with colorful fish and marine life",
        "Autumn forest with vibrant fall colors and fallen leaves carpet",
        "Desert landscape with sand dunes and dramatic shadows at sunset",
        "Winter wonderland with fresh snow and frozen waterfalls",
        "Mediterranean coastal village with white buildings and blue waters",
        "Milky Way galaxy over dark sky preserve with no light pollution",
        "Lavender fields in Provence with purple rows stretching to horizon",
        "Scottish highlands with misty mountains and ancient castles",
        "Venice canals with gondolas and historic architecture reflections",
        "African safari landscape with acacia trees and wildlife silhouettes",
        "New York City skyline from Brooklyn Bridge at twilight",
        "Iceland's black sand beaches with basalt columns and crashing waves",
        "Swiss Alps panorama with snow-capped peaks and mountain villages",
        "Amazon rainforest canopy with exotic birds and lush vegetation",
        "Dubai futuristic skyline with Burj Khalifa and modern architecture",
        "Santorini sunset with white churches and blue domes overlooking caldera",
        "Grand Canyon panoramic view with layered rock formations and Colorado River"
      ]
    },
    {
      category: "Creative Styles",
      icon: "🎨",
      prompts: [
        "Transform to Studio Ghibli anime style with soft colors and whimsical details",
        "Cyberpunk neon aesthetic with glowing edges and futuristic elements",
        "Van Gogh painting style with swirling brushstrokes and vibrant colors",
        "80s synthwave/vaporwave with neon grids and retro-futuristic vibes",
        "Banksy street art stencil style with political message and urban decay",
        "Tim Burton gothic style with dark whimsy and exaggerated proportions",
        "Wes Anderson symmetrical composition with pastel color palette",
        "Marvel/DC comic book style with bold outlines and Ben Day dots",
        "Minecraft blocky voxel art style with pixelated cubic forms",
        "Salvador Dali surrealist melting style with dreamlike distortions",
        "Andy Warhol pop art with bold colors and repeated patterns",
        "Japanese woodblock print (ukiyo-e) style with flat colors and waves",
        "Steampunk Victorian era with brass gears and mechanical elements",
        "Low poly 3D geometric style with triangulated surfaces",
        "Film noir black and white with dramatic shadows and venetian blinds",
        "Lisa Frank rainbow style with neon colors and cute animals",
        "Borderlands cel-shaded video game style with thick black outlines",
        "Art Nouveau style with organic flowing lines and nature motifs",
        "Glitch art with digital artifacts and corrupted pixel effects",
        "Bauhaus minimalist design with geometric shapes and primary colors"
      ]
    },
    {
      category: "Social Media Content",
      icon: "📱",
      prompts: [
        "Instagram carousel post with cohesive color scheme across 10 slides",
        "TikTok viral transformation with dramatic before/after split screen",
        "Pinterest-worthy infographic with data visualization and icons",
        "LinkedIn thought leadership post with professional headshot overlay",
        "YouTube thumbnail with shocked expression and bold text overlay",
        "Facebook cover photo with family portrait and seasonal theme",
        "Twitter header with minimalist design and personal branding",
        "Instagram Reels cover with motion blur and dynamic text",
        "Snapchat geofilter design with location-specific graphics",
        "WhatsApp status update with countdown timer overlay",
        "Discord server banner with gaming theme and animated elements",
        "Twitch stream overlay with alerts and donation goals",
        "Instagram story highlight covers with matching icons and colors",
        "TikTok duet layout with reaction space and original video",
        "Pinterest mood board with cohesive aesthetic and color palette",
        "LinkedIn banner with industry keywords and achievements",
        "YouTube end screen with subscribe button and video suggestions",
        "Instagram quote post with typography and blurred background",
        "Facebook event cover with date, time, and location details",
        "Twitter meme format with relatable text and reaction image"
      ]
    },
    {
      category: "Real Estate & Architecture",
      icon: "🏡",
      prompts: [
        "Golden hour exterior shot with warm lighting enhancing curb appeal",
        "Virtual staging of empty room with modern furniture and decor",
        "Wide-angle interior showing spacious layout and natural light",
        "Twilight photography with interior lights creating warm glow",
        "Aerial drone view showing property boundaries and neighborhood",
        "HDR interior balancing window views with indoor lighting",
        "Kitchen close-up highlighting premium appliances and finishes",
        "Bathroom spa-like presentation with staged towels and accessories",
        "Virtual renovation showing potential after improvements",
        "Day to dusk conversion for dramatic twilight effect",
        "Remove clutter and personal items for clean listing photos",
        "Add virtual grass and landscaping to improve yard appeal",
        "Brighten dark rooms with enhanced lighting and exposure",
        "Create floor plan overlay showing room dimensions and flow",
        "Before/after renovation comparison showing improvements",
        "Add blue sky to overcast exterior photos for better appeal",
        "Virtual paint colors showing different room color options",
        "Enhance fireplace with virtual fire for cozy atmosphere",
        "Remove cars from driveway for cleaner exterior shot",
        "Add virtual pool or outdoor features to backyard"
      ]
    }
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

        {/* Prompt Library */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-orange-600" />
            <h2 className="text-3xl font-bold text-gray-900">Prompt Library</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promptIdeas.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="bg-white rounded-xl p-5 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-bold text-lg text-gray-900">{category.category}</h3>
                </div>
                <div className="space-y-3">
                  {category.prompts.map((prompt, promptIndex) => (
                    <div
                      key={promptIndex}
                      className="group relative p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
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
              </div>
            ))}
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
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Workflow Optimization</h3>
              <ul className="space-y-2 text-orange-50">
                <li>• Save your favorite prompts for quick access</li>
                <li>• Use batch processing for consistent branding</li>
                <li>• Start with low-res tests, then apply to high-res</li>
                <li>• Combine multiple passes for complex edits</li>
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