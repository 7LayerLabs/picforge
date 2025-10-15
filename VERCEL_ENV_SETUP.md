# Vercel Environment Variables Setup

## Required Environment Variables for Production

Add these in your Vercel project settings under Settings > Environment Variables:

### 1. InstantDB (Primary Auth & Database)
```
NEXT_PUBLIC_INSTANT_APP_ID=59da2600-08d9-476c-a591-ddc662b14847
```

### 2. Database for Showcase Feature (Choose one option):

#### Option A: SQLite (Simplest - for testing)
```
DATABASE_URL=file:./dev.db
```

#### Option B: Vercel Postgres (Recommended for production)
1. Go to your Vercel project dashboard
2. Click "Storage" tab
3. Click "Create Database" > "Postgres"
4. Follow the setup wizard
5. It will automatically add `DATABASE_URL` to your environment variables

#### Option C: External PostgreSQL
Add manually:
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### 3. AI API Keys (Required)
```
GEMINI_API_KEY=your_gemini_api_key
REPLICATE_API_TOKEN=your_replicate_token (for NSFW features - optional but recommended)
```

### 4. Optional APIs
```
OPENAI_API_KEY=your_openai_key (if using DALL-E)
TOGETHER_API_KEY=your_together_key (if using Together AI)
```

### 5. Vercel KV (Optional - for analytics)
If you want visitor tracking:
1. Go to Storage > Create Database > KV
2. It will auto-add these variables:
   - KV_URL
   - KV_REST_API_URL
   - KV_REST_API_TOKEN
   - KV_REST_API_READ_ONLY_TOKEN

## After Adding Environment Variables

1. Redeploy your project from Vercel dashboard
2. Or push a new commit to trigger deployment

## Build Script Update

The build script has been updated to include Prisma client generation:
```json
"build": "prisma generate && next build"
```

This ensures the Prisma client is properly generated during Vercel deployment.

## Testing

Visit: https://pic-forge.com

The promo code system and all new features should now be working correctly.