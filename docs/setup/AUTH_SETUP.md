# Authentication Setup Guide

PicForge now includes a complete authentication system using NextAuth.js with social logins and user data persistence.

## Features Added

✅ **NextAuth.js Integration**
- Google OAuth login
- GitHub OAuth login
- Session management
- Secure authentication flow

✅ **User Profile System**
- Profile page with user stats
- Image history tracking
- Favorites system
- Credits tracking (500 free images/day)
- Settings management

✅ **Database Integration**
- SQLite for local development
- Prisma ORM for database management
- User data persistence
- Image history storage

✅ **UI Components**
- User menu in navigation
- Sign-in/sign-out flow
- Profile dashboard
- Error handling pages

## Setup Instructions

### 1. Database is Ready
The SQLite database has been created and is ready to use. No additional setup needed for local development.

### 2. Configure OAuth Providers

To enable social logins, you need to set up OAuth applications:

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

#### GitHub OAuth Setup
1. Go to [GitHub Settings → Developer settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret

### 3. Update Environment Variables

Edit `.env.local` and replace the placeholder values:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-actual-github-client-id
GITHUB_CLIENT_SECRET=your-actual-github-client-secret
```

## Features Overview

### User Authentication
- Social login with Google and GitHub
- Secure session management
- Protected routes and API endpoints

### User Profile (`/profile`)
- View account information
- Track usage statistics
- Quick links to history and favorites

### Image History
- Automatically saves all processed images
- Associates images with user accounts
- View processing history

### Favorites System
- Save favorite creations
- Quick access to best results
- Organize your work

### Credits System
- 500 free images per day per user
- Credit tracking and management
- Ready for Pro plan upgrade

## Testing the Authentication

1. Start the development server:
```bash
npm run dev
```

2. Click "Sign In" in the navigation
3. Choose Google or GitHub login
4. After authentication, you'll see your profile menu
5. Visit `/profile` to see your dashboard

## Database Management

```bash
# View database content
npx prisma studio

# Reset database
rm dev.db
npx dotenv -e .env.local -- npx prisma db push

# Generate Prisma client after schema changes
npx prisma generate
```

## Production Deployment

For production deployment on Vercel:

1. Use PostgreSQL instead of SQLite:
   - Update `prisma/schema.prisma` datasource to `postgresql`
   - Set `DATABASE_URL` to your PostgreSQL connection string

2. Set environment variables in Vercel:
   - All variables from `.env.local`
   - Update `NEXTAUTH_URL` to your production domain

3. Run database migrations:
```bash
npx prisma migrate deploy
```

## Security Notes

- ✅ NEXTAUTH_SECRET is securely generated
- ✅ Database credentials are environment variables
- ✅ OAuth tokens are encrypted
- ✅ Sessions expire after 30 days
- ✅ HTTPS required in production

## Next Steps

The authentication system is fully integrated and ready to use. To start using it:

1. Configure your OAuth providers (Google/GitHub)
2. Update the environment variables with real credentials
3. Restart the development server
4. Test the sign-in flow

For production, remember to:
- Switch to PostgreSQL
- Set production environment variables
- Update NEXTAUTH_URL to your domain