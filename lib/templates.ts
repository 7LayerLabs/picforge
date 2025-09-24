export interface Template {
  id: string
  name: string
  icon: string
  category: 'professional' | 'social' | 'ecommerce' | 'personal' | 'realestate'
  description: string
  badge?: string
  prompts: string[]
  settings?: {
    intensity?: 'light' | 'medium' | 'strong'
    style?: string
  }
  examples?: {
    before: string
    after: string
  }
}

export const templates: Template[] = [
  {
    id: 'linkedin-pro',
    name: 'LinkedIn Headshot Pro',
    icon: '💼',
    category: 'professional',
    description: 'Professional polish for your career profile',
    badge: '🔥 Popular',
    prompts: [
      'Create professional business headshot with clean background. Enhance lighting to be bright and professional. Ensure formal business appearance. Remove any distracting background elements. Apply subtle skin smoothing while maintaining natural look. Enhance eye clarity and add professional presence. Adjust colors for corporate feel.',
      'Make background a subtle gradient or solid professional color (navy, gray, or white). Ensure subject is well-lit with soft, even lighting. Professional but approachable expression.'
    ],
    settings: {
      intensity: 'medium'
    }
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story Ready',
    icon: '📱',
    category: 'social',
    description: 'Vertical format with vibrant, eye-catching style',
    badge: '✨ Trending',
    prompts: [
      'Optimize for Instagram stories 9:16 vertical format. Enhance colors to be vibrant and eye-catching. Add artistic blur to background. Increase contrast and saturation for social media impact. Make subject pop from background. Apply trendy color grading with warm tones.',
      'Add subtle glow effect. Ensure image is bright and engaging for mobile viewing. Create scroll-stopping visual impact.'
    ],
    settings: {
      intensity: 'strong',
      style: 'vibrant'
    }
  },
  {
    id: 'ecommerce-product',
    name: 'E-commerce Product Shot',
    icon: '🛍️',
    category: 'ecommerce',
    description: 'Clean, professional product photography',
    prompts: [
      'Remove background completely and replace with pure white. Enhance product lighting for professional e-commerce look. Remove all shadows and reflections. Ensure product is perfectly centered. Enhance product details and textures. Adjust colors for accurate product representation.',
      'Add subtle drop shadow for depth. Ensure all product features are clearly visible. Professional product photography style.'
    ],
    settings: {
      intensity: 'light'
    }
  },
  {
    id: 'dating-profile',
    name: 'Dating Profile Optimizer',
    icon: '💝',
    category: 'personal',
    description: 'Authentic, attractive, and approachable look',
    badge: '💕 Magic Touch',
    prompts: [
      'Enhance natural beauty while maintaining authenticity. Improve lighting to be warm and flattering. Subtle skin enhancement for healthy glow. Brighten eyes and enhance smile. Create approachable, friendly appearance. Add warm color grading.',
      'Blur background slightly to focus on subject. Ensure genuine, attractive presentation. Make subject look their absolute best while staying true to their appearance.'
    ],
    settings: {
      intensity: 'medium',
      style: 'warm'
    }
  },
  {
    id: 'realestate-enhancer',
    name: 'Real Estate Enhancer',
    icon: '🏡',
    category: 'realestate',
    description: 'Bright, spacious, and inviting property photos',
    prompts: [
      'Brighten interior spaces dramatically. Enhance natural light from windows. Remove any clutter or personal items. Make rooms appear more spacious with wide angle perspective. Enhance architectural features. Adjust colors to be warm and inviting.',
      'Fix perspective distortion. Enhance outdoor views from windows. Make property look move-in ready. Professional real estate photography style with HDR-like enhancement.'
    ],
    settings: {
      intensity: 'strong'
    }
  },
  {
    id: 'passport-photo',
    name: 'Passport/ID Photo',
    icon: '📷',
    category: 'professional',
    description: 'Official document photo requirements',
    prompts: [
      'Create passport/ID photo with plain white or light blue background. Ensure face is centered and clearly visible. Remove shadows from face and background. Adjust to passport photo specifications: straight-on angle, neutral expression, both eyes open. Even lighting across entire face.',
      'Ensure shoulders are straight and visible. Professional document photo quality.'
    ]
  },
  {
    id: 'food-instagram',
    name: 'Food Porn Mode',
    icon: '🍔',
    category: 'social',
    description: 'Make food look irresistibly delicious',
    badge: '🤤 Yummy',
    prompts: [
      'Enhance food to look incredibly delicious and appetizing. Increase color saturation especially for reds, oranges, and greens. Add subtle steam or freshness effect if applicable. Professional food photography styling. Make textures pop.',
      'Blur background with bokeh effect. Overhead or 45-degree angle optimization. Make viewers hungry just looking at it.'
    ]
  },
  {
    id: 'fitness-transformation',
    name: 'Fitness Showcase',
    icon: '💪',
    category: 'personal',
    description: 'Highlight muscle definition and progress',
    prompts: [
      'Enhance muscle definition and body contours. Improve lighting to show muscle detail. Increase contrast for athletic appearance. Add dramatic lighting for fitness photography style. Enhance vascularity subtly.',
      'Make subject look strong and fit. Gym or athletic background enhancement.'
    ],
    settings: {
      intensity: 'strong',
      style: 'dramatic'
    }
  },
  {
    id: 'vintage-filter',
    name: 'Vintage Aesthetic',
    icon: '📸',
    category: 'social',
    description: 'Nostalgic film camera look',
    prompts: [
      'Apply vintage film photography aesthetic. Add grain and slight vignetting. Adjust colors for retro film look with faded blacks. Create nostalgic mood with warm color cast. Simulate analog film characteristics.',
      'Add light leaks or film burn effects subtly. 70s/80s photography style.'
    ]
  },
  {
    id: 'anime-style',
    name: 'Anime Avatar',
    icon: '🎌',
    category: 'social',
    description: 'Transform into anime character style',
    badge: '🆕 New',
    prompts: [
      'Transform photo into anime/manga art style. Enhance eyes to be larger and more expressive. Smooth skin with anime-style rendering. Add anime-style hair highlights and shading. Create cel-shaded appearance.',
      'Apply Japanese animation aesthetic. Make subject look like anime character while maintaining recognizable features.'
    ],
    settings: {
      intensity: 'strong',
      style: 'anime'
    }
  }
]

// Helper function to get templates by category
export function getTemplatesByCategory(category: Template['category']) {
  return templates.filter(t => t.category === category)
}

// Helper function to get trending templates
export function getTrendingTemplates() {
  return templates.filter(t => t.badge?.includes('Trending') || t.badge?.includes('Popular'))
}

// Helper function to apply template
export function getTemplatePrompt(templateId: string, customSettings?: any): string {
  const template = templates.find(t => t.id === templateId)
  if (!template) return ''

  // Combine all prompts into one instruction
  let fullPrompt = template.prompts.join(' ')

  // Apply intensity settings if specified
  if (customSettings?.intensity || template.settings?.intensity) {
    const intensity = customSettings?.intensity || template.settings?.intensity
    if (intensity === 'light') {
      fullPrompt = `Apply these edits subtly and naturally: ${fullPrompt}`
    } else if (intensity === 'strong') {
      fullPrompt = `Apply these edits with strong, dramatic effect: ${fullPrompt}`
    }
  }

  return fullPrompt
}