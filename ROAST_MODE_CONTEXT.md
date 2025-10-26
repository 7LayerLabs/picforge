# Roast Mode - Context-Aware AI Roasting 🔥🧠

## Overview

Roast Mode uses **AI Vision Analysis** + **Double Parallel Roasts** + **Pixxy & Trixxy Mascots** to deliver devastating, context-aware roasts. Two different roasts generated simultaneously in ~6-7 seconds with custom warning box UI.

---

## How It Works

### **Before (Generic Roasting):**
```
User uploads selfie
AI: "This photo makes me question my existence."
```
Generic, boring, could apply to any photo.

### **After (Context-Aware Roasting):**
```
User uploads selfie taken in poor bathroom lighting with cluttered background
AI analyzes:
- Type: selfie
- Lighting: harsh overhead fluorescent
- Quality: grainy, low resolution
- Setting: messy bathroom
- Roastable elements: bathroom clutter, unflattering angle, poor lighting

AI roasts: "Between the harsh fluorescent lighting and that cluttered bathroom
background, this selfie looks less 'Instagram model' and more 'before photo for
a home makeover show.' Even your phone's camera is begging for better content."
```

**SPECIFIC. TARGETED. HILARIOUS.**

---

## Technical Implementation

### **Two-Step Analysis Process:**

#### **Step 1: Image Context Detection**
Uses Gemini Vision to analyze the image:

```typescript
{
  type: "selfie" | "group" | "food" | "pet" | "bedroom" | "landscape" | "portrait" | "other",
  subject: "main subject (e.g., 'young woman', 'golden retriever')",
  setting: "where taken (e.g., 'bathroom', 'outdoor park')",
  mood: "overall vibe (e.g., 'trying too hard', 'casual')",
  colors: ["primary", "colors"],
  lighting: "lighting quality (e.g., 'poor fluorescent', 'overexposed', 'dramatic shadows')",
  style: "current style (e.g., 'amateur snapshot', 'professional')",
  quality: "photo quality (e.g., 'grainy', 'blurry', 'low resolution', 'high quality')",
  roastableElements: ["specific things to roast - be funny and accurate"]
}
```

#### **Step 2: Context-Aware Roast Generation**
Passes context to Gemini with intensity-specific instructions:

**Mild:**
```
"Be playful and lighthearted. Gentle teasing only."
```

**Spicy:**
```
"Be sarcastic and witty. You can be a bit harsh but still funny."
```

**Nuclear:**
```
"Go ALL OUT. Be ruthlessly hilarious. No mercy. Maximum savagery."
```

Plus the image context:
```
Image Analysis:
- Type: selfie
- Subject: young woman
- Setting: bathroom
- Lighting: harsh overhead fluorescent
- Quality: grainy, low resolution
- Roastable elements: bathroom clutter, unflattering angle, poor lighting

Use these specific details to make your roast more targeted and hilarious.
```

---

## UI Updates

### **Context Display Badge:**

After the roast text, users see:

```
🧠 AI Detected:
📸 selfie | 💡 poor fluorescent | ⭐ grainy | 🔥 unflattering angle
```

Shows what the AI saw, making the roast feel even smarter.

---

## Example Roasts (Context-Aware)

### **Selfie with Bad Lighting:**
**Context Detected:**
- Type: selfie
- Lighting: harsh overhead fluorescent
- Quality: grainy
- Roastable: bathroom setting, unflattering angle

**Roast:**
"This bathroom lighting is doing you dirty, but honestly, it's probably for the best. At least the graininess adds some artistic ambiguity to your life choices."

---

### **Food Photo (Burnt Pizza):**
**Context Detected:**
- Type: food
- Subject: pizza
- Quality: burnt, overcooked
- Roastable: charred edges, questionable presentation

**Roast:**
"I've seen charcoal briquettes with more appetite appeal. This pizza looks like it survived a house fire and you still tried to serve it. Gordon Ramsay is crying somewhere and he doesn't even know why."

---

### **Pet Photo (Blurry Dog):**
**Context Detected:**
- Type: pet
- Subject: dog
- Quality: motion blur, out of focus
- Roastable: timing, camera shake

**Roast:**
"Your dog moved faster than your reaction time, which perfectly captures the essence of this relationship. Even your pet knows this isn't photo-worthy and tried to escape."

---

### **Group Photo (Awkward Poses):**
**Context Detected:**
- Type: group
- Subject: 4 people
- Mood: awkward, forced smiles
- Roastable: stiff poses, varying heights creating chaos

**Roast:**
"This looks like a police lineup for 'Most Awkward Family Photo Ever.' The height difference alone is creating an optical illusion that makes me dizzy. At least everyone's equally uncomfortable."

---

## Files Modified

1. ✅ `app/api/roast/route.ts` - Added two-step analysis (context + roast)
2. ✅ `app/roast/page.tsx` - Updated UI to display context badges

---

## API Response Format

```json
{
  "roastText": "Your devastating, context-aware roast here...",
  "transformPrompt": "make it dramatically epic",
  "transformedImage": "base64_image_data",
  "category": "selfie",
  "imageContext": {
    "type": "selfie",
    "subject": "young woman",
    "setting": "bathroom",
    "mood": "trying too hard",
    "colors": ["beige", "white", "fluorescent"],
    "lighting": "harsh overhead fluorescent",
    "style": "amateur snapshot",
    "quality": "grainy, low resolution",
    "roastableElements": [
      "bathroom clutter visible in background",
      "unflattering overhead angle",
      "harsh fluorescent lighting",
      "visible shower curtain creating distraction"
    ]
  }
}
```

---

## Why This is BRILLIANT

### **1. Specificity = Comedy**
Generic roasts are boring. Specific roasts are HILARIOUS.

**Generic:** "This photo is bad."
**Specific:** "The harsh bathroom lighting is exposing more than just bad skin texture—it's revealing some serious life choices."

### **2. Shows Off AI Capabilities**
Users see:
- AI detected it's a selfie
- AI saw the poor lighting
- AI noticed the grainy quality
- AI picked up on roastable elements

**Reaction:** "Wow, this AI is SMART. What else can it do?"

### **3. Shareable Content**
Context-aware roasts are:
- More quotable
- More specific to the actual photo
- More likely to be shared on social media

**User thinks:** "My friends NEED to see this. The AI called out my bathroom clutter!"

### **4. Retention Driver**
Users want to try different photos to see what the AI detects:
- "What will it say about my food photos?"
- "How will it roast my group photo?"
- "Does it notice my messy room?"

**Result:** More uploads = more engagement = more conversions

---

## Cost Analysis

### **API Calls Per Roast:**

1. **Image Context Analysis**: ~200 tokens
   - Gemini Vision: ~$0.001 per image

2. **Roast Generation**: ~300 input + ~100 output tokens
   - Gemini Vision: ~$0.002 per roast

**Total cost per roast: ~$0.003**

Very affordable! Even at scale:
- 1,000 roasts/month = $3
- 10,000 roasts/month = $30

**Worth it for the quality improvement.**

---

## Testing Examples

### **Try These:**

1. **Bathroom Selfie**
   - Upload poorly lit bathroom selfie
   - Expect roast about lighting and setting
   - Check context badges show: selfie, poor lighting, bathroom

2. **Burnt Food**
   - Upload overcooked food
   - Expect roast about cooking skills
   - Check context shows: food, burnt, poor quality

3. **Blurry Pet Photo**
   - Upload motion-blurred pet
   - Expect roast about timing
   - Check context shows: pet, motion blur, out of focus

4. **Awkward Group Photo**
   - Upload stiff group pose
   - Expect roast about awkwardness
   - Check context shows: group, forced smiles

---

## Marketing Angle

### **Homepage Teaser:**
"Our AI doesn't just roast your photos—it *understands* them first. Get context-aware roasts that are scary accurate."

### **Roast Page Header:**
"AI-Powered Context-Aware Roasting"
"We analyze your photo first. Then we destroy it with surgical precision."

### **Social Proof:**
"The AI detected my bathroom clutter before roasting me. I'm both impressed and hurt." - User

---

## User Experience Flow

```
User uploads photo
  ↓
Page shows: "Analyzing your photo..."
  ↓
AI detects: Type, lighting, quality, roastable elements (2 seconds)
  ↓
Page shows: "Preparing your roast..."
  ↓
AI generates context-aware roast (3 seconds)
  ↓
Typewriter effect displays roast
  ↓
Context badges appear: 📸 selfie | 💡 harsh lighting | ⭐ grainy | 🔥 bathroom clutter
  ↓
User reaction: "OMG it noticed EVERYTHING! 😂"
  ↓
User shares on social media
  ↓
Friends try it
  ↓
Viral loop activated 🚀
```

---

## Future Enhancements

### **Phase 2:**

1. **Roast History**: Save past roasts with context
2. **Category Stats**: "You've been roasted for poor lighting 5 times. Maybe invest in a lamp?"
3. **Roast Intensity Auto-Adjust**: Based on photo quality (worse photo = harder roast option)
4. **Roast Comparisons**: "Here's how your selfie compares to others..."

### **Phase 3:**

1. **Before/After Context**: Show how transformations changed the context
2. **Roast Leaderboard**: "Most roastable photos this week"
3. **Roast Challenges**: "Can you take a photo so bad the AI can't roast it?"

---

## Latest Updates (October 26, 2025)

### **Double Roast System 🔥🔥**

#### **Parallel Roast Generation:**
Instead of one roast, users now get TWO completely different roasts running in parallel:

```typescript
const roast1Promise = model.generateContent([roastPrompt, imageData])
const roast2Promise = model.generateContent([
  `${roastPrompt}\n\nIMPORTANT: This is your SECOND roast. Make it COMPLETELY DIFFERENT from your first roast. Attack from a totally different angle. Find NEW flaws to destroy. Use DIFFERENT jokes. Go EVEN HARDER if possible.`,
  imageData
])

const [response1, response2] = await Promise.all([roast1Promise, roast2Promise])
```

**Benefits:**
- Double the entertainment value
- Two different perspectives on same photo
- Still only ~6-7 seconds total (parallel execution)
- Only ~$0.006 per photo (2x roasts)

---

### **Pixxy & Trixxy Mascots 🎨**

#### **Custom Characters:**
Replaced emoji mascots with custom-designed Pixxy & Trixxy characters:

**Pixxy** (Left mascot):
- Dark pixelated cat character
- Holds paintbrush and spray can
- Slides in from left
- Name displayed in yellow below

**Trixxy** (Right mascot):
- Same cat character with pink bow
- Pixelated design matches brand
- Slides in from right
- Name displayed in yellow below

**Implementation:**
```tsx
<Image
  src="/mascots/pixxy.png"
  alt="Pixxy"
  width={128}
  height={128}
  priority
/>
```

**Optimizations:**
- Next.js Image component for automatic WebP conversion
- Priority loading (no lazy load delay)
- 10MB PNGs → ~200KB optimized images
- Instant loading with proper caching

---

### **Warning Box UI Theme ⚠️**

Replaced colorful thought bubbles with aggressive warning box design:

**Visual Elements:**
- Black background with white text
- 4px solid yellow borders
- Yellow/black diagonal warning stripes on top edge
- Warning sign emoji (⚠️) instead of flame icons
- Construction zone aesthetic

**CSS:**
```tsx
<div className="bg-black text-white rounded-xl shadow-2xl p-6 border-4 border-yellow-400">
  {/* Yellow warning stripes */}
  <div style={{
    backgroundImage: 'repeating-linear-gradient(45deg, #facc15, #facc15 10px, #000 10px, #000 20px)'
  }} />

  <div className="flex items-start gap-3">
    <span className="text-3xl">⚠️</span>
    <p>{roastText}</p>
  </div>
</div>
```

**Why This Works:**
- Matches aggressive roasting tone
- No more cute gradients
- Warning aesthetic = expect brutal honesty
- Stands out in screenshots/shares

---

### **Enhanced Roast Intensity**

Made roast prompts MUCH more savage across all intensity levels:

**Mild (Updated):**
```
"Be playful but still throw some shade. Gentle roasting with a smirk. Think friendly banter that stings just a little."
```

**Spicy (Updated):**
```
"Go HARD. Be savage, sarcastic, and brutal. Don't hold back. Attack the photo's flaws mercilessly. Make them feel the burn."
```

**Nuclear (Updated):**
```
"DESTROY THEM. Be absolutely ruthless. Obliterate every flaw you see. No mercy, no filter, maximum devastation. This should HURT (in a funny way). Channel your inner comedian roasting a heckler. Go for the JUGULAR."
```

**System Prompt Updates:**
```
You are a ruthless roast comedian. Your job is to absolutely DESTROY this photo with comedy.

RULES:
- Make it 2-3 sentences of pure savagery
- Be SPECIFIC about what you see (don't use generic roasts)
- Reference the actual elements, lighting, composition, quality flaws
- Attack HARD - this is a ROAST, not a compliment session
- Make it FUNNY but BRUTAL
- No holding back - they ASKED to be roasted
- Think: "What would a savage stand-up comedian say about this?"

DESTROY THIS PHOTO NOW:
```

---

### **Share Text Branding**

Updated social sharing to prominently feature PIC-FORGE.com:

**Before:**
```
🔥 AI Roasted my photo:
"[roast text]"
Try it yourself at pic-forge.com/roast
```

**After:**
```
🔥 PIC-FORGE.com Roasted my photo:
"[roast text]"
Try it yourself at pic-forge.com/roast
```

**Impact:**
- Brand name in share text
- Capitalizes PIC-FORGE for visibility
- Domain acts as call-to-action
- Free marketing with every share

---

### **UI Cleanup**

**Removed:**
- AI vision analysis badges (too cluttered)
- Thought bubble clouds
- Gradient backgrounds

**Result:**
- Cleaner, more focused UI
- Roasts are the star
- Warning aesthetic reinforces brutal honesty
- Faster page rendering

---

### **Files Modified:**

1. ✅ `app/api/roast/route.ts` - Double parallel roast generation + enhanced prompts
2. ✅ `app/roast/page.tsx` - Warning box UI + mascots + typewriter effects
3. ✅ `public/mascots/pixxy.png` - Left mascot image
4. ✅ `public/mascots/trixxy.png` - Right mascot image

---

### **Cost Analysis (Updated):**

**Per Roast:**
- 2x Context Analysis: ~$0.002
- 2x Roast Generation: ~$0.004
- **Total: ~$0.006 per photo**

**Scale:**
- 1,000 roasts/month = $6
- 10,000 roasts/month = $60

Still very affordable for double the entertainment value!

---

## Conclusion

Context-aware roasting makes Roast Mode:
- **Funnier** (specific = comedy gold)
- **Smarter** (shows off AI capabilities)
- **More shareable** (users want friends to see)
- **More engaging** (try different photos to see what AI detects)

For an extra $0.003 per roast, you get WAY better quality and virality potential.

**That's a no-brainer. Ship it!** 🔥🚀
