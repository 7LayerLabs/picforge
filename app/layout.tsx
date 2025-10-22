import type { Metadata } from "next";
import { Special_Elite } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
// import AuthSessionProvider from "@/components/providers/SessionProvider";

const specialElite = Special_Elite({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Pic-Forge: (re)imagine everything",
    template: "%s | Pic-Forge: (re)imagine everything"
  },
  description: "Make them weird. Make them epic. Make them yours. 272+ AI templates, batch processing, and custom prompts. Zero artistic talent required. Nothing is real anymore.",
  keywords: [
    "AI image editor", "photo transformer", "image enhancement", "AI art generator",
    "batch image processing", "photo effects", "image filters", "AI creativity tools",
    "picture editor", "photo manipulation", "image transformation", "AI photo editor"
  ],
  authors: [{ name: "PicForge Team" }],
  creator: "PicForge",
  publisher: "PicForge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pic-forge.com'),
  alternates: {
    canonical: 'https://pic-forge.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icon.svg',
        color: '#ff6347',
      },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PicForge',
    startupImage: [
      {
        url: '/apple-icon.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      }
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pic-forge.com',
    siteName: 'PicForge',
    title: 'Pic-Forge: (re)imagine everything',
    description: 'Make them weird. Make them epic. Make them yours. 272+ AI templates. Zero artistic talent required. Nothing is real anymore.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pic-Forge: (re)imagine everything - Transform your images with AI',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@picforge',
    creator: '@picforge',
    title: 'Pic-Forge: (re)imagine everything',
    description: 'Make them weird. Make them epic. Make them yours. 272+ AI templates. Zero artistic talent required. Nothing is real anymore.',
    images: {
      url: '/og-image.png',
      alt: 'Pic-Forge: (re)imagine everything',
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, // Will be added to .env.local
    yandex: undefined, // Add if targeting Russian market
    yahoo: undefined,  // Add if needed
    other: {
      // Add other verification codes as needed
    },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PicForge",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "description": "Make them weird. Make them epic. Make them yours. 272+ AI templates, batch processing, and custom prompts. Zero artistic talent required.",
    "url": "https://pic-forge.com",
    "creator": {
      "@type": "Organization",
      "name": "PicForge Team"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free AI image transformation tool"
    },
    "featureList": [
      "AI-powered image transformation",
      "272+ pre-built templates",
      "Batch image processing",
      "Custom AI prompts",
      "Professional editing tools",
      "Lock composition feature",
      "Multiple export formats"
    ],
    "screenshot": "https://pic-forge.com/og-image.png"
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico?v=4" sizes="16x16 32x32 48x48" />
        <link rel="icon" href="/icon.svg?v=4" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=4" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=4" color="#D2691E" />
        <meta name="msapplication-TileColor" content="#ff6347" />
        <meta name="theme-color" content="#ff6347" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${specialElite.variable} font-body antialiased`}
      >
        {/* Google Analytics */}
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />

        {/* <AuthSessionProvider> */}
          <Navigation />
          {children}
          <Footer />
          <KeyboardShortcutsHelp />
          <Analytics />
        {/* </AuthSessionProvider> */}
      </body>
    </html>
  );
}
