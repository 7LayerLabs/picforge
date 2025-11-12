'use client'

import { useState } from 'react'
import { Upload, Shuffle, Share2, Download, RefreshCw, Maximize2, X, Trophy, Award, TrendingUp } from 'lucide-react'
import { applyClientTransform } from '@/lib/clientTransforms'
import styles from './roulette.module.css'
import { useRouletteGame } from '@/hooks/useRouletteGame'
import AchievementToast from '@/components/AchievementToast'
import StreakBadge from '@/components/roulette/StreakBadge'
import AchievementModal from '@/components/roulette/AchievementModal'
import { logger } from '@/lib/logger'
import Leaderboard from '@/components/roulette/Leaderboard'
import RouletteShareModal from '@/components/roulette/RouletteShareModal'
import ProgressiveReveal from '@/components/roulette/ProgressiveReveal'

// Wild transformation prompts organized by 8 categories
const PROMPT_CATEGORIES = {
  'Art Styles': {
    color: '#8b5cf6',
    icon: '🎨',
    prompts: [
      "Transform into Van Gogh's Starry Night style",
      "Make it look like a Renaissance painting",
      "Turn into 80s retro synthwave art",
      "Transform into Japanese anime style",
      "Make it look like Banksy street art",
      "Convert to pop art like Andy Warhol",
      "Transform into impressionist painting",
      "Make it look like a Picasso cubist masterpiece",
      "Turn into watercolor painting",
      "Transform into oil painting with thick brush strokes",
      "Make it look like street graffiti art",
      "Convert to pixel art 8-bit style",
      "Transform into minimalist line art",
      "Make it look like art deco poster",
      "Turn into pointillism dots style",
      "Transform into abstract expressionism",
      "Make it look like stained glass window",
      "Convert to comic book art style",
      "Transform into charcoal sketch",
      "Make it look like Japanese ukiyo-e woodblock print",
      "Turn into psychedelic 60s poster art",
      "Transform into bauhaus geometric art",
      "Make it look like art nouveau style",
      "Convert to cyberpunk neon art",
      "Transform into surrealist collage",
      "Make it look like medieval illuminated manuscript",
      "Turn into vaporwave aesthetic",
      "Transform into Memphis design style",
      "Make it look like Soviet propaganda poster",
      "Convert to low poly geometric art",
      "Transform into glitch art",
      "Make it look like risograph print",
      "Turn into vintage travel poster",
      "Transform into constructivist design",
      "Make it look like dadaist artwork",
      "Convert to suprematist composition",
      "Transform into futurist dynamic painting",
      "Make it look like fauvism bold colors",
      "Turn into expressionist dramatic style",
      "Transform into neoclassical painting"
    ]
  },
  'Movie Magic': {
    color: '#ec4899',
    icon: '🎬',
    prompts: [
      "Turn this into a Marvel superhero poster",
      "Make it look like a horror movie scene",
      "Transform into a romantic comedy poster",
      "Make it look like Star Wars",
      "Turn into a western movie scene",
      "Transform into Wes Anderson symmetrical style",
      "Make it look like a Tarantino film frame",
      "Turn into James Bond movie poster",
      "Transform into Christopher Nolan epic scene",
      "Make it look like Disney Pixar animation",
      "Turn into Tim Burton gothic style",
      "Transform into Blade Runner cyberpunk",
      "Make it look like The Matrix green tint",
      "Turn into Mad Max post-apocalyptic",
      "Transform into Studio Ghibli animation",
      "Make it look like noir detective film",
      "Turn into 80s action movie poster",
      "Transform into Spielberg dramatic lighting",
      "Make it look like Kubrick symmetric shot",
      "Turn into Hitchcock suspense thriller",
      "Transform into Lord of the Rings epic fantasy",
      "Make it look like Inception dreamscape",
      "Turn into Guardians of the Galaxy cosmic",
      "Transform into John Wick action scene",
      "Make it look like Jurassic Park adventure",
      "Turn into Back to the Future time travel",
      "Transform into Alien sci-fi horror",
      "Make it look like The Godfather mafia drama",
      "Turn into Harry Potter magical world",
      "Transform into Pirates of the Caribbean",
      "Make it look like Dune desert epic",
      "Turn into Avatar alien planet",
      "Transform into Tron digital world",
      "Make it look like The Grand Budapest Hotel",
      "Turn into Interstellar space odyssey",
      "Transform into Kill Bill revenge film",
      "Make it look like Scarface crime drama",
      "Turn into Mission Impossible spy thriller",
      "Transform into The Fifth Element future",
      "Make it look like Pacific Rim kaiju battle"
    ]
  },
  'Time Warp': {
    color: '#f59e0b',
    icon: '⏰',
    prompts: [
      "Make it look like ancient Egypt",
      "Transform to the year 3000",
      "Turn into a medieval scene",
      "Make it look like the 1920s",
      "Transform into prehistoric times",
      "Make it look like ancient Rome",
      "Turn into Victorian era 1890s",
      "Transform into ancient Greece",
      "Make it look like Renaissance Italy",
      "Turn into Wild West 1880s",
      "Transform into Roaring Twenties jazz age",
      "Make it look like ancient China dynasty",
      "Turn into 1950s retro Americana",
      "Transform into 1960s hippie era",
      "Make it look like 1970s disco fever",
      "Turn into 1980s neon excess",
      "Transform into 1990s grunge aesthetic",
      "Make it look like ancient Mayan civilization",
      "Turn into Industrial Revolution era",
      "Transform into Stone Age caveman times",
      "Make it look like Viking age",
      "Turn into Samurai feudal Japan",
      "Transform into Art Deco 1930s",
      "Make it look like post-war 1940s",
      "Turn into Edwardian era elegance",
      "Transform into ancient Babylon",
      "Make it look like colonial America",
      "Turn into Belle Époque Paris",
      "Transform into Aztec empire",
      "Make it look like year 2500 utopia",
      "Turn into year 3500 cyberpunk dystopia",
      "Transform into ancient Persia",
      "Make it look like Prohibition era",
      "Turn into ancient India",
      "Transform into Byzantine Empire",
      "Make it look like Ice Age 10000 BC",
      "Turn into far future year 5000",
      "Transform into ancient Celtic tribes",
      "Make it look like Ottoman Empire",
      "Turn into distant future year 10000"
    ]
  },
  'Fantasy': {
    color: '#10b981',
    icon: '🧙',
    prompts: [
      "Add dragons flying overhead",
      "Make everyone look like wizards",
      "Transform into a fairy tale",
      "Add unicorns and rainbows",
      "Turn into a magical kingdom",
      "Transform into enchanted forest",
      "Make it look like elven realm",
      "Add phoenix birds and magic",
      "Turn into wizard's tower",
      "Transform into mermaid underwater kingdom",
      "Make it look like dwarf mountain fortress",
      "Add magical floating islands",
      "Turn into vampire gothic castle",
      "Transform into werewolf moonlit scene",
      "Make it look like fairy garden",
      "Add centaurs and mythology",
      "Turn into angel heavenly realm",
      "Transform into demon underworld",
      "Make it look like pegasus sky palace",
      "Add griffin and mythical beasts",
      "Turn into sorcerer's lair",
      "Transform into crystal cave magic",
      "Make it look like goblin market",
      "Add leprechaun rainbow world",
      "Turn into genie Arabian nights",
      "Transform into yeti mountain peak",
      "Make it look like kraken ocean depths",
      "Add basilisk mythical creature",
      "Turn into chimera beast realm",
      "Transform into sphinx desert mystery",
      "Make it look like hydra swamp",
      "Add cyclops giant world",
      "Turn into minotaur labyrinth",
      "Transform into satyr forest party",
      "Make it look like nymph waterfall",
      "Add valkyrie warrior heaven",
      "Turn into troll bridge scene",
      "Transform into banshee haunted moor",
      "Make it look like kitsune fox spirit",
      "Add thunderbird sky spirit"
    ]
  },
  'Chaos Mode': {
    color: '#3b82f6',
    icon: '💥',
    prompts: [
      "Turn this into a zombie apocalypse",
      "Make it look like a meteor is striking",
      "Transform into a post-nuclear wasteland",
      "Add alien invasion chaos",
      "Make it look like the world is ending",
      "Add tornado destroying everything",
      "Make it look like volcanic eruption",
      "Turn into earthquake destruction",
      "Transform into tsunami wave",
      "Add lightning storm chaos",
      "Make it look like blizzard whiteout",
      "Turn into sandstorm desert",
      "Transform into wildfire spreading",
      "Add giant monster attack",
      "Make it look like robot uprising",
      "Turn into kaiju city destruction",
      "Transform into demon portal opening",
      "Add ghost invasion haunting",
      "Make it look like vampire outbreak",
      "Turn into werewolf rampage",
      "Transform into plague doctor apocalypse",
      "Add mutant creature chaos",
      "Make it look like cyborg takeover",
      "Turn into clone army invasion",
      "Transform into void consuming reality",
      "Add cosmic horror from space",
      "Make it look like dimensions colliding",
      "Turn into reality glitching out",
      "Transform into time breaking down",
      "Add gravity reversing chaos",
      "Make it look like plants taking over",
      "Turn into insect swarm attack",
      "Transform into ocean flooding world",
      "Add ice age freezing everything",
      "Make it look like sun dying out",
      "Turn into black hole approaching",
      "Transform into supernova explosion",
      "Add asteroid belt impact",
      "Make it look like gamma ray burst",
      "Turn into antimatter annihilation"
    ]
  },
  'Weird World': {
    color: '#ef4444',
    icon: '🌀',
    prompts: [
      "Make it look like it's melting",
      "Turn everything into candy",
      "Make it look underwater but in the sky",
      "Transform into Salvador Dali painting",
      "Make everything float in zero gravity",
      "Replace everyone with rubber ducks",
      "Make everything neon and glowing",
      "Turn into a pizza universe",
      "Transform everyone into robots",
      "Make it rain tacos",
      "Turn everything into balloons",
      "Make it look like jello world",
      "Transform into clockwork mechanism",
      "Make everything made of cheese",
      "Turn into bubble universe",
      "Transform into origami folded world",
      "Make everything look like toys",
      "Turn into mushroom forest",
      "Transform into cloud city",
      "Make everything crystalline",
      "Turn into mirror dimension",
      "Transform into upside down world",
      "Make everything fuzzy and soft",
      "Turn into static TV noise",
      "Transform into honeycomb pattern",
      "Make everything look holographic",
      "Turn into kaleidoscope vision",
      "Transform into thermal camera view",
      "Make everything look like X-ray",
      "Turn into infrared camera view",
      "Transform into ASCII art text",
      "Make everything look like claymation",
      "Turn into stop motion animation",
      "Transform into pencil sketch world",
      "Make everything look transparent",
      "Turn into wireframe 3D model",
      "Transform into mosaic tiles",
      "Make everything look like LEGO",
      "Turn into cross-stitch pattern",
      "Transform into magnetic field lines"
    ]
  },
  'Nature Extreme': {
    color: '#a855f7',
    icon: '🌪️',
    prompts: [
      "Add dinosaurs roaming around",
      "Turn into an enchanted forest",
      "Make it look like it's on fire",
      "Transform into an ice age scene",
      "Add northern lights aurora",
      "Make it look like bioluminescent jungle",
      "Turn into coral reef underwater",
      "Transform into desert oasis",
      "Add redwood giant trees",
      "Make it look like cherry blossom spring",
      "Turn into autumn fall colors",
      "Transform into snowy winter wonderland",
      "Add tropical rainforest",
      "Make it look like savanna plains",
      "Turn into bamboo forest",
      "Transform into tundra frozen land",
      "Add volcano lava flow",
      "Make it look like geyser field",
      "Turn into hot spring paradise",
      "Transform into cave stalactites",
      "Add waterfall cascade",
      "Make it look like river rapids",
      "Turn into ocean waves",
      "Transform into beach paradise",
      "Add mountain peaks summit",
      "Make it look like canyon depths",
      "Turn into valley meadow",
      "Transform into wetland marsh",
      "Add lake reflection mirror",
      "Make it look like fjord cliffs",
      "Turn into glacier ice field",
      "Transform into quicksand desert",
      "Add meteor crater impact",
      "Make it look like geothermal springs",
      "Turn into salt flats expanse",
      "Transform into cloud forest mist",
      "Add mangrove swamp roots",
      "Make it look like kelp forest",
      "Turn into tide pool ecosystem",
      "Transform into prehistoric jungle"
    ]
  },
  'Digital Dimension': {
    color: '#f97316',
    icon: '🤖',
    prompts: [
      "Transform into Matrix digital rain",
      "Make it look like Tron grid world",
      "Turn into cyberpunk neon city",
      "Transform into virtual reality",
      "Add hologram projection effect",
      "Make it look like computer circuit board",
      "Turn into video game 3D render",
      "Transform into augmented reality overlay",
      "Add laser light show effects",
      "Make it look like blockchain network",
      "Turn into data visualization",
      "Transform into neural network nodes",
      "Add quantum computing glow",
      "Make it look like AI generated dream",
      "Turn into metaverse digital space",
      "Transform into crypto art NFT style",
      "Add scanning laser grid",
      "Make it look like digital glitch",
      "Turn into retro computer graphics",
      "Transform into wireframe hologram",
      "Add binary code matrix",
      "Make it look like satellite view",
      "Turn into thermal imaging",
      "Transform into night vision green",
      "Add sonar echo location",
      "Make it look like radar display",
      "Turn into oscilloscope wave",
      "Transform into EKG heart monitor",
      "Add spectrogram frequency view",
      "Make it look like CAD blueprint",
      "Turn into 3D printer rendering",
      "Transform into VHS tape glitch",
      "Add CRT screen scanlines",
      "Make it look like old film grain",
      "Turn into photocopy distortion",
      "Transform into fax machine quality",
      "Add dial-up modem aesthetic",
      "Make it look like corrupted file",
      "Turn into loading screen buffer",
      "Transform into pixel sorting algorithm"
    ]
  }
}

// Wheel segments (8 categories with short display names)
const WHEEL_SEGMENTS = Object.entries(PROMPT_CATEGORIES).map(([name, data]) => ({
  name,
  displayName: name.replace('Art Styles', 'Art')
                  .replace('Movie Magic', 'Movies')
                  .replace('Time Warp', 'Time')
                  .replace('Chaos Mode', 'Chaos')
                  .replace('Weird World', 'Weird')
                  .replace('Nature Extreme', 'Nature')
                  .replace('Digital Dimension', 'Digital'),
  color: data.color,
  icon: data.icon
}))

interface RouletteResult {
  category: string
  prompt: string
  transformedImage: string
  isRare: boolean
  spinId?: string
}

export default function TransformRoulette() {
  const [uploadedImage, setUploadedImage] = useState<string>('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<string>('')
  const [selectedPrompt, setSelectedPrompt] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [wheelRotation, setWheelRotation] = useState(0)
  const [result, setResult] = useState<RouletteResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showProgressiveReveal, setShowProgressiveReveal] = useState(false)
  const [revealData, setRevealData] = useState<{ category: string; prompt: string; isRare: boolean } | null>(null)
  const [newUnlockedAchievement, setNewUnlockedAchievement] = useState<string | null>(null)

  const {
    user,
    stats,
    recordSpin,
    recordShare,
    getLeaderboard,
    getProgress,
    getAchievementDetails,
    allAchievements,
    isRarePrompt,
  } = useRouletteGame()

  const leaderboard = getLeaderboard()
  const progress = getProgress()

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
      setResult(null)
      setSelectedPrompt('')
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  const spinWheel = () => {
    if (!uploadedImage || isSpinning || isProcessing) return

    setIsSpinning(true)
    setResult(null)

    // Play spinning sound effect
    const audio = new Audio('/sounds/spin.mp3')
    audio.volume = 0.3
    audio.play().catch(() => {})

    // Random spin amount (3-5 full rotations plus land on a segment)
    const spins = Math.floor(Math.random() * 3) + 3
    const segmentIndex = Math.floor(Math.random() * 8)

    // Pointer is at TOP (0 degrees)
    // Segments start at 0° (top), going clockwise in 45° slices
    // Add 22.5° offset to land in CENTER of segment (not edge)
    const degreesPerSegment = 360 / 8 // 45 degrees per segment
    const segmentCenterOffset = 22.5 // Offset to center of segment
    const targetAngle = -(segmentIndex * degreesPerSegment + segmentCenterOffset)
    const totalRotation = wheelRotation + (spins * 360) + targetAngle

    setWheelRotation(totalRotation)

    // Select random prompt from the landed category after spin completes
    setTimeout(() => {
      const categoryName = WHEEL_SEGMENTS[segmentIndex].name
      const categoryData = PROMPT_CATEGORIES[categoryName as keyof typeof PROMPT_CATEGORIES]
      const randomPrompt = categoryData.prompts[Math.floor(Math.random() * categoryData.prompts.length)]
      const isRare = isRarePrompt(randomPrompt)

      setSelectedCategory(categoryName)
      setSelectedPrompt(randomPrompt)
      setIsSpinning(false)

      // Show progressive reveal
      setRevealData({ category: categoryName, prompt: randomPrompt, isRare })
      setShowProgressiveReveal(true)

      // Play selection sound
      const dingAudio = new Audio('/sounds/ding.mp3')
      dingAudio.volume = 0.5
      dingAudio.play().catch(() => {})
    }, 3000)
  }

  const handleRevealComplete = () => {
    setShowProgressiveReveal(false)
    if (revealData) {
      transformImage(revealData.category, revealData.prompt, revealData.isRare)
    }
  }

  const transformImage = async (category: string, prompt: string, isRare: boolean) => {
    setIsProcessing(true)
    setProcessingStatus('Analyzing your image...')

    try {
      // Try Gemini image transformation first (best quality)
      setProcessingStatus('Preparing transformation...')

      const response = await fetch('/api/process-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          prompt: prompt,
          operation: 'transform' // Use transform instead of enhance
        })
      })

      setProcessingStatus('Applying AI transformation...')
      const data = await response.json()

      const transformedImage = data.generatedImage || data.processedImage

      if (transformedImage) {
        setProcessingStatus('Saving your transformation...')

        // Record spin in InstantDB and check for achievements
        const spinResult = await recordSpin(category, prompt, uploadedImage, transformedImage)

        // Show achievement toast if new achievement unlocked
        if (spinResult.newAchievements && spinResult.newAchievements.length > 0) {
          setNewUnlockedAchievement(spinResult.newAchievements[0].id)
        }

        // AI transformation successful
        setResult({
          category: category,
          prompt: prompt,
          transformedImage: transformedImage,
          isRare: isRare,
          spinId: spinResult.spinId
        })
      } else {
        // Fallback to client-side transformation
        setProcessingStatus('Applying effects...')
        const clientTransformed = await applyClientTransform(uploadedImage, prompt)

        const spinResult = await recordSpin(category, prompt, uploadedImage, clientTransformed)

        if (spinResult.newAchievements && spinResult.newAchievements.length > 0) {
          setNewUnlockedAchievement(spinResult.newAchievements[0].id)
        }

        setResult({
          category: category,
          prompt: prompt,
          transformedImage: clientTransformed,
          isRare: isRare,
          spinId: spinResult.spinId
        })
      }

      setProcessingStatus('Complete!')

      // Play success sound
      const successAudio = new Audio('/sounds/success.mp3')
      successAudio.volume = 0.4
      successAudio.play().catch(() => {})

    } catch (error) {
      logger.error('Error transforming image:', error)

      // Use client-side transformation as fallback
      try {
        setProcessingStatus('Using fallback processor...')
        const clientTransformed = await applyClientTransform(uploadedImage, prompt)

        const spinResult = await recordSpin(category, prompt, uploadedImage, clientTransformed)

        if (spinResult.newAchievements && spinResult.newAchievements.length > 0) {
          setNewUnlockedAchievement(spinResult.newAchievements[0].id)
        }

        setResult({
          category: category,
          prompt: prompt,
          transformedImage: clientTransformed,
          isRare: isRare,
          spinId: spinResult.spinId
        })

        setProcessingStatus('Complete!')
      } catch (clientError) {
        logger.error('Client transform also failed:', clientError)
        setProcessingStatus('Transform failed - please try again')
      }
    } finally {
      setIsProcessing(false)
      // Clear status after a short delay
      setTimeout(() => setProcessingStatus(''), 2000)
    }
  }

  const handleShare = (spinId: string) => {
    recordShare(spinId)
  }

  const downloadResult = () => {
    if (!result) return

    // Track download in GA
    import('@/lib/analytics').then(({ trackDownload }) => {
      trackDownload('roulette');
    });

    const link = document.createElement('a')
    link.href = result.transformedImage
    link.download = 'transform-roulette.png'
    link.click()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Achievement Toast */}
      {newUnlockedAchievement && getAchievementDetails(newUnlockedAchievement) && (
        <AchievementToast
          achievement={getAchievementDetails(newUnlockedAchievement)!}
          onClose={() => setNewUnlockedAchievement(null)}
        />
      )}

      {/* Progressive Reveal Overlay */}
      {showProgressiveReveal && revealData && (
        <ProgressiveReveal
          category={revealData.category}
          prompt={revealData.prompt}
          isRare={revealData.isRare}
          onComplete={handleRevealComplete}
        />
      )}

      {/* Achievement Modal */}
      {showAchievementModal && (
        <AchievementModal
          unlockedAchievements={stats.achievements}
          totalSpins={stats.totalSpins}
          currentStreak={stats.currentStreak}
          categoriesUnlocked={stats.categoriesUnlocked}
          rareSpinsCount={stats.rareSpinsCount}
          shareCount={stats.shareCount}
          voteCount={stats.voteCount}
          onClose={() => setShowAchievementModal(false)}
        />
      )}

      {/* Share Modal */}
      {showShareModal && result && (
        <RouletteShareModal
          result={result}
          stats={{
            totalSpins: stats.totalSpins,
            currentStreak: stats.currentStreak,
          }}
          spinId={result.spinId}
          onShare={handleShare}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Header */}
      <div className="bg-black border-b-4 border-brutal-cyan">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="font-heading text-5xl md:text-6xl font-black uppercase text-brutal-cyan mb-2 flex items-center justify-center gap-3 tracking-tight">
              <Shuffle className="w-8 h-8 text-brutal-cyan" />
              Transform Roulette
            </h1>
            <p className="text-white text-lg max-w-2xl mx-auto mb-4 font-bold">
              Spin the wheel. Let chaos decide. No takebacks.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 justify-center flex-wrap">
              <button
                onClick={() => setShowAchievementModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brutal-yellow text-black border-4 border-black font-black uppercase hover:bg-brutal-cyan transition-all shadow-brutal"
              >
                <Trophy className="w-5 h-5" />
                Achievements ({stats.achievements.length}/{allAchievements.length})
              </button>
              <button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex items-center gap-2 px-4 py-2 bg-brutal-pink text-black border-4 border-black font-black uppercase hover:bg-brutal-cyan transition-all shadow-brutal"
              >
                <TrendingUp className="w-5 h-5" />
                Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Leaderboard (collapsible) */}
        {showLeaderboard && (
          <div className="mb-8 max-w-4xl mx-auto">
            <Leaderboard
              topSpins={leaderboard.all}
              topStreaks={[]} // TODO: Get from stats query
              currentUserRank={{
                spinsRank: undefined,
                streakRank: undefined,
              }}
            />
          </div>
        )}

        {!uploadedImage ? (
          /* Upload Area */
          <div
            className={`max-w-2xl mx-auto bg-black shadow-brutal-lg p-12 ${
              dragActive ? 'border-4 border-brutal-cyan' : 'border-4 border-brutal-pink'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
              />
              <div className="text-center">
                <Upload className="w-16 h-16 mx-auto text-brutal-cyan mb-4" />
                <h2 className="text-2xl font-black uppercase text-brutal-cyan mb-2 tracking-tight">
                  Upload Your Image
                </h2>
                <p className="text-white mb-4 font-bold">
                  Then spin the wheel of transformation!
                </p>
                <div className="inline-block px-6 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-pink hover:text-white transition-all shadow-brutal">
                  Choose Image
                </div>
              </div>
            </label>

            {/* Preview of categories */}
            <div className="mt-8 pt-8 border-t-4 border-brutal-cyan">
              <p className="text-sm text-brutal-cyan text-center mb-4 font-black uppercase">Spin to land on a category:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {WHEEL_SEGMENTS.map((segment, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 text-black border-4 border-black text-xs font-black uppercase shadow-brutal"
                    style={{ backgroundColor: segment.color }}
                  >
                    {segment.icon} {segment.name}
                  </div>
                ))}
              </div>
              <p className="text-xs text-white text-center mt-3 font-bold">
                320+ unique transformations across 8 wild categories!
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Spinning Wheel */}
              <div className="bg-black border-4 border-brutal-cyan shadow-brutal-lg p-8">
                <h2 className="text-xl font-black uppercase text-brutal-cyan text-center mb-6 tracking-tight">
                  {isSpinning ? 'Spinning...' : selectedCategory ? `${PROMPT_CATEGORIES[selectedCategory as keyof typeof PROMPT_CATEGORIES].icon} ${selectedCategory}` : 'Spin the Wheel!'}
                </h2>

                {/* Wheel Container */}
                <div className={styles.wheelContainer}>
                  {/* Pointer */}
                  <div className={styles.pointer}>
                    <div className={styles.pointerTriangle}></div>
                  </div>

                  {/* Spinning Wheel */}
                  <div
                    className={styles.wheel}
                    style={{
                      transform: `rotate(${wheelRotation}deg)`,
                    }}
                  >
                    {/* Add segment labels positioned absolutely */}
                    {WHEEL_SEGMENTS.map((segment, i) => {
                      // Calculate position for each label around the wheel
                      // Offset by 22.5° to center text in middle of each 45° segment
                      const angle = (i * 45) + 22.5 - 90 // Start from top, offset to segment center
                      const radius = 110 // Distance from center
                      const radians = (angle * Math.PI) / 180
                      const x = 50 + (radius / 160) * 50 * Math.cos(radians) // Percentage from center
                      const y = 50 + (radius / 160) * 50 * Math.sin(radians)

                      return (
                        <div
                          key={i}
                          className={styles.wheelLabel}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`
                          }}
                        >
                          {segment.icon} {segment.displayName}
                        </div>
                      )
                    })}
                  </div>

                  {/* Center button */}
                  <button
                    onClick={spinWheel}
                    disabled={isSpinning || isProcessing}
                    className={styles.spinButton}
                  >
                    {isSpinning ? '...' : 'SPIN!'}
                  </button>
                </div>

                {/* Selected Prompt Display */}
                {selectedPrompt && !isSpinning && (
                  <div className={styles.promptDisplay}>
                    <p className="text-sm text-white/80 mb-1">Your transformation:</p>
                    <p className="font-semibold text-white">&quot;{selectedPrompt}&quot;</p>
                  </div>
                )}

                {/* Status */}
                {isProcessing && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 text-brutal-cyan mb-2">
                      <div className="w-5 h-5 border-2 border-brutal-cyan border-t-transparent rounded-full animate-spin" />
                      <span className="font-black uppercase">{processingStatus || 'Processing...'}</span>
                    </div>
                    <p className="text-xs text-white font-bold">This may take 10-20 seconds</p>
                  </div>
                )}
              </div>

              {/* Result Display */}
              <div className="bg-black border-4 border-brutal-pink shadow-brutal-lg p-8">
                <h2 className="text-xl font-black uppercase text-brutal-pink text-center mb-6 tracking-tight">
                  {result ? 'Transformation Result' : 'Your Image'}
                </h2>

                {result ? (
                  <div>
                    {/* Before/After Display */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      <div>
                        <p className="text-sm font-black uppercase text-brutal-cyan mb-1 text-center">Before</p>
                        <div className="relative group cursor-pointer" onClick={() => setLightboxImage(uploadedImage)}>
                          <img
                            src={uploadedImage}
                            alt="Original"
                            className="w-full border-4 border-brutal-cyan shadow-brutal"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-brutal-pink mb-1 text-center">After</p>
                        <div className="relative group cursor-pointer" onClick={() => setLightboxImage(result.transformedImage)}>
                          <img
                            src={result.transformedImage}
                            alt="Transformed"
                            className="w-full border-4 border-brutal-pink shadow-brutal"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rare Badge */}
                    {result.isRare && (
                      <div className="mb-4 bg-brutal-yellow p-3 text-center border-4 border-black shadow-brutal">
                        <p className="text-black font-black text-lg flex items-center justify-center gap-2 uppercase">
                          <Award className="w-5 h-5" />
                          RARE TRANSFORMATION!
                          <Award className="w-5 h-5" />
                        </p>
                        <p className="text-black text-sm mt-1 font-bold">1 in 20 chance - You&apos;re lucky!</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={spinWheel}
                        disabled={isSpinning || isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brutal-cyan text-black border-4 border-black font-black uppercase hover:bg-brutal-pink hover:text-white transition-all disabled:opacity-50 shadow-brutal"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Spin Again
                      </button>
                      <button
                        onClick={() => setShowShareModal(true)}
                        className="px-4 py-3 bg-brutal-pink text-black border-4 border-black font-black uppercase hover:bg-brutal-yellow transition-all shadow-brutal"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={downloadResult}
                        className="px-4 py-3 bg-brutal-pink text-black border-4 border-black font-black uppercase hover:bg-brutal-yellow transition-all shadow-brutal"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full border-4 border-brutal-pink mb-6 shadow-brutal"
                    />
                    <button
                      onClick={spinWheel}
                      disabled={isSpinning || isProcessing}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-brutal-cyan text-black border-4 border-black font-black text-lg uppercase hover:bg-brutal-pink hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-brutal tracking-tight"
                    >
                      {isSpinning ? (
                        <>
                          <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                          Wheel is Spinning...
                        </>
                      ) : (
                        <>
                          <Shuffle className="w-6 h-6" />
                          SPIN THE WHEEL!
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Change Image Button */}
                <button
                  onClick={() => {
                    setUploadedImage('')
                    setResult(null)
                    setSelectedPrompt('')
                    setWheelRotation(0)
                  }}
                  className="w-full mt-3 px-4 py-2 text-white hover:text-brutal-cyan transition-colors font-black uppercase"
                >
                  Upload Different Image
                </button>
              </div>
            </div>

            {/* Streak & Progress Section */}
            <div className="mt-8 max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              {/* Streak Badge */}
              <StreakBadge
                currentStreak={stats.currentStreak}
                longestStreak={stats.longestStreak}
                lastSpinDate={stats.lastSpinDate}
              />

              {/* Progress to Next Achievement */}
              <div className="bg-black border-4 border-brutal-yellow shadow-brutal p-6">
                <h3 className="font-black uppercase text-brutal-yellow mb-4 flex items-center gap-2 tracking-tight">
                  <Trophy className="w-5 h-5 text-brutal-yellow" />
                  Next Milestone
                </h3>

                {progress.nextSpin && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black uppercase text-white">
                        {progress.nextSpin.achievement.name}
                      </span>
                      <span className="text-sm text-brutal-cyan font-bold">
                        {progress.nextSpin.current}/{progress.nextSpin.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-900 h-3 overflow-hidden border-4 border-black">
                      <div
                        className="bg-brutal-cyan h-3 transition-all duration-500"
                        style={{ width: `${Math.min(progress.nextSpin.percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-white mt-2 font-bold">
                      Reward: +{progress.nextSpin.achievement.reward.bonusImages} images
                    </p>
                  </div>
                )}

                {progress.nextStreak && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black uppercase text-white">
                        {progress.nextStreak.achievement.name}
                      </span>
                      <span className="text-sm text-brutal-pink font-bold">
                        {progress.nextStreak.current}/{progress.nextStreak.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-900 h-3 overflow-hidden border-4 border-black">
                      <div
                        className="bg-brutal-pink h-3 transition-all duration-500"
                        style={{ width: `${Math.min(progress.nextStreak.percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-white mt-2 font-bold">
                      Reward: +{progress.nextStreak.achievement.reward.bonusImages} images
                    </p>
                  </div>
                )}

                {!progress.nextSpin && !progress.nextStreak && (
                  <div className="text-center py-6 text-white">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-brutal-yellow" />
                    <p className="font-black uppercase">All achievements unlocked!</p>
                    <p className="text-sm font-bold">You&apos;re a true Roulette Master!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Fun Stats */}
            {result && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="bg-black border-4 border-brutal-cyan shadow-brutal p-4 text-center">
                  <div className="text-2xl mb-1">🎲</div>
                  <div className="text-sm text-brutal-cyan font-bold uppercase">Total Spins</div>
                  <div className="font-black text-white text-xl">{stats.totalSpins}</div>
                </div>
                <div className="bg-black border-4 border-brutal-pink shadow-brutal p-4 text-center">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-sm text-brutal-pink font-bold uppercase">Current Streak</div>
                  <div className="font-black text-white text-xl">{stats.currentStreak}</div>
                </div>
                <div className="bg-black border-4 border-brutal-cyan shadow-brutal p-4 text-center">
                  <div className="text-2xl mb-1">🌍</div>
                  <div className="text-sm text-brutal-cyan font-bold uppercase">Categories</div>
                  <div className="font-black text-white text-xl">{stats.categoriesUnlocked.length}/8</div>
                </div>
                <div className="bg-black border-4 border-brutal-yellow shadow-brutal p-4 text-center">
                  <div className="text-2xl mb-1">💎</div>
                  <div className="text-sm text-brutal-yellow font-bold uppercase">Rare Finds</div>
                  <div className="font-black text-white text-xl">{stats.rareSpinsCount}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 bg-brutal-cyan border-4 border-black hover:bg-brutal-pink transition-all shadow-brutal"
          >
            <X className="w-6 h-6 text-black" />
          </button>
          <img
            src={lightboxImage}
            alt="Enlarged view"
            className="max-w-full max-h-full object-contain border-4 border-brutal-cyan shadow-brutal-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
