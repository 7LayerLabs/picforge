# AI Prompt Assistant Chat Feature

## Overview

The **AI Prompt Assistant** is a persistent, floating chat widget that helps users create optimized prompts for image transformations. It translates casual, conversational descriptions into detailed, AI-ready prompts.

## User Experience

### How It Works

1. **Always Available**: Chat button (✨) floats in bottom-right corner on all pages
2. **Click to Expand**: Opens into a full chat interface
3. **Describe Your Vision**: User types casual description like:
   - "I want my bedroom to have a cozy K-Pop vibe but not too intense"
   - "Make this look like a dystopian cyberpunk city at night"
   - "Turn my dog into a medieval knight"
4. **AI Enhancement**: Claude analyzes the description and generates 3 optimized prompt variations
5. **Copy & Use**: Each variation has a copy button for easy use in transformations

### Example Interaction

**User Input:**
```
"my daughter wants a Kpop Demon hunter themed room but I don't want to do just that I want to give it that vibe though"
```

**AI Response:**
```
I understand! You want to capture that edgy K-pop aesthetic without going full demon hunter.
Here are 3 different approaches:

Option 1:
Modern minimalist bedroom inspired by K-Pop culture — soft pastel color palette (pink,
lavender, white, beige), LED strip lighting with gentle glow, a few framed K-Pop posters
or vinyls as wall accents, cozy bedding with layered textures, subtle sparkle details,
plants for freshness, clean Scandinavian furniture with a feminine touch, stylish vanity
corner, mood-lighting ambiance, aesthetic yet uncluttered — balanced mix of cozy teen girl
room and modern Korean studio vibe.

Option 2:
Korean teen bedroom with subtle edgy elements — monochrome color scheme with pops of neon
pink/purple, sleek modern furniture, subtle anime-inspired wall art, string lights, minimalist
K-pop merchandise display, clean lines with one accent wall featuring geometric patterns...

Option 3:
[Alternative variation]
```

## Technical Implementation

### Components

#### 1. `PromptAssistantChat.tsx`
- **Location**: `components/PromptAssistantChat.tsx`
- **Type**: Client component
- **Features**:
  - Floating chat bubble button
  - Expandable chat panel (400px wide, 600px tall)
  - Message history
  - Typing indicator
  - Copy-to-clipboard for generated prompts
  - Keyboard shortcuts (Enter to send, Shift+Enter for newline)
  - Responsive design

#### 2. API Endpoint
- **Route**: `app/api/enhance-prompt/route.ts`
- **Method**: POST
- **Input**:
  ```json
  {
    "userInput": "casual description of what user wants"
  }
  ```
- **Output**:
  ```json
  {
    "explanation": "Brief interpretation of user's request",
    "prompts": [
      "Optimized prompt variation 1",
      "Optimized prompt variation 2",
      "Optimized prompt variation 3"
    ]
  }
  ```

### Integration

The chat widget is integrated into the root layout (`app/layout.tsx`), making it available across all pages without needing to add it individually to each route.

```tsx
import PromptAssistantChat from "@/components/PromptAssistantChat";

// In layout.tsx
<PromptAssistantChat />
```

### AI Model

Uses **Claude 3.5 Sonnet** via Anthropic API for:
- Natural language understanding
- Context interpretation
- Creative prompt generation
- Multiple variation creation

### Styling

- **Colors**: Purple-to-teal gradient (matches PicForge brand)
- **Position**: Fixed bottom-right (z-index: 50)
- **Animation**:
  - Pulse effect on chat button
  - Smooth expand/collapse
  - Typing indicator with bouncing dots
- **Responsive**: Works on mobile and desktop

## Setup Requirements

### 1. Environment Variable

Add to `.env.local`:
```bash
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

Get your API key from: https://console.anthropic.com/settings/keys

### 2. NPM Package

Already installed:
```bash
npm install @anthropic-ai/sdk
```

### 3. Cost Considerations

**Claude API Pricing** (as of Oct 2025):
- Claude 3.5 Sonnet: ~$3 per million input tokens, ~$15 per million output tokens
- Average prompt enhancement: ~500 input tokens + ~800 output tokens
- **Estimated cost**: ~$0.014 per chat message
- For 1,000 uses/month: ~$14/month

## Future Enhancements

### Phase 2 Features
1. **Context Awareness**: Detect which page user is on and provide relevant suggestions
2. **Image Analysis**: Upload image to get context-specific prompts
3. **Prompt History**: Save favorite prompts for reuse
4. **Quick Actions**: One-click insert into active transformation form
5. **Preset Templates**: Common scenarios (bedroom, portrait, landscape, etc.)
6. **Learning**: Track which prompts users actually use

### Phase 3 Features
1. **Voice Input**: Speak your description instead of typing
2. **Multi-language**: Support non-English descriptions
3. **Collaborative**: Share prompts with community
4. **Analytics**: Track most popular prompt styles
5. **A/B Testing**: Show which prompts generate best results

## Usage Analytics

Track these metrics:
- Chat open rate
- Messages per session
- Prompt copy rate (how often users copy vs just read)
- Which variations get copied most
- Average conversation length
- Drop-off points

## User Feedback

### Potential Issues
1. **API Timeout**: If Claude API is slow, add timeout handling
2. **Rate Limiting**: Add daily limit for free users
3. **Token Costs**: Monitor usage to control costs
4. **Mobile UX**: Ensure chat doesn't block important UI on small screens

### Solutions
1. Add loading states with max 10s timeout
2. Implement rate limiting (e.g., 10 prompts/day for free, unlimited for pro)
3. Set up monitoring alerts for unusual usage spikes
4. Make chat collapsible on mobile with smaller max-height

## Marketing Angle

**Tagline**: "Not sure what to ask for? Just describe the vibe."

**Value Props**:
- "AI copilot for better prompts"
- "Turn ideas into reality with AI-enhanced descriptions"
- "Your personal prompt expert, always available"
- "No prompt engineering skills needed"

**Differentiator**:
Most image tools make users figure out prompts on their own. PicForge has a built-in AI assistant that helps you craft the perfect prompt through conversation.

## Testing Checklist

- [ ] Chat button appears on all pages
- [ ] Chat expands/collapses smoothly
- [ ] Messages send and receive correctly
- [ ] Copy buttons work for all prompt variations
- [ ] Keyboard shortcuts function (Enter, Shift+Enter)
- [ ] Mobile responsive (test on iPhone/Android)
- [ ] Error handling works (API down, timeout, etc.)
- [ ] Loading states display properly
- [ ] Chat persists across page navigation
- [ ] ANTHROPIC_API_KEY validation works

## Launch Plan

### Soft Launch (Beta)
1. Enable for Pro users only
2. Collect feedback
3. Monitor costs and usage patterns
4. Iterate on UI/UX

### Public Launch
1. Announce in navigation/homepage
2. Add tutorial/walkthrough on first use
3. Create example prompts showcase
4. Track conversion impact (free → pro)

### Success Metrics
- **Engagement**: >30% of users try the chat
- **Retention**: Users who use chat return more often
- **Conversion**: Chat users upgrade to pro at higher rate
- **Quality**: Generated prompts lead to better transformations
