'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initGA, trackPageView } from '@/lib/analytics';

interface GoogleAnalyticsProps {
  measurementId: string;
}

/**
 * Google Analytics component with Cookie Consent Support
 * Handles GA4 script loading and automatic page view tracking
 * Respects user cookie consent choice (GDPR compliant)
 */
export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  // Check cookie consent status
  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem('cookie-consent');
      setHasConsent(consent === 'accepted');
    };

    // Check initially
    checkConsent();

    // Listen for consent changes
    const handleStorageChange = () => checkConsent();
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Track page views on route change (only if consent given)
  useEffect(() => {
    if (!measurementId || !hasConsent) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams, measurementId, hasConsent]);

  // Don't render in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_GA_DEBUG) {
    return null;
  }

  if (!measurementId || measurementId === 'your_measurement_id_here') {
    console.warn('Google Analytics measurement ID not configured');
    return null;
  }

  // Don't load GA4 if user hasn't consented yet or declined
  if (hasConsent === null || hasConsent === false) {
    return null;
  }

  return (
    <>
      {/* Google Analytics gtag.js script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />

      {/* Initialize GA4 with consent mode */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Initialize consent mode (default: denied until user accepts)
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'ad_storage': 'denied',
              'personalization_storage': 'denied',
              'functionality_storage': 'granted',
              'security_storage': 'granted'
            });

            // Configure GA4
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              send_page_view: true,
              cookie_flags: 'SameSite=None;Secure',
              anonymize_ip: true, // GDPR requirement
            });
          `,
        }}
      />
    </>
  );
}
