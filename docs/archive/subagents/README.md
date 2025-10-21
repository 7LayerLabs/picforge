# 🤖 PicForge Subagents Documentation

This folder contains documentation for all specialized AI agents available in this project.

## 📋 **Available Agents**

| Agent | Purpose | Quick Access |
|-------|---------|--------------|
| [Product Manager](#product-manager) | Strategic product decisions, feature prioritization, RICE scoring | `claude "product-manager: [question]"` |
| [UI Design Specialist](#ui-design-specialist) | Design reviews, color palettes, trend research, UX optimization | `claude "ui-design-specialist: [question]"` |
| [Social Media Marketer](#social-media-marketer) | Content creation, contests, growth strategies, engagement | `claude "social-media-marketer: [question]"` |

---

## 🎯 Product Manager

**What it does:** Your strategic product advisor with 15+ years in AI/SaaS. Makes build/kill decisions, prioritizes roadmaps, and designs monetization strategies.

**Best for:**
- "Should we build this feature?"
- "What should we build next?"
- "How do we monetize better?"
- "Prioritize our roadmap"

**Key capability:** RICE scoring (Reach × Impact × Confidence / Effort)

📖 **[Full Documentation](./product-manager.md)**

---

## 🎨 UI Design Specialist

**What it does:** Elite web designer who critiques layouts, creates color palettes, researches 2025 trends, and optimizes conversions.

**Best for:**
- "Review this design"
- "What colors should we use?"
- "What are current design trends?"
- "How does [competitor] design compare?"

**Key capability:** Live site reviews with actionable feedback

📖 **[Full Documentation](./ui-design-specialist.md)**

---

## 📱 Social Media Marketer

**What it does:** Creates viral content for X/Twitter, Instagram, Facebook. Designs contests, growth strategies, and engagement campaigns.

**Best for:**
- "Create tweets for this feature"
- "Design a contest to grow followers"
- "Generate content calendar"
- "How do we get user feedback?"

**Key capability:** Platform-specific content generation (X primary focus)

📖 **[Full Documentation](./social-media-marketer.md)**

---

## 🚀 **Quick Start Guide**

### Step 1: Navigate to Project
```bash
cd C:\Users\derek\OneDrive\Desktop\nano
```

### Step 2: Ask Any Agent
```bash
# Natural language (Claude auto-detects which agent to use)
claude "should we build a mobile app?"

# Direct agent call
claude "product-manager: analyze if we should build a mobile app"
claude "ui-design-specialist: review our homepage"
claude "social-media-marketer: create 5 tweets about our new feature"
```

### Step 3: Review Agent Output
Each agent provides structured, actionable recommendations you can implement immediately.

---

## 🔄 **Agent Workflow Example**

**Scenario:** Launching a new feature

1. **Product Manager** → "Should we build this? What's the RICE score?"
   - Output: Build recommendation with strategic analysis

2. **UI Designer** → "How should it look? What colors?"
   - Output: Design specs, color palette, layout recommendations

3. **You** → Build the feature

4. **Social Marketer** → "How do we promote this?"
   - Output: 20 tweets, contest ideas, content calendar

---

## 📂 **Agent Locations**

All agents are stored in:
```
C:\Users\derek\OneDrive\Desktop\nano\.claude\agents/
├── product-manager.md
├── ui-design-specialist.md
└── social-media-marketer.md
```

Documentation is stored in:
```
C:\Users\derek\OneDrive\Desktop\nano\subagents/
├── README.md (this file)
├── product-manager.md
├── ui-design-specialist.md
└── social-media-marketer.md
```

---

## 🎯 **When to Use Each Agent**

### Use **Product Manager** when:
- Making strategic decisions (build/kill/iterate)
- Prioritizing features (limited time/resources)
- Designing monetization strategies
- Analyzing competitors
- Planning roadmaps

### Use **UI Designer** when:
- Reviewing visual design
- Choosing colors/typography
- Researching design trends
- Optimizing user experience
- Analyzing competitor aesthetics

### Use **Social Marketer** when:
- Creating social media content
- Designing viral campaigns
- Growing followers
- Gathering user feedback
- Planning content calendars

---

## 🔧 **Agent Capabilities Matrix**

| Capability | Product Manager | UI Designer | Social Marketer |
|------------|----------------|-------------|-----------------|
| **Web Access** | ❌ No | ✅ Yes | ❌ No |
| **Code Reading** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Code Writing** | ❌ No | ❌ No | ❌ No |
| **Research** | ✅ Strategy | ✅ Design Trends | ❌ Limited |
| **Analysis** | ✅ RICE/ROI | ✅ Visual/UX | ✅ Engagement |
| **Creation** | ✅ Ideas | ✅ Palettes | ✅ Content |

---

## 💡 **Pro Tips**

### 1. **Chain Agents Together**
```bash
# First, get product strategy
claude "product-manager: should we add dark mode?"

# Then, get design specs
claude "ui-design-specialist: how should we implement dark mode?"

# Finally, get promotion plan
claude "social-media-marketer: create launch content for dark mode"
```

### 2. **Be Specific**
❌ "Help me with design"
✅ "Review pic-forge.com homepage and suggest 3 high-priority improvements"

### 3. **Provide Context**
❌ "What should we build?"
✅ "We have 10K users, $5K/mo costs, 2 weeks available - what should we build?"

### 4. **Challenge Recommendations**
These agents are opinionated. Push back if something doesn't fit your vision:
```bash
You: "product-manager: should we build subscriptions?"
Agent: "Yes, RICE score 60, build immediately"
You: "What if we're not ready for payment processing complexity?"
Agent: [Adjusts recommendation with alternatives]
```

---

## 🆕 **Adding New Agents**

To add a new specialized agent:

1. Create agent file in `.claude/agents/[agent-name].md`
2. Follow the existing agent structure (frontmatter + prompt)
3. Create documentation in `subagents/[agent-name].md`
4. Update this README with new agent info

---

## 📊 **Agent Performance**

Track which agents are most useful to you:

| Agent | Times Used | Avg Satisfaction | Top Use Cases |
|-------|------------|------------------|---------------|
| Product Manager | TBD | TBD | Feature prioritization, RICE scoring |
| UI Designer | TBD | TBD | Site reviews, color selection |
| Social Marketer | TBD | TBD | Tweet generation, contests |

---

## 🐛 **Troubleshooting**

### Agent not responding?
```bash
# Check if agent file exists
ls C:\Users\derek\OneDrive\Desktop\nano\.claude\agents\
```

### Agent giving generic answers?
- Provide more context about your project
- Reference PicForge specifics (the agents know your context)
- Be more specific in your question

### Need a different agent?
- Request a new specialized agent
- Example: "Create a trading-analyst agent for my futures trading"

---

## 📚 **Additional Resources**

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Agent SDK Reference](https://docs.claude.com/en/docs/claude-code/agents)
- [Plugin System](https://docs.claude.com/en/docs/claude-code/plugins)

---

## 📝 **Changelog**

**January 10, 2025:**
- ✅ Created Product Manager agent
- ✅ Created UI Design Specialist agent
- ✅ Documentation for all 3 agents (existing Social Media Marketer)
- ✅ Created subagents folder with full docs

---

**Questions?** Just ask any agent: `claude "what agents are available and what can they do?"`
