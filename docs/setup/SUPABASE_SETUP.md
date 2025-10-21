# Supabase PostgreSQL Setup for PicForge

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login and click "New project"
3. Fill in:
   - Project name: `picforge` (or your choice)
   - Database password: (save this securely)
   - Region: Choose closest to you
4. Click "Create new project" (takes ~2 minutes)

## Step 2: Get Your Database URL

1. In your Supabase project dashboard
2. Click "Settings" (gear icon) in sidebar
3. Click "Database"
4. Scroll to "Connection string" section
5. Copy the **"URI"** connection string
6. It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## Step 3: Add to Vercel Environment Variables

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add:
   ```
   DATABASE_URL = [paste your Supabase URI here]
   DATABASE_DIRECT_URL = [paste your Supabase URI here]
   ```

## Step 4: Initialize Database Schema

Run these commands locally:

```bash
# Install Prisma CLI if needed
npm install -D prisma

# Generate Prisma client
npx prisma generate --schema=./prisma/schema.production.prisma

# Push schema to Supabase
npx prisma db push --schema=./prisma/schema.production.prisma
```

## Step 5: Verify in Supabase

1. Go to your Supabase dashboard
2. Click "Table Editor" in sidebar
3. You should see tables like:
   - User
   - Account
   - Session
   - Showcase
   - etc.

## Step 6: Redeploy on Vercel

Either:
- Push a new commit to trigger deployment
- Or manually redeploy from Vercel dashboard

## Troubleshooting

If you get connection errors:
1. Make sure you replaced `[YOUR-PASSWORD]` in the connection string with your actual database password
2. Check that the connection string is properly quoted in Vercel
3. Ensure you're using the correct schema file for production

## Free Tier Limits

Supabase free tier includes:
- 500MB database
- 2GB bandwidth
- 50MB file storage
- Unlimited API requests
- Perfect for this project!