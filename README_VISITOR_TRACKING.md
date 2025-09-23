# Visitor Tracking Setup

## Current Implementation
The app now includes a visitor counter that tracks:
- Total page visits
- Unique visitors (by IP address)

## Local Development
The tracking works with in-memory storage during development.

## Production Setup (Vercel)

### Option 1: Vercel KV (Recommended - Free tier available)

1. Go to your Vercel dashboard
2. Select your project (picforge)
3. Go to "Storage" tab
4. Click "Create Database" → Select "KV"
5. Follow the setup wizard
6. It will automatically add environment variables

Then update the API endpoints to use Vercel KV:

```bash
npm install @vercel/kv
```

Update `/app/api/track-visitor/route.ts` to uncomment the KV code:
```typescript
import { kv } from '@vercel/kv'

// In the GET/POST handlers:
const count = await kv.incr('visitor_count')
await kv.sadd('visitor_ips', ip)
const uniqueIps = await kv.scard('visitor_ips')
```

### Option 2: Vercel Postgres

1. Similar setup but choose "Postgres" instead
2. Use SQL queries to track visits

### Option 3: External Database
Use any database service (Supabase, PlanetScale, etc.)

## Features
- Tracks visitor IP addresses (anonymized)
- Shows total visits count
- Shows unique visitors count
- Persists data across deployments
- Small, unobtrusive display in bottom-right corner

## Privacy Notes
- Only stores IP addresses for counting unique visitors
- No personal information is collected
- Consider adding a privacy policy if needed

## Customization
The counter display can be customized in `/app/page.tsx` around line 880-895.