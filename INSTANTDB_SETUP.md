# InstantDB Setup Guide for PicForge

## What InstantDB Gives You

- **User Authentication** - Magic link (passwordless) auth built-in
- **Real-time Database** - Client-side queries with automatic sync
- **Offline Support** - Works without internet, syncs when back online
- **No Backend Needed** - Everything runs in the browser

## Setup Steps

### 1. Create InstantDB App

1. Go to https://www.instantdb.com/dash
2. Sign up or log in
3. Click "Create App"
4. Name it "PicForge" (or whatever you want)
5. Copy the **App ID** that's generated

### 2. Add App ID to Environment Variables

Create or update `.env.local` in the project root:

```
NEXT_PUBLIC_INSTANT_APP_ID=your_app_id_here
```

**IMPORTANT**: The `NEXT_PUBLIC_` prefix is required for Next.js to expose this to the client.

### 3. Add Auth Button to Navigation

Open `components/Navigation.tsx` and add the auth button:

```typescript
import AuthButton from '@/components/AuthButton';

// Inside your navigation component, add:
<AuthButton />
```

This gives users a "Sign In" button that sends magic links to their email.

### 4. Track Image Generations (Optional)

In your main image editor component, add tracking:

```typescript
import { useImageTracking } from '@/hooks/useImageTracking';

function ImageEditor() {
  const { trackImageGeneration, hasReachedLimit, getRemainingImages } = useImageTracking();

  const handleGenerate = async () => {
    // Check limit before generating
    if (hasReachedLimit()) {
      alert('Daily limit reached! Sign up for Pro to get unlimited images.');
      return;
    }

    // ... your existing image generation code ...

    // After successful generation, track it
    await trackImageGeneration({
      prompt: userPrompt,
      originalUrl: originalImage,
      transformedUrl: resultImage,
      locked: lockComposition
    });

    // Show remaining images
    const remaining = getRemainingImages();
    console.log(`${remaining} images remaining today`);
  };

  return (
    // ... your component JSX ...
  );
}
```

### 5. Show User's Image History (Optional)

```typescript
import { useImageTracking } from '@/hooks/useImageTracking';

function ImageHistory() {
  const { imageHistory, user } = useImageTracking();

  if (!user) {
    return <p>Sign in to see your image history</p>;
  }

  return (
    <div>
      <h2>Your Transformations</h2>
      {imageHistory.map((img) => (
        <div key={img.id}>
          <img src={img.transformedUrl} alt={img.prompt} />
          <p>{img.prompt}</p>
          <small>{new Date(img.timestamp).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}
```

## Database Schema

The InstantDB schema is defined in `lib/instantdb.ts`:

- **users** - User accounts (email, name, createdAt)
- **images** - Generated images (userId, prompt, urls, timestamp)
- **favorites** - Saved favorite prompts (userId, prompt, category)
- **usage** - Usage tracking for freemium limits (userId, count, tier)
- **showcaseSubmissions** - User-submitted showcase images (userId, imageUrl, likes)

## Features Now Available

### User Accounts
- Magic link authentication (no passwords!)
- User profile data
- Sign in/out functionality

### Image Tracking
- Save every image generation
- View history across devices
- Real-time sync

### Favorite Prompts
- Save best prompts
- Organize by category
- Share with other users (coming soon)

### Usage Limits
- Track free tier usage (500/day)
- Pro tier = unlimited
- Real-time count updates

### Showcase Gallery
- Users submit transformations
- Like/comment on submissions
- Real-time updates when new submissions added

## Next Steps

### Immediate (Already Set Up)
- ✅ InstantDB installed
- ✅ Configuration file created (`lib/instantdb.ts`)
- ✅ Auth button component created (`components/AuthButton.tsx`)
- ✅ Usage tracking hook created (`hooks/useImageTracking.ts`)
- ⏳ Get your App ID from instantdb.com/dash
- ⏳ Add App ID to `.env.local`

### Short Term (Vibecode These)
- Add `<AuthButton />` to navigation
- Show "X images remaining" counter
- Add "Save to Favorites" button on prompts
- Create "My Images" page showing user's history

### Medium Term
- Build user dashboard with stats
- Implement Pro tier upgrade flow
- Add social features (like, comment on showcase)
- Create template marketplace

## Migration from Vercel KV

InstantDB can replace your current Vercel KV analytics:

**Current:** `track-visitor/`, `track-share/`, `track-template/` API routes
**New:** Store visits/shares/templates in InstantDB
**Benefits:**
- Real-time analytics dashboard
- User-level insights (who's using what)
- No need for separate API routes

## Troubleshooting

**"db.useAuth is not a function"**
- Make sure you imported from `@/lib/instantdb` not `@instantdb/react`

**"Cannot read App ID"**
- Check `.env.local` has `NEXT_PUBLIC_INSTANT_APP_ID`
- Restart dev server after adding env var

**Magic link not arriving**
- Check spam folder
- Verify email is correct
- Check InstantDB dashboard for sent emails

**"undefined is not an object (evaluating 'data.usage')"**
- User hasn't generated any images yet
- Add null checks: `const usage = data?.usage?.[0]`

## Resources

- InstantDB Docs: https://www.instantdb.com/docs
- InstantDB Dashboard: https://www.instantdb.com/dash
- React Hooks Guide: https://www.instantdb.com/docs/react
- Schema Explorer: https://www.instantdb.com/dash (your app → Schema tab)

## Support

Having issues? Check:
1. InstantDB dashboard for app status
2. Browser console for errors
3. Network tab for failed requests
4. InstantDB Discord: https://discord.gg/instantdb
