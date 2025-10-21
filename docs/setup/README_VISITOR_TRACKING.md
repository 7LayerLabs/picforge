# Visitor Tracking Setup

## Current Implementation
The app now includes a visitor counter that tracks:
- Total page visits
- Unique visitors (by IP address)

## Local Development
The tracking works with in-memory storage during development.

## Production Setup (Vercel)

### Setting up Vercel KV (Recommended - Free tier available)

1. **Go to your Vercel dashboard**: https://vercel.com/dashboard
2. **Select your project**: picforge
3. **Go to "Storage" tab**
4. **Click "Browse Storage"** in the Marketplace
5. **Select "KV Storage"** by Vercel
6. **Click "Get Started"**
7. **Create a new KV database**:
   - Give it a name (e.g., "picforge-visitor-tracking")
   - Select your preferred region
   - Click "Create"
8. **Connect to your project**:
   - It will automatically add the required environment variables:
     - `KV_URL`
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_REST_API_READ_ONLY_TOKEN`

The code is already set up to use Vercel KV when these environment variables are present!

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