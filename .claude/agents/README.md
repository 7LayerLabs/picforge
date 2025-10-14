# PicForge Sub-Agents

Custom sub-agents for PicForge development. These specialized AI assistants help with specific aspects of the project.

## 📁 Available Sub-Agents

### 1. **image-processing-specialist**
**When to use:** Working with image transformations, Canvas API, AI providers (Gemini, Replicate, OpenAI)

**Expertise:**
- Client-side image processing
- AI API integrations
- Performance optimization
- Batch processing

**Example usage:**
```
"Use the image-processing-specialist to optimize our Canvas filter pipeline"
```

---

### 2. **instantdb-specialist**
**When to use:** Database queries, authentication, schema changes, real-time sync issues

**Expertise:**
- InstantDB React hooks
- Schema design
- Magic link authentication
- Transaction patterns

**Example usage:**
```
"Use the instantdb-specialist to add a search feature to favorites"
```

---

### 3. **prompt-engineer**
**When to use:** Creating or optimizing AI image generation prompts

**Expertise:**
- Prompt crafting for Stable Diffusion, DALL-E
- Style transfer techniques
- Negative prompts
- Prompt categorization

**Example usage:**
```
"Use the prompt-engineer to create 20 new cyberpunk-themed prompts"
```

---

### 4. **saas-growth-specialist**
**When to use:** Pricing strategy, feature gates, monetization, growth tactics

**Expertise:**
- Free vs Pro tier design
- Upgrade trigger points
- Viral mechanics
- A/B testing ideas

**Example usage:**
```
"Use the saas-growth-specialist to design our pricing page"
```

---

### 5. **nextjs-deployment-expert**
**When to use:** Build errors, TypeScript issues, Vercel deployments, performance optimization

**Expertise:**
- Next.js 15 App Router
- Vercel configuration
- TypeScript strict mode
- Build optimization

**Example usage:**
```
"Use the nextjs-deployment-expert to fix the Vercel build failure"
```

## 🚀 How to Use

### Explicit Invocation
Directly request a sub-agent in your message:
```
"Use the image-processing-specialist to add a new sepia filter effect"
```

### Automatic Delegation
Claude will automatically select the right sub-agent based on your task description:
```
"Add a new filter to the batch processor"
→ Claude invokes image-processing-specialist
```

## 🎯 Built-in Sub-Agents (Also Available)

From Claude Code's standard library:
- **ui-polisher** - Visual polish, animations, premium feel
- **ux-optimizer** - Simplify user flows, reduce clicks
- **user-researcher** - Analyze user behavior, find pain points
- **mobile-optimizer** - Native-feel mobile experience
- **seo-master** - Search engine optimization
- **revenue-optimizer** - Monetization strategy
- **data-analytics-specialist** - Data analysis and insights

## 📝 Creating New Sub-Agents

Add new `.md` files to `.claude/agents/` with this format:

```markdown
---
name: your-agent-name
description: When to use this agent
tools: Read, Write, Edit, Bash
---

System prompt defining the agent's expertise and capabilities...
```

## 🔗 Learn More

- [Claude Code Sub-Agents Documentation](https://docs.claude.com/en/docs/claude-code/sub-agents)
- Project: PicForge - AI Image Transformation Platform
- Owner: Derek Bobola (@7LayerLabs)
