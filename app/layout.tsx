import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PicForge - AI Image Transformer",
  description: "Forge your images into art. Transform and reshape pictures with AI-powered creativity.",
  metadataBase: new URL('https://pic-forge.com'),
  openGraph: {
    title: 'PicForge - AI Image Transformer',
    description: 'Forge your images into art with AI-powered creativity',
    url: 'https://pic-forge.com',
    siteName: 'PicForge',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'PicForge - AI Image Transformer',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PicForge - AI Image Transformer',
    description: 'Forge your images into art with AI-powered creativity',
    images: ['/og-image.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
