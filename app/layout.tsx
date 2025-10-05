import type { Metadata } from "next";
import { Special_Elite, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Analytics } from "@vercel/analytics/react";

const specialElite = Special_Elite({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  variable: "--font-body",
  subsets: ["latin"],
  display: 'swap',
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
        className={`${specialElite.variable} ${robotoMono.variable} font-body antialiased`}
      >
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
