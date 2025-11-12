'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie, Shield } from 'lucide-react';

/**
 * GDPR-compliant Cookie Consent Banner
 * Shows on first visit and stores user preference in localStorage
 * Only loads GA4 if user accepts cookies
 */
export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');

    if (!consent) {
      // Small delay to let page load first
      setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 100); // Animation delay
      }, 1000);
    } else if (consent === 'accepted') {
      // User previously accepted - initialize GA4
      initializeGA4();
    }
  }, []);

  const initializeGA4 = () => {
    // GA4 is already loaded via GoogleAnalytics component
    // This just sets a flag that tracking is allowed
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied', // We don't use ads
        personalization_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    initializeGA4();
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');

    // Disable GA4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        personalization_storage: 'denied',
        functionality_storage: 'denied',
        security_storage: 'granted',
      });
    }

    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
              <Cookie className="w-6 h-6 text-teal-600" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-heading text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                Your Privacy Matters
              </h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We use cookies to analyze site traffic and improve your experience. We never sell your data or use it for advertising.
              Your images are processed client-side and never stored on our servers.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="text-green-600 font-bold">✓</span> Analytics only
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-600 font-bold">✓</span> No advertising
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-600 font-bold">✓</span> No data selling
              </span>
              <Link
                href="/legal/privacy"
                className="text-teal-600 hover:text-teal-700 font-medium underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleDecline}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all border-2 border-gray-200 hover:border-gray-300"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Accept Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
