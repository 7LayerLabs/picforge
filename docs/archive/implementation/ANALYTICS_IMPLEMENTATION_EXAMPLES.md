# Analytics Implementation Examples

Real-world examples of implementing GA4 tracking in PicForge components.

## Table of Contents
- [Main Editor Component](#main-editor-component)
- [Prompts Library](#prompts-library)
- [Batch Processor](#batch-processor)
- [User Authentication](#user-authentication)
- [Pricing & Upgrades](#pricing--upgrades)
- [Social Sharing](#social-sharing)
- [Navigation & UI](#navigation--ui)

---

## Main Editor Component

### Complete Image Transformation Flow

```typescript
'use client';

import { useState } from 'react';
import {
  trackImageTransformation,
  trackPromptUsage,
  trackDownload,
  trackError,
  trackButtonClick,
} from '@/lib/analytics';

export default function ImageEditor() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransform = async () => {
    // Track button click
    trackButtonClick('transform_image', 'main_editor', {
      has_prompt: !!prompt,
      is_locked: isLocked,
    });

    const startTime = performance.now();
    setIsProcessing(true);

    try {
      // Get image file size
      const imageSize = image ? new Blob([image]).size : 0;

      // Process image
      const result = await processImage({
        image,
        prompt: isLocked ? `${prompt} (don't change anything else)` : prompt,
      });

      const processingTime = performance.now() - startTime;

      // Track successful transformation
      trackImageTransformation({
        prompt_category: getPromptCategory(prompt),
        prompt_title: prompt,
        locked_composition: isLocked,
        is_nsfw: false,
        processing_time: processingTime,
        image_size: imageSize,
      });

      // Track prompt usage
      trackPromptUsage({
        prompt_category: getPromptCategory(prompt),
        prompt_title: prompt,
        source: 'custom',
      });

      setImage(result);
    } catch (error) {
      // Track error
      trackError({
        error_type: 'transformation_failed',
        error_message: error.message,
        page_path: '/editor',
      });

      alert('Failed to transform image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    // Track download
    trackDownload('main_editor');

    // Trigger download
    const link = document.createElement('a');
    link.href = image!;
    link.download = `picforge-${Date.now()}.png`;
    link.click();
  };

  return (
    <div>
      {/* Image upload */}
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      {/* Prompt input */}
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your transformation..."
      />

      {/* Lock composition toggle */}
      <label>
        <input
          type="checkbox"
          checked={isLocked}
          onChange={(e) => {
            setIsLocked(e.target.checked);
            trackButtonClick('toggle_lock', 'main_editor', {
              enabled: e.target.checked,
            });
          }}
        />
        Lock composition
      </label>

      {/* Transform button */}
      <button onClick={handleTransform} disabled={isProcessing || !image}>
        {isProcessing ? 'Processing...' : 'Transform'}
      </button>

      {/* Download button */}
      {image && (
        <button onClick={handleDownload}>
          Download
        </button>
      )}
    </div>
  );
}

// Helper function to categorize prompts
function getPromptCategory(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('van gogh') || lowerPrompt.includes('picasso')) {
    return 'Art Styles';
  }
  if (lowerPrompt.includes('zombie') || lowerPrompt.includes('fantasy')) {
    return 'Fantasy';
  }
  if (lowerPrompt.includes('photo') || lowerPrompt.includes('portrait')) {
    return 'Pro Photography';
  }

  return 'Custom';
}
```

---

## Prompts Library

### Search and Filter Implementation

```typescript
'use client';

import { useState, useEffect } from 'react';
import {
  trackPromptSearch,
  trackFilterUsage,
  trackFavoritePrompt,
  trackPromptUsage,
  trackButtonClick,
} from '@/lib/analytics';
import { allPrompts } from '@/lib/prompts';

export default function PromptsLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredPrompts, setFilteredPrompts] = useState(allPrompts);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Track search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        const results = filterPrompts(searchQuery, selectedCategory);

        trackPromptSearch(searchQuery, results.length, {
          category: selectedCategory,
        });

        setFilteredPrompts(results);
      } else {
        setFilteredPrompts(
          selectedCategory
            ? allPrompts.filter(p => p.category === selectedCategory)
            : allPrompts
        );
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);

    // Track filter usage
    const results = filterPrompts(searchQuery, category);
    trackFilterUsage('category', category, results.length);
  };

  const handleFavorite = (prompt: any) => {
    const isFavorited = favorites.includes(prompt.id);

    if (isFavorited) {
      setFavorites(favorites.filter(id => id !== prompt.id));
    } else {
      setFavorites([...favorites, prompt.id]);
    }

    // Track favorite action
    trackFavoritePrompt(
      prompt.title,
      prompt.category,
      isFavorited ? 'remove' : 'add'
    );
  };

  const handleUsePrompt = (prompt: any) => {
    // Track prompt usage
    trackPromptUsage({
      prompt_category: prompt.category,
      prompt_title: prompt.title,
      source: 'library',
    });

    // Copy to clipboard
    navigator.clipboard.writeText(prompt.text);

    // Navigate to editor
    window.location.href = `/?prompt=${encodeURIComponent(prompt.text)}`;
  };

  return (
    <div>
      {/* Search bar */}
      <input
        type="search"
        placeholder="Search prompts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Category filters */}
      <div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={selectedCategory === cat ? 'active' : ''}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prompts grid */}
      <div className="grid">
        {filteredPrompts.map(prompt => (
          <div key={prompt.id} className="prompt-card">
            <h3>{prompt.title}</h3>
            <p>{prompt.description}</p>

            {/* Favorite button */}
            <button
              onClick={() => handleFavorite(prompt)}
              aria-label="Favorite"
            >
              {favorites.includes(prompt.id) ? '❤️' : '🤍'}
            </button>

            {/* Use prompt button */}
            <button onClick={() => handleUsePrompt(prompt)}>
              Use Prompt
            </button>
          </div>
        ))}
      </div>

      {/* Results count */}
      <p>{filteredPrompts.length} prompts found</p>
    </div>
  );
}

function filterPrompts(query: string, category: string | null) {
  let results = allPrompts;

  if (category) {
    results = results.filter(p => p.category === category);
  }

  if (query) {
    results = results.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  return results;
}
```

---

## Batch Processor

### Bulk Image Processing with Progress Tracking

```typescript
'use client';

import { useState } from 'react';
import {
  trackBatchProcess,
  trackDownload,
  trackError,
  trackButtonClick,
} from '@/lib/analytics';

export default function BatchProcessor() {
  const [images, setImages] = useState<File[]>([]);
  const [effect, setEffect] = useState('sharpen');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProcess = async () => {
    // Track start of batch processing
    trackButtonClick('start_batch_process', 'batch_processor', {
      image_count: images.length,
      effect,
    });

    setIsProcessing(true);
    setProgress(0);

    const startTime = performance.now();

    try {
      const results = [];

      // Process each image
      for (let i = 0; i < images.length; i++) {
        const result = await processImage(images[i], effect);
        results.push(result);
        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      const processingTime = performance.now() - startTime;

      // Track successful batch processing
      trackBatchProcess(
        images.length,
        effect,
        false // is_nsfw
      );

      console.log(`Processed ${images.length} images in ${processingTime}ms`);

      // Show results
      showResults(results);
    } catch (error) {
      // Track error
      trackError({
        error_type: 'batch_processing_failed',
        error_message: error.message,
        page_path: '/batch',
      });

      alert('Failed to process images');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDownloadAll = () => {
    // Track download
    trackDownload('batch');

    // Download all images as ZIP
    downloadAsZip(images);
  };

  return (
    <div>
      {/* File upload */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(Array.from(e.target.files || []))}
      />

      {/* Effect selector */}
      <select value={effect} onChange={(e) => setEffect(e.target.value)}>
        <option value="sharpen">Sharpen</option>
        <option value="blur">Blur</option>
        <option value="sepia">Sepia</option>
        <option value="grayscale">Grayscale</option>
      </select>

      {/* Process button */}
      <button
        onClick={handleProcess}
        disabled={images.length === 0 || isProcessing}
      >
        {isProcessing ? `Processing ${progress}%` : 'Process All'}
      </button>

      {/* Download all button */}
      {images.length > 0 && !isProcessing && (
        <button onClick={handleDownloadAll}>
          Download All ({images.length})
        </button>
      )}

      {/* Preview grid */}
      <div className="grid">
        {images.map((img, i) => (
          <img key={i} src={URL.createObjectURL(img)} alt={`Image ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
```

---

## User Authentication

### Signup and Login Tracking

```typescript
'use client';

import { useEffect } from 'react';
import { init, tx, id } from '@instantdb/react';
import {
  trackSignUp,
  trackSignIn,
  setUserProperties,
  trackError,
} from '@/lib/analytics';

const db = init({ appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID! });

export default function AuthButton() {
  const { user, isLoading } = db.useAuth();

  // Track user properties when user changes
  useEffect(() => {
    if (user) {
      // Get user data from InstantDB
      const userData = db.useQuery({ users: { $: { where: { email: user.email } } } });

      if (userData.data?.users?.[0]) {
        const userRecord = userData.data.users[0];

        // Set GA4 user properties
        setUserProperties({
          user_tier: userRecord.tier || 'free',
          has_generated_images: userRecord.imageCount > 0,
          total_transformations: userRecord.imageCount,
          registration_date: userRecord.createdAt,
        });
      }
    }
  }, [user]);

  const handleSignIn = async () => {
    try {
      await db.auth.sendMagicCode({ email: 'user@example.com' });

      // Track sign in attempt
      trackSignIn('magic_link');
    } catch (error) {
      trackError({
        error_type: 'auth_signin_failed',
        error_message: error.message,
        page_path: window.location.pathname,
      });
    }
  };

  const handleSignUp = async () => {
    try {
      await db.auth.sendMagicCode({ email: 'newuser@example.com' });

      // Track sign up attempt
      trackSignUp('magic_link');
    } catch (error) {
      trackError({
        error_type: 'auth_signup_failed',
        error_message: error.message,
        page_path: window.location.pathname,
      });
    }
  };

  const handleSignOut = async () => {
    await db.auth.signOut();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <>
          <button onClick={handleSignIn}>Sign In</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </>
      )}
    </div>
  );
}
```

---

## Pricing & Upgrades

### Conversion Funnel Tracking

```typescript
'use client';

import { useState } from 'react';
import {
  trackUpgradeClick,
  trackPromoCodeRedemption,
  trackTierChange,
  trackButtonClick,
  trackEnhancedConversion,
  trackModalOpen,
} from '@/lib/analytics';
import { usePromoCode } from '@/hooks/usePromoCode';

export default function PricingPage() {
  const { redeemCode } = usePromoCode();
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const handleUpgradeClick = (tier: 'pro' | 'yearly') => {
    // Track upgrade click
    trackUpgradeClick({
      source: 'pricing_page',
      tier_clicked: tier,
    });

    // Track button click
    trackButtonClick(`upgrade_${tier}`, 'pricing_page', {
      monthly_price: tier === 'pro' ? 9.99 : 7.49,
    });

    // Redirect to Stripe checkout
    window.location.href = `/api/checkout?tier=${tier}`;
  };

  const handlePromoRedeem = async () => {
    try {
      const result = await redeemCode(promoCode);

      if (result.success) {
        // Track promo code redemption
        trackPromoCodeRedemption({
          code_tier: result.tier,
          code_type: result.type,
        });

        // Track tier change
        trackTierChange(
          'free',
          result.tier,
          'promo_code'
        );

        // Track conversion
        trackEnhancedConversion('upgrade', 0, {
          method: 'promo_code',
          tier: result.tier,
        });

        alert('Promo code redeemed successfully!');
        setShowPromoModal(false);
      } else {
        alert('Invalid promo code');
      }
    } catch (error) {
      alert('Failed to redeem code');
    }
  };

  const openPromoModal = () => {
    trackModalOpen('promo_code_modal', 'pricing_page');
    setShowPromoModal(true);
  };

  return (
    <div className="pricing">
      <h1>Choose Your Plan</h1>

      {/* Free Tier */}
      <div className="tier">
        <h2>Free</h2>
        <p>20 images per day</p>
        <button disabled>Current Plan</button>
      </div>

      {/* Pro Tier */}
      <div className="tier">
        <h2>Pro</h2>
        <p>$9.99/month</p>
        <p>Unlimited images</p>
        <button onClick={() => handleUpgradeClick('pro')}>
          Upgrade to Pro
        </button>
      </div>

      {/* Yearly Tier */}
      <div className="tier">
        <h2>Pro Yearly</h2>
        <p>$89.99/year</p>
        <p>Save 25%</p>
        <button onClick={() => handleUpgradeClick('yearly')}>
          Upgrade to Yearly
        </button>
      </div>

      {/* Promo code button */}
      <button onClick={openPromoModal}>
        Have a promo code?
      </button>

      {/* Promo code modal */}
      {showPromoModal && (
        <div className="modal">
          <h3>Redeem Promo Code</h3>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
          />
          <button onClick={handlePromoRedeem}>Redeem</button>
          <button onClick={() => setShowPromoModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
```

---

## Social Sharing

### Share Modal with Platform Tracking

```typescript
'use client';

import { useState } from 'react';
import {
  trackSocialShare,
  trackModalOpen,
  trackButtonClick,
} from '@/lib/analytics';

interface ShareModalProps {
  imageUrl: string;
  beforeUrl?: string;
  onClose: () => void;
}

export default function ShareModal({ imageUrl, beforeUrl, onClose }: ShareModalProps) {
  const contentType = beforeUrl ? 'before_after' : 'single';

  // Track modal open on mount
  useEffect(() => {
    trackModalOpen('share_modal', 'gallery');
  }, []);

  const handleShare = (platform: 'twitter' | 'instagram' | 'tiktok') => {
    // Track social share
    trackSocialShare({
      platform,
      content_type: contentType,
    });

    // Track button click
    trackButtonClick(`share_${platform}`, 'share_modal', {
      content_type: contentType,
    });

    // Platform-specific sharing
    switch (platform) {
      case 'twitter':
        const twitterText = 'Check out this AI transformation! 🎨 #PicForge #AIArt';
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(imageUrl)}`,
          '_blank'
        );
        break;

      case 'instagram':
        // Instagram doesn't have URL sharing, so copy image link
        navigator.clipboard.writeText(imageUrl);
        alert('Image link copied! Paste in Instagram bio or story.');
        break;

      case 'tiktok':
        // TikTok sharing
        alert('Download and upload to TikTok with #PicForge');
        break;
    }
  };

  const handleDownload = () => {
    // Track download as share action
    trackSocialShare({
      platform: 'download',
      content_type: contentType,
    });

    // Download image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `picforge-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Share Your Creation</h2>

        {/* Image preview */}
        {beforeUrl ? (
          <div className="before-after">
            <img src={beforeUrl} alt="Before" />
            <img src={imageUrl} alt="After" />
          </div>
        ) : (
          <img src={imageUrl} alt="Result" />
        )}

        {/* Share buttons */}
        <div className="share-buttons">
          <button onClick={() => handleShare('twitter')}>
            Share on Twitter
          </button>
          <button onClick={() => handleShare('instagram')}>
            Share on Instagram
          </button>
          <button onClick={() => handleShare('tiktok')}>
            Share on TikTok
          </button>
          <button onClick={handleDownload}>
            Download Image
          </button>
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
```

---

## Navigation & UI

### Navigation Menu Tracking

```typescript
'use client';

import Link from 'next/link';
import { trackNavigation } from '@/lib/analytics';

export default function Navigation() {
  const handleNavClick = (item: string, destination: string) => {
    trackNavigation(item, destination);
  };

  return (
    <nav>
      <Link
        href="/"
        onClick={() => handleNavClick('home', '/')}
      >
        Home
      </Link>

      <Link
        href="/prompts"
        onClick={() => handleNavClick('prompts_library', '/prompts')}
      >
        Prompts Library
      </Link>

      <Link
        href="/batch"
        onClick={() => handleNavClick('batch_processor', '/batch')}
      >
        Batch Processor
      </Link>

      <Link
        href="/canvas"
        onClick={() => handleNavClick('ai_canvas', '/canvas')}
      >
        AI Canvas
      </Link>

      <Link
        href="/roulette"
        onClick={() => handleNavClick('transform_roulette', '/roulette')}
      >
        Roulette
      </Link>

      <Link
        href="/pricing"
        onClick={() => handleNavClick('pricing', '/pricing')}
      >
        Pricing
      </Link>
    </nav>
  );
}
```

---

## Scroll Depth Tracking

### Automatic Scroll Tracking

```typescript
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackScrollDepth } from '@/lib/analytics';

export default function ScrollTracker() {
  const pathname = usePathname();

  useEffect(() => {
    let maxScrollPercentage = 0;
    const milestones = [25, 50, 75, 100];
    const trackedMilestones = new Set<number>();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / docHeight) * 100);

      // Update max scroll
      if (scrollPercentage > maxScrollPercentage) {
        maxScrollPercentage = scrollPercentage;

        // Check if we've hit a milestone
        for (const milestone of milestones) {
          if (
            scrollPercentage >= milestone &&
            !trackedMilestones.has(milestone)
          ) {
            trackScrollDepth(pathname, milestone);
            trackedMilestones.add(milestone);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return null; // No UI, just tracking
}

// Add to layout.tsx:
// <ScrollTracker />
```

---

## Engagement Time Tracking

### Track Time on Page

```typescript
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEngagementTime } from '@/lib/analytics';

export default function EngagementTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const startTime = Date.now();

    // Track engagement when user leaves page
    return () => {
      const engagementTime = Math.round((Date.now() - startTime) / 1000);

      // Only track if user spent more than 5 seconds
      if (engagementTime >= 5) {
        trackEngagementTime(pathname, engagementTime);
      }
    };
  }, [pathname]);

  return null; // No UI, just tracking
}

// Add to layout.tsx:
// <EngagementTracker />
```

---

## Error Boundary with Tracking

### Global Error Tracking

```typescript
'use client';

import { Component, ReactNode } from 'react';
import { trackError } from '@/lib/analytics';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Track error in GA4
    trackError({
      error_type: 'react_error_boundary',
      error_message: error.message,
      page_path: window.location.pathname,
    });

    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Something went wrong</h1>
          <p>We've been notified and are working on a fix.</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap app in layout.tsx:
// <ErrorBoundary>
//   {children}
// </ErrorBoundary>
```

---

## Testing Analytics

### Development Mode Testing

```typescript
// lib/analytics.ts - Add development mode helper

export const isAnalyticsEnabled = () => {
  // Only track in production, or if GA_DEBUG is enabled
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_GA_DEBUG === 'true'
  );
};

export const trackEvent = (
  eventName: GAEvent,
  eventParams?: Record<string, any>
) => {
  if (!isAnalyticsEnabled()) {
    console.log('[GA4 Dev]', eventName, eventParams);
    return;
  }

  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', eventName, {
    ...eventParams,
    timestamp: new Date().toISOString(),
  });
};
```

### Test Helper Component

```typescript
'use client';

import {
  trackImageTransformation,
  trackPromptUsage,
  trackSignUp,
  trackSocialShare,
} from '@/lib/analytics';

export default function AnalyticsTestPanel() {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded">
      <h3>Analytics Testing</h3>
      <button onClick={() => trackImageTransformation({
        prompt_category: 'Test',
        prompt_title: 'Test Prompt',
        locked_composition: false,
        is_nsfw: false,
      })}>
        Test Image Transform
      </button>
      <button onClick={() => trackSignUp('magic_link')}>
        Test Sign Up
      </button>
      <button onClick={() => trackSocialShare({
        platform: 'twitter',
        content_type: 'single',
      })}>
        Test Social Share
      </button>
    </div>
  );
}
```

---

**Last Updated**: October 22, 2025
