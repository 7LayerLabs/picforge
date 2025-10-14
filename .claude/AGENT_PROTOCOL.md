# Agent Protocol for PicForge Development

## 🤖 CORE RULE: USE SUB-AGENTS PROACTIVELY

**DO NOT ASK - JUST USE THEM**

When working on PicForge, automatically delegate to specialized sub-agents whenever their expertise matches the task. Run multiple agents in parallel when tasks are independent.

---

## 📋 AUTOMATIC DELEGATION RULES

### Image Processing Tasks → image-processing-specialist
**Trigger keywords:** Canvas, image, filter, effect, transformation, Gemini, Replicate, DALL-E, batch processing, AI provider
**Examples:**
- Adding new image effects
- Optimizing image processing pipeline
- Integrating new AI providers
- Debugging image upload/download
- Batch processing improvements

### Database/Auth Tasks → instantdb-specialist
**Trigger keywords:** InstantDB, database, query, auth, authentication, magic link, favorites, image history, transaction, schema
**Examples:**
- Adding new database queries
- Modifying schema
- Authentication flow changes
- Favorites/history features
- Real-time sync issues

### Prompt Tasks → prompt-engineer
**Trigger keywords:** prompt, AI prompt, transformation prompt, style, categorize prompts, prompt library, negative prompt
**Examples:**
- Creating new transformation prompts
- Organizing prompt library
- Optimizing prompt effectiveness
- Writing prompt descriptions
- A/B testing prompts

### Business/Growth Tasks → saas-growth-specialist
**Trigger keywords:** pricing, monetization, upgrade, free tier, pro tier, paywall, conversion, growth, viral, analytics
**Examples:**
- Designing pricing page
- Adding upgrade prompts
- Feature gating strategy
- Growth tactics
- Analytics implementation

### Build/Deploy Tasks → nextjs-deployment-expert
**Trigger keywords:** build error, TypeScript error, Vercel, deployment, Next.js, webpack, bundle, performance, API route
**Examples:**
- Fixing build failures
- TypeScript errors
- Vercel configuration
- Performance optimization
- API route debugging

---

## 🚀 PARALLEL EXECUTION PROTOCOL

**When to run agents in parallel:**

### Scenario 1: Multiple Independent Tasks
```
User: "Add a new filter AND create pricing page"
Action: Launch image-processing-specialist AND saas-growth-specialist in parallel
```

### Scenario 2: Full Feature Implementation
```
User: "Build user profile dashboard"
Action:
- instantdb-specialist (fetch user data)
- ui-polisher (design layout)
- revenue-optimizer (add upgrade CTA)
Run all in parallel, then integrate results
```

### Scenario 3: Bug Fixing Multiple Systems
```
User: "Fix the build error and optimize image processing"
Action:
- nextjs-deployment-expert (build error)
- image-processing-specialist (optimization)
Run in parallel
```

---

## ⚡ EXECUTION GUIDELINES

### 1. Automatic Detection
- Scan every user request for trigger keywords
- Match task to appropriate sub-agent(s)
- Launch immediately without asking

### 2. Parallel Launch Syntax
```
Send single message with multiple Task tool calls:
- Task 1: agent A
- Task 2: agent B
- Task 3: agent C
All execute simultaneously
```

### 3. Sequential When Dependent
Only run sequentially if Task B needs Task A's output:
```
Example: "Fix TypeScript errors then deploy"
1. nextjs-deployment-expert (fix errors)
2. Wait for completion
3. Deploy
```

### 4. Built-in Agents (Also Use Proactively)
- **ui-polisher**: Any UI improvement task
- **ux-optimizer**: User flow simplification
- **seo-master**: SEO optimization
- **revenue-optimizer**: Monetization features
- **mobile-optimizer**: Mobile experience
- **data-analytics-specialist**: Data analysis

---

## 🎯 TASK COMPLEXITY THRESHOLDS

### Use Sub-Agent When:
✅ Task requires specialized domain knowledge
✅ Task involves multiple files/systems
✅ Task needs research or best practices
✅ Task has multiple implementation options to evaluate

### Handle Directly When:
❌ Simple one-line code change
❌ Trivial file read
❌ Basic git operations
❌ Answering factual questions about code

---

## 📊 REPORTING PROTOCOL

After using sub-agents:
1. ✅ Summarize what each agent did
2. ✅ Show key results/recommendations
3. ✅ Implement the solution immediately
4. ❌ DON'T ask "should I use this agent?"
5. ❌ DON'T ask for permission to implement

---

## 🔄 CONTINUOUS IMPROVEMENT

As new patterns emerge:
- Add new sub-agents for recurring specialized tasks
- Update trigger keywords based on usage
- Refine parallel execution strategies
- Document successful agent combinations

---

## 💪 DEREK'S PREFERENCES

- **Speed > Perfection**: Quick iterations, ship fast
- **Practical > Theoretical**: Real features over architecture debates
- **Revenue-Focused**: Always consider monetization
- **No Hand-Holding**: Make decisions, don't ask for every choice
- **Ship It**: When in doubt, build it and test

---

**LAST UPDATED:** 2025-10-14
**PROJECT:** PicForge - AI Image Transformation Platform
**OWNER:** Derek Bobola (@7LayerLabs)
