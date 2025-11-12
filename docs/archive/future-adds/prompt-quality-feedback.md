# Prompt Quality Feedback Feature

## Overview
Real-time suggestions to help users write better prompts as they type, increasing the quality of AI-generated results.

## Implementation Plan

### User Flow
1. User starts typing in prompt field
2. System analyzes prompt in real-time
3. Shows helpful suggestions below textarea:
   - "💡 Try adding lighting keywords (golden hour, soft lighting)"
   - "💡 Specify quality level (professional, 4K, highly detailed)"
   - "💡 Include mood/atmosphere (dramatic, peaceful, energetic)"
4. Suggestions update as user types
5. Optional: Click suggestion to auto-add to prompt

### Technical Approach
- Client-side prompt analyzer (no API calls needed)
- Check for missing key elements:
  - Lighting keywords
  - Quality descriptors
  - Style/mood words
  - Composition hints
- Display as inline tips with icons

### UI Components Needed
- `PromptAnalyzer.tsx` - Real-time analysis component
- Suggestion chips below prompt textarea
- Animated fade-in for new suggestions

### Prompt Analysis Logic
```typescript
interface PromptSuggestion {
  category: 'lighting' | 'quality' | 'mood' | 'composition';
  message: string;
  examples: string[];
}

function analyzePrompt(prompt: string): PromptSuggestion[] {
  const suggestions = [];

  // Check for lighting
  if (!hasLightingKeywords(prompt)) {
    suggestions.push({
      category: 'lighting',
      message: 'Add lighting for better results',
      examples: ['golden hour', 'soft lighting', 'studio lights']
    });
  }

  // Check for quality
  if (!hasQualityKeywords(prompt)) {
    suggestions.push({
      category: 'quality',
      message: 'Specify quality level',
      examples: ['professional', '4K', 'highly detailed']
    });
  }

  // More checks...

  return suggestions;
}
```

### Estimated Time
~15 minutes

### UX Benefits
- Educates users on better prompt writing
- Improves generation quality immediately
- Non-intrusive, helpful guidance
- Reduces trial-and-error iterations

### Example Suggestions by Category

**Lighting:**
- "golden hour", "soft lighting", "studio lights", "natural light", "dramatic lighting"

**Quality:**
- "professional", "4K", "8K", "highly detailed", "sharp focus", "crisp"

**Mood:**
- "dramatic", "peaceful", "energetic", "moody", "ethereal", "vibrant"

**Composition:**
- "centered", "rule of thirds", "wide angle", "close-up", "aerial view"

---

**Status:** Planned for future implementation
**Priority:** High (Quick win, immediate user value)
**Source:** Inspired by NanoBananaEditor prompt feedback system
