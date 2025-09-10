export interface ShortUrl {
  id: string
  originalUrl: string
  shortCode: string
  createdAt: Date
  expiresAt: Date
  clickCount: number
  clicks: ClickData[]
}

export interface ClickData {
  timestamp: Date
  referrer: string
  location: string
}

export interface CreateShortUrlRequest {
  url: string
  validity?: number
  shortcode?: string
}

export interface CreateShortUrlResponse {
  shortLink: string
  expiry: string
}

export interface StatsResponse {
  shortLink: string
  createdAt: string
  expiry: string
  clickCount: number
  clicks: Array<{
    timestamp: string
    referrer: string
    location: string
  }>
}
