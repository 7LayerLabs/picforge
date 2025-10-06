# Vercel Environment Variables Setup

## Required Environment Variables for Production

Add these in your Vercel project settings under Settings > Environment Variables:

### 1. Database (Choose one option):

#### Option A: Vercel Postgres (Recommended - Free tier available)
1. Go to your Vercel project dashboard
2. Click "Storage" tab
3. Click "Create Database" > "Postgres"
4. Follow the setup wizard
5. It will automatically add `DATABASE_URL` to your environment variables

#### Option B: External PostgreSQL
Add manually:
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### 2. NextAuth Configuration
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_generated_secret_here
```

To generate NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```

### 3. Google OAuth
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. AI API Keys (from your .env.local)
```
GEMINI_API_KEY=your_gemini_api_key
```

### 5. Optional APIs
```
OPENAI_API_KEY=your_openai_key (if using DALL-E)
TOGETHER_API_KEY=your_together_key (if using Together AI)
```

### 6. Vercel KV (Optional - for analytics)
If you want visitor tracking:
1. Go to Storage > Create Database > KV
2. It will auto-add these variables:
   - KV_URL
   - KV_REST_API_URL
   - KV_REST_API_TOKEN
   - KV_REST_API_READ_ONLY_TOKEN

## Google OAuth Setup for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to APIs & Services > Credentials
4. Click on your OAuth 2.0 Client
5. Add to Authorized redirect URIs:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```
   Replace `your-domain` with your actual Vercel domain

## After Adding Environment Variables

1. Redeploy your project from Vercel dashboard
2. Or push a new commit to trigger deployment

## Testing

Visit: https://your-domain.vercel.app/auth/signin

You should see the Google sign-in button and be able to authenticate.