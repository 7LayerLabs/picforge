# 🎯 Product Manager Agent

## **Agent Name**
`product-manager`

## **What It Does**
Elite product management specialist for PicForge.com and your other projects. This agent acts as your strategic product advisor with 15+ years of experience in AI/SaaS products, freemium models, and viral growth mechanics.

## **Location**
```
C:\Users\derek\OneDrive\Desktop\nano\.claude\agents\product-manager.md
```

## **How to Access**

### Method 1: Direct Command
```bash
cd C:\Users\derek\OneDrive\Desktop\nano
claude "hey product-manager, [your question]"
```

### Method 2: Natural Language
Claude Code will automatically invoke this agent when you mention product strategy topics:
- "Should we build [feature]?"
- "What features should we prioritize?"
- "How can we monetize better?"
- "Analyze our product roadmap"

## **Core Capabilities**

### 1. **Feature Ideation**
- Generate breakthrough feature ideas
- Design viral mechanics and gamification
- Identify white space opportunities
- Create 10x improvements (not 10% iterations)

**Example:**
```bash
claude "product-manager: give me 3 viral feature ideas for PicForge"
```

### 2. **Strategic Analysis**
- Build/kill decisions with clear reasoning
- RICE scoring (Reach × Impact × Confidence / Effort)
- ROI analysis (user impact vs dev cost)
- Competitive threat evaluation

**Example:**
```bash
claude "product-manager: should we build collaborative editing? do a RICE analysis"
```

### 3. **Roadmap Prioritization**
- Prioritize features using RICE framework
- Sequence features for compounding effect
- Balance quick wins vs long-term bets
- Identify MVP vs V2 vs V3 scope

**Example:**
```bash
claude "product-manager: we have 10 feature requests, which should we build first?"
```

### 4. **Monetization Strategy**
- Design pricing tiers (free/pro/enterprise)
- Optimize conversion funnels
- Identify premium feature opportunities
- Create revenue-driving mechanics

**Example:**
```bash
claude "product-manager: how should we price our Pro subscription?"
```

### 5. **Competitive Intelligence**
- Monitor competitors (Canva, Figma, Adobe, etc.)
- Identify market gaps
- Track AI model advancements
- Find unfair advantages

**Example:**
```bash
claude "product-manager: what is Canva doing that we should copy or avoid?"
```

### 6. **Growth & Viral Mechanics**
- Design viral loops and referral systems
- Create habit-forming features
- Optimize for shareability
- Build network effects

**Example:**
```bash
claude "product-manager: design a referral program that would actually work"
```

## **What It Can Fetch/Research**

This agent has **READ ONLY** access to your codebase:
- ✅ Read files (analyze existing features)
- ✅ Search code (understand implementation)
- ✅ Review documentation
- ❌ Cannot modify code (advisory role only)

## **Output Format**

The agent structures responses as:

1. **Executive Summary** - TLDR for busy entrepreneurs
2. **Detailed Analysis** - Using RICE scores, competitive data
3. **Recommendation** - Clear "Build/Kill/Iterate" with reasoning
4. **Next Steps** - Specific actions to validate or execute
5. **Open Questions** - What needs testing before committing

## **Tone & Style**
- **Direct** - No fluff, gets to the point
- **Data-driven** - Backs claims with logic and examples
- **Opinionated** - Makes calls, doesn't just present options
- **Action-oriented** - Always ends with "Here's what to do next"
- **Realistic** - Acknowledges tradeoffs and constraints

## **Context Awareness**

The agent knows about:
- **Your situation**: Solo founder, 7 kids, limited time
- **PicForge specifics**: 320+ prompts, freemium model, AI costs
- **Tech stack**: Next.js 15, Gemini API, Replicate, Vercel
- **Competition**: Canva, Adobe, Remove.bg, Midjourney

## **Example Sessions**

### Session 1: Feature Ideation
```bash
You: "product-manager: what should we build next for PicForge?"

Agent: Generates 5 RICE-scored feature ideas with:
- Full analysis of each idea
- Prioritized roadmap (what to build when)
- Revenue projections
- Implementation complexity
- Competitive advantages
```

### Session 2: Build/Kill Decision
```bash
You: "should we build a mobile app or focus on web?"

Agent:
- Analyzes market data (80% of image editing is mobile)
- Calculates development effort (3-6 months native app)
- Compares alternatives (iOS shortcuts = 2 weeks)
- Recommends: Build shortcuts first, validate demand, then native app
- Provides RICE scores for each option
```

### Session 3: Pricing Strategy
```bash
You: "how much should we charge for Pro?"

Agent:
- Researches competitor pricing (Canva $13/mo, Remove.bg $9/mo)
- Analyzes your costs (~$0.001-0.023/image)
- Calculates unit economics
- Recommends: $9/mo (aggressive) or $12/mo (market rate)
- Suggests A/B test with 2-week trial
```

## **Best Practices**

### ✅ DO:
- Ask specific questions ("Should we build X?" not "What should we do?")
- Provide context ("We have 10K users, $5K/mo in costs")
- Challenge the agent's recommendations ("What if we can't afford that?")
- Use for strategic decisions (not tactical code questions)

### ❌ DON'T:
- Ask for code implementation (agent is advisory only)
- Expect it to write features (that's your job or use other agents)
- Use for debugging or bug fixes (wrong agent)
- Ignore the RICE scores (they're data-driven for a reason)

## **Integration with Other Agents**

This agent works well with:
- **ui-design-specialist** - Product says what to build, UI says how it should look
- **social-media-marketer** - Product designs viral features, marketer promotes them

**Example workflow:**
1. Product Manager: "Build Battle Mode feature" (strategy)
2. UI Designer: "Make it look like this" (design)
3. You: Build it (execution)
4. Social Marketer: "Here's how to launch it" (promotion)

## **Model**
- Uses: `claude-sonnet-4-5` (latest Sonnet model)
- Color: `blue` (in UI)

## **Last Updated**
January 10, 2025

---

**Need help?** Just ask: `claude "product-manager: what can you help me with?"`
