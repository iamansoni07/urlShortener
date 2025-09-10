import crypto from "crypto"

export const generateShortCode = (): string => {
  return crypto.randomBytes(3).toString("hex")
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isValidShortCode = (shortCode: string): boolean => {
  // Alphanumeric, 3-10 characters
  return /^[a-zA-Z0-9]{3,10}$/.test(shortCode)
}

export const getCoarseLocation = (ip: string): string => {
  // Simplified geo location - in real implementation, use a geo IP service
  // For demo purposes, return a mock location
  if (ip.startsWith("127.") || ip === "::1") {
    return "LOCAL"
  }
  return "IN" // Default to India for demo
}

export const formatDateISO = (date: Date): string => {
  return date.toISOString()
}
