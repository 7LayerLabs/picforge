export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  subject: string;
  mood: string;
  composition: string;
  equipment?: string;
  platform?: string;
}

export interface SubmittedPrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  subject: string;
  mood: string;
  composition: string;
  submittedBy?: string;
  submittedAt: number;
  votes?: number;
}

export const prompts: Prompt[] = [
  // ===== PRO PHOTOGRAPHY & EDITING (35 prompts) =====
  {
    id: "pro-1",
    title: "Studio Headshot - Professional",
    category: "Pro Photography & Editing",
    tags: ["people", "professional", "realistic", "business"],
    subject: "Professional headshot for corporate use",
    mood: "Neutral lighting, clean background, approachable",
    composition: "Head and shoulders, direct gaze, soft focus background",
    equipment: "Canon 85mm f/1.4, studio setup, ring light",
    description: "Clean professional headshot with proper studio lighting and neutral backdrop. Perfect for LinkedIn, corporate websites, and professional profiles. Soft skin tones with natural eye catchlights."
  },
  {
    id: "pro-2",
    title: "High-End Product Retouching",
    category: "Pro Photography & Editing",
    tags: ["products", "professional", "realistic", "e-commerce"],
    subject: "Luxury product in pristine condition",
    mood: "Bright, clean, minimalist, premium",
    composition: "Product centered, 3/4 angle, studio lighting, minimal shadow",
    equipment: "Macro lens, studio lights, professional reflectors, tethered capture",
    description: "Advanced product retouching with professional finish. Includes color correction, blemish removal, and enhanced product details. Suitable for luxury goods and e-commerce."
  },
  {
    id: "pro-3",
    title: "Fashion Photography - High Fashion",
    category: "Pro Photography & Editing",
    tags: ["people", "fashion", "realistic", "professional"],
    subject: "Model in high-end fashion",
    mood: "Dramatic, editorial, powerful",
    composition: "Full body, dynamic pose, editorial cropping, fashion-forward framing",
    equipment: "50mm or 85mm lens, professional lighting, backdrop stand",
    description: "Editorial fashion photography with dramatic lighting and powerful posing. Captures clothing details and model presence for high-fashion campaigns."
  },
  {
    id: "pro-4",
    title: "Beauty Product Close-Up",
    category: "Pro Photography & Editing",
    tags: ["products", "professional", "beauty", "detail"],
    subject: "Beauty or cosmetic product with packaging visible",
    mood: "Luxurious, glowing, aspirational",
    composition: "Extreme close-up, macro lens depth, golden lighting",
    equipment: "100mm macro lens, ring light, studio setup",
    description: "Detailed product photography for cosmetics, skincare, and beauty items. Showcases packaging, texture, and product form with professional retouching."
  },
  {
    id: "pro-5",
    title: "Corporate Event Photography",
    category: "Pro Photography & Editing",
    tags: ["professional", "business", "events", "realistic"],
    subject: "Professional event or conference setting",
    mood: "Active, professional, engaging",
    composition: "Mid-shot of action or presentations, event context visible",
    equipment: "24-70mm zoom lens, event lighting capture",
    description: "Professional event documentation with sharp focus on subjects and context. Suitable for corporate communications and annual reports."
  },
  {
    id: "pro-6",
    title: "Real Estate Professional Photography",
    category: "Pro Photography & Editing",
    tags: ["professional", "realistic", "architecture", "business"],
    subject: "Interior or exterior property",
    mood: "Inviting, well-lit, spacious",
    composition: "Wide angle shot, leading lines, property features highlighted",
    equipment: "16-35mm wide angle, tripod, perspective correction",
    description: "Professional real estate photography with wide-angle framing and perspective correction. Includes color correction and enhanced lighting."
  },
  {
    id: "pro-7",
    title: "Jewelry Product Photography",
    category: "Pro Photography & Editing",
    tags: ["products", "professional", "luxury", "detail"],
    subject: "Fine jewelry or accessory",
    mood: "Elegant, luxurious, detailed",
    composition: "Extreme macro, intricate details visible, studio lighting",
    equipment: "Macro lens, focus stacking capable, professional lighting",
    description: "Professional jewelry photography with macro detail. Captures sparkle, materials, and craftsmanship with studio perfection."
  },
  {
    id: "pro-8",
    title: "Food Photography - Culinary Pro",
    category: "Pro Photography & Editing",
    tags: ["food", "professional", "culinary", "detail"],
    subject: "Gourmet prepared dish",
    mood: "Appetizing, professional, sophisticated",
    composition: "Overhead or 45-degree angle, shallow depth of field, food hero centered",
    equipment: "100mm lens, natural light preference, professional styling",
    description: "Professional food photography for culinary publications. Includes food styling, lighting optimization, and detailed composition."
  },
  {
    id: "pro-9",
    title: "Architecture - Professional Interior",
    category: "Pro Photography & Editing",
    tags: ["architecture", "professional", "realistic", "design"],
    subject: "Interior design space",
    mood: "Clean, professional, design-focused",
    composition: "Wide angle, symmetrical framing, architectural lines emphasized",
    equipment: "Tilt-shift or wide angle lens, tripod, perspective correction",
    description: "Professional architectural photography of interior spaces. Includes perspective correction and color grading for design publications."
  },
  {
    id: "pro-10",
    title: "Environmental Portrait - Professional",
    category: "Pro Photography & Editing",
    tags: ["people", "professional", "portraits", "business"],
    subject: "Professional in their environment or workplace",
    mood: "Confident, authentic, professional",
    composition: "Three-quarter view, subject in context, natural framing",
    equipment: "50mm lens, natural or mixed lighting",
    description: "Professional portraits capturing individuals in their work environment. Balances subject focus with contextual information."
  },
  {
    id: "pro-11",
    title: "Automotive Photography - Professional",
    category: "Pro Photography & Editing",
    tags: ["professional", "automotive", "products", "realistic"],
    subject: "Vehicle exterior or interior detail",
    mood: "Dynamic, professional, sleek",
    composition: "3/4 angle, studio lighting, reflections enhanced",
    equipment: "24-70mm zoom, professional automotive lights",
    description: "Professional automotive photography with detailed lighting setup. Captures vehicle features and craftsmanship."
  },
  {
    id: "pro-12",
    title: "Technical Product Documentation",
    category: "Pro Photography & Editing",
    tags: ["professional", "products", "technical", "detail"],
    subject: "Technical or mechanical product",
    mood: "Clear, detailed, professional",
    composition: "Isometric or 3/4 angle, all details visible, sharp throughout",
    equipment: "Macro or standard lens, diffused lighting, focus stacking",
    description: "Technical photography for product manuals and documentation. Emphasizes clarity, detail, and professional presentation."
  },
  {
    id: "pro-13",
    title: "Luxury Watch Photography",
    category: "Pro Photography & Editing",
    tags: ["professional", "luxury", "products", "detail"],
    subject: "High-end timepiece",
    mood: "Luxurious, detailed, prestigious",
    composition: "Extreme macro detail, face, case, band all visible, studio lit",
    equipment: "Macro lens with focus stacking, ring light",
    description: "Professional watch photography showcasing craftsmanship. Macro detail of mechanisms and luxury materials."
  },
  {
    id: "pro-14",
    title: "Brand Photography - Lifestyle",
    category: "Pro Photography & Editing",
    tags: ["professional", "brand", "lifestyle", "business"],
    subject: "Brand products in lifestyle context",
    mood: "Aspirational, professional, brand-aligned",
    composition: "Products integrated into lifestyle scene, natural interaction",
    equipment: "35-85mm prime, natural or balanced lighting",
    description: "Professional brand lifestyle photography showing products in use. Creates aspirational brand narratives."
  },
  {
    id: "pro-15",
    title: "Color Grading - Professional Preset",
    category: "Pro Photography & Editing",
    tags: ["professional", "editing", "realistic", "technical"],
    subject: "Any photograph requiring color correction",
    mood: "Warm, professional, color-corrected",
    composition: "Professional color grading, consistent color theory applied",
    equipment: "Professional photo editing software, calibrated monitor",
    description: "Professional color grading and correction. Achieves consistent, brand-aligned color profiles across image series."
  },
  {
    id: "pro-16",
    title: "Retouching - Skin & Details",
    category: "Pro Photography & Editing",
    tags: ["professional", "editing", "people", "realistic"],
    subject: "Portrait requiring advanced retouching",
    mood: "Natural, enhanced, professional",
    composition: "Skin perfection while maintaining natural texture",
    equipment: "Professional retouching software, Wacom tablet",
    description: "Advanced skin retouching and detail enhancement. Maintains natural appearance while perfecting skin tones and texture."
  },
  {
    id: "pro-17",
    title: "Composite Photography - Professional",
    category: "Pro Photography & Editing",
    tags: ["professional", "editing", "creative", "technical"],
    subject: "Multiple images combined for composite",
    mood: "Seamless, professional, artistic",
    composition: "Elements perfectly blended, lighting matched",
    equipment: "Professional compositing software, Photoshop expertise",
    description: "Professional composite photography combining multiple images. Includes perfect blending and lighting matching."
  },
  {
    id: "pro-18",
    title: "HDR Photography - Professional",
    category: "Pro Photography & Editing",
    tags: ["professional", "technical", "realistic", "editing"],
    subject: "Scene with high dynamic range",
    mood: "Detailed, professional, balanced",
    composition: "Shadow and highlight detail preserved, natural appearance",
    equipment: "HDR software, bracketed exposures",
    description: "Professional HDR tone mapping preserving details in highlights and shadows while maintaining natural appearance."
  },
  {
    id: "pro-19",
    title: "Studio Setup - Three Light Setup",
    category: "Pro Photography & Editing",
    tags: ["professional", "technical", "lighting", "studio"],
    subject: "Subject photographed with professional three-light setup",
    mood: "Professional, well-lit, studio quality",
    composition: "Key light, fill light, backlight balanced perfectly",
    equipment: "Studio strobes, light modifiers, professional setup",
    description: "Professional studio lighting with three-light setup. Key light, fill light, and backlight perfectly balanced."
  },
  {
    id: "pro-20",
    title: "Motion Blur - Professional",
    category: "Pro Photography & Editing",
    tags: ["professional", "technical", "dynamic", "realistic"],
    subject: "Action shot with professional motion blur",
    mood: "Dynamic, professional, controlled",
    composition: "Subject sharp, background motion blurred, professional timing",
    equipment: "Fast shutter, tracking capability",
    description: "Professional action photography with controlled motion blur. Subject remains sharp while capturing movement."
  },

  // ===== PLAYFUL & COLLECTIBLE CREATIONS (25 prompts) =====
  {
    id: "play-1",
    title: "Miniature Diorama Scene",
    category: "Playful & Collectible Creations",
    subcategory: "Dioramas",
    tags: ["creative", "fun", "artistic", "transformative"],
    subject: "Scene transformed into tiny diorama",
    mood: "Whimsical, detailed, magical",
    composition: "Bird's eye view of miniature world, depth of field effect",
    description: "Transform any image into a miniature diorama scene with detailed tiny elements and perspective distortion."
  },
  {
    id: "play-2",
    title: "Retro Cereal Box Design",
    category: "Playful & Collectible Creations",
    subcategory: "Vintage & Retro",
    tags: ["creative", "retro", "fun", "transformative"],
    subject: "Image as vintage 80s/90s packaging",
    mood: "Nostalgic, colorful, playful",
    composition: "Product box format, centered image, vintage typography",
    description: "Convert image to retro packaging design with 80s/90s aesthetic, bold colors, and vintage typography."
  },
  {
    id: "play-3",
    title: "Trading Card Version",
    category: "Playful & Collectible Creations",
    subcategory: "Toys & Games",
    tags: ["creative", "fun", "artistic", "collectible"],
    subject: "Image as collectible trading card",
    mood: "Bold, card-like aesthetic, nostalgic",
    composition: "Standard trading card format with stats and details",
    description: "Transform into vintage trading card style with card border, stats, name, and collectible card aesthetic."
  },
  {
    id: "play-4",
    title: "Action Figure Packaging",
    category: "Playful & Collectible Creations",
    subcategory: "Toys & Games",
    tags: ["creative", "fun", "retro", "toy"],
    subject: "Subject as action figure in package",
    mood: "Nostalgic, colorful, toy-like",
    composition: "Action figure box format with text and illustrated background",
    description: "Package subject as vintage-style action figure with box artwork, text, and toy packaging design."
  },
  {
    id: "play-5",
    title: "Comic Book Cover Style",
    category: "Playful & Collectible Creations",
    subcategory: "Artistic",
    tags: ["creative", "artistic", "fun", "transformative"],
    subject: "Scene rendered as comic book cover",
    mood: "Dynamic, bold, comic-style",
    composition: "Comic panel grid, thought bubbles, action lines",
    description: "Convert image to comic book cover style with bold colors, speech bubbles, and comic panel effects."
  },
  {
    id: "play-6",
    title: "Vintage Poster Design",
    category: "Playful & Collectible Creations",
    subcategory: "Vintage & Retro",
    tags: ["creative", "retro", "artistic", "design"],
    subject: "Image rendered as vintage travel poster",
    mood: "Nostalgic, artistic, promotional",
    composition: "Vintage poster layout with bold typography and borders",
    description: "Transform into vintage travel poster style with retro design elements, bold text, and limited color palette."
  },
  {
    id: "play-7",
    title: "Lego-Style Rendering",
    category: "Playful & Collectible Creations",
    subcategory: "Toys & Games",
    tags: ["creative", "fun", "toy", "artistic"],
    subject: "Scene rendered in Lego brick style",
    mood: "Playful, blocky, colorful",
    composition: "Made from visible Lego bricks, chunky pixel-like appearance",
    description: "Render scene as if made from Lego bricks with blocky appearance and bright toy colors."
  },
  {
    id: "play-8",
    title: "Sticker Pack Design",
    category: "Playful & Collectible Creations",
    subcategory: "Design",
    tags: ["creative", "fun", "design", "playful"],
    subject: "Multiple subjects as sticker pack",
    mood: "Fun, colorful, playful",
    composition: "Arranged as sticker pack with varied sizes and styles",
    description: "Create subjects as sticker pack designs with varied sizes, borders, and collectible sticker aesthetic."
  },
  {
    id: "play-9",
    title: "3D Render - Plastic Toy Style",
    category: "Playful & Collectible Creations",
    subcategory: "Toys & Games",
    tags: ["creative", "fun", "toy", "3d"],
    subject: "Subject rendered as plastic toy",
    mood: "Playful, shiny, toy-like",
    composition: "Smooth plastic appearance, bright colors, toy proportions",
    description: "Render subject as a plastic toy with shiny appearance, simplified features, and bright toy colors."
  },
  {
    id: "play-10",
    title: "Pixelated - Retro Video Game",
    category: "Playful & Collectible Creations",
    subcategory: "Retro & Vintage",
    tags: ["creative", "retro", "fun", "video-game"],
    subject: "Image rendered in retro video game pixel style",
    mood: "Nostalgic, blocky, retro",
    composition: "8-bit or 16-bit pixel art style with limited color palette",
    description: "Convert image to retro video game pixel art style with limited colors and blocky pixels."
  },
  {
    id: "play-11",
    title: "Holographic Sticker Effect",
    category: "Playful & Collectible Creations",
    subcategory: "Design",
    tags: ["creative", "fun", "shiny", "collectible"],
    subject: "Image with holographic sticker effect",
    mood: "Shiny, iridescent, holographic",
    composition: "Rainbow shimmer effect, sticker borders, sparkles",
    description: "Apply holographic sticker effect with iridescent colors, shimmer, and collectible sticker appearance."
  },
  {
    id: "play-12",
    title: "Vintage Comic Book Art",
    category: "Playful & Collectible Creations",
    subcategory: "Artistic",
    tags: ["creative", "artistic", "retro", "comic"],
    subject: "Scene as vintage comic book illustration",
    mood: "Artistic, vintage, illustrative",
    composition: "Comic book ink style, halftone dots, bold outlines",
    description: "Render as vintage comic book illustration with ink style, halftone patterns, and hand-drawn aesthetic."
  },
  {
    id: "play-13",
    title: "Collage - Mixed Media Style",
    category: "Playful & Collectible Creations",
    subcategory: "Artistic",
    tags: ["creative", "artistic", "collage", "fun"],
    subject: "Image rendered as mixed media collage",
    mood: "Artistic, textured, creative",
    composition: "Magazine clippings, paper textures, mixed elements",
    description: "Create as mixed media collage using magazine cutouts, textures, and layered paper elements."
  },
  {
    id: "play-14",
    title: "Stained Glass Window",
    category: "Playful & Collectible Creations",
    subcategory: "Artistic",
    tags: ["creative", "artistic", "colorful", "detailed"],
    subject: "Image rendered as stained glass window",
    mood: "Artistic, colorful, luminous",
    composition: "Stained glass segments, leading lines, light effect",
    description: "Render as stained glass window with colored glass segments, leading, and luminous light effect."
  },
  {
    id: "play-15",
    title: "Children's Book Illustration",
    category: "Playful & Collectible Creations",
    subcategory: "Artistic",
    tags: ["creative", "artistic", "fun", "illustration"],
    subject: "Scene as children's book illustration",
    mood: "Whimsical, colorful, friendly",
    composition: "Children's book art style, simple shapes, friendly design",
    description: "Transform into children's book illustration style with simple shapes, bright colors, and friendly aesthetic."
  },
  {
    id: "play-16",
    title: "Art Deco Poster",
    category: "Playful & Collectible Creations",
    subcategory: "Vintage & Retro",
    tags: ["creative", "artistic", "retro", "design"],
    subject: "Image rendered as Art Deco poster",
    mood: "Elegant, geometric, stylized",
    composition: "Art Deco geometric patterns, bold lines, art deco colors",
    description: "Create as Art Deco poster with geometric patterns, bold lines, and limited color palette."
  },
  {
    id: "play-17",
    title: "Punk Rock Poster",
    category: "Playful & Collectible Creations",
    subcategory: "Design",
    tags: ["creative", "fun", "retro", "music"],
    subject: "Image rendered as punk rock poster",
    mood: "Edgy, rebellious, bold",
    composition: "Torn paper effect, bold typography, graffiti style",
    description: "Design as punk rock concert poster with torn paper, bold type, and rebellious aesthetic."
  },
  {
    id: "play-18",
    title: "Psychedelic Poster",
    category: "Playful & Collectible Creations",
    subcategory: "Artistic",
    tags: ["creative", "artistic", "colorful", "retro"],
    subject: "Image rendered with psychedelic effects",
    mood: "Trippy, colorful, groovy",
    composition: "Swirling patterns, vibrant colors, fluid shapes",
    description: "Create psychedelic poster with swirling patterns, vibrant colors, and fluid organic shapes."
  },
  {
    id: "play-19",
    title: "Graffiti Street Art",
    category: "Playful & Collectible Creations",
    subcategory: "Artistic",
    tags: ["creative", "artistic", "urban", "fun"],
    subject: "Image as graffiti street art",
    mood: "Urban, bold, artistic",
    composition: "Graffiti style, spray paint texture, urban aesthetic",
    description: "Render as graffiti street art with spray paint style, tags, and urban aesthetic."
  },
  {
    id: "play-20",
    title: "Neon Sign Design",
    category: "Playful & Collectible Creations",
    subcategory: "Design",
    tags: ["creative", "fun", "neon", "modern"],
    subject: "Image or text as neon sign",
    mood: "Modern, glowing, vibrant",
    composition: "Neon glow effect, bright colors against dark background",
    description: "Create as neon sign design with glowing neon effect, bright colors, and modern aesthetic."
  },
  {
    id: "play-21",
    title: "Embroidery Pattern",
    category: "Playful & Collectible Creations",
    subcategory: "Design",
    tags: ["creative", "artistic", "textured", "detailed"],
    subject: "Image rendered as embroidery pattern",
    mood: "Textured, handcrafted, detailed",
    composition: "Embroidery stitch patterns, fabric texture visible",
    description: "Transform into embroidery pattern with visible stitches and fabric texture."
  },
  {
    id: "play-22",
    title: "Mosaic Art Style",
    category: "Playful & Collectible Creations",
    subcategory: "Artistic",
    tags: ["creative", "artistic", "colorful", "detailed"],
    subject: "Image rendered as mosaic art",
    mood: "Artistic, textured, colorful",
    composition: "Mosaic tiles visible, grout lines shown",
    description: "Create as mosaic art with visible tiles, grout lines, and artistic color composition."
  },
  {
    id: "play-23",
    title: "Origami Paper Craft",
    category: "Playful & Collectible Creations",
    subcategory: "Design",
    tags: ["creative", "artistic", "3d", "craft"],
    subject: "Subject rendered as origami craft",
    mood: "Artistic, folded, three-dimensional",
    composition: "Paper fold visible, 3D appearance, crisp edges",
    description: "Render subject as origami paper craft with visible folds and three-dimensional appearance."
  },
  {
    id: "play-24",
    title: "Ink Wash Painting",
    category: "Playful & Collectible Creations",
    subcategory: "Artistic",
    tags: ["creative", "artistic", "traditional", "painting"],
    subject: "Scene as ink wash painting",
    mood: "Artistic, fluid, traditional",
    composition: "Watercolor ink style, flowing brushstrokes, Asian art influence",
    description: "Create as traditional ink wash painting with fluid brushstrokes and minimalist aesthetic."
  },
  {
    id: "play-25",
    title: "Felt Craft / Wool Felting",
    category: "Playful & Collectible Creations",
    subcategory: "Design",
    tags: ["creative", "artistic", "textured", "craft"],
    subject: "Subject rendered as felt craft",
    mood: "Soft, textured, handmade",
    composition: "Felt texture visible, yarn-like appearance, soft colors",
    description: "Render as wool felt craft with visible textile texture and handmade appearance."
  },

  // ===== SOCIAL MEDIA & MARKETING (40 prompts) =====
  {
    id: "social-1",
    title: "Instagram Story Hero Shot",
    category: "Social Media & Marketing",
    subcategory: "Instagram",
    tags: ["marketing", "social-media", "instagram", "vertical"],
    subject: "Eye-catching product or scene for story",
    mood: "Bold, engaging, attention-grabbing",
    composition: "Vertical 9:16 optimized, hero image centered",
    platform: "Instagram Story (1080x1920px)",
    description: "Optimized for Instagram Stories with vibrant styling and vertical composition perfect for mobile viewing."
  },
  {
    id: "social-2",
    title: "LinkedIn Executive Carousel",
    category: "Social Media & Marketing",
    subcategory: "LinkedIn",
    tags: ["marketing", "social-media", "business", "professional"],
    subject: "Business concept in carousel format",
    mood: "Professional, minimalist, thought-leadership",
    composition: "Horizontal 1.91:1 landscape, balanced design",
    platform: "LinkedIn Carousel (1200x628px)",
    description: "Professional carousel post for LinkedIn with thought leadership positioning and business-focused imagery."
  },
  {
    id: "social-3",
    title: "TikTok Vertical Video Aesthetic",
    category: "Social Media & Marketing",
    subcategory: "TikTok",
    tags: ["marketing", "social-media", "tiktok", "viral"],
    subject: "Trending aesthetic for vertical video",
    mood: "Dynamic, trendy, eye-catching",
    composition: "Vertical 9:16, trending visual effect",
    platform: "TikTok (1080x1920px)",
    description: "Formatted for TikTok viral content with trending visual aesthetics and vertical video optimization."
  },
  {
    id: "social-4",
    title: "Product Unboxing Sequence",
    category: "Social Media & Marketing",
    subcategory: "Marketing",
    tags: ["marketing", "e-commerce", "product", "engaging"],
    subject: "Product being unboxed with anticipation",
    mood: "Exciting, premium, engaging",
    composition: "Sequential shot, hands in frame, premium packaging",
    description: "Unboxing style for marketing content showcasing product presentation and premium packaging design."
  },
  {
    id: "social-5",
    title: "Carousel Post - 3 Images",
    category: "Social Media & Marketing",
    subcategory: "Multi-Image",
    tags: ["marketing", "social-media", "instagram", "carousel"],
    subject: "Three connected images for carousel",
    mood: "Storytelling, engaging, professional",
    composition: "Square 1:1 format per image, visual flow between images",
    description: "Three-image carousel posts that tell a story or showcase multiple product angles."
  },
  {
    id: "social-6",
    title: "Before & After Comparison",
    category: "Social Media & Marketing",
    subcategory: "Marketing",
    tags: ["marketing", "transformation", "engaging", "testimonial"],
    subject: "Before and after transformation",
    mood: "Impressive, credible, motivating",
    composition: "Split screen or sequential presentation",
    description: "Before and after content showing transformation or product results for credibility and engagement."
  },
  {
    id: "social-7",
    title: "User Generated Content - Styled",
    category: "Social Media & Marketing",
    subcategory: "Community",
    tags: ["marketing", "ugc", "community", "authentic"],
    subject: "Customer-style photograph of product",
    mood: "Authentic, relatable, real-world usage",
    composition: "Natural setting, real-world context",
    description: "User-generated style content that feels authentic and relatable to audience."
  },
  {
    id: "social-8",
    title: "Quote Graphics - Inspirational",
    category: "Social Media & Marketing",
    subcategory: "Design",
    tags: ["marketing", "design", "motivational", "text"],
    subject: "Inspirational quote on background image",
    mood: "Motivating, shareable, engaging",
    composition: "Text-focused, readable on mobile, branded colors",
    description: "Inspirational quote graphics optimized for sharing and engagement."
  },
  {
    id: "social-9",
    title: "Product Pack Shot - Multiple Colors",
    category: "Social Media & Marketing",
    subcategory: "Product",
    tags: ["marketing", "products", "ecommerce", "variety"],
    subject: "Product shown in multiple color variations",
    mood: "Professional, complete, options-focused",
    composition: "All colors displayed, organized layout",
    description: "Product photography showcasing all available color options and variations."
  },
  {
    id: "social-10",
    title: "Behind-The-Scenes Content",
    category: "Social Media & Marketing",
    subcategory: "Storytelling",
    tags: ["marketing", "authentic", "behind-scenes", "engaging"],
    subject: "Behind-the-scenes business or product development",
    mood: "Authentic, transparent, engaging",
    composition: "Candid moments, real work environment",
    description: "Behind-the-scenes content showing authentic business operations and team culture."
  },
  {
    id: "social-11",
    title: "Tutorial or How-To Content",
    category: "Social Media & Marketing",
    subcategory: "Educational",
    tags: ["marketing", "educational", "tutorial", "engaging"],
    subject: "Step-by-step product or process tutorial",
    mood: "Clear, helpful, instructional",
    composition: "Sequential steps, clear action visible",
    description: "Tutorial content showing how to use product or complete process with clear steps."
  },
  {
    id: "social-12",
    title: "Lifestyle Flat Lay",
    category: "Social Media & Marketing",
    subcategory: "Lifestyle",
    tags: ["marketing", "lifestyle", "flat-lay", "styled"],
    subject: "Product arranged in styled flat lay scene",
    mood: "Aspirational, aesthetically pleasing, coordinated",
    composition: "Flat lay overhead view, coordinated styling",
    description: "Aspirational lifestyle flat lay showcasing product in beautifully coordinated scene."
  },
  {
    id: "social-13",
    title: "Customer Testimonial - Visual",
    category: "Social Media & Marketing",
    subcategory: "Social Proof",
    tags: ["marketing", "testimonial", "social-proof", "engaging"],
    subject: "Happy customer with product",
    mood: "Genuine, approachable, trustworthy",
    composition: "Customer visible with product, natural setting",
    description: "Customer testimonial photography showing satisfied customer with product in natural setting."
  },
  {
    id: "social-14",
    title: "Product in Context - Real Life",
    category: "Social Media & Marketing",
    subcategory: "Lifestyle",
    tags: ["marketing", "lifestyle", "context", "relatable"],
    subject: "Product shown being used in real-life situation",
    mood: "Relatable, functional, aspirational",
    composition: "Product in actual use environment",
    description: "Product shown in real-life usage context demonstrating practical application and benefits."
  },
  {
    id: "social-15",
    title: "Promo Banner - Limited Time",
    category: "Social Media & Marketing",
    subcategory: "Design",
    tags: ["marketing", "promotional", "design", "urgent"],
    subject: "Limited time offer or promotion",
    mood: "Urgent, exciting, promotional",
    composition: "Prominent call-to-action, clear offer",
    description: "Promotional banner design for limited-time offers with urgency and clear call-to-action."
  },
  {
    id: "social-16",
    title: "Seasonal Campaign Visual",
    category: "Social Media & Marketing",
    subcategory: "Seasonal",
    tags: ["marketing", "seasonal", "holiday", "thematic"],
    subject: "Product/scene with seasonal theme",
    mood: "Festive, timely, relevant",
    composition: "Seasonal props and colors incorporated",
    description: "Seasonal marketing visuals incorporating holiday themes and seasonal design elements."
  },
  {
    id: "social-17",
    title: "Poll or Question Graphics",
    category: "Social Media & Marketing",
    subcategory: "Engagement",
    tags: ["marketing", "engagement", "interactive", "polls"],
    subject: "Image with question or poll prompt",
    mood: "Engaging, interactive, conversational",
    composition: "Clear question visible, answer options shown",
    description: "Interactive poll or question graphics designed to drive engagement and comments."
  },
  {
    id: "social-18",
    title: "Success Story - Transformation",
    category: "Social Media & Marketing",
    subcategory: "Testimonial",
    tags: ["marketing", "success-story", "transformation", "inspiring"],
    subject: "Before/after or transformation story visual",
    mood: "Inspiring, motivating, transformative",
    composition: "Clear comparison or sequential progression",
    description: "Success story visuals showcasing customer transformation and product impact."
  },
  {
    id: "social-19",
    title: "Limited Edition Announcement",
    category: "Social Media & Marketing",
    subcategory: "Product Launch",
    tags: ["marketing", "launch", "exclusive", "limited"],
    subject: "Limited edition or exclusive product",
    mood: "Exclusive, desirable, urgent",
    composition: "Product hero, exclusivity messaging visible",
    description: "Limited edition product announcement emphasizing exclusivity and availability."
  },
  {
    id: "social-20",
    title: "Partnership or Collaboration",
    category: "Social Media & Marketing",
    subcategory: "Partnership",
    tags: ["marketing", "partnership", "collaboration", "professional"],
    subject: "Co-branded or partnership content",
    mood: "Professional, complementary, exciting",
    composition: "Both brands represented, collaborative feel",
    description: "Partnership announcement visuals showing collaboration between brands or influencers."
  },
  {
    id: "social-21",
    title: "Video Thumbnail - Bold & Clear",
    category: "Social Media & Marketing",
    subcategory: "Video",
    tags: ["marketing", "video", "youtube", "engaging"],
    subject: "YouTube or video thumbnail design",
    mood: "Bold, attention-grabbing, clickable",
    composition: "Large text, facial expression, high contrast",
    description: "Video thumbnail optimized for YouTube and social video with bold design and clear call-to-action."
  },
  {
    id: "social-22",
    title: "News or Updates Announcement",
    category: "Social Media & Marketing",
    subcategory: "Announcements",
    tags: ["marketing", "news", "announcements", "update"],
    subject: "Company news or product update",
    mood: "Professional, informative, clear",
    composition: "Headline visible, key info prominent",
    description: "News and update announcements with professional design and clear information hierarchy."
  },
  {
    id: "social-23",
    title: "Milestone Celebration",
    category: "Social Media & Marketing",
    subcategory: "Engagement",
    tags: ["marketing", "milestone", "celebration", "engaging"],
    subject: "Company milestone or achievement",
    mood: "Celebratory, grateful, engaging",
    composition: "Milestone number prominent, festive styling",
    description: "Milestone celebration visuals thanking community for support and sharing achievements."
  },
  {
    id: "social-24",
    title: "FAQ or Tip Graphics",
    category: "Social Media & Marketing",
    subcategory: "Educational",
    tags: ["marketing", "educational", "tips", "helpful"],
    subject: "Frequently asked question or helpful tip",
    mood: "Helpful, informative, friendly",
    composition: "Question and answer clear, easy to read",
    description: "Educational FAQ and tips graphics providing value to audience."
  },
  {
    id: "social-25",
    title: "Influencer Collaboration Content",
    category: "Social Media & Marketing",
    subcategory: "Influencer",
    tags: ["marketing", "influencer", "collaboration", "authentic"],
    subject: "Influencer-style product showcase",
    mood: "Authentic, fashionable, engaging",
    composition: "Influencer aesthetic, trendy styling",
    description: "Influencer-style collaboration content with authentic, trendy visual aesthetic."
  },
  {
    id: "social-26",
    title: "Countdown Graphics",
    category: "Social Media & Marketing",
    subcategory: "Campaign",
    tags: ["marketing", "urgency", "countdown", "promotional"],
    subject: "Product launch or event countdown",
    mood: "Urgent, exciting, engaging",
    composition: "Number/countdown prominent, anticipation built",
    description: "Countdown graphics building anticipation for launches, sales, or events."
  },
  {
    id: "social-27",
    title: "Comparison Chart - Visual",
    category: "Social Media & Marketing",
    subcategory: "Educational",
    tags: ["marketing", "comparison", "educational", "clear"],
    subject: "Product comparison or feature comparison",
    mood: "Clear, informative, persuasive",
    composition: "Side-by-side or matrix comparison, easy to scan",
    description: "Visual comparison charts making product features and benefits easy to understand."
  },
  {
    id: "social-28",
    title: "Call-to-Action Button Graphics",
    category: "Social Media & Marketing",
    subcategory: "Design",
    tags: ["marketing", "cta", "design", "promotional"],
    subject: "Graphics with prominent CTA button",
    mood: "Actionable, clear, persuasive",
    composition: "CTA button stands out, action clear",
    description: "Graphics designed around strong call-to-action driving clicks and conversions."
  },
  {
    id: "social-29",
    title: "Award or Recognition Graphic",
    category: "Social Media & Marketing",
    subcategory: "Social Proof",
    tags: ["marketing", "awards", "recognition", "credibility"],
    subject: "Award, certification, or recognition won",
    mood: "Prestigious, credible, proud",
    composition: "Award logo/badge prominent, professional design",
    description: "Award and recognition graphics building credibility and brand authority."
  },
  {
    id: "social-30",
    title: "Meme or Humorous Content",
    category: "Social Media & Marketing",
    subcategory: "Engagement",
    tags: ["marketing", "humor", "engagement", "relatable"],
    subject: "Humorous or meme-style marketing content",
    mood: "Fun, relatable, shareable",
    composition: "Trending meme format with product tie-in",
    description: "Humorous meme-style content using trending formats for relatable, shareable engagement."
  },
  {
    id: "social-31",
    title: "Holiday Campaign Visual",
    category: "Social Media & Marketing",
    subcategory: "Holiday",
    tags: ["marketing", "holiday", "seasonal", "festive"],
    subject: "Holiday-themed product or campaign",
    mood: "Festive, warm, seasonal",
    composition: "Holiday colors and elements, warm feeling",
    description: "Holiday campaign visuals with festive design and seasonal messaging."
  },
  {
    id: "social-32",
    title: "Community Feature Post",
    category: "Social Media & Marketing",
    subcategory: "Community",
    tags: ["marketing", "community", "user-generated", "featuring"],
    subject: "Featured community member or customer",
    mood: "Grateful, community-focused, engaging",
    composition: "Customer featured prominently, brand support visible",
    description: "Community feature posts highlighting and celebrating customer creations and stories."
  },
  {
    id: "social-33",
    title: "Swipe-Up or Learn More Graphics",
    category: "Social Media & Marketing",
    subcategory: "Interactive",
    tags: ["marketing", "interactive", "cta", "engagement"],
    subject: "Content prompting 'swipe up' or 'learn more'",
    mood: "Curious, engaging, interactive",
    composition: "Clear swipe-up cue or link visible",
    description: "Interactive graphics designed for Stories with swipe-up CTAs driving traffic."
  },
  {
    id: "social-34",
    title: "Split Screen Contrast",
    category: "Social Media & Marketing",
    subcategory: "Engagement",
    tags: ["marketing", "contrast", "engaging", "comparison"],
    subject: "Two contrasting images side-by-side",
    mood: "Engaging, thought-provoking, clear",
    composition: "Equal split, clear visual contrast",
    description: "Split screen content creating contrast and driving engagement through comparison."
  },
  {
    id: "social-35",
    title: "Trending Sounds Visual - TikTok",
    category: "Social Media & Marketing",
    subcategory: "TikTok",
    tags: ["marketing", "tiktok", "trending", "audio"],
    subject: "Visual content optimized for trending audio",
    mood: "Trendy, lip-sync ready, engaging",
    composition: "Vertical optimized, lip-sync friendly",
    description: "TikTok content optimized for trending sounds with engaging visual movements."
  },
  {
    id: "social-36",
    title: "Text-Heavy Educational Post",
    category: "Social Media & Marketing",
    subcategory: "Educational",
    tags: ["marketing", "educational", "text", "helpful"],
    subject: "Educational content with text overlay",
    mood: "Informative, helpful, readable",
    composition: "Large readable text, clear hierarchy",
    description: "Educational posts with text overlay providing actionable tips and knowledge."
  },
  {
    id: "social-37",
    title: "Product Mockup - Lifestyle Integration",
    category: "Social Media & Marketing",
    subcategory: "Product",
    tags: ["marketing", "mockup", "lifestyle", "aspirational"],
    subject: "Product mockup in lifestyle context",
    mood: "Aspirational, integrated, realistic",
    composition: "Product integrated naturally into scene",
    description: "Product mockups integrated into lifestyle scenes showing realistic product usage."
  },
  {
    id: "social-38",
    title: "Motivation Monday / Day Quote",
    category: "Social Media & Marketing",
    subcategory: "Calendar Content",
    tags: ["marketing", "motivational", "calendar", "social"],
    subject: "Day-specific motivational content",
    mood: "Motivating, timely, relevant",
    composition: "Day-specific messaging, branded design",
    description: "Calendar-based motivational content for Motivation Monday and other themed days."
  },
  {
    id: "social-39",
    title: "Eye-Catching Stat or Number",
    category: "Social Media & Marketing",
    subcategory: "Data",
    tags: ["marketing", "statistics", "engaging", "data"],
    subject: "Impressive statistic or number",
    mood: "Impressive, attention-grabbing, engaging",
    composition: "Number very large and prominent",
    description: "Graphics highlighting impressive statistics and numbers for brand building."
  },
  {
    id: "social-40",
    title: "Aesthetic Grid Layout",
    category: "Social Media & Marketing",
    subcategory: "Design",
    tags: ["marketing", "aesthetic", "grid", "cohesive"],
    subject: "Grid of images creating cohesive aesthetic",
    mood: "Aesthetically pleasing, coordinated, professional",
    composition: "Grid layout, color coordinated across tiles",
    description: "Carefully curated grid feeds with cohesive aesthetic and coordinated color palettes."
  },

  // ===== Additional categories simplified for now =====
  // Product Photography
  {
    id: "prod-1",
    title: "Flat Lay Product Arrangement",
    category: "Product Photography",
    tags: ["products", "e-commerce", "realistic", "flat-lay"],
    subject: "Product arranged artfully with complementary items",
    mood: "Clean, bright, minimalist, styled",
    composition: "Flat lay, top-down view, balanced arrangement",
    description: "Professional flat lay arrangement showcasing product in styled scene with complementary items."
  },
  {
    id: "prod-2",
    title: "Lifestyle Product Context",
    category: "Product Photography",
    tags: ["products", "e-commerce", "lifestyle", "contextual"],
    subject: "Product in use scenario with human context",
    mood: "Warm, aspirational, relatable",
    composition: "Mid-shot, hands in frame, natural interaction",
    description: "Product shown in real-world lifestyle context demonstrating practical usage and benefits."
  },

  // Creative Styles
  {
    id: "style-1",
    title: "Studio Ghibli Animation",
    category: "Creative Styles",
    tags: ["artistic", "animation", "creative", "whimsical"],
    subject: "Any scene rendered as Studio Ghibli art",
    mood: "Whimsical, handcrafted, magical",
    composition: "Animated film frame style with watercolor-like textures",
    description: "Transform to Studio Ghibli animated aesthetic with hand-drawn quality and magical feeling."
  },
  {
    id: "style-2",
    title: "Van Gogh Impressionist",
    category: "Creative Styles",
    tags: ["artistic", "painting", "creative", "impressionist"],
    subject: "Scene painted in Van Gogh's style",
    mood: "Dramatic, energetic, emotional",
    composition: "Oil painting texture with bold brushstrokes",
    description: "Impressionist painting in Van Gogh's distinctive style with dramatic color and texture."
  },

  // People & Portraits
  {
    id: "port-1",
    title: "Cinematic Portrait - Golden Hour",
    category: "People & Portraits",
    tags: ["people", "portraits", "realistic", "cinematic"],
    subject: "Portrait in golden hour lighting",
    mood: "Warm, flattering, intimate, cinematic",
    composition: "Face focused, soft background blur, directional lighting",
    description: "Cinematic portrait with golden hour glow and professional depth of field."
  },

  // Food & Hospitality
  {
    id: "food-1",
    title: "Fine Dining Plating",
    category: "Food & Hospitality",
    tags: ["food", "restaurant", "culinary", "plating"],
    subject: "Gourmet plated dish",
    mood: "Elegant, appetizing, refined, professional",
    composition: "Overhead 45-degree angle, shallow depth of field",
    equipment: "Macro lens, natural or warm light",
    description: "Professional plated dish photography showcasing culinary artistry and elegant presentation."
  },

  // Business & Commerce
  {
    id: "biz-1",
    title: "Corporate Team Photo",
    category: "Business & Commerce",
    tags: ["business", "corporate", "team", "professional"],
    subject: "Professional team in office setting",
    mood: "Professional, collaborative, modern",
    composition: "Group arranged naturally, environmental",
    description: "Corporate team photography for company branding and professional communications."
  },

  // Social Media Formats
  {
    id: "fmt-1",
    title: "Instagram Feed Post - Square",
    category: "Social Media Formats",
    tags: ["social-media", "instagram", "square", "vertical"],
    subject: "Any content optimized for Instagram feed",
    mood: "Varies based on content",
    composition: "1:1 Square (1080x1080px), mobile optimized",
    platform: "Instagram Feed",
    description: "Content optimized for Instagram feed with 1:1 square format and mobile viewing."
  },

  // ===== ADDITIONAL EXPANDED PROMPTS (64 prompts from prompts-expanded.ts) =====

  // ===== MORE PRO PHOTOGRAPHY & EDITING (10 additional) =====
  {
    id: "pro-21",
    title: "Aerial Photography - Drone Shot",
    category: "Pro Photography & Editing",
    tags: ["professional", "aerial", "landscape", "realistic"],
    subject: "Aerial view from drone perspective",
    mood: "Expansive, breathtaking, professional",
    composition: "Wide sweeping aerial view, horizon line balanced",
    equipment: "Drone with 4K camera, ND filters, smooth gimbal",
    description: "Professional aerial photography with drone providing unique perspective and cinematic movement."
  },
  {
    id: "pro-22",
    title: "Macro Photography - Extreme Detail",
    category: "Pro Photography & Editing",
    tags: ["professional", "macro", "detail", "technical"],
    subject: "Extreme close-up of tiny subject",
    mood: "Detailed, intricate, scientific",
    composition: "Macro extreme close-up, perfect sharpness, artistic background blur",
    equipment: "200mm+ macro lens, extension tubes, diffused lighting, focus stacking",
    description: "Extreme macro photography revealing intricate details invisible to the naked eye."
  },
  {
    id: "pro-23",
    title: "Night Photography - Long Exposure",
    category: "Pro Photography & Editing",
    tags: ["professional", "night", "technical", "creative"],
    subject: "Scene photographed in low light conditions",
    mood: "Moody, atmospheric, dramatic",
    composition: "Long exposure with motion trails, stable tripod positioning",
    equipment: "Fast lens, tripod, remote shutter, ND filters for daytime long exposure",
    description: "Professional night photography with long exposures capturing light trails and atmosphere."
  },
  {
    id: "pro-24",
    title: "Underwater Photography",
    category: "Pro Photography & Editing",
    tags: ["professional", "underwater", "technical", "adventure"],
    subject: "Subject photographed underwater",
    mood: "Surreal, peaceful, mysterious",
    composition: "Underwater perspective with light rays, subject centered",
    equipment: "Underwater camera housing, wide angle lens, underwater lights",
    description: "Professional underwater photography capturing aquatic environments with color correction."
  },
  {
    id: "pro-25",
    title: "High Speed Photography - Action Frozen",
    category: "Pro Photography & Editing",
    tags: ["professional", "technical", "action", "dynamic"],
    subject: "Fast action captured in single frame",
    mood: "Dynamic, frozen, impactful",
    composition: "Action frozen at decisive moment, sharp throughout",
    equipment: "Fast shutter speed capable camera, fast lens, high speed flash",
    description: "High-speed photography freezing fast-moving subjects with perfection."
  },
  {
    id: "pro-26",
    title: "Panoramic Stitching",
    category: "Pro Photography & Editing",
    tags: ["professional", "editing", "landscape", "technical"],
    subject: "Panoramic composition from multiple frames",
    mood: "Expansive, immersive, detailed",
    composition: "Seamlessly stitched panoramic format, no visible seams",
    equipment: "Tripod, wide angle lens, panorama editing software",
    description: "Professional panoramic stitching creating seamless ultra-wide compositions."
  },
  {
    id: "pro-27",
    title: "Tilt-Shift Photography",
    category: "Pro Photography & Editing",
    tags: ["professional", "creative", "editing", "artistic"],
    subject: "Scene with selective focus tilt-shift effect",
    mood: "Miniature-like, stylized, artistic",
    composition: "Selective focus band, rest in soft blur",
    equipment: "Tilt-shift lens or software correction, shallow depth of field",
    description: "Tilt-shift effect making full-size scenes appear miniature."
  },
  {
    id: "pro-28",
    title: "Black and White Fine Art",
    category: "Pro Photography & Editing",
    tags: ["professional", "artistic", "editing", "fine-art"],
    subject: "Scene converted to professional black and white",
    mood: "Timeless, artistic, dramatic",
    composition: "Strong contrast, tonal range optimization",
    equipment: "Professional B&W conversion software, tone curve adjustments",
    description: "Professional black and white conversion emphasizing form, contrast, and composition."
  },
  {
    id: "pro-29",
    title: "Infrared Photography",
    category: "Pro Photography & Editing",
    tags: ["professional", "technical", "creative", "artistic"],
    subject: "Scene captured in infrared spectrum",
    mood: "Surreal, ethereal, otherworldly",
    composition: "Infrared converted image, glowing foliage, dark skies",
    equipment: "Infrared converted camera or IR filter, appropriate lenses",
    description: "Infrared photography revealing hidden thermal signatures and surreal landscapes."
  },
  {
    id: "pro-30",
    title: "Silhouette Photography",
    category: "Pro Photography & Editing",
    tags: ["professional", "artistic", "lighting", "dramatic"],
    subject: "Subject backlit creating silhouette",
    mood: "Dramatic, mysterious, artistic",
    composition: "Subject perfectly silhouetted against bright background",
    equipment: "Backlighting setup, exposure metering for background",
    description: "Professional silhouette photography with dramatic backlighting."
  },

  // ===== MORE PRODUCT PHOTOGRAPHY (8 prompts) =====
  {
    id: "prod-3",
    title: "Product 360 Rotation",
    category: "Product Photography",
    tags: ["products", "e-commerce", "realistic", "interactive"],
    subject: "Product shown from multiple angles",
    mood: "Professional, complete, comprehensive",
    composition: "Consistent lighting across 360 degree angles",
    description: "Multiple angle product shots for 360-degree view or carousel."
  },
  {
    id: "prod-4",
    title: "Product Close-Up Detail",
    category: "Product Photography",
    tags: ["products", "e-commerce", "detail", "macro"],
    subject: "Extreme close-up of product details",
    mood: "Detailed, textured, quality-focused",
    composition: "Macro close-up showing texture and craftsmanship",
    description: "Detail shots highlighting product quality, materials, and craftsmanship."
  },
  {
    id: "prod-5",
    title: "Product in Box - Packaging",
    category: "Product Photography",
    tags: ["products", "e-commerce", "packaging", "professional"],
    subject: "Product displayed in packaging",
    mood: "Professional, premium, unboxing-ready",
    composition: "Product visible in packaging context",
    description: "Product photography showing packaging presentation and unboxing experience."
  },
  {
    id: "prod-6",
    title: "Scale Reference Product",
    category: "Product Photography",
    tags: ["products", "e-commerce", "realistic", "context"],
    subject: "Product with scale reference item",
    mood: "Realistic, relatable, contextual",
    composition: "Product with hand or common object for scale",
    description: "Product photography with scale reference showing true size context."
  },
  {
    id: "prod-7",
    title: "Product Lifestyle Hero",
    category: "Product Photography",
    tags: ["products", "e-commerce", "lifestyle", "aspirational"],
    subject: "Product as lifestyle hero image",
    mood: "Aspirational, beautiful, premium",
    composition: "Large dominant product with lifestyle context",
    description: "Hero lifestyle image making product the star of the scene."
  },
  {
    id: "prod-8",
    title: "Product Collection Display",
    category: "Product Photography",
    tags: ["products", "e-commerce", "collection", "organized"],
    subject: "Multiple products arranged as collection",
    mood: "Professional, complete, organized",
    composition: "Products arranged artfully showing collection cohesion",
    description: "Collection shot showing product range and coordination."
  },
  {
    id: "prod-9",
    title: "Product Still Life",
    category: "Product Photography",
    tags: ["products", "artistic", "still-life", "creative"],
    subject: "Product in artistic still life arrangement",
    mood: "Artistic, creative, refined",
    composition: "Still life arrangement with complementary props",
    description: "Artistic still life arrangement elevating product presentation."
  },
  {
    id: "prod-10",
    title: "Product Before & After",
    category: "Product Photography",
    tags: ["products", "transformation", "before-after", "results"],
    subject: "Product showing before and after results",
    mood: "Transformative, impressive, credible",
    composition: "Split screen or sequential before/after",
    description: "Before and after product usage demonstrating effectiveness."
  },

  // ===== MORE CREATIVE STYLES (10 prompts) =====
  {
    id: "style-3",
    title: "Oil Painting Realistic",
    category: "Creative Styles",
    tags: ["artistic", "painting", "creative", "realistic"],
    subject: "Scene rendered as realistic oil painting",
    mood: "Classical, textured, artistic",
    composition: "Oil painting texture with visible brushstrokes",
    description: "Professional oil painting rendering with classical technique."
  },
  {
    id: "style-4",
    title: "Watercolor Soft",
    category: "Creative Styles",
    tags: ["artistic", "painting", "creative", "soft"],
    subject: "Scene rendered as soft watercolor",
    mood: "Dreamy, delicate, artistic",
    composition: "Watercolor wash technique, soft edges",
    description: "Delicate watercolor painting with soft color transitions."
  },
  {
    id: "style-5",
    title: "Pencil Sketch Detailed",
    category: "Creative Styles",
    tags: ["artistic", "drawing", "creative", "detailed"],
    subject: "Scene rendered as detailed pencil sketch",
    mood: "Classical, detailed, artistic",
    composition: "Detailed pencil drawing with shading",
    description: "Detailed pencil sketch with fine shading and detail."
  },
  {
    id: "style-6",
    title: "Charcoal Drawing",
    category: "Creative Styles",
    tags: ["artistic", "drawing", "creative", "dramatic"],
    subject: "Scene rendered as charcoal drawing",
    mood: "Dramatic, expressive, artistic",
    composition: "Charcoal drawing with bold strokes",
    description: "Expressive charcoal drawing with dramatic tones."
  },
  {
    id: "style-7",
    title: "Digital Art - Vector Style",
    category: "Creative Styles",
    tags: ["artistic", "digital", "creative", "modern"],
    subject: "Scene rendered as vector digital art",
    mood: "Clean, modern, graphic",
    composition: "Vector art style with clean lines and shapes",
    description: "Modern vector digital art with clean graphic style."
  },
  {
    id: "style-8",
    title: "Pop Art - Warhol Style",
    category: "Creative Styles",
    tags: ["artistic", "pop-art", "creative", "bold"],
    subject: "Scene rendered in Warhol pop art style",
    mood: "Bold, colorful, iconic",
    composition: "High contrast, bright colors, repetition",
    description: "Andy Warhol-inspired pop art with bold colors and contrast."
  },
  {
    id: "style-9",
    title: "Art Nouveau Design",
    category: "Creative Styles",
    tags: ["artistic", "vintage", "creative", "elegant"],
    subject: "Scene rendered in Art Nouveau style",
    mood: "Elegant, ornate, decorative",
    composition: "Art Nouveau ornamental design with flowing lines",
    description: "Elegant Art Nouveau design with decorative elements."
  },
  {
    id: "style-10",
    title: "Steampunk Aesthetic",
    category: "Creative Styles",
    tags: ["artistic", "steampunk", "creative", "mechanical"],
    subject: "Scene rendered with steampunk elements",
    mood: "Industrial, mechanical, retro-futuristic",
    composition: "Steampunk gears, brass, Victorian machinery",
    description: "Steampunk aesthetic with mechanical elements and retro-futuristic styling."
  },
  {
    id: "style-11",
    title: "Fantasy Illustration",
    category: "Creative Styles",
    tags: ["artistic", "fantasy", "creative", "imaginative"],
    subject: "Scene rendered as fantasy illustration",
    mood: "Magical, imaginative, epic",
    composition: "Fantasy world with magical elements",
    description: "Fantasy illustration with magical creatures and landscapes."
  },
  {
    id: "style-12",
    title: "Film Noir Black & White",
    category: "Creative Styles",
    tags: ["artistic", "noir", "creative", "dramatic"],
    subject: "Scene rendered in film noir style",
    mood: "Mysterious, dramatic, cinematic",
    composition: "High contrast black and white film noir lighting",
    description: "Classic film noir style with dramatic shadows and mystery."
  },

  // ===== MORE PEOPLE & PORTRAITS (9 prompts) =====
  {
    id: "port-2",
    title: "Headshot - Corporate Professional",
    category: "People & Portraits",
    tags: ["people", "portraits", "professional", "business"],
    subject: "Corporate professional headshot",
    mood: "Professional, approachable, credible",
    composition: "Head and shoulders, direct gaze, neutral background",
    description: "Corporate headshot for professional profiles and business use."
  },
  {
    id: "port-3",
    title: "Family Portrait - Multigenerational",
    category: "People & Portraits",
    tags: ["people", "family", "portraits", "candid"],
    subject: "Multi-generation family group",
    mood: "Warm, connected, natural",
    composition: "Group arranged with natural connections",
    description: "Family portrait capturing multiple generations together."
  },
  {
    id: "port-4",
    title: "Couple Portrait - Romantic",
    category: "People & Portraits",
    tags: ["people", "portraits", "romantic", "couples"],
    subject: "Romantic couple portrait",
    mood: "Romantic, intimate, elegant",
    composition: "Couple close together, emotional connection visible",
    description: "Romantic couple portrait capturing emotion and connection."
  },
  {
    id: "port-5",
    title: "Child Portrait - Playful",
    category: "People & Portraits",
    tags: ["people", "portraits", "children", "playful"],
    subject: "Child in playful natural moment",
    mood: "Joyful, playful, innocent",
    composition: "Natural moment, authentic expression",
    description: "Playful child portrait capturing genuine childhood moments."
  },
  {
    id: "port-6",
    title: "Senior Portrait - Dignified",
    category: "People & Portraits",
    tags: ["people", "portraits", "senior", "dignified"],
    subject: "Senior person portrait",
    mood: "Dignified, wise, warm",
    composition: "Respectful framing, natural lighting",
    description: "Senior portrait with dignity and warmth."
  },
  {
    id: "port-7",
    title: "Artist Portrait - Creative",
    category: "People & Portraits",
    tags: ["people", "portraits", "creative", "environmental"],
    subject: "Artist in creative environment",
    mood: "Creative, inspired, authentic",
    composition: "Person with elements of their craft visible",
    description: "Artist portrait showing creative work in environmental context."
  },
  {
    id: "port-8",
    title: "Action Sport Portrait",
    category: "People & Portraits",
    tags: ["people", "portraits", "sports", "dynamic"],
    subject: "Athlete in sports action",
    mood: "Dynamic, powerful, energetic",
    composition: "Action captured in moment of athletic performance",
    description: "Athletic portrait capturing dynamic sports movement."
  },
  {
    id: "port-9",
    title: "Beauty Portrait - Glamour",
    category: "People & Portraits",
    tags: ["people", "portraits", "beauty", "glamour"],
    subject: "Beauty or glamour portrait",
    mood: "Glamorous, stunning, confident",
    composition: "Professional makeup and styling, flattering angles",
    description: "Glamour portrait with professional styling and lighting."
  },
  {
    id: "port-10",
    title: "Street Style Portrait",
    category: "People & Portraits",
    tags: ["people", "portraits", "fashion", "street-style"],
    subject: "Person in authentic street setting",
    mood: "Candid, authentic, fashion-forward",
    composition: "Natural setting, genuine moment",
    description: "Street style fashion portrait in authentic urban context."
  },

  // ===== MORE FOOD & HOSPITALITY (9 prompts) =====
  {
    id: "food-2",
    title: "Dessert Photography - Decadent",
    category: "Food & Hospitality",
    tags: ["food", "restaurant", "dessert", "indulgent"],
    subject: "Decadent dessert",
    mood: "Indulgent, luxurious, tempting",
    composition: "Dessert hero shot with detail and texture visible",
    description: "Decadent dessert photography for fine dining promotion."
  },
  {
    id: "food-3",
    title: "Beverage Flat Lay",
    category: "Food & Hospitality",
    tags: ["food", "beverage", "flat-lay", "styled"],
    subject: "Beverage flat lay arrangement",
    mood: "Stylish, appetizing, coordinated",
    composition: "Flat lay with complementary props and ingredients",
    description: "Beverage photography in styled flat lay arrangement."
  },
  {
    id: "food-4",
    title: "Ingredient Showcase",
    category: "Food & Hospitality",
    tags: ["food", "ingredients", "artisanal", "fresh"],
    subject: "Fresh ingredients displayed artfully",
    mood: "Fresh, artisanal, natural",
    composition: "Ingredients arranged to show quality and freshness",
    description: "Ingredient photography showcasing quality and sourcing."
  },
  {
    id: "food-5",
    title: "Table Setting - Fine Dining",
    category: "Food & Hospitality",
    tags: ["restaurant", "table-setting", "fine-dining", "elegant"],
    subject: "Complete table setting",
    mood: "Elegant, refined, sophisticated",
    composition: "Full table with place settings, glassware, centerpiece",
    description: "Fine dining table setting photography."
  },
  {
    id: "food-6",
    title: "Kitchen Action Shot",
    category: "Food & Hospitality",
    tags: ["restaurant", "kitchen", "action", "behind-the-scenes"],
    subject: "Chef working in kitchen",
    mood: "Dynamic, professional, authentic",
    composition: "Action captured in professional kitchen",
    description: "Behind-the-scenes kitchen action photography."
  },
  {
    id: "food-7",
    title: "Food Close-Up Texture",
    category: "Food & Hospitality",
    tags: ["food", "macro", "texture", "detail"],
    subject: "Food macro showing texture",
    mood: "Detailed, appetizing, textured",
    composition: "Extreme close-up showing food texture",
    description: "Macro food photography highlighting texture and detail."
  },
  {
    id: "food-8",
    title: "Restaurant Interior - Ambiance",
    category: "Food & Hospitality",
    tags: ["restaurant", "interior", "ambiance", "design"],
    subject: "Restaurant interior design",
    mood: "Aesthetic, welcoming, atmospheric",
    composition: "Interior shot showcasing design and atmosphere",
    description: "Restaurant interior photography for marketing."
  },
  {
    id: "food-9",
    title: "Plating Artistic Arrangement",
    category: "Food & Hospitality",
    tags: ["food", "plating", "artistic", "culinary"],
    subject: "Artistic food plating",
    mood: "Artistic, creative, refined",
    composition: "Artistic arrangement of food on plate",
    description: "Artistic food plating as culinary art."
  },
  {
    id: "food-10",
    title: "Outdoor Dining Scene",
    category: "Food & Hospitality",
    tags: ["restaurant", "outdoor", "dining", "ambiance"],
    subject: "Outdoor dining setting",
    mood: "Relaxed, inviting, scenic",
    composition: "Outdoor dining with natural setting",
    description: "Outdoor dining venue photography."
  },

  // ===== MORE BUSINESS & COMMERCE (9 prompts) =====
  {
    id: "biz-2",
    title: "Office Space - Modern",
    category: "Business & Commerce",
    tags: ["business", "office", "workspace", "modern"],
    subject: "Modern office space",
    mood: "Professional, creative, collaborative",
    composition: "Office environment showing design and functionality",
    description: "Modern office workspace photography."
  },
  {
    id: "biz-3",
    title: "Meeting Room - Collaborative",
    category: "Business & Commerce",
    tags: ["business", "meeting", "collaborative", "professional"],
    subject: "Team meeting in progress",
    mood: "Collaborative, focused, productive",
    composition: "Meeting room with team engaged",
    description: "Collaborative meeting room photography."
  },
  {
    id: "biz-4",
    title: "Startup Culture - Casual",
    category: "Business & Commerce",
    tags: ["business", "startup", "culture", "casual"],
    subject: "Startup office culture",
    mood: "Creative, casual, energetic",
    composition: "Startup environment showing culture",
    description: "Startup culture and environment photography."
  },
  {
    id: "biz-5",
    title: "Conference or Event",
    category: "Business & Commerce",
    tags: ["business", "conference", "event", "professional"],
    subject: "Business conference or event",
    mood: "Professional, engaging, productive",
    composition: "Conference setting with attendees",
    description: "Business conference and event photography."
  },
  {
    id: "biz-6",
    title: "Handshake - Business Deal",
    category: "Business & Commerce",
    tags: ["business", "deal", "partnership", "professional"],
    subject: "Business handshake",
    mood: "Professional, trusting, successful",
    composition: "Close-up of handshake with context",
    description: "Business partnership and deal photography."
  },
  {
    id: "biz-7",
    title: "Data Dashboard - Analytics",
    category: "Business & Commerce",
    tags: ["business", "data", "analytics", "technology"],
    subject: "Data analytics dashboard",
    mood: "Technical, analytical, insights-driven",
    composition: "Dashboard display with visible metrics",
    description: "Data analytics and business intelligence photography."
  },
  {
    id: "biz-8",
    title: "Innovation Lab",
    category: "Business & Commerce",
    tags: ["business", "innovation", "technology", "creative"],
    subject: "Innovation or R&D space",
    mood: "Innovative, creative, technical",
    composition: "Lab or innovation space showing tools and projects",
    description: "Innovation lab and research space photography."
  },
  {
    id: "biz-9",
    title: "Supply Chain - Logistics",
    category: "Business & Commerce",
    tags: ["business", "logistics", "supply-chain", "operations"],
    subject: "Warehouse or logistics operation",
    mood: "Operational, organized, efficient",
    composition: "Warehouse or logistics space",
    description: "Supply chain and logistics photography."
  },
  {
    id: "biz-10",
    title: "Customer Service - Support",
    category: "Business & Commerce",
    tags: ["business", "customer-service", "support", "professional"],
    subject: "Customer service environment",
    mood: "Helpful, professional, engaging",
    composition: "Customer service team at work",
    description: "Customer service and support team photography."
  },

  // ===== MORE SOCIAL MEDIA FORMATS (9 prompts) =====
  {
    id: "fmt-2",
    title: "Instagram Reel - Vertical Video",
    category: "Social Media Formats",
    tags: ["social-media", "instagram", "vertical", "video"],
    subject: "Vertical video content for reels",
    mood: "Dynamic, engaging, viral-ready",
    composition: "9:16 vertical, motion optimized",
    platform: "Instagram Reels (1080x1920px)",
    description: "Instagram Reels format for vertical short-form video content."
  },
  {
    id: "fmt-3",
    title: "TikTok Format - Vertical Video",
    category: "Social Media Formats",
    tags: ["social-media", "tiktok", "vertical", "video"],
    subject: "TikTok vertical video",
    mood: "Trendy, engaging, shareable",
    composition: "9:16 vertical, trending sounds optimized",
    platform: "TikTok (1080x1920px)",
    description: "TikTok vertical video format optimized for trending audio."
  },
  {
    id: "fmt-4",
    title: "YouTube Thumbnail - Clickable",
    category: "Social Media Formats",
    tags: ["social-media", "youtube", "thumbnail", "engaging"],
    subject: "YouTube video thumbnail",
    mood: "Attention-grabbing, clickable, engaging",
    composition: "1280x720px with bold text overlay",
    platform: "YouTube Thumbnail (1280x720px)",
    description: "YouTube thumbnail optimized for click-through rates."
  },
  {
    id: "fmt-5",
    title: "Pinterest Pin - Tall Portrait",
    category: "Social Media Formats",
    tags: ["social-media", "pinterest", "vertical", "tall"],
    subject: "Tall Pinterest pin format",
    mood: "Inspirational, clickable, valuable",
    composition: "2:3 vertical tall format (1000x1500px)",
    platform: "Pinterest Pin (1000x1500px)",
    description: "Pinterest pin format for maximum visibility in feeds."
  },
  {
    id: "fmt-6",
    title: "Facebook Post - Square",
    category: "Social Media Formats",
    tags: ["social-media", "facebook", "square", "engaging"],
    subject: "Facebook feed post",
    mood: "Engaging, shareable, clear",
    composition: "1:1 square format (1200x1200px)",
    platform: "Facebook (1200x1200px)",
    description: "Facebook feed post optimized for the algorithm."
  },
  {
    id: "fmt-7",
    title: "LinkedIn Post - Professional",
    category: "Social Media Formats",
    tags: ["social-media", "linkedin", "professional", "article"],
    subject: "LinkedIn article post",
    mood: "Professional, thought-leadership, valuable",
    composition: "1.91:1 landscape (1200x628px)",
    platform: "LinkedIn (1200x628px)",
    description: "LinkedIn professional post format."
  },
  {
    id: "fmt-8",
    title: "Snapchat Story - Square",
    category: "Social Media Formats",
    tags: ["social-media", "snapchat", "story", "vertical"],
    subject: "Snapchat story format",
    mood: "Casual, quick, authentic",
    composition: "9:16 vertical (1080x1920px)",
    platform: "Snapchat (1080x1920px)",
    description: "Snapchat story format for ephemeral sharing."
  },
  {
    id: "fmt-9",
    title: "Twitter/X Header Banner",
    category: "Social Media Formats",
    tags: ["social-media", "twitter", "banner", "branding"],
    subject: "Twitter profile header banner",
    mood: "On-brand, professional, eye-catching",
    composition: "16:9 landscape (1500x500px)",
    platform: "Twitter/X Header (1500x500px)",
    description: "Twitter/X profile header banner design."
  },
  {
    id: "fmt-10",
    title: "WhatsApp Status - Square",
    category: "Social Media Formats",
    tags: ["social-media", "whatsapp", "status", "square"],
    subject: "WhatsApp status update",
    mood: "Casual, quick, personal",
    composition: "9:16 vertical (1080x1920px)",
    platform: "WhatsApp (1080x1920px)",
    description: "WhatsApp status update format."
  },

  // ===== ADDITIONAL FINAL PROMPTS (53 more to reach 210+) =====

  // Landscape & Nature (12 prompts)
  {
    id: "land-1",
    title: "Mountain Landscape - Epic",
    category: "Creative Styles",
    tags: ["landscape", "nature", "scenic", "dramatic"],
    subject: "Epic mountain landscape",
    mood: "Majestic, powerful, awe-inspiring",
    composition: "Wide landscape with dramatic peaks",
    description: "Epic mountain landscape photography with dramatic lighting."
  },
  {
    id: "land-2",
    title: "Forest Scene - Moody",
    category: "Creative Styles",
    tags: ["landscape", "nature", "forest", "moody"],
    subject: "Dense forest setting",
    mood: "Moody, atmospheric, mysterious",
    composition: "Deep forest with light filtering through trees",
    description: "Moody forest photography with atmospheric lighting."
  },
  {
    id: "land-3",
    title: "Ocean Seascape - Golden Hour",
    category: "People & Portraits",
    tags: ["landscape", "seascape", "nature", "golden-hour"],
    subject: "Coastal ocean scene",
    mood: "Romantic, serene, golden",
    composition: "Ocean horizon with golden light",
    description: "Golden hour seascape photography."
  },
  {
    id: "land-4",
    title: "Desert Dunes - Surreal",
    category: "Creative Styles",
    tags: ["landscape", "desert", "surreal", "texture"],
    subject: "Desert sand dunes",
    mood: "Surreal, textured, minimalist",
    composition: "Sand dunes with dramatic shadows",
    description: "Surreal desert landscape with unique textures."
  },
  {
    id: "land-5",
    title: "Waterfall - Long Exposure",
    category: "Pro Photography & Editing",
    tags: ["landscape", "nature", "water", "technical"],
    subject: "Flowing waterfall",
    mood: "Smooth, flowing, peaceful",
    composition: "Long exposure of cascading water",
    description: "Long exposure waterfall photography."
  },
  {
    id: "land-6",
    title: "Field of Flowers",
    category: "Creative Styles",
    tags: ["landscape", "nature", "flowers", "colorful"],
    subject: "Blooming wildflower field",
    mood: "Colorful, vibrant, natural",
    composition: "Wide field of flowers with shallow depth",
    description: "Wildflower field photography with vibrant colors."
  },
  {
    id: "land-7",
    title: "Sunset Landscape",
    category: "People & Portraits",
    tags: ["landscape", "sunset", "nature", "romantic"],
    subject: "Sunset landscape scene",
    mood: "Romantic, warm, peaceful",
    composition: "Sunset with landscape elements",
    description: "Romantic sunset landscape photography."
  },
  {
    id: "land-8",
    title: "Starry Night Sky",
    category: "Pro Photography & Editing",
    tags: ["landscape", "night", "stars", "technical"],
    subject: "Night sky with stars",
    mood: "Cosmic, peaceful, mysterious",
    composition: "Star-filled night sky with landscape",
    description: "Starry night sky astrophotography."
  },
  {
    id: "land-9",
    title: "Rock Formations - Texture",
    category: "Creative Styles",
    tags: ["landscape", "rocks", "texture", "detailed"],
    subject: "Dramatic rock formations",
    mood: "Textured, dramatic, geological",
    composition: "Detailed rock textures and formations",
    description: "Rock formation detail photography."
  },
  {
    id: "land-10",
    title: "Canyon Epic",
    category: "Creative Styles",
    tags: ["landscape", "canyon", "scenic", "epic"],
    subject: "Deep canyon landscape",
    mood: "Epic, grand, majestic",
    composition: "Wide canyon vista with depth",
    description: "Epic canyon landscape photography."
  },
  {
    id: "land-11",
    title: "Lake Reflection",
    category: "Creative Styles",
    tags: ["landscape", "water", "reflection", "peaceful"],
    subject: "Mountain lake with reflection",
    mood: "Peaceful, reflective, serene",
    composition: "Lake with mirror reflection",
    description: "Lake reflection landscape photography."
  },
  {
    id: "land-12",
    title: "Weather Drama - Storms",
    category: "Pro Photography & Editing",
    tags: ["landscape", "weather", "dramatic", "technical"],
    subject: "Dramatic storm clouds",
    mood: "Dramatic, powerful, intense",
    composition: "Storm clouds over landscape",
    description: "Dramatic weather and storm photography."
  },

  // Architecture & Interiors (11 prompts)
  {
    id: "arch-1",
    title: "Modern Building Facade",
    category: "Pro Photography & Editing",
    tags: ["architecture", "modern", "building", "geometric"],
    subject: "Contemporary building exterior",
    mood: "Modern, clean, geometric",
    composition: "Building facade with architectural lines",
    description: "Modern architecture exterior photography."
  },
  {
    id: "arch-2",
    title: "Historic Building Detail",
    category: "Pro Photography & Editing",
    tags: ["architecture", "historic", "detail", "ornate"],
    subject: "Historic building details",
    mood: "Ornate, detailed, historic",
    composition: "Architectural detail shots",
    description: "Historic building detail photography."
  },
  {
    id: "arch-3",
    title: "Interior Design - Luxury",
    category: "Pro Photography & Editing",
    tags: ["architecture", "interior", "luxury", "design"],
    subject: "Luxury interior space",
    mood: "Elegant, luxurious, refined",
    composition: "Complete interior design space",
    description: "Luxury interior design photography."
  },
  {
    id: "arch-4",
    title: "Minimalist Interior",
    category: "Pro Photography & Editing",
    tags: ["architecture", "interior", "minimalist", "clean"],
    subject: "Minimalist interior design",
    mood: "Clean, minimal, peaceful",
    composition: "Minimalist space with clean lines",
    description: "Minimalist interior design photography."
  },
  {
    id: "arch-5",
    title: "Staircase Architecture",
    category: "Pro Photography & Editing",
    tags: ["architecture", "stairs", "geometric", "design"],
    subject: "Architectural staircase",
    mood: "Geometric, dramatic, architectural",
    composition: "Staircase with geometric forms",
    description: "Staircase architectural photography."
  },
  {
    id: "arch-6",
    title: "Window & Light",
    category: "Pro Photography & Editing",
    tags: ["architecture", "light", "window", "artistic"],
    subject: "Window with light play",
    mood: "Artistic, bright, dramatic",
    composition: "Window with interesting light",
    description: "Window and light architectural photography."
  },
  {
    id: "arch-7",
    title: "Corridor Perspective",
    category: "Pro Photography & Editing",
    tags: ["architecture", "perspective", "lines", "minimal"],
    subject: "Long corridor or hallway",
    mood: "Perspective-driven, minimal, geometric",
    composition: "Vanishing point perspective",
    description: "Corridor perspective architectural photography."
  },
  {
    id: "arch-8",
    title: "Ceiling Detail",
    category: "Pro Photography & Editing",
    tags: ["architecture", "ceiling", "detail", "ornate"],
    subject: "Ornate ceiling design",
    mood: "Ornate, detailed, elegant",
    composition: "Looking up at ceiling details",
    description: "Ceiling detail architectural photography."
  },
  {
    id: "arch-9",
    title: "Building Symmetry",
    category: "Pro Photography & Editing",
    tags: ["architecture", "symmetry", "geometric", "balanced"],
    subject: "Symmetrical building design",
    mood: "Balanced, geometric, harmonious",
    composition: "Perfect symmetrical composition",
    description: "Symmetrical building photography."
  },
  {
    id: "arch-10",
    title: "Urban Street Scene",
    category: "Pro Photography & Editing",
    tags: ["architecture", "urban", "street", "city"],
    subject: "Urban street architecture",
    mood: "Urban, energetic, dynamic",
    composition: "Street view with buildings",
    description: "Urban street architecture photography."
  },
  {
    id: "arch-11",
    title: "Rooftop View",
    category: "Pro Photography & Editing",
    tags: ["architecture", "rooftop", "cityscape", "aerial"],
    subject: "Cityscape from rooftop",
    mood: "Expansive, urban, scenic",
    composition: "Rooftop overlooking city",
    description: "Rooftop cityscape photography."
  },

  // Abstract & Experimental (10 prompts)
  {
    id: "abst-1",
    title: "Color Explosion Abstract",
    category: "Creative Styles",
    tags: ["abstract", "colorful", "experimental", "artistic"],
    subject: "Abstract color burst",
    mood: "Vibrant, explosive, energetic",
    composition: "Abstract color composition",
    description: "Abstract color explosion artwork."
  },
  {
    id: "abst-2",
    title: "Geometric Patterns",
    category: "Creative Styles",
    tags: ["abstract", "geometric", "patterns", "design"],
    subject: "Abstract geometric shapes",
    mood: "Geometric, mathematical, precise",
    composition: "Geometric pattern composition",
    description: "Abstract geometric pattern design."
  },
  {
    id: "abst-3",
    title: "Liquid Art Effect",
    category: "Creative Styles",
    tags: ["abstract", "liquid", "experimental", "fluid"],
    subject: "Liquid flowing art",
    mood: "Fluid, flowing, dynamic",
    composition: "Liquid art composition",
    description: "Liquid art abstract photography."
  },
  {
    id: "abst-4",
    title: "Glitch Art Style",
    category: "Creative Styles",
    tags: ["abstract", "glitch", "digital", "experimental"],
    subject: "Digital glitch effect",
    mood: "Digital, chaotic, modern",
    composition: "Glitch pattern composition",
    description: "Glitch art digital effect."
  },
  {
    id: "abst-5",
    title: "Fractal Art",
    category: "Creative Styles",
    tags: ["abstract", "fractal", "mathematical", "complex"],
    subject: "Fractal pattern",
    mood: "Complex, mathematical, infinite",
    composition: "Fractal pattern composition",
    description: "Fractal art mathematical design."
  },
  {
    id: "abst-6",
    title: "Light Painting",
    category: "Pro Photography & Editing",
    tags: ["abstract", "light", "experimental", "technical"],
    subject: "Light painting effects",
    mood: "Luminous, flowing, artistic",
    composition: "Light trails composition",
    description: "Light painting abstract photography."
  },
  {
    id: "abst-7",
    title: "Smoke & Fog Abstract",
    category: "Creative Styles",
    tags: ["abstract", "smoke", "atmospheric", "ethereal"],
    subject: "Smoke and fog patterns",
    mood: "Ethereal, atmospheric, mysterious",
    composition: "Smoke pattern composition",
    description: "Smoke and fog abstract artwork."
  },
  {
    id: "abst-8",
    title: "Blur Motion Effect",
    category: "Pro Photography & Editing",
    tags: ["abstract", "motion", "blur", "dynamic"],
    subject: "Motion blur abstract",
    mood: "Dynamic, flowing, energetic",
    composition: "Motion blur composition",
    description: "Motion blur abstract photography."
  },
  {
    id: "abst-9",
    title: "Particle Effect",
    category: "Creative Styles",
    tags: ["abstract", "particles", "digital", "effect"],
    subject: "Particle dispersion",
    mood: "Ethereal, dispersed, digital",
    composition: "Particle cloud composition",
    description: "Particle effect digital art."
  },
  {
    id: "abst-10",
    title: "Mirror Reflection Abstract",
    category: "Creative Styles",
    tags: ["abstract", "reflection", "mirror", "surreal"],
    subject: "Mirror or reflection abstract",
    mood: "Surreal, reflective, dreamlike",
    composition: "Reflection composition",
    description: "Mirror reflection abstract art."
  },

  // Macro & Close-Up (10 prompts)
  {
    id: "macro-1",
    title: "Insect Close-Up",
    category: "Pro Photography & Editing",
    tags: ["macro", "insect", "detail", "nature"],
    subject: "Detailed insect macro",
    mood: "Detailed, intricate, scientific",
    composition: "Extreme macro of insect",
    description: "Insect macro detail photography."
  },
  {
    id: "macro-2",
    title: "Water Droplets",
    category: "Pro Photography & Editing",
    tags: ["macro", "water", "droplets", "detail"],
    subject: "Water droplets and reflections",
    mood: "Delicate, reflective, detailed",
    composition: "Water droplet macro",
    description: "Water droplet macro photography."
  },
  {
    id: "macro-3",
    title: "Flower Petals Detail",
    category: "Creative Styles",
    tags: ["macro", "flower", "detail", "nature"],
    subject: "Flower petal texture",
    mood: "Delicate, detailed, natural",
    composition: "Flower petal macro",
    description: "Flower petal detail photography."
  },
  {
    id: "macro-4",
    title: "Crystal Texture",
    category: "Creative Styles",
    tags: ["macro", "crystal", "texture", "detail"],
    subject: "Crystal or ice texture",
    mood: "Sharp, geometric, detailed",
    composition: "Crystal texture macro",
    description: "Crystal texture macro photography."
  },
  {
    id: "macro-5",
    title: "Fabric Close-Up",
    category: "Pro Photography & Editing",
    tags: ["macro", "fabric", "texture", "detail"],
    subject: "Fabric weave texture",
    mood: "Textured, detailed, intricate",
    composition: "Fabric weave macro",
    description: "Fabric texture macro photography."
  },
  {
    id: "macro-6",
    title: "Rust & Decay",
    category: "Creative Styles",
    tags: ["macro", "texture", "decay", "artistic"],
    subject: "Rust or decay texture",
    mood: "Textured, artistic, weathered",
    composition: "Rust pattern macro",
    description: "Rust and decay texture photography."
  },
  {
    id: "macro-7",
    title: "Food Texture",
    category: "Food & Hospitality",
    tags: ["macro", "food", "texture", "detail"],
    subject: "Food surface texture",
    mood: "Appetizing, textured, detailed",
    composition: "Food texture macro",
    description: "Food texture macro photography."
  },
  {
    id: "macro-8",
    title: "Hair & Fiber Detail",
    category: "Pro Photography & Editing",
    tags: ["macro", "texture", "detail", "abstract"],
    subject: "Hair or fiber threads",
    mood: "Intricate, detailed, abstract",
    composition: "Hair fiber macro",
    description: "Hair and fiber macro photography."
  },
  {
    id: "macro-9",
    title: "Ink Dispersal",
    category: "Creative Styles",
    tags: ["macro", "ink", "abstract", "artistic"],
    subject: "Ink dispersing in water",
    mood: "Artistic, fluid, abstract",
    composition: "Ink dispersion macro",
    description: "Ink dispersal macro photography."
  },
  {
    id: "macro-10",
    title: "Organism Microscopic",
    category: "Pro Photography & Editing",
    tags: ["macro", "microscopic", "scientific", "detail"],
    subject: "Microscopic organism",
    mood: "Scientific, detailed, fascinating",
    composition: "Microscopic view",
    description: "Microscopic organism photography."
  },

  // Final 10 prompts to reach 210+
  {
    id: "final-1",
    title: "Vintage Film Photography",
    category: "Pro Photography & Editing",
    tags: ["film", "vintage", "nostalgic", "artistic"],
    subject: "Vintage film aesthetic",
    mood: "Nostalgic, warm, vintage",
    composition: "Film photography look",
    description: "Vintage film aesthetic photography."
  },
  {
    id: "final-2",
    title: "Silhouette Sunset",
    category: "People & Portraits",
    tags: ["silhouette", "sunset", "portrait", "romantic"],
    subject: "Person silhouetted against sunset",
    mood: "Romantic, peaceful, dramatic",
    composition: "Silhouette profile at sunset",
    description: "Silhouette portrait at sunset."
  },
  {
    id: "final-3",
    title: "Drone Aerial View",
    category: "Pro Photography & Editing",
    tags: ["aerial", "drone", "landscape", "technical"],
    subject: "Aerial landscape view",
    mood: "Expansive, breathtaking, cinematic",
    composition: "Drone bird's eye view",
    description: "Aerial drone landscape photography."
  },
  {
    id: "final-4",
    title: "Neon Lights Urban",
    category: "Social Media & Marketing",
    tags: ["neon", "urban", "night", "modern"],
    subject: "Neon signs in city",
    mood: "Modern, vibrant, urban",
    composition: "Neon light urban scene",
    description: "Urban neon lights photography."
  },
  {
    id: "final-5",
    title: "Bokeh Background",
    category: "Pro Photography & Editing",
    tags: ["bokeh", "depth", "blur", "artistic"],
    subject: "Subject with bokeh background",
    mood: "Artistic, dreamy, professional",
    composition: "Shallow depth of field bokeh",
    description: "Bokeh background photography."
  },
  {
    id: "final-6",
    title: "Minimalist Black & White",
    category: "Pro Photography & Editing",
    tags: ["minimalist", "bw", "simple", "artistic"],
    subject: "Minimalist black and white",
    mood: "Minimalist, stark, elegant",
    composition: "Minimalist B&W composition",
    description: "Minimalist black and white photography."
  },
  {
    id: "final-7",
    title: "Food & Beverage Pairing",
    category: "Food & Hospitality",
    tags: ["food", "beverage", "styling", "professional"],
    subject: "Food and drink together",
    mood: "Appetizing, sophisticated, styled",
    composition: "Food with beverage styled",
    description: "Food and beverage pairing photography."
  },
  {
    id: "final-8",
    title: "Pet Portrait",
    category: "People & Portraits",
    tags: ["animals", "pets", "portrait", "cute"],
    subject: "Pet animal portrait",
    mood: "Cute, playful, endearing",
    composition: "Pet portrait close-up",
    description: "Pet animal portrait photography."
  },
  {
    id: "final-9",
    title: "Reflection Photography",
    category: "Pro Photography & Editing",
    tags: ["reflection", "mirror", "artistic", "creative"],
    subject: "Reflection in mirror or water",
    mood: "Artistic, thoughtful, creative",
    composition: "Creative reflection composition",
    description: "Reflection photography technique."
  },
  {
    id: "final-10",
    title: "Action & Sports Motion",
    category: "Pro Photography & Editing",
    tags: ["sports", "action", "motion", "dynamic"],
    subject: "Dynamic action shot",
    mood: "Dynamic, powerful, energetic",
    composition: "Frozen action moment",
    description: "Action and sports motion photography."
  },

  // ===== FAMOUS ARTISTS & STYLES (30+ prompts) =====

  // Banksy Style
  {
    id: "banksy-1",
    title: "Banksy Street Art",
    category: "Creative Styles",
    tags: ["banksy", "street-art", "graffiti", "political"],
    subject: "Scene rendered in Banksy style",
    mood: "Rebellious, thought-provoking, artistic",
    composition: "Stencil-based street art with message",
    description: "Banksy-inspired street art with social commentary."
  },
  {
    id: "banksy-2",
    title: "Banksy Rat Character",
    category: "Creative Styles",
    tags: ["banksy", "rat", "character", "iconic"],
    subject: "Banksy's iconic rat character",
    mood: "Playful yet serious, iconic, recognizable",
    composition: "Stenciled rat with attitude",
    description: "Banksy's famous rat character in street art style."
  },
  {
    id: "banksy-3",
    title: "Banksy Girl Silhouette",
    category: "Creative Styles",
    tags: ["banksy", "girl", "silhouette", "iconic"],
    subject: "Girl with balloon Banksy style",
    mood: "Hopeful, poignant, iconic",
    composition: "Girl figure with balloon drifting",
    description: "Banksy's girl with balloon iconic image."
  },

  // Tim Burton Style
  {
    id: "burton-1",
    title: "Tim Burton Gothic Style",
    category: "Creative Styles",
    tags: ["tim-burton", "gothic", "dark", "whimsical"],
    subject: "Scene in Tim Burton's gothic style",
    mood: "Gothic, whimsical, darkly beautiful",
    composition: "Tim Burton's characteristic skeletal forms",
    description: "Tim Burton gothic illustration style with dark whimsy."
  },
  {
    id: "burton-2",
    title: "Tim Burton Character Design",
    category: "Creative Styles",
    tags: ["tim-burton", "character", "design", "eccentric"],
    subject: "Character in Tim Burton style",
    mood: "Eccentric, artistic, imaginative",
    composition: "Burton-style character with exaggerated features",
    description: "Tim Burton character design and illustration."
  },
  {
    id: "burton-3",
    title: "Tim Burton Stop Motion",
    category: "Creative Styles",
    tags: ["tim-burton", "stop-motion", "claymation", "3d"],
    subject: "Stop motion animation style",
    mood: "Handcrafted, whimsical, tactile",
    composition: "Stop motion puppet aesthetic",
    description: "Tim Burton stop motion animation style."
  },

  // Other Famous Artists
  {
    id: "artist-1",
    title: "Salvador Dali Surrealism",
    category: "Creative Styles",
    tags: ["dali", "surrealism", "dreamlike", "melting"],
    subject: "Scene in Dali surrealist style",
    mood: "Surreal, dreamlike, mind-bending",
    composition: "Melting clocks, impossible landscapes",
    description: "Salvador Dali surrealist art style."
  },
  {
    id: "artist-2",
    title: "Pablo Picasso Cubism",
    category: "Creative Styles",
    tags: ["picasso", "cubism", "geometric", "abstract"],
    subject: "Cubist composition",
    mood: "Abstract, geometric, analytical",
    composition: "Fragmented geometric forms",
    description: "Pablo Picasso cubist art style."
  },
  {
    id: "artist-3",
    title: "Vincent Van Gogh Starry Night",
    category: "Creative Styles",
    tags: ["van-gogh", "starry-night", "impressionist", "post-impressionist"],
    subject: "Scene in Van Gogh Starry Night style",
    mood: "Dreamlike, swirling, emotional",
    composition: "Swirling sky with stars",
    description: "Vincent Van Gogh Starry Night style."
  },
  {
    id: "artist-4",
    title: "Claude Monet Impressionist",
    category: "Creative Styles",
    tags: ["monet", "impressionist", "light", "water"],
    subject: "Water lily pond scene",
    mood: "Peaceful, light-focused, atmospheric",
    composition: "Monet water lilies composition",
    description: "Claude Monet impressionist water lilies style."
  },
  {
    id: "artist-5",
    title: "Andy Warhol Pop Art",
    category: "Creative Styles",
    tags: ["warhol", "pop-art", "colorful", "repetition"],
    subject: "Subject in Warhol pop art style",
    mood: "Bold, colorful, mass-produced aesthetic",
    composition: "Repeated bright color blocks",
    description: "Andy Warhol pop art style with repetition."
  },
  {
    id: "artist-6",
    title: "Frida Kahlo Portrait",
    category: "Creative Styles",
    tags: ["frida-kahlo", "portrait", "surreal", "self-portrait"],
    subject: "Portrait in Frida Kahlo style",
    mood: "Intimate, surreal, emotional",
    composition: "Kahlo's characteristic surreal portrait",
    description: "Frida Kahlo portrait and surrealist style."
  },
  {
    id: "artist-7",
    title: "Jean-Michel Basquiat Neo-Expressionism",
    category: "Creative Styles",
    tags: ["basquiat", "neo-expressionism", "street-art", "urban"],
    subject: "Basquiat neo-expressionist composition",
    mood: "Raw, expressive, street-inspired",
    composition: "Mixed media street art aesthetic",
    description: "Jean-Michel Basquiat neo-expressionism style."
  },
  {
    id: "artist-8",
    title: "M.C. Escher Impossible Geometry",
    category: "Creative Styles",
    tags: ["escher", "impossible-geometry", "mathematical", "optical"],
    subject: "Impossible geometric composition",
    mood: "Mathematical, mind-bending, intricate",
    composition: "Escher's impossible stairs and shapes",
    description: "M.C. Escher impossible geometry style."
  },
  {
    id: "artist-9",
    title: "Wassily Kandinsky Abstract",
    category: "Creative Styles",
    tags: ["kandinsky", "abstract", "geometric", "spiritual"],
    subject: "Abstract Kandinsky composition",
    mood: "Spiritual, geometric, colorful",
    composition: "Geometric shapes and color relationships",
    description: "Wassily Kandinsky abstract art style."
  },
  {
    id: "artist-10",
    title: "Jeff Koons Pop Sculpture",
    category: "Creative Styles",
    tags: ["koons", "pop-art", "sculpture", "shiny"],
    subject: "Koons-style shiny sculpture",
    mood: "Contemporary, glossy, pop-art",
    composition: "Mirror-polished reflective forms",
    description: "Jeff Koons contemporary pop art sculpture."
  },
  {
    id: "artist-11",
    title: "Shepard Fairey Street Art",
    category: "Creative Styles",
    tags: ["shepard-fairey", "street-art", "stencil", "political"],
    subject: "Shepard Fairey stencil art",
    mood: "Political, bold, graphic",
    composition: "Stenciled high-contrast imagery",
    description: "Shepard Fairey street art and stencil style."
  },
  {
    id: "artist-12",
    title: "Keith Haring Graffiti",
    category: "Creative Styles",
    tags: ["keith-haring", "graffiti", "dancing", "neon"],
    subject: "Keith Haring dancing figures",
    mood: "Energetic, flowing, vibrant",
    composition: "Haring's characteristic dancing forms",
    description: "Keith Haring graffiti and dancing figures."
  },
  {
    id: "artist-13",
    title: "Katsushika Hokusai Woodblock",
    category: "Creative Styles",
    tags: ["hokusai", "woodblock", "japanese", "wave"],
    subject: "Hokusai woodblock print style",
    mood: "Traditional, elegant, Japanese",
    composition: "Hokusai's Great Wave composition",
    description: "Katsushika Hokusai Japanese woodblock style."
  },
  {
    id: "artist-14",
    title: "Käthe Kollwitz Expressionism",
    category: "Creative Styles",
    tags: ["kollwitz", "expressionism", "emotional", "dark"],
    subject: "Expressionist emotional composition",
    mood: "Emotional, somber, powerful",
    composition: "Expressive bold lines and forms",
    description: "Käthe Kollwitz expressionist style."
  },
  {
    id: "artist-15",
    title: "Retrowave Synthwave Aesthetic",
    category: "Creative Styles",
    tags: ["retrowave", "synthwave", "80s", "neon"],
    subject: "80s retrowave cyberpunk aesthetic",
    mood: "Nostalgic, cyberpunk, neon",
    composition: "Neon colors and retro-futurism",
    description: "Retrowave and synthwave 80s aesthetic."
  },
  {
    id: "artist-16",
    title: "Cyberpunk Digital Art",
    category: "Creative Styles",
    tags: ["cyberpunk", "digital", "futuristic", "tech"],
    subject: "Cyberpunk futuristic scene",
    mood: "Futuristic, technological, dystopian",
    composition: "High-tech cyberpunk composition",
    description: "Cyberpunk digital art and futurism."
  },
  {
    id: "artist-17",
    title: "Steampunk Victorian",
    category: "Creative Styles",
    tags: ["steampunk", "victorian", "mechanical", "brass"],
    subject: "Steampunk Victorian machinery",
    mood: "Victorian, mechanical, industrial",
    composition: "Gears, brass, Victorian design",
    description: "Steampunk Victorian aesthetic style."
  },
  {
    id: "artist-18",
    title: "Art Nouveau Mucha",
    category: "Creative Styles",
    tags: ["art-nouveau", "mucha", "ornate", "decorative"],
    subject: "Art Nouveau Mucha style",
    mood: "Ornate, elegant, decorative",
    composition: "Flowing lines and decorative elements",
    description: "Art Nouveau and Alphonse Mucha style."
  },
  {
    id: "artist-19",
    title: "Comic Book Pop Art",
    category: "Creative Styles",
    tags: ["comic-book", "pop-art", "bold", "graphic"],
    subject: "Comic book illustration style",
    mood: "Bold, dynamic, graphic",
    composition: "Comic book panels and speech bubbles",
    description: "Comic book pop art style."
  },
  {
    id: "artist-20",
    title: "Manga Japanese Animation",
    category: "Creative Styles",
    tags: ["manga", "anime", "japanese", "animation"],
    subject: "Manga anime character style",
    mood: "Expressive, Japanese, animated",
    composition: "Manga illustration aesthetic",
    description: "Manga and anime Japanese illustration."
  },
  {
    id: "artist-21",
    title: "Graffiti Wildstyle",
    category: "Creative Styles",
    tags: ["graffiti", "wildstyle", "complex", "urban"],
    subject: "Complex graffiti wildstyle",
    mood: "Complex, urban, energetic",
    composition: "Intricate graffiti letters",
    description: "Graffiti wildstyle complex lettering."
  },
  {
    id: "artist-22",
    title: "Digital Glitch Art",
    category: "Creative Styles",
    tags: ["glitch", "digital", "error", "experimental"],
    subject: "Digital glitch effect art",
    mood: "Experimental, chaotic, modern",
    composition: "Digital corruption and glitch effects",
    description: "Digital glitch art and error aesthetic."
  },
  {
    id: "artist-23",
    title: "Vaporwave Aesthetic",
    category: "Creative Styles",
    tags: ["vaporwave", "aesthetic", "surreal", "nostalgic"],
    subject: "Vaporwave surreal aesthetic",
    mood: "Surreal, nostalgic, dreamlike",
    composition: "Vaporwave visual motifs",
    description: "Vaporwave aesthetic and visual style."
  },
  {
    id: "artist-24",
    title: "Lowbrow Art Cute",
    category: "Creative Styles",
    tags: ["lowbrow", "cute", "colorful", "playful"],
    subject: "Lowbrow cute art style",
    mood: "Cute, playful, colorful",
    composition: "Lowbrow cute character design",
    description: "Lowbrow art cute and playful style."
  },
  {
    id: "artist-25",
    title: "Dark Fantasy Gothic",
    category: "Creative Styles",
    tags: ["dark-fantasy", "gothic", "fantasy", "dark"],
    subject: "Dark fantasy gothic scene",
    mood: "Dark, mysterious, gothic",
    composition: "Dark fantasy composition",
    description: "Dark fantasy gothic art style."
  },

  // ===== DIVERSE PORTRAITS (New additions) =====
  {
    id: "portrait-seniors-1",
    title: "Senior Couple Portrait",
    category: "People & Portraits",
    tags: ["seniors", "couple", "portrait", "warm"],
    subject: "Elderly couple together",
    mood: "Warm, intimate, timeless",
    composition: "Close couple composition with soft focus",
    equipment: "50mm lens, warm window light",
    description: "Warm and intimate portrait of senior couple with focus on connection and emotion."
  },
  {
    id: "portrait-seniors-2",
    title: "Grandparents with Grandchildren",
    category: "People & Portraits",
    tags: ["multi-generational", "family", "seniors", "warmth"],
    subject: "Grandparents reading to grandchildren in cozy living room",
    mood: "Warm, peaceful, nostalgic",
    composition: "Group portrait with warm evening light through windows",
    description: "Multi-generational family moment with seniors and children in cozy home setting."
  },
  {
    id: "portrait-children-1",
    title: "Children Playing Portrait",
    category: "People & Portraits",
    tags: ["children", "playful", "candid", "joy"],
    subject: "Children playing and laughing",
    mood: "Joyful, candid, natural",
    composition: "Action shot capturing genuine childhood moments",
    description: "Candid children's portraits capturing authentic playful moments and genuine emotion."
  },
  {
    id: "portrait-family-1",
    title: "Multi-Cultural Family Portrait",
    category: "People & Portraits",
    tags: ["family", "cultural", "diverse", "inclusive"],
    subject: "Diverse multi-cultural family",
    mood: "Joyful, inclusive, celebratory",
    composition: "Family group portrait with cultural elements",
    description: "Inclusive family portrait celebrating cultural diversity and unity."
  },
  {
    id: "portrait-lifestyle-1",
    title: "Candid Lifestyle Portrait",
    category: "People & Portraits",
    tags: ["lifestyle", "candid", "authentic", "documentary"],
    subject: "Person in natural daily environment",
    mood: "Authentic, real-life, intimate",
    composition: "Environmental portrait showing lifestyle context",
    description: "Authentic documentary-style lifestyle portrait capturing real moments."
  },
  {
    id: "portrait-cultural-1",
    title: "Cultural Traditional Attire",
    category: "People & Portraits",
    tags: ["cultural", "traditional", "diversity", "authentic"],
    subject: "Person in traditional cultural clothing",
    mood: "Dignified, authentic, respectful",
    composition: "Portrait highlighting cultural garments and heritage",
    description: "Respectful portrait showcasing traditional cultural attire and heritage."
  },

  // ===== SPORTS & FITNESS =====
  {
    id: "sports-1",
    title: "Soccer Match Action",
    category: "Sports & Fitness",
    tags: ["sports", "soccer", "action", "dynamic"],
    subject: "Soccer match wide shot at golden hour",
    mood: "Dynamic, energetic, competitive",
    composition: "Players mid-stride, stadium lights glowing, wide perspective",
    equipment: "70-200mm lens, fast shutter speed",
    description: "Dynamic soccer photography capturing action and athleticism at golden hour with stadium atmosphere."
  },
  {
    id: "sports-2",
    title: "Gym Fitness Training",
    category: "Sports & Fitness",
    tags: ["fitness", "gym", "training", "strength"],
    subject: "Person lifting weights in gym",
    mood: "Powerful, focused, intense",
    composition: "Close-up of athletic movement with gym lighting",
    equipment: "35mm lens, dramatic lighting",
    description: "Athletic gym training photography showing strength and determination."
  },
  {
    id: "sports-3",
    title: "Marathon Runner",
    category: "Sports & Fitness",
    tags: ["sports", "running", "marathon", "endurance"],
    subject: "Runner mid-marathon in nature",
    mood: "Determined, energetic, perseverant",
    composition: "Runner in motion with landscape context",
    description: "Motivational marathon and endurance sports photography."
  },
  {
    id: "sports-4",
    title: "Basketball Court Action",
    category: "Sports & Fitness",
    tags: ["sports", "basketball", "action", "intensity"],
    subject: "Basketball player in intense action",
    mood: "Intense, competitive, explosive",
    composition: "Mid-action shot showing athleticism",
    description: "High-energy basketball sports photography with intense competition."
  },
  {
    id: "sports-5",
    title: "Yoga Pose Flexibility",
    category: "Sports & Fitness",
    tags: ["fitness", "yoga", "flexibility", "wellness"],
    subject: "Person in advanced yoga pose",
    mood: "Serene, balanced, graceful",
    composition: "Yoga pose with natural light and calm background",
    description: "Serene yoga and flexibility fitness photography."
  },
  {
    id: "sports-6",
    title: "Mountain Biking Trail",
    category: "Sports & Fitness",
    tags: ["sports", "biking", "adventure", "outdoors"],
    subject: "Mountain biker on trail",
    mood: "Adventurous, powerful, outdoor",
    composition: "Action shot on mountain terrain",
    description: "Adventure sports photography of mountain biking."
  },
  {
    id: "sports-7",
    title: "Swimming Athlete",
    category: "Sports & Fitness",
    tags: ["sports", "swimming", "athletic", "water"],
    subject: "Swimmer in action in water",
    mood: "Fluid, powerful, athletic",
    composition: "Underwater or poolside dynamic shot",
    description: "Dynamic swimming and athletic water sports photography."
  },

  // ===== POLITICS & CIVIC ENGAGEMENT =====
  {
    id: "politics-1",
    title: "Campaign Poster Design",
    category: "Politics & Civic Engagement",
    tags: ["politics", "campaign", "poster", "graphic"],
    subject: "Political campaign poster composition",
    mood: "Bold, inspiring, motivational",
    composition: "High-contrast political imagery with text",
    description: "Bold campaign poster design with political messaging and impact."
  },
  {
    id: "politics-2",
    title: "Election Infographic",
    category: "Politics & Civic Engagement",
    tags: ["politics", "infographic", "data", "election"],
    subject: "Election data visualization",
    mood: "Informative, clear, official",
    composition: "Data-driven infographic layout",
    description: "Professional election infographic visualizing political data."
  },
  {
    id: "politics-3",
    title: "Civic Activism Protest",
    category: "Politics & Civic Engagement",
    tags: ["activism", "protest", "civic", "activism"],
    subject: "Civic activism and protest scene",
    mood: "Passionate, active, engaged",
    composition: "Group demonstration or rally scene",
    description: "Documentary-style civic activism and protest photography."
  },
  {
    id: "politics-4",
    title: "Political Editorial Illustration",
    category: "Politics & Civic Engagement",
    tags: ["politics", "editorial", "illustration", "artistic"],
    subject: "Editorial political illustration",
    mood: "Thoughtful, symbolic, impactful",
    composition: "Artistic political commentary composition",
    description: "Thought-provoking editorial political illustration."
  },
  {
    id: "politics-5",
    title: "Voting Poll Patriotic",
    category: "Politics & Civic Engagement",
    tags: ["voting", "civic", "patriotic", "democracy"],
    subject: "Patriotic voting and democracy theme",
    mood: "Civic, patriotic, empowering",
    composition: "Voting booth or patriotic imagery",
    description: "Empowering civic participation and voting photography."
  },

  // ===== WELLNESS & LIFESTYLE =====
  {
    id: "wellness-1",
    title: "Yoga Mindfulness Practice",
    category: "Wellness & Lifestyle",
    tags: ["wellness", "yoga", "mindfulness", "peace"],
    subject: "Person in meditation or yoga pose",
    mood: "Calm, peaceful, meditative",
    composition: "Serene wellness scene with natural lighting",
    description: "Peaceful wellness and mindfulness photography for yoga and meditation."
  },
  {
    id: "wellness-2",
    title: "Spa Relaxation Wellness",
    category: "Wellness & Lifestyle",
    tags: ["wellness", "spa", "relaxation", "self-care"],
    subject: "Spa or wellness relaxation setting",
    mood: "Luxurious, calm, rejuvenating",
    composition: "Spa environment with wellness elements",
    description: "Luxurious spa and wellness relaxation photography."
  },
  {
    id: "wellness-3",
    title: "Healthy Breakfast Lifestyle",
    category: "Wellness & Lifestyle",
    tags: ["wellness", "health", "food", "lifestyle"],
    subject: "Healthy nutritious breakfast",
    mood: "Fresh, healthy, aspirational",
    composition: "Styled wellness breakfast scene",
    description: "Aspirational healthy lifestyle and wellness food photography."
  },
  {
    id: "wellness-4",
    title: "Morning Meditation Routine",
    category: "Wellness & Lifestyle",
    tags: ["wellness", "meditation", "routine", "morning"],
    subject: "Morning meditation or mindfulness routine",
    mood: "Serene, intentional, grounded",
    composition: "Morning wellness routine scene",
    description: "Serene morning meditation and mindfulness routine photography."
  },
  {
    id: "wellness-5",
    title: "Nature Walk Wellness",
    category: "Wellness & Lifestyle",
    tags: ["wellness", "nature", "outdoors", "health"],
    subject: "Person walking in nature",
    mood: "Peaceful, rejuvenating, natural",
    composition: "Outdoor wellness nature scene",
    description: "Rejuvenating nature and outdoor wellness photography."
  },
  {
    id: "wellness-6",
    title: "Self-Care Beauty Routine",
    category: "Wellness & Lifestyle",
    tags: ["wellness", "self-care", "beauty", "personal"],
    subject: "Self-care and beauty routine",
    mood: "Luxurious, caring, personal",
    composition: "Self-care moment composition",
    description: "Personal self-care and beauty wellness photography."
  },

  // ===== EVENTS & CELEBRATIONS =====
  {
    id: "events-1",
    title: "Wedding Ceremony",
    category: "Events & Celebrations",
    tags: ["wedding", "ceremony", "celebration", "love"],
    subject: "Wedding ceremony moment",
    mood: "Romantic, joyful, emotional",
    composition: "Wedding ceremony with couple focus",
    equipment: "50mm lens, soft focus background",
    description: "Romantic wedding ceremony photography capturing emotional moments."
  },
  {
    id: "events-2",
    title: "Birthday Party Celebration",
    category: "Events & Celebrations",
    tags: ["birthday", "party", "celebration", "joy"],
    subject: "Birthday party celebration scene",
    mood: "Joyful, festive, energetic",
    composition: "Celebration moment with festive elements",
    description: "Joyful birthday party celebration photography."
  },
  {
    id: "events-3",
    title: "Festival Crowd Scene",
    category: "Events & Celebrations",
    tags: ["festival", "crowd", "celebration", "event"],
    subject: "Music or cultural festival scene",
    mood: "Festive, energetic, communal",
    composition: "Festival crowd with vibrant atmosphere",
    description: "Energetic festival and crowd celebration photography."
  },
  {
    id: "events-4",
    title: "Corporate Gala Event",
    category: "Events & Celebrations",
    tags: ["corporate", "gala", "event", "formal"],
    subject: "Formal corporate gala or event",
    mood: "Elegant, professional, sophisticated",
    composition: "Formal event photography",
    description: "Elegant corporate gala and formal event photography."
  },
  {
    id: "events-5",
    title: "Graduation Ceremony",
    category: "Events & Celebrations",
    tags: ["graduation", "education", "celebration", "achievement"],
    subject: "Graduation ceremony moment",
    mood: "Proud, celebratory, momentous",
    composition: "Graduation moment with achievement",
    description: "Celebratory graduation and achievement photography."
  },
  {
    id: "events-6",
    title: "Holiday Family Gathering",
    category: "Events & Celebrations",
    tags: ["holiday", "family", "gathering", "festive"],
    subject: "Family holiday celebration",
    mood: "Warm, festive, familial",
    composition: "Family gathering scene with holiday elements",
    description: "Warm family holiday gathering photography."
  },
  {
    id: "events-7",
    title: "Concert Performance",
    category: "Events & Celebrations",
    tags: ["concert", "performance", "music", "entertainment"],
    subject: "Live concert or performance",
    mood: "Energetic, exciting, live",
    composition: "Live performance with audience",
    description: "Dynamic concert and live performance photography."
  },
];

export const categories = [
  "Pro Photography & Editing",
  "Playful & Collectible Creations",
  "Social Media & Marketing",
  "Product Photography",
  "Creative Styles",
  "People & Portraits",
  "Food & Hospitality",
  "Business & Commerce",
  "Social Media Formats",
  "Sports & Fitness",
  "Politics & Civic Engagement",
  "Wellness & Lifestyle",
  "Events & Celebrations"
];

export const allTags = Array.from(
  new Set(prompts.flatMap(p => p.tags))
).sort();

export const getPromptOfTheDay = (): Prompt => {
  // Use date-based index for daily rotation (resets at midnight UTC)
  const daysSinceEpoch = Math.floor(Date.now() / 86400000);
  const index = daysSinceEpoch % prompts.length;
  return prompts[index];
};
