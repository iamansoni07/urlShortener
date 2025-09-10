import type { ShortUrl, ClickData } from "./types"

// In-memory database for simplicity
class Database {
  private urls: Map<string, ShortUrl> = new Map()
  private urlsByCode: Map<string, string> = new Map()

  createShortUrl(shortUrl: ShortUrl): void {
    this.urls.set(shortUrl.id, shortUrl)
    this.urlsByCode.set(shortUrl.shortCode, shortUrl.id)
  }

  getShortUrlByCode(shortCode: string): ShortUrl | null {
    const id = this.urlsByCode.get(shortCode)
    if (!id) return null
    return this.urls.get(id) || null
  }

  getShortUrlById(id: string): ShortUrl | null {
    return this.urls.get(id) || null
  }

  getAllShortUrls(): ShortUrl[] {
    return Array.from(this.urls.values())
  }

  shortCodeExists(shortCode: string): boolean {
    return this.urlsByCode.has(shortCode)
  }

  addClick(shortCode: string, clickData: ClickData): boolean {
    const shortUrl = this.getShortUrlByCode(shortCode)
    if (!shortUrl) return false

    shortUrl.clicks.push(clickData)
    shortUrl.clickCount++
    return true
  }

  updateShortUrl(shortUrl: ShortUrl): void {
    this.urls.set(shortUrl.id, shortUrl)
  }
}

export const db = new Database()
