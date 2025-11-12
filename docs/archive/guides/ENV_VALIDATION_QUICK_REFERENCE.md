# Environment Validation Quick Reference

## 🚀 Quick Start

```bash
# 1. Check what's missing
npm run check-env

# 2. Copy example file
cp .env.example .env.local

# 3. Add required keys to .env.local
# - GEMINI_API_KEY (get from: https://aistudio.google.com/apikey)
# - REPLICATE_API_TOKEN (get from: https://replicate.com/account/api-tokens)
# - NEXT_PUBLIC_INSTANT_APP_ID (get from: https://www.instantdb.com/dash)

# 4. Verify setup
npm run check-env

# 5. Start development
npm run dev
```

---

## 📋 Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run check-env` | Interactive environment checker | Setup, debugging, daily checks |
| `npm run validate-env` | Build-time validation | Before build, CI/CD |
| `npm run build` | Build with validation | Production builds |
| `npm run build:skip-validation` | Build without checks | Emergency only |

---

## 🔑 Required API Keys (3)

| Key | Service | Get It From | Cost |
|-----|---------|-------------|------|
| `GEMINI_API_KEY` | Google Gemini | https://aistudio.google.com/apikey | Free (1,500 req/day) |
| `REPLICATE_API_TOKEN` | Replicate | https://replicate.com/account/api-tokens | ~$0.023/image |
| `NEXT_PUBLIC_INSTANT_APP_ID` | InstantDB | https://www.instantdb.com/dash | Free (100K ops/month) |

---

## 🎨 Optional API Keys

| Key | Service | Fallback Behavior |
|-----|---------|-------------------|
| `OPENAI_API_KEY` | OpenAI DALL-E | Falls back to Pollinations.ai (free) |
| `TOGETHER_API_KEY` | Together AI | Falls back to Pollinations.ai (free) |
| `HF_API_TOKEN` | Hugging Face | Falls back to Pollinations.ai (free) |
| `KV_URL` | Vercel KV | Uses in-memory storage (resets on restart) |
| `RESEND_API_KEY` | Resend Email | Email notifications disabled |
| `STRIPE_SECRET_KEY` | Stripe | Pro subscriptions disabled (promo codes still work) |

---

## 🧑‍💻 Using Validation in Code

### API Routes

```typescript
import { requireEnvVar } from '@/lib/validateEnv';
import { Errors, handleApiError } from '@/lib/apiErrors';

export async function POST(request: NextRequest) {
  try {
    // Validate API key (throws if missing/invalid)
    const apiKey = requireEnvVar('GEMINI_API_KEY', 'Gemini image processing');

    // Validate parameters
    if (!image) throw Errors.missingParameter('image');

    // Process request...

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Optional Keys (Graceful Degradation)

```typescript
import { isEnvVarConfigured } from '@/lib/validateEnv';

// Check if service is available
const hasKV = isEnvVarConfigured('KV_URL');

if (hasKV) {
  // Use Vercel KV
  await kv.set('key', 'value');
} else {
  // Fallback to in-memory
  inMemoryStorage['key'] = 'value';
}
```

### Startup Checks

```typescript
// In app/layout.tsx or middleware.ts
import { runStartupChecks } from '@/lib/startupChecks';

// Run checks (only in development)
runStartupChecks();
```

---

## ❗ Common Errors & Solutions

### Error: "Missing required environment variable: GEMINI_API_KEY"

**Solution:**
1. Go to https://aistudio.google.com/apikey
2. Create new API key
3. Add to `.env.local`: `GEMINI_API_KEY=AIzaSy...`
4. Restart dev server

### Error: "Environment variable GEMINI_API_KEY is set to a placeholder value"

**Solution:**
1. Your `.env.local` has: `GEMINI_API_KEY=your_api_key_here`
2. Replace with real API key (starts with `AIzaSy...`)
3. Restart dev server

### Error: "Environment variable OPENAI_API_KEY has invalid format"

**Solution:**
1. OpenAI keys should start with `sk-`
2. Check for typos in your `.env.local`
3. Generate new key at https://platform.openai.com/api-keys

### Build Fails: "Validation Failed!"

**Solution:**
1. Run `npm run check-env` to see what's missing
2. Add missing REQUIRED keys to `.env.local`
3. Run `npm run validate-env` to verify
4. Run `npm run build` again

---

## 🛠️ Files Reference

| File | Purpose |
|------|---------|
| `.env.local` | Your actual API keys (NEVER commit!) |
| `.env.example` | Template with documentation |
| `lib/validateEnv.ts` | Core validation utilities |
| `lib/apiErrors.ts` | Standardized error handling |
| `lib/startupChecks.ts` | App startup validation |
| `scripts/check-env.ts` | Interactive CLI checker |
| `scripts/validate-env.ts` | Build-time validation |

---

## 📊 Validation Levels

### Level 1: Format Validation
- Checks API key format (e.g., `AIzaSy...`, `sk-...`)
- Runs: During `requireEnvVar()` calls

### Level 2: Placeholder Detection
- Rejects `your_api_key_here` and similar placeholders
- Runs: During `requireEnvVar()` calls

### Level 3: Startup Checks
- Validates all services at app startup
- Runs: `runStartupChecks()` in dev mode

### Level 4: Build-Time Validation
- Blocks production builds if required keys missing
- Runs: `npm run validate-env` during `npm run build`

### Level 5: Runtime Validation
- Validates keys when API routes are called
- Runs: Every API request

---

## 🎯 Best Practices

1. **Always run `npm run check-env` after git pull**
   - Team members may have added new required keys

2. **Never commit `.env.local`**
   - It's in `.gitignore` for a reason

3. **Use `check-env` for debugging**
   - Better than manually checking environment variables

4. **Don't skip validation in CI/CD**
   - Let builds fail early if keys are missing

5. **Document new API keys in `.env.example`**
   - Include service name, link, format, and cost

6. **Use optional keys for graceful degradation**
   - App should work without non-critical services

---

## 🔍 Debugging Tips

### Check if key is configured:
```typescript
import { isEnvVarConfigured } from '@/lib/validateEnv';

console.log(isEnvVarConfigured('GEMINI_API_KEY')); // true/false
```

### Get service summary:
```typescript
import { getServiceSummary } from '@/lib/startupChecks';

const summary = getServiceSummary();
console.log(summary.allRequiredAvailable); // true/false
```

### Test specific key:
```bash
# In terminal
node -e "console.log(process.env.GEMINI_API_KEY ? 'Configured' : 'Missing')"
```

---

## 📞 Support

If you're still having issues:

1. Run `npm run check-env` and read the output carefully
2. Check `.env.example` for expected format
3. Verify API key at provider's dashboard
4. Try generating a new API key
5. Check for typos in variable names (case-sensitive!)

---

## ✅ Pre-Deployment Checklist

- [ ] Run `npm run check-env` - All required keys configured
- [ ] Run `npm run validate-env` - Validation passes
- [ ] Run `npm run build` - Build succeeds
- [ ] Test critical features (main editor, canvas, auth)
- [ ] Verify optional services work or degrade gracefully
- [ ] Check API key rate limits and quotas
- [ ] Set up monitoring for key expiration

---

**Last Updated:** October 22, 2025
**For Issues:** Check `API_KEY_VALIDATION_IMPLEMENTATION.md` for detailed docs
