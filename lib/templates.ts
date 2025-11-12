export interface Template {
  id: string
  name: string
  icon: string
  category: 'professional' | 'social' | 'ecommerce' | 'personal' | 'realestate' | '3d' | 'era' | 'character' | 'ar' | 'comic' | 'creative'
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
  },
  // 3D Templates
  {
    id: '3d-render-pro',
    name: '3D Product Render',
    icon: '🔮',
    category: '3d',
    description: 'Photorealistic 3D product visualization',
    badge: '✨ Premium',
    prompts: [
      'Transform into photorealistic 3D render with ray tracing. Add professional studio lighting with soft shadows. Create seamless white or gradient background. Apply realistic material properties and reflections.',
      'CGI product visualization style. High-end 3D rendering with perfect geometry and clean presentation.'
    ],
    settings: {
      intensity: 'strong',
      style: '3d-render'
    }
  },
  {
    id: '3d-isometric',
    name: 'Isometric 3D View',
    icon: '📐',
    category: '3d',
    description: 'Clean isometric 3D perspective',
    prompts: [
      'Convert to isometric 3D perspective view. Create clean geometric shapes with proper isometric angles. Apply flat color style or gradient shading. Perfect for infographics and technical illustrations.',
      'Modern isometric design aesthetic with balanced proportions.'
    ]
  },
  {
    id: '3d-clay-render',
    name: 'Clay Render Style',
    icon: '🎨',
    category: '3d',
    description: 'Soft 3D clay material aesthetic',
    prompts: [
      'Transform into 3D clay render style. Apply soft matte material with subtle subsurface scattering. Use pastel color palette. Create soft studio lighting. Minimalist clean background.',
      'Trending 3D clay aesthetic popular in modern design. Soft, organic, approachable visual style.'
    ]
  },
  // Era Transformation Templates
  {
    id: 'era-1920s',
    name: '1920s Art Deco',
    icon: '🎩',
    category: 'era',
    description: 'Roaring twenties glamour',
    badge: '⏰ Vintage',
    prompts: [
      'Transform to 1920s art deco era style. Apply black and white or sepia tone. Add art deco geometric patterns and borders. Vintage film grain and soft focus. Period-appropriate styling and atmosphere.',
      'Gatsby-era glamour with jazz age aesthetic. Classic portrait photography style of the 1920s.'
    ]
  },
  {
    id: 'era-1950s',
    name: '1950s Retro',
    icon: '🚗',
    category: 'era',
    description: 'Classic Americana nostalgia',
    prompts: [
      'Transform to 1950s retro Americana style. Apply Kodachrome color palette with vibrant reds and blues. Add vintage advertising aesthetic. Classic mid-century styling.',
      'Nostalgic 1950s look with period-appropriate colors and composition.'
    ]
  },
  {
    id: 'era-1980s',
    name: '1980s Synthwave',
    icon: '💾',
    category: 'era',
    description: 'Neon retro futurism',
    badge: '🔥 Popular',
    prompts: [
      'Transform to 1980s synthwave aesthetic. Add neon colors (pink, purple, cyan). Apply grid patterns and retro futuristic elements. VHS-style scan lines and chromatic aberration.',
      'Vaporwave meets Miami Vice. Neon-soaked retro futurism with nostalgic 80s vibes.'
    ]
  },
  {
    id: 'era-cyberpunk',
    name: 'Cyberpunk Future',
    icon: '🌃',
    category: 'era',
    description: 'High-tech dystopian aesthetic',
    badge: '🆕 New',
    prompts: [
      'Transform to cyberpunk 2077 style. Add neon lighting (blue, pink, yellow). Urban dystopian atmosphere with rain-slicked streets. High contrast with deep shadows. Futuristic tech elements.',
      'Blade Runner inspired aesthetic. Dark, moody, technologically advanced urban setting.'
    ],
    settings: {
      intensity: 'strong'
    }
  },
  // Character Consistency Templates
  {
    id: 'char-beach-sunset',
    name: 'Beach Sunset Scene',
    icon: '🏖️',
    category: 'character',
    description: 'Maintain subject, change to beach background',
    prompts: [
      'Keep the exact same subject/person but transport them to a beautiful beach at sunset. Golden hour lighting. Warm orange and pink sky. Ocean waves in background. Natural beach environment.',
      'Maintain subject identity and pose. Only change the background setting to beach scene.'
    ]
  },
  {
    id: 'char-urban-night',
    name: 'Urban Night Scene',
    icon: '🌆',
    category: 'character',
    description: 'Same subject, city night setting',
    prompts: [
      'Keep the exact same subject/person but place them in an urban city environment at night. Neon lights and city glow. Street lighting. Modern metropolitan setting.',
      'Preserve subject completely. Transform only the background to nighttime cityscape.'
    ]
  },
  {
    id: 'char-mountain-vista',
    name: 'Mountain Vista',
    icon: '⛰️',
    category: 'character',
    description: 'Subject with epic mountain backdrop',
    prompts: [
      'Keep the exact same subject/person but place them with a dramatic mountain landscape background. Epic vista with snow-capped peaks. Natural outdoor lighting. Scenic wilderness setting.',
      'Maintain subject identity. Replace background with majestic mountain scenery.'
    ]
  },
  // AR Overlay Templates
  {
    id: 'ar-product-overlay',
    name: 'AR Product Overlay',
    icon: '✨',
    category: 'ar',
    description: 'Augmented reality product visualization',
    badge: '🔮 AR',
    prompts: [
      'Transform to augmented reality product overlay style. Add holographic interface elements. Transparent glowing edges. Futuristic UI measurements and callouts. Clean isolated product.',
      'AR app preview style with interactive overlay elements. Modern tech aesthetic.'
    ]
  },
  {
    id: 'ar-hologram',
    name: 'Holographic Effect',
    icon: '👻',
    category: 'ar',
    description: 'Futuristic hologram projection',
    prompts: [
      'Transform to holographic projection effect. Add translucent glow with cyan/blue tint. Scan lines and glitch effects. Floating in dark space. Sci-fi hologram aesthetic.',
      'Star Wars style hologram with ethereal glow and digital artifacts.'
    ]
  },
  {
    id: 'ar-measurement',
    name: 'AR Measurement Guide',
    icon: '📏',
    category: 'ar',
    description: 'Product dimensions overlay',
    prompts: [
      'Add AR measurement guides and dimensions overlay. Technical drawing style callouts. Dimension lines and measurements. Professional product specification view. Clean and technical.',
      'IKEA-style AR measurement visualization with clear dimension indicators.'
    ]
  },
  // Comic/Manga Templates
  {
    id: 'comic-manga-bw',
    name: 'Manga Black & White',
    icon: '📚',
    category: 'comic',
    description: 'Japanese manga ink art style',
    badge: '🎌 Manga',
    prompts: [
      'Transform to Japanese manga black and white ink style. Bold black outlines. Screentone patterns for shading. Dramatic speed lines and action effects. Authentic manga aesthetic.',
      'Professional manga illustration style with traditional ink techniques.'
    ]
  },
  {
    id: 'comic-american',
    name: 'American Comic Book',
    icon: '💥',
    category: 'comic',
    description: 'Bold superhero comic style',
    prompts: [
      'Transform to American comic book style. Bold black outlines with vibrant colors. Ben-Day dots and halftone patterns. Dramatic shading. Marvel/DC superhero aesthetic.',
      'Classic comic book illustration with dynamic composition and bold line art.'
    ]
  },
  {
    id: 'comic-anime-cel',
    name: 'Anime Cel-Shaded',
    icon: '🎨',
    category: 'comic',
    description: 'Digital anime style coloring',
    prompts: [
      'Transform to anime cel-shaded digital art style. Flat color areas with sharp edges. Anime-style highlights and shadows. Clean vector-like appearance. Modern anime aesthetic.',
      'Professional anime digital painting with vibrant colors and clean shading.'
    ]
  },
  {
    id: 'comic-noir',
    name: 'Graphic Novel Noir',
    icon: '🌙',
    category: 'comic',
    description: 'Dark moody graphic novel style',
    prompts: [
      'Transform to graphic novel noir style. High contrast black and white with strategic color accents. Film noir lighting with dramatic shadows. Gritty urban atmosphere.',
      'Sin City inspired aesthetic with stark contrast and moody atmosphere.'
    ]
  },
  {
    id: 'comic-chibi',
    name: 'Chibi Cute Style',
    icon: '🎀',
    category: 'comic',
    description: 'Adorable kawaii chibi art',
    prompts: [
      'Transform to chibi/kawaii cute style. Exaggerated head proportions (large head, small body). Big sparkling eyes. Simplified features. Pastel colors. Super cute and adorable.',
      'Japanese chibi aesthetic - cute, round, and kawaii with vibrant colors.'
    ]
  },
  {
    id: 'comic-webtoon',
    name: 'Webtoon Digital',
    icon: '📱',
    category: 'comic',
    description: 'Modern digital comic style',
    prompts: [
      'Transform to modern webtoon/digital comic style. Clean digital line art. Soft cell shading. Contemporary Korean manhwa aesthetic. Optimized for vertical scrolling format.',
      'Modern digital comic illustration popular in webtoon platforms.'
    ]
  },
  // Creative Studio Templates (from awesome-nano-banana-images)
  {
    id: 'creative-bobblehead',
    name: 'Bobblehead Figure',
    icon: '🎭',
    category: 'creative',
    description: 'Turn photo into cute bobblehead',
    badge: '🔥 Popular',
    prompts: [
      'Turn this photo into a bobblehead: enlarge the head slightly, keep the face accurate and cartoonify the body. Place it on a neutral background with professional lighting.',
      'Create a fun collectible bobblehead style with exaggerated head proportions. Maintain facial accuracy while making the body cute and cartoonish.'
    ],
    settings: {
      intensity: 'strong',
      style: 'cartoon'
    }
  },
  {
    id: 'creative-anime-figure',
    name: 'Anime Figure',
    icon: '🎌',
    category: 'creative',
    description: 'Anime-style collectible figure',
    badge: '✨ Premium',
    prompts: [
      'Generate an anime-style figure photo placed on a desktop, presented from a casual perspective. Accurately reproduce the full body posture, facial expression, and clothing style. The overall design is exquisite and detailed, with hair and clothing featuring natural, soft gradient colors and fine textures. Japanese anime style, rich in detail, with realistic textures and beautiful appearance.',
      'Create as if photographed with mobile phone on a desk. Professional figure quality with vibrant colors.'
    ]
  },
  {
    id: 'creative-glass-retexture',
    name: 'Glass Material',
    icon: '💎',
    category: 'creative',
    description: 'Transform to iridescent glass',
    prompts: [
      'Retexture the image with photorealistic 3D render using glass with transparent and iridescent effects. Smooth, polished surface with subtle reflections and refractive effects. Studio HDRI lighting with high intensity. Blue, green, and purple accent colors. Reflections, refractions, and dispersion effects enabled.',
      'Black background with soft vignette. Add bloom, chromatic aberration, and rainbow-like highlights around edges.'
    ],
    settings: {
      intensity: 'strong',
      style: 'glass-3d'
    }
  },
  {
    id: 'creative-funko-pop',
    name: 'Funko Pop Figure',
    icon: '🧸',
    category: 'creative',
    description: 'Funko Pop collectible style',
    badge: '🆕 Trending',
    prompts: [
      'Transform into Funko Pop vinyl figure style. Large square head with small circular eyes. Simplified body proportions. Matte vinyl texture finish. Accurate to subject but in Funko aesthetic. Include Funko-style window box packaging in background.',
      'Classic Funko Pop style with characteristic features: oversized head, tiny body, and signature Funko proportions.'
    ]
  },
  {
    id: 'creative-voxel-3d',
    name: 'Voxel 3D Icon',
    icon: '🧱',
    category: 'creative',
    description: 'Blocky voxel art style',
    prompts: [
      'Convert to voxel-style 3D icon with cubic, blocky aesthetic. Use bright, vibrant colors with slight gradients. Isometric or slightly angled perspective. Clean, minimalist background. Low-poly geometric shapes forming recognizable subject.',
      'Minecraft-inspired voxel art with colorful cubes and 3D pixel aesthetic.'
    ]
  },
  {
    id: 'creative-pixel-art',
    name: '8-Bit Pixel Icon',
    icon: '👾',
    category: 'creative',
    description: 'Retro pixel art style',
    prompts: [
      'Transform into 8-bit pixel art icon style. Limited color palette (16-32 colors). Sharp pixel edges with no anti-aliasing. Retro gaming aesthetic. Small sprite size appearance. Clean pixel-perfect execution.',
      'Classic video game sprite style with chunky pixels and vibrant retro colors.'
    ]
  },
  {
    id: 'creative-lego-figure',
    name: 'LEGO Minifigure',
    icon: '🧱',
    category: 'creative',
    description: 'LEGO collectible figure',
    prompts: [
      'Create as a LEGO collectible minifigure. Iconic LEGO proportions with cylindrical head, C-shaped hands, and blocky body. Bright plastic material finish. Accurate details painted on LEGO pieces. Professional product photography on white background.',
      'Authentic LEGO minifigure style with realistic plastic texture and official LEGO aesthetic.'
    ]
  },
  {
    id: 'creative-enamel-pin',
    name: 'Enamel Pin',
    icon: '📌',
    category: 'creative',
    description: 'Kawaii enamel pin design',
    prompts: [
      'Transform into kawaii enamel pin design. Smooth enamel coating appearance with metallic gold outlines. Cute, simplified features. Pastel or vibrant color fill areas. Pin backing visible. Presented on neutral background as product photography.',
      'Collectible enamel pin style with glossy finish and metal borders. Cute and wearable design.'
    ]
  },
  {
    id: 'creative-keycap',
    name: 'Artisan Keycap',
    icon: '⌨️',
    category: 'creative',
    description: 'Custom mechanical keycap',
    prompts: [
      'Transform into artisan mechanical keyboard keycap. 3D sculpted design with fine details. Resin or plastic material with vibrant colors or translucent effects. Cherry MX stem visible at bottom. Macro photography style showing intricate details.',
      'Premium custom keycap for mechanical keyboards. Collectible quality with artistic design.'
    ]
  },
  {
    id: 'creative-chibi',
    name: 'Chibi Character',
    icon: '🎀',
    category: 'creative',
    description: 'Super cute chibi style',
    prompts: [
      'Transform to chibi/Q-version style. Exaggerated proportions: head is 1/2 to 1/3 of total height. Large sparkling eyes with highlights. Tiny body with stubby limbs. Simplified but expressive features. Soft pastel colors. Kawaii aesthetic.',
      'Super deformed (SD) Japanese chibi style. Adorable, rounded, and irresistibly cute.'
    ]
  },
  {
    id: 'creative-sticker',
    name: 'Die-Cut Sticker',
    icon: '✨',
    category: 'creative',
    description: 'Vinyl sticker design',
    prompts: [
      'Create as die-cut vinyl sticker design. Bold outlines, vibrant colors, and simplified shapes. White border around edge. Flat illustration style optimized for printing. Clean vector-like appearance. Glossy sticker finish aesthetic.',
      'Perfect for laptop, water bottle, or phone. Professional sticker pack quality.'
    ]
  },
  {
    id: 'creative-papercraft',
    name: '3D Papercraft',
    icon: '📄',
    category: 'creative',
    description: 'Paper pop-up book style',
    prompts: [
      'Transform into 3D papercraft pop-up book style. Layered paper cutouts with depth and shadows. Intricate paper engineering with folds and tabs. Soft pastel or vibrant colored paper. Photographed as physical paper sculpture with realistic lighting.',
      'Handmade papercraft aesthetic like a professional pop-up book or paper diorama.'
    ]
  },
  {
    id: 'creative-plush-toy',
    name: 'Plush Toy',
    icon: '🧸',
    category: 'creative',
    description: 'Soft plush stuffed animal',
    prompts: [
      'Transform into soft plush stuffed toy. Fuzzy fabric texture with visible stitching. Rounded, huggable proportions. Button or embroidered eyes. Cute and cuddly appearance. Photographed on soft surface with warm lighting.',
      'High-quality plushie design like official merchandise. Soft, adorable, and collectible.'
    ]
  },
  {
    id: 'creative-clay-art',
    name: 'Clay Sculpture',
    icon: '🎨',
    category: 'creative',
    description: 'Handmade clay figure',
    prompts: [
      'Transform into handmade clay sculpture. Polymer clay or modeling clay texture with fingerprint details and tool marks. Soft matte finish. Vibrant or pastel colors. Photographed on neutral background showing crafted, artisan quality.',
      'Cute clay art style like handmade Etsy sculptures. Charming imperfections showing handcrafted nature.'
    ]
  },
  {
    id: 'creative-double-exposure',
    name: 'Double Exposure',
    icon: '🌅',
    category: 'creative',
    description: 'Artistic double exposure',
    prompts: [
      'Create double exposure effect blending subject with nature scenery. Silhouette of subject filled with landscape imagery (mountains, forests, ocean, or cityscape). Ethereal, dreamlike composition. Soft color grading with muted tones.',
      'Professional double exposure photography style. Surreal blend of portrait and environment.'
    ],
    settings: {
      intensity: 'medium',
      style: 'artistic'
    }
  },
  {
    id: 'creative-polaroid-3d',
    name: '3D Polaroid Breakout',
    icon: '📸',
    category: 'creative',
    description: 'Subject breaking out of photo',
    prompts: [
      'Create 3D perspective breakout effect where subject appears to be bursting out of a Polaroid photo frame. Subject extends beyond photo boundaries in 3D space. Dramatic depth and shadows. White Polaroid border visible. Creative compositing.',
      'Surreal photo-within-photo effect with subject breaking the fourth wall.'
    ]
  },
  {
    id: 'creative-magazine-cover',
    name: 'Magazine Cover',
    icon: '📰',
    category: 'creative',
    description: 'Fashion magazine cover style',
    prompts: [
      'Transform into professional fashion magazine cover. Bold headline text, cover lines, and barcode. High-fashion photography style with dramatic lighting. Magazine logo at top. Professional layout with price and date. Vogue/Elle aesthetic.',
      'Glossy fashion editorial quality. Make subject look like cover model with professional styling.'
    ]
  },
  {
    id: 'creative-trading-card',
    name: 'Trading Card',
    icon: '🎴',
    category: 'creative',
    description: 'Collectible card game style',
    prompts: [
      'Design as collectible trading card with holographic border effects. Subject in action pose within ornate frame. Stats, abilities, and flavor text at bottom. Metallic foil accents and energy effects. Pokemon/MTG aesthetic.',
      'Premium trading card quality with special edition holographic finish.'
    ]
  },
  {
    id: 'creative-neon-sign',
    name: 'Neon Sign',
    icon: '💡',
    category: 'creative',
    description: 'Glowing neon tube art',
    prompts: [
      'Transform into glowing neon sign design. Bright neon tubes forming subject outline. Vibrant neon colors (pink, blue, purple, yellow). Dark background (black or deep blue). Realistic glow effects, reflections, and light bloom.',
      'Retro neon signage aesthetic. Perfect for bars, arcades, or cyberpunk vibes.'
    ]
  },
  {
    id: 'creative-embroidery',
    name: 'Embroidery Patch',
    icon: '🧵',
    category: 'creative',
    description: 'Stitched fabric patch',
    prompts: [
      'Design as embroidered fabric patch. Visible thread stitching texture with raised, dimensional quality. Bold simplified design with limited colors. Fabric backing visible at edges. Photographed showing textile details.',
      'Collectible embroidered patch style like scout badges or jacket patches.'
    ]
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
export function getTemplatePrompt(templateId: string, customSettings?: { intensity?: 'light' | 'medium' | 'strong' }): string {
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