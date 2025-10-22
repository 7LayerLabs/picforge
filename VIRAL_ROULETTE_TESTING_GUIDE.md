# Transform Roulette - Viral Gamification Testing Guide

## Pre-Launch Checklist

### 1. Local Development Testing

**Start dev server:**
```bash
cd C:\Users\derek\OneDrive\Desktop\nano
npm run dev
```

**Navigate to:**
```
http://localhost:3000/roulette
```

### 2. User Flow Testing

#### A. First-Time User (Not Logged In)
1. Upload an image
2. Click "SPIN THE WHEEL!"
3. Watch wheel animation (should take 3 seconds)
4. See progressive reveal overlay:
   - "Transformation Incoming..." (2 sec)
   - Category + prompt reveal (2 sec)
   - "Transformation Complete!" (0.5 sec)
5. View transformation result
6. Click share button - should see enhanced share modal
7. Try downloading branded image

**Expected Behavior:**
- Stats show: 0 streak, 0 achievements
- Streak badge shows "Start Your Streak!"
- No user-specific data stored
- Can still spin and use features

#### B. Logged-In User Journey
1. Sign in (click "Sign In" in navigation)
2. Complete authentication flow
3. Upload image and spin
4. After transformation:
   - Check if achievement toast appears (should get "First Spin")
   - View streak badge (should show 1 day streak)
   - Check stats cards at bottom
5. Click "Achievements" button in header
   - Verify "First Spin" is unlocked
   - Check that other achievements show progress
6. Spin again:
   - Should get "Getting Started" at 5 spins
   - Streak should remain at 1 (same day)
7. Click "Leaderboard" button
   - Verify leaderboard shows your spins
   - Check all 3 tabs work

#### C. Multi-Day Streak Testing (Manual)
**Day 1:**
- Sign in and spin
- Note streak: 1 day
- Close app

**Day 2:**
- Sign in and spin
- Verify streak: 2 days
- Streak badge should show "STARTING" (teal)

**Day 3:**
- Sign in and spin
- Verify streak: 3 days
- Should unlock "Hot Streak" achievement
- Streak badge should show "HEATING UP" (yellow)
- Should see warning if you haven't spun today

**Day 4-6:**
- Continue daily spins
- Streak badge updates color

**Day 7:**
- Should unlock "Lucky 7" achievement
- Streak badge shows "ON FIRE" (orange)

**Miss a day:**
- Streak resets to 1
- Longest streak preserved
- Should see "Spin today or lose your streak!" warning

### 3. Feature Testing

#### Rare Transformations (5% chance)
The following 20 prompts are marked as "rare":
- "Transform into Banksy street art"
- "Make it look like Salvador Dali painting"
- "Turn this into a Marvel superhero poster"
- "Transform into Wes Anderson symmetrical style"
- "Make it look like The Matrix green tint"
- "Transform into Studio Ghibli animation"
- "Turn into Christopher Nolan epic scene"
- "Make it look like ancient Egypt"
- "Transform to the year 3000"
- "Add dragons flying overhead"
- "Turn this into a zombie apocalypse"
- "Make it look like it's melting"
- "Replace everyone with rubber ducks"
- "Make it rain tacos"
- "Transform into Matrix digital rain"
- "Add alien invasion chaos"
- "Turn everything into candy"
- "Make it look like Tron grid world"
- "Add northern lights aurora"
- "Transform into hologram projection effect"

**To test rare finds:**
- Keep spinning until you hit one (average: 20 spins)
- Should see "RARE TRANSFORMATION!" in progressive reveal
- Result should show gold badge with "1 in 20 chance"
- Achievement "First Jackpot" should unlock

#### Achievement Modal
**Click "Achievements" button and verify:**
- Shows total count (e.g., "2/16")
- Overall progress bar updates
- 3 tabs: All, Unlocked, Locked
- Unlocked achievements have checkmark and gold background
- Locked achievements show progress bar
- Each shows reward amount

#### Leaderboard
**Click "Leaderboard" button and verify:**
- 3 tabs: Most Popular, Top Streaks, Most Active
- Crown icon for #1, Silver medal for #2, Bronze for #3
- Your rank shows at bottom if applicable
- Real-time updates (spin again and see your position update)

#### Share Modal
**Click share button after transformation:**
- Preview shows image thumbnail
- Share text includes category, prompt, streak
- Native share works on mobile
- Copy to clipboard works
- Twitter/Facebook share opens new window
- Download branded image creates 1080x1080 canvas with branding

#### Streak Badge
**Verify all states:**
- 0 streak: Shows "Start Your Streak!"
- 1-2 days: Teal, "STARTING"
- 3-6 days: Yellow, "HEATING UP"
- 7-13 days: Orange, "ON FIRE", 3 flames lit
- 14-29 days: Red, "UNSTOPPABLE", 4 flames lit
- 30+ days: Purple, "LEGENDARY", 5 flames lit
- Shows longest streak vs current
- Progress bar to next milestone
- Warning if not spun today

### 4. Edge Cases

#### No Internet Connection
- Should show error gracefully
- Can still use client-side transforms
- Data syncs when connection restored

#### Multiple Rapid Spins
- Should prevent button spam
- Only one spin at a time
- Queue properly handles rapid clicks

#### Achievement Unlock During Transformation
- Toast appears after transformation complete
- Doesn't block user interaction
- Multiple achievements queue properly

#### Streak at Midnight
- Last spin date uses browser timezone
- Handles daylight saving time
- Streak persists across sessions

### 5. Performance Testing

**Load Testing:**
- Upload large image (5MB+) - should resize
- Rapid fire 10 spins - should handle queue
- Switch tabs during processing - should continue
- Refresh page during spin - should reset cleanly

**Mobile Testing:**
- Responsive design on mobile
- Touch interactions work
- Share modal fits screen
- Wheel spins smoothly
- Animations don't lag

### 6. Data Integrity Testing

**InstantDB Verification:**
1. Open browser console
2. Check Network tab for InstantDB calls
3. Verify data being saved:
   - `rouletteStreaks` - updated after each spin
   - `rouletteAchievements` - added when unlocked
   - `rouletteSpins` - full history logged
4. Check that data persists across page refreshes
5. Verify real-time sync (open in 2 tabs, spin in one, see update in other)

**Achievement Rewards:**
1. Note current image count
2. Unlock achievement
3. Verify bonus images added to account
4. Check that reward only granted once per achievement

### 7. Analytics Verification

**Google Analytics Events:**
Check that these fire:
- `roulette_spinned` - on each spin
- `achievement_unlocked` - when achievement earned
- `share_initiated` - when share modal opened
- `download_clicked` - when download button clicked

**Track these metrics:**
- Session duration on roulette page
- Spins per session
- Share conversion rate
- Achievement unlock rate
- Daily active users
- Streak retention

### 8. Visual/UI Testing

**Check all visual elements:**
- Wheel rotates smoothly
- Colors match brand (purple/pink/teal)
- Icons render correctly
- Modal overlays work
- Animations are smooth (60fps)
- Typography is consistent
- Buttons have hover states
- Loading states are clear

**Accessibility:**
- Keyboard navigation works
- Screen reader compatibility
- Sufficient color contrast
- Focus indicators visible
- Alt text on images

### 9. Browser Compatibility

Test on:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Mobile Chrome (Android)

**Known Issues:**
- Native share API only works on mobile
- Canvas download may fail on older browsers
- Sound effects require user interaction first

### 10. Production Deployment Checklist

Before deploying:
- [ ] All tests pass
- [ ] No console errors
- [ ] InstantDB App ID configured
- [ ] Environment variables set
- [ ] Google Analytics tracking verified
- [ ] Mobile responsive verified
- [ ] Share links tested
- [ ] Achievement rewards confirmed
- [ ] Leaderboard populating
- [ ] Streak calculation accurate

After deploying:
- [ ] Smoke test on production URL
- [ ] Monitor error logs
- [ ] Check analytics dashboard
- [ ] Test share links publicly
- [ ] Verify database writes
- [ ] Monitor API usage
- [ ] Check page load speed

## Common Issues & Solutions

### Issue: Achievements not unlocking
**Solution:** Check InstantDB permissions, verify user is logged in, check console for errors

### Issue: Streak not updating
**Solution:** Verify date comparison logic, check timezone handling, confirm database writes

### Issue: Share modal not opening
**Solution:** Check for JavaScript errors, verify modal component imports, test browser compatibility

### Issue: Leaderboard empty
**Solution:** Need at least one spin with images, verify query syntax, check database schema

### Issue: Rare transformations not appearing
**Solution:** Verify `isRarePrompt()` function, check RARE_PROMPTS array, confirm 5% logic

### Issue: Performance lag
**Solution:** Optimize image sizes, reduce animation complexity, implement lazy loading

## Success Metrics to Monitor

**Daily:**
- Total spins
- Active users
- Achievement unlock rate
- Share count

**Weekly:**
- 3+ day streak retention
- 7+ day streak retention
- Viral coefficient (K-factor)
- New user acquisition

**Monthly:**
- 30+ day streak count
- All achievements unlocked count
- Top leaderboard positions
- User lifetime value

## Feedback Collection

**User testing questions:**
1. How clear is the achievement system?
2. Do streaks motivate daily use?
3. Is the leaderboard competitive/fun?
4. Are rare finds exciting enough?
5. Is sharing easy and desirable?
6. What features feel missing?
7. Any confusing UI elements?
8. Performance issues noticed?

---

## Quick Test Script

```javascript
// Paste in browser console to verify InstantDB connection
console.log('Testing InstantDB connection...')
const { db } = await import('./lib/instantdb')
const { data } = db.useQuery({ rouletteStreaks: {} })
console.log('Streak data:', data)
```

## Done!
All viral gamification features are ready for testing. Focus on:
1. Streak preservation (most critical)
2. Achievement unlocking (user delight)
3. Share flow (viral growth)
4. Performance (user retention)
