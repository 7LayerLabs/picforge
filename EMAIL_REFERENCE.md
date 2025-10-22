# Email System Reference Guide

Quick reference for all email-related files and key code snippets.

## File Structure

```
C:\Users\derek\OneDrive\Desktop\nano\
│
├── emails/                              # Email templates (React Email)
│   ├── WelcomeEmail.tsx                # New user welcome
│   ├── LimitWarningEmail.tsx           # 5 images remaining warning
│   ├── LimitReachedEmail.tsx           # Daily limit hit notification
│   ├── PromoCodeRedeemedEmail.tsx      # Promo code success confirmation
│   └── WeeklyDigestEmail.tsx           # Weekly stats recap
│
├── lib/
│   ├── email.ts                        # Email sending utility functions
│   └── instantdb.ts                    # Updated with emailPreferences schema
│
├── hooks/
│   ├── useEmailNotifications.ts        # Hook for triggering emails
│   ├── useEmailPreferences.ts          # Hook for managing user email settings
│   ├── useImageTracking.ts             # Updated to send limit emails
│   └── usePromoCode.ts                 # Updated to send promo emails
│
├── app/
│   ├── api/send-email/route.ts         # API endpoint for sending emails
│   └── email-preferences/page.tsx      # User email settings page
│
├── components/
│   └── AuthButton.tsx                  # Updated to send welcome emails
│
├── .env.local                          # Added RESEND_API_KEY
├── EMAIL_SETUP.md                      # Complete setup guide
└── EMAIL_REFERENCE.md                  # This file
```

## Key Code Snippets

### Send Email from Anywhere

```typescript
// Send any email type
fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'user@example.com',
    type: 'welcome', // or 'limit-warning', 'limit-reached', 'promo-redeemed', 'weekly-digest'
    data: {
      userName: 'John',
      // ... other template-specific data
    },
  }),
});
```

### Check Email Preferences

```typescript
import { useEmailPreferences } from '@/hooks/useEmailPreferences';

const { isEmailEnabled } = useEmailPreferences();

if (isEmailEnabled('limit-warning')) {
  // Send limit warning email
}
```

### Manual Email Trigger

```typescript
import { sendEmail } from '@/lib/email';

await sendEmail({
  to: 'user@example.com',
  type: 'weekly-digest',
  data: {
    userName: 'Derek',
    totalTransformations: 47,
    favoritePrompts: ['zombie', 'Van Gogh'],
    topImages: [
      {
        originalUrl: 'https://...',
        transformedUrl: 'https://...',
        prompt: 'turn into zombie',
      },
    ],
    weekStart: 'Oct 15, 2025',
    weekEnd: 'Oct 22, 2025',
  },
});
```

## Email Template Data Requirements

### Welcome Email
```typescript
{
  userName?: string,
  userEmail: string
}
```

### Limit Warning Email
```typescript
{
  userName?: string,
  remainingImages: number
}
```

### Limit Reached Email
```typescript
{
  userName?: string,
  resetTime: string  // e.g., "in 8 hours"
}
```

### Promo Code Redeemed Email
```typescript
{
  userName?: string,
  promoCode: string,
  tier: string
}
```

### Weekly Digest Email
```typescript
{
  userName?: string,
  totalTransformations: number,
  favoritePrompts: string[],
  topImages?: Array<{
    originalUrl: string,
    transformedUrl: string,
    prompt: string
  }>,
  weekStart: string,  // e.g., "Oct 15, 2025"
  weekEnd: string     // e.g., "Oct 22, 2025"
}
```

## Integration Triggers

### Welcome Email
**File:** `C:\Users\derek\OneDrive\Desktop\nano\components\AuthButton.tsx`
**Line:** ~15-42
**Trigger:** New user signs up (within 60 seconds of account creation)

### Limit Warning Email
**File:** `C:\Users\derek\OneDrive\Desktop\nano\hooks\useImageTracking.ts`
**Line:** ~117-122
**Trigger:** User generates 15th image (5 remaining on free tier)

### Limit Reached Email
**File:** `C:\Users\derek\OneDrive\Desktop\nano\hooks\useImageTracking.ts`
**Line:** ~125-147
**Trigger:** User generates 20th image (daily limit reached)

### Promo Code Redeemed Email
**File:** `C:\Users\derek\OneDrive\Desktop\nano\hooks\usePromoCode.ts`
**Line:** ~100-117
**Trigger:** User successfully redeems promo code

## Environment Variables

Add to `.env.local`:

```bash
# Resend API Key
RESEND_API_KEY=re_your_api_key_here
```

Get API key from: https://resend.com/api-keys

## Testing Commands

### Test Welcome Email
```bash
# 1. Sign out if logged in
# 2. Sign up with new email at http://localhost:3000
# 3. Check inbox
```

### Test via API
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "type": "welcome",
    "data": {
      "userName": "Test",
      "userEmail": "your-email@example.com"
    }
  }'
```

### Preview Templates Locally
```bash
cd C:\Users\derek\OneDrive\Desktop\nano\emails
npm run dev
# Opens at http://localhost:3000
```

## Email Preferences URLs

- **Manage Preferences:** https://pic-forge.com/email-preferences
- **Unsubscribe:** https://pic-forge.com/email-preferences (then click "Unsubscribe All")

## Database Schema

New table added to InstantDB:

```typescript
emailPreferences: {
  id: string;
  userId: string;
  welcomeEmails: boolean;      // Default: true
  limitWarnings: boolean;      // Default: true
  weeklyDigests: boolean;      // Default: true
  marketingEmails: boolean;    // Default: false
  updatedAt: number;
}
```

## Common Issues & Solutions

### Issue: Email not sending
**Solution:** Check `.env.local` has correct `RESEND_API_KEY`

### Issue: Email goes to spam
**Solution:** Verify domain at https://resend.com/domains

### Issue: Wrong email content
**Solution:** Check template data matches requirements above

### Issue: User gets duplicate emails
**Solution:** Email hooks prevent duplicates in same session automatically

## Admin Panel Integration (Future)

For sending weekly digests manually:

```typescript
// In admin panel
const sendWeeklyDigestsToAllUsers = async () => {
  const users = await getAllActiveUsers();

  for (const user of users) {
    const stats = await getUserWeeklyStats(user.id);

    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: user.email,
        type: 'weekly-digest',
        data: {
          userName: user.name,
          totalTransformations: stats.count,
          favoritePrompts: stats.favorites,
          topImages: stats.topImages,
          weekStart: getWeekStart(),
          weekEnd: getWeekEnd(),
        },
      }),
    });
  }
};
```

## Performance Notes

- All emails send asynchronously (non-blocking)
- No impact on user-facing page load times
- Emails queue in background using Resend's infrastructure
- Duplicate prevention via `useRef` in hooks

## Brand Guidelines for Future Templates

When creating new email templates:

1. **Colors:** Black (#000), White (#fff), Teal (#14b8a6)
2. **Tone:** Edgy, direct, NOT corporate
3. **Headlines:** Bold, punchy statements
4. **CTAs:** Action-oriented ("Start Creating", not "Click Here")
5. **Footer:** Always include unsubscribe link
6. **Mobile:** Test on mobile devices (50%+ users on mobile)

## Next Steps

1. **Get Resend API Key** - Sign up at https://resend.com
2. **Add to .env.local** - Copy key to environment variables
3. **Verify Domain** - Set up SPF/DKIM records
4. **Test Emails** - Send test emails to verify setup
5. **Monitor Logs** - Check Resend dashboard for delivery stats

## Support

- **Resend Docs:** https://resend.com/docs
- **React Email Docs:** https://react.email/docs
- **Issue Tracker:** GitHub (if using git)
- **Direct Contact:** derek.bobola@gmail.com
