'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Check, ArrowLeft, Sparkles, Search } from 'lucide-react'

export default function PromptsPage() {
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    setCopiedPrompt(prompt)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  const scrollToCategory = (category: string) => {
    const elementId = category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setSelectedCategory(category)
  }

  const promptLibrary = [
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
    },
    {
      category: "Photorealistic (Pro Quality)",
      icon: "📸",
      prompts: [
        "A photorealistic close-up portrait of a person, smiling warmly, set in a sunlit park. The scene is illuminated by natural golden hour lighting, creating a cheerful and inviting atmosphere. Captured with a Canon EOS R5 with 85mm f/1.4 lens, emphasizing soft skin tones and gentle bokeh. The image should be in a 4:5 portrait format",
        "A photorealistic medium shot of a coffee cup on a wooden table, steam rising gently, set in a cozy café interior. The scene is illuminated by soft window light from the left, creating a warm morning atmosphere. Captured with a Sony A7IV with 35mm f/1.8 lens, emphasizing rich textures and shallow depth of field. The image should be in a 16:9 landscape format",
        "A photorealistic wide shot of a mountain landscape, with mist rolling through valleys, set at dawn. The scene is illuminated by diffused sunrise light, creating a serene and majestic atmosphere. Captured with a Nikon Z9 with 24-70mm f/2.8 lens at 24mm, emphasizing dramatic depth and sharp foreground details. The image should be in a 3:2 landscape format",
        "A photorealistic overhead shot of fresh ingredients on a marble countertop, arranged artistically, set in a modern kitchen. The scene is illuminated by soft overhead LED panels, creating a clean and professional atmosphere. Captured with a Fujifilm X-T5 with 16-55mm f/2.8 lens, emphasizing vibrant colors and fine textures. The image should be in a 1:1 square format",
        "A photorealistic street photography shot of a busy city intersection at night, with light trails from cars, set in an urban downtown area. The scene is illuminated by neon signs and street lights, creating a dynamic and energetic atmosphere. Captured with a Leica Q2 with 28mm f/1.7 lens, emphasizing motion blur and crisp architectural details. The image should be in a 16:9 landscape format"
      ]
    },
    {
      category: "Character Consistency",
      icon: "🎭",
      prompts: [
        "A consistent character: a young woman with curly red hair, green eyes, wearing a blue denim jacket. First scene: standing in a coffee shop holding a latte. Maintain exact same facial features, hair style, and clothing across all variations",
        "A consistent character: a golden retriever with a red collar and distinctive white patch on chest. First scene: sitting in a park with autumn leaves. Keep the same dog's facial markings, fur pattern, and collar in all subsequent images",
        "A consistent character: a businessman in his 40s with salt-and-pepper hair, rimless glasses, wearing a charcoal grey suit. First scene: presenting at a conference. Preserve identical facial features, hairstyle, glasses, and suit across all scenes",
        "A consistent character: an animated robot with blue metallic body, round friendly eyes, and orange accent lights. First scene: waving hello in a futuristic cityscape. Maintain exact same design, proportions, and color scheme throughout",
        "A consistent character: a young chef with black hair in a bun, wearing white chef's coat with red apron. First scene: plating a dish in a modern kitchen. Keep identical facial features, hair, and uniform consistent across all scenarios"
      ]
    },
    {
      category: "Interior Design & Home Staging",
      icon: "🛋️",
      prompts: [
        "Transform this living room into mid-century modern style with teak furniture, geometric patterns, and warm earth tones. Add a sunburst clock, low-profile sofa, and indoor plants. Maintain room dimensions and window placement",
        "Redesign this bedroom in Scandinavian minimalist style with light wood floors, white walls, cozy textiles, and simple furniture. Add soft natural lighting through sheer curtains and a few green plants. Keep architectural features intact",
        "Convert this kitchen to farmhouse rustic style with white shiplap walls, butcher block counters, vintage-inspired fixtures, and open shelving. Add mason jar storage and warm pendant lighting. Preserve existing layout and appliance locations",
        "Restyle this home office in industrial modern aesthetic with exposed brick walls, metal shelving, Edison bulb lighting, and leather seating. Add vintage typewriter and modern tech accessories. Maintain window and door positions",
        "Transform this bathroom into spa-like sanctuary with natural stone tiles, rainfall shower, floating vanity, and ambient lighting. Add bamboo accents and fluffy white towels. Keep plumbing fixture locations unchanged"
      ]
    },
    {
      category: "Historical & Era Transformations",
      icon: "🕰️",
      prompts: [
        "Transform to 1920s vintage photograph with sepia tones, slight grain, soft focus edges, and period-appropriate clothing and hairstyles. Add art deco elements and flapper-era aesthetics",
        "Convert to 1950s Kodachrome photo with saturated colors, slight color shift, and mid-century modern styling. Include pastel color palette and retro fashion elements",
        "Transform to 1970s polaroid aesthetic with faded edges, warm yellow tint, slightly washed out colors, and disco-era fashion. Add vintage film grain and light leaks",
        "Convert to 1980s VHS camcorder footage style with scan lines, color bleeding, date stamp in corner, and neon color palette. Include big hair and bold patterns of the era",
        "Transform to Victorian-era daguerreotype with monochrome tones, formal poses, period-accurate clothing, and vintage photography characteristics. Add slight vignetting and aged appearance"
      ]
    },
    {
      category: "Advanced Editing Techniques",
      icon: "⚡",
      prompts: [
        "Replace background with a softly lit studio gray gradient; keep subject edges crisp and sharp; maintain original color accuracy on the person; no color spill or contamination",
        "Enhance only the sky region: make clouds more dramatic and voluminous; increase color saturation in sunset tones; keep foreground landscape completely unchanged; no over-processing",
        "Localized face retouching: soften skin tones naturally; reduce shine on forehead; brighten eyes subtly; maintain natural texture and pores; avoid plastic or artificial appearance",
        "Product image refinement: remove dust and imperfections; enhance reflections and highlights; correct color balance for web display; sharpen details without introducing artifacts; maintain transparent background",
        "Compositional improvement: apply rule of thirds; adjust perspective for professional framing; balance negative space; enhance leading lines; preserve all original content and subject matter"
      ]
    },
    {
      category: "Gaming & Collectibles",
      icon: "🎮",
      prompts: [
        "Transform into RPG character status screen with health/mana bars, stats panel showing strength/agility/intelligence, character portrait in ornate frame, game UI elements, and fantasy-styled text. Include level indicator and experience bar",
        "Create vintage trading card design with character portrait, holographic border effects, stat numbers for attack/defense/speed, rarity symbol, and flavor text describing abilities. Use 1990s Pokemon/Yu-Gi-Oh aesthetic",
        "Turn into collectible anime figure with clear display box packaging. Show figure on rotating stand, product name on box in Japanese and English, window showing figure details, and authentic toy company branding",
        "Generate original Pokemon character based on this image. Include Pokedex number, type icons (fire/water/grass), evolution chain diagram, height/weight stats, and abilities description in official Pokemon style",
        "Transform into bobblehead figure on dashboard with oversized head, spring-loaded neck, glossy finish, small body with crossed arms pose, circular base with name plate, and realistic toy photography lighting",
        "Create action figure in original packaging with character visible through plastic window, cardboard backing with character artwork, product description, age rating, barcode, and authentic toy manufacturer branding",
        "Design as retro arcade game character sprite with pixel art style, 8-bit color palette, idle animation pose, health bar above head, power-up indicators, and classic 1980s video game aesthetics",
        "Transform into LEGO minifigure with blocky construction, signature yellow skin tone (or character-appropriate color), detailed outfit made of LEGO pieces, classic minifigure smile, and official LEGO product photography style"
      ]
    },
    {
      category: "Miniature Worlds & Dioramas",
      icon: "🔬",
      prompts: [
        "Create miniature scene inside computer keyboard ESC key. Show tiny office setup with desk, monitor, chair, and working person. Use tilt-shift photography effect with dramatic depth of field. Hyper-detailed miniature craftsmanship",
        "Transform into tiny diorama scene contained within a crystal ball. Include miniature landscape, buildings, trees, and characters. Crystal ball sits on ornate wooden stand. Soft magical glow from within. Professional product photography",
        "Design as miniature world built inside a mason jar. Show complete ecosystem with tiny plants, water feature, miniature house, and small pathway. Glass jar on wooden table with soft window lighting. Terrarium aesthetic",
        "Create tilt-shift effect making real scene look like toy model. Increase color saturation, add selective focus blur on top and bottom, enhance miniature appearance. Make buildings and cars look like tiny scale models",
        "Transform into snow globe scene with miniature winter village inside. Show small houses, trees, and figures suspended in liquid with floating snow particles. Glass globe on decorative base. Nostalgic holiday aesthetic",
        "Design as miniature room inside a shoebox diorama. Include tiny furniture, wall decorations, working lights, and detailed accessories. View from open box showing handcrafted miniature interior. Cozy detailed craftsmanship"
      ]
    },
    {
      category: "Creative Transformations",
      icon: "✨",
      prompts: [
        "Transform into emoji 3D object with glossy plastic finish. Make it look like official Apple emoji merchandise - inflatable pool float, plush cushion, or vinyl toy figure. Bright saturated colors with soft shadows",
        "Retexture entire image as if made from stained glass. Colorful translucent panels with black leading between sections, light shining through creating colored reflections. Cathedral window aesthetic with geometric patterns",
        "Convert into voxel/pixel art icon with Minecraft-style blocky 3D construction. Use limited color palette, cubic forms, and isometric perspective. Retro gaming aesthetic meets modern 3D rendering",
        "Transform map screenshot into ancient treasure map with aged parchment texture, hand-drawn cartography style, decorative compass rose, sea monsters in water areas, and 'X marks the spot' indicators. Pirate map aesthetic",
        "Turn into inflatable pool toy version with glossy vinyl material, air valve visible, exaggerated proportions, bright summery colors, and floating on pool water with sun reflections. Fun beach toy aesthetic",
        "Create as embroidered patch design with visible thread texture, felt backing, stitched outlines, fabric material appearance, and slight dimensional depth. Like iron-on jacket patch or scout badge",
        "Transform into neon sign with glowing tubes, electric buzz effect, dark background, colorful neon gas colors (pink/blue/green), mounting hardware visible, and dramatic nighttime city aesthetic",
        "Convert to claymation/stop-motion animation style figure with visible fingerprints in clay, matte texture, slightly imperfect handmade appearance, and soft studio lighting. Wallace & Gromit aesthetic"
      ]
    },
    {
      category: "Vintage & Retro Packaging",
      icon: "📦",
      prompts: [
        "Design as 1980s toy box packaging with character bursting through colorful explosion graphic, bold action words in comic font, 'Collector's Edition' badge, age rating, and barcode. Authentic retro toy aisle aesthetic",
        "Transform into vintage cereal box featuring character as mascot. Include brand name in retro font, 'FREE TOY INSIDE!' banner, nutrition facts panel, UPC barcode, and 1970s grocery store product design",
        "Create as retro VHS tape cover with character in action pose, movie title in neon gradient font, 'Be Kind Rewind' sticker, rental store tags, and authentic 1990s video store aesthetic with tracking lines",
        "Design as vintage passport stamp with circular border, country name, official seal, date stamp, and faded ink texture. Multiple overlapping stamps creating travel document aesthetic from various countries",
        "Transform into old-school trading card album page with plastic sleeve pockets, handwritten notes in margins, slightly worn edges, and nostalgic collector's binder presentation from childhood",
        "Create as vintage postage stamp with perforated edges, denomination value, country of origin, official government seal, and character portrait in classic commemorative stamp design style"
      ]
    },
    {
      category: "AR & Technical Visualization",
      icon: "🔧",
      prompts: [
        "Create hardware exploded view diagram showing all internal components separated and labeled. Display DSLR camera, smartphone, or laptop with parts floating in organized layers. Technical blueprint aesthetic with measurement lines",
        "Generate location-based AR information overlay. Highlight points of interest in image with floating annotation cards showing relevant facts, history, and context. Modern AR interface design with semi-transparent data panels",
        "Transform into technical assembly instructions with numbered steps, exploded component views, and directional arrows showing construction sequence. IKEA-style illustration with clear visual hierarchy",
        "Create product component breakdown showing materials, parts list, and construction details. Label each element with specifications, dimensions, and material composition. Engineering diagram aesthetic",
        "Generate interactive maintenance guide with highlighted problem areas, diagnostic information, and repair steps overlaid on equipment image. Professional service manual visualization",
        "Design technical specification sheet with product cutaway view, annotated features, performance metrics, and dimensional callouts. Professional industrial design presentation"
      ]
    },
    {
      category: "Perspective & View Transformations",
      icon: "🗺️",
      prompts: [
        "Convert ground-level photograph to top-down aerial map view. Transform street scene into bird's eye perspective with labeled locations, paths, and photographer position marked. Cartographic style with map elements",
        "Transform 2D architectural floor plan into isometric 3D visualization. Show room layouts with furniture, walls, and dimensions in angled perspective. Professional architectural rendering style",
        "Convert real photo into Minecraft-style blocky isometric world. Transform buildings, landscape, and objects into pixelated cube construction. Voxel game aesthetic with grid-based design",
        "Generate cross-section cutaway view revealing internal structure. Slice building, vehicle, or object to show hidden interior layers and components. Architectural section drawing style",
        "Transform flat map into 3D terrain visualization with elevation, topography, and relief shading. Show mountains, valleys, and geographical features in raised perspective. Topographic map aesthetic",
        "Convert photograph to blueprint/wireframe technical drawing. Show object outline, dimensions, construction lines, and measurement annotations. Professional CAD drawing style with blue background"
      ]
    },
    {
      category: "Educational & Infographics",
      icon: "📊",
      prompts: [
        "Create educational infographic about 'Top 5 [topic]' with visual rankings, comparison data, and illustrated facts. Include charts, icons, and color-coded sections. Professional data visualization style",
        "Transform text information into visual timeline showing historical progression, milestones, and key events. Add dates, icons, connecting lines, and descriptive annotations. Clean chronological design",
        "Generate comparison infographic showing side-by-side analysis of multiple options. Include pros/cons, feature matrices, and rating scales. Clear visual hierarchy with iconography",
        "Create 'How It Works' educational diagram explaining complex process in simple visual steps. Show workflow, connections, and transformations with arrows and illustrations. Technical yet accessible style",
        "Design knowledge map visualizing relationships between concepts. Show connections, hierarchies, and categories in interconnected node structure. Mind map or knowledge graph aesthetic",
        "Transform statistics into engaging data story with charts, graphs, percentage visualizations, and key takeaway highlights. Magazine-quality infographic design with compelling visual narrative"
      ]
    }
  ]

  // Show all categories, no filtering
  const filteredPrompts = promptLibrary
    .map(cat => ({
      ...cat,
      prompts: cat.prompts.filter(prompt =>
        prompt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(cat => cat.prompts.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/tips"
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tips
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Try in Editor
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4">
            <Copy className="w-4 h-4" />
            <span className="text-sm font-medium">210+ Ready-to-Use Prompts</span>
          </div>
          <h1 className="font-heading text-5xl font-bold text-gray-900 mb-4">
            PicForge Prompt Library
          </h1>
          <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
            Professional prompts for every use case. Click any prompt to copy it, then paste into PicForge to transform your images instantly.
          </p>
        </div>

        {/* Category Filter */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">Browse by Category</h3>
              <p className="text-gray-600">Select a category to explore specialized prompts</p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {promptLibrary.map(cat => (
                <button
                  key={cat.category}
                  onClick={() => scrollToCategory(cat.category)}
                  className={`px-5 py-4 rounded-xl font-medium transition-all flex flex-col items-center gap-2 text-sm ${
                    selectedCategory === cat.category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-lg border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="text-center leading-tight">{cat.category}</span>
                </button>
              ))}
            </div>

            {/* Scroll to Top Button */}
            <div className="text-center pt-4 border-t border-gray-200">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 py-3 rounded-xl font-semibold transition-all text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              >
                ↑ Back to Top
              </button>
            </div>
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid gap-8 mb-12">
          {filteredPrompts.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              id={category.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden scroll-mt-32"
            >
              {/* Category Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-gray-900">{category.category}</h2>
                      <p className="text-sm text-gray-600">{category.prompts.length} prompts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-xs text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    ↑ Top
                  </button>
                </div>
              </div>

              {/* Prompts List */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-3">
                  {category.prompts.map((prompt, promptIndex) => (
                    <div
                      key={promptIndex}
                      className="group relative p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300"
                      onClick={() => copyPrompt(prompt)}
                    >
                      <p className="text-sm text-gray-700 pr-10 leading-relaxed">
                        {searchTerm ? (
                          // Highlight search term
                          prompt.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) =>
                            part.toLowerCase() === searchTerm.toLowerCase() ? (
                              <span key={i} className="bg-yellow-200 font-medium">{part}</span>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )
                        ) : (
                          prompt
                        )}
                      </p>
                      <button
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 hover:bg-white rounded"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyPrompt(prompt)
                        }}
                      >
                        {copiedPrompt === prompt ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No prompts found matching your search.</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Tips Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="font-heading text-2xl font-bold mb-4">💡 Pro Tips for Better Results</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Enhance Your Prompts</h3>
                <ul className="space-y-1 text-blue-50 text-sm">
                  <li>• Add lighting details: &quot;soft lighting&quot;, &quot;golden hour&quot;</li>
                  <li>• Specify quality: &quot;highly detailed&quot;, &quot;professional&quot;</li>
                  <li>• Include mood: &quot;dramatic&quot;, &quot;peaceful&quot;, &quot;energetic&quot;</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Combine Prompts</h3>
                <ul className="space-y-1 text-blue-50 text-sm">
                  <li>• Mix styles: Copy two prompts and combine them</li>
                  <li>• Layer effects: Apply multiple transformations</li>
                  <li>• Iterate: Start simple, then add details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}