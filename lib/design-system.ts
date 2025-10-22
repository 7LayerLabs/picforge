/**
 * PicForge Design System
 *
 * CRITICAL RULES - DO NOT VIOLATE:
 *
 * ❌ NEVER USE GRADIENTS - NO EXCEPTIONS ❌
 * - NO bg-gradient-to-*
 * - NO from-* to-* combinations
 * - NO linear-gradient, radial-gradient, conic-gradient
 * - Use solid colors ONLY: bg-purple-600, bg-teal-500, bg-gray-50, etc.
 *
 * Why? User explicitly banned all gradients from the entire application.
 * This is a hard requirement for the design aesthetic.
 */

// ========================================
// COLOR PALETTE - Solid Colors Only
// ========================================

export const colors = {
  // Primary Colors (Solid Only)
  purple: {
    50: 'bg-purple-50',
    100: 'bg-purple-100',
    500: 'bg-purple-500',
    600: 'bg-purple-600',   // Primary brand color
    700: 'bg-purple-700',
    800: 'bg-purple-800',
  },

  teal: {
    50: 'bg-teal-50',
    100: 'bg-teal-100',
    300: 'bg-teal-300',
    400: 'bg-teal-400',
    500: 'bg-teal-500',      // Secondary brand color
    600: 'bg-teal-600',
    700: 'bg-teal-700',
  },

  gray: {
    50: 'bg-gray-50',
    100: 'bg-gray-100',
    200: 'bg-gray-200',
    600: 'bg-gray-600',
    700: 'bg-gray-700',
    800: 'bg-gray-800',
    900: 'bg-gray-900',
  },

  white: 'bg-white',
  black: 'bg-black',
} as const;

// ========================================
// BUTTONS - Solid Backgrounds Only
// ========================================

export const buttonStyles = {
  primary: 'bg-teal-500 hover:bg-teal-600 text-white',
  secondary: 'bg-purple-600 hover:bg-purple-700 text-white',
  outline: 'border-2 border-gray-200 hover:border-teal-400 bg-white text-gray-900',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
} as const;

// ========================================
// CARDS - Solid Backgrounds Only
// ========================================

export const cardStyles = {
  white: 'bg-white border-2 border-gray-200',
  teal: 'bg-teal-50 border-2 border-teal-300',
  purple: 'bg-purple-600 border-2 border-purple-700',
  gray: 'bg-gray-50 border-2 border-gray-200',
} as const;

// ========================================
// TYPOGRAPHY
// ========================================

export const typography = {
  heading: {
    h1: 'text-5xl md:text-6xl font-bold text-gray-900',
    h2: 'text-4xl md:text-5xl font-bold text-gray-900',
    h3: 'text-2xl font-bold text-gray-900',
  },
  body: {
    large: 'text-xl md:text-2xl text-gray-700',
    base: 'text-base text-gray-700',
    small: 'text-sm text-gray-600',
  },
} as const;

// ========================================
// FORBIDDEN PATTERNS
// ========================================

/**
 * DO NOT USE:
 * - bg-gradient-to-r, bg-gradient-to-br, bg-gradient-to-*
 * - from-purple-500 to-teal-600 (or any from-* to-* combo)
 * - linear-gradient() in inline styles
 * - Any CSS gradient syntax
 *
 * ALWAYS USE:
 * - Solid background colors only
 * - Single color classes: bg-purple-600, bg-teal-500, etc.
 * - No exceptions, no special cases, no "just this once"
 */
