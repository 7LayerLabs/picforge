// VIP Code System for unlimited access
// Store codes in environment variables or directly here for family/friends

const VIP_CODES = [
  'FAMILY2024',      // For family members
  'PICFORGE-VIP',    // General VIP code
  'BETA-TESTER',     // For beta testers
  'DEREK-SON',       // Specific for your son
  // Add more codes as needed
]

// You can also use environment variable for more security
// const VIP_CODES = process.env.VIP_CODES?.split(',') || []

export function isVIPCode(code: string): boolean {
  if (!code) return false
  return VIP_CODES.includes(code.toUpperCase().trim())
}

export function getVIPCodeFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(';').map(c => c.trim())
  const vipCookie = cookies.find(c => c.startsWith('vip_code='))

  if (vipCookie) {
    const code = vipCookie.split('=')[1]
    return isVIPCode(code) ? code : null
  }

  return null
}

export function setVIPCookie(code: string): string {
  // Set cookie for 1 year
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1)
  return `vip_code=${code}; Path=/; Expires=${expires.toUTCString()}; SameSite=Strict`
}