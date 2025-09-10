import type { Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { db } from "../database"
import { Log } from "../../../logging-middleware/src/index"
import { generateShortCode, isValidUrl, isValidShortCode, getCoarseLocation, formatDateISO } from "../utils"
import type { CreateShortUrlRequest, CreateShortUrlResponse, StatsResponse, ShortUrl } from "../types"

export const createShortUrl = async (req: Request, res: Response) => {
  try {
    await Log("backend", "info", "controller", "Creating short URL")

    const { url, validity = 30, shortcode }: CreateShortUrlRequest = req.body

    // Validate URL
    if (!url || !isValidUrl(url)) {
      await Log("backend", "warn", "controller", "Invalid URL provided")
      return res.status(400).json({ error: "Invalid URL format" })
    }

    // Validate validity
    if (validity && (!Number.isInteger(validity) || validity <= 0)) {
      await Log("backend", "warn", "controller", "Invalid validity period")
      return res.status(400).json({ error: "Validity must be a positive integer" })
    }

    // Generate or validate shortcode
    let finalShortCode: string
    if (shortcode) {
      if (!isValidShortCode(shortcode)) {
        await Log("backend", "warn", "controller", "Invalid shortcode format")
        return res.status(400).json({ error: "Shortcode must be alphanumeric, 3-10 characters" })
      }
      if (db.shortCodeExists(shortcode)) {
        await Log("backend", "warn", "controller", "Shortcode already exists")
        return res.status(409).json({ error: "Shortcode already exists" })
      }
      finalShortCode = shortcode
    } else {
      // Generate unique shortcode
      do {
        finalShortCode = generateShortCode()
      } while (db.shortCodeExists(finalShortCode))
    }

    // Create short URL
    const now = new Date()
    const expiresAt = new Date(now.getTime() + validity * 60 * 1000)

    const shortUrl: ShortUrl = {
      id: uuidv4(),
      originalUrl: url,
      shortCode: finalShortCode,
      createdAt: now,
      expiresAt,
      clickCount: 0,
      clicks: [],
    }

    db.createShortUrl(shortUrl)

    const response: CreateShortUrlResponse = {
      shortLink: `http://localhost:4000/${finalShortCode}`,
      expiry: formatDateISO(expiresAt),
    }

    await Log("backend", "info", "controller", `Short URL created: ${finalShortCode}`)
    res.status(201).json(response)
  } catch (error) {
    await Log("backend", "error", "controller", `Error creating short URL: ${error}`)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const redirectToUrl = async (req: Request, res: Response) => {
  try {
    const { shortcode } = req.params
    await Log("backend", "info", "controller", `Redirect request for: ${shortcode}`)

    const shortUrl = db.getShortUrlByCode(shortcode)

    if (!shortUrl) {
      await Log("backend", "warn", "controller", `Short URL not found: ${shortcode}`)
      return res.status(404).json({ error: "Short URL not found" })
    }

    // Check if expired
    if (new Date() > shortUrl.expiresAt) {
      await Log("backend", "warn", "controller", `Short URL expired: ${shortcode}`)
      return res.status(410).json({ error: "Short URL has expired" })
    }

    // Track click
    const clickData = {
      timestamp: new Date(),
      referrer: req.get("Referer") || "direct",
      location: getCoarseLocation(req.ip || req.connection.remoteAddress || ""),
    }

    db.addClick(shortcode, clickData)

    await Log("backend", "info", "controller", `Redirecting ${shortcode} to ${shortUrl.originalUrl}`)
    res.redirect(302, shortUrl.originalUrl)
  } catch (error) {
    await Log("backend", "error", "controller", `Error in redirect: ${error}`)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const listShortUrls = async (req: Request, res: Response) => {
  try {
    await Log("backend", "info", "controller", "Listing all short URLs")

    const urls = db.getAllShortUrls().map((url) => ({
      shortLink: `http://localhost:4000/${url.shortCode}`,
      originalUrl: url.originalUrl,
      createdAt: formatDateISO(url.createdAt),
      expiry: formatDateISO(url.expiresAt),
      clickCount: url.clickCount,
    }))

    res.json(urls)
  } catch (error) {
    await Log("backend", "error", "controller", `Error listing URLs: ${error}`)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getUrlStats = async (req: Request, res: Response) => {
  try {
    const { shortcode } = req.params
    await Log("backend", "info", "controller", `Getting stats for: ${shortcode}`)

    const shortUrl = db.getShortUrlByCode(shortcode)

    if (!shortUrl) {
      await Log("backend", "warn", "controller", `Short URL not found for stats: ${shortcode}`)
      return res.status(404).json({ error: "Short URL not found" })
    }

    const response: StatsResponse = {
      shortLink: `http://localhost:4000/${shortUrl.shortCode}`,
      createdAt: formatDateISO(shortUrl.createdAt),
      expiry: formatDateISO(shortUrl.expiresAt),
      clickCount: shortUrl.clickCount,
      clicks: shortUrl.clicks.map((click) => ({
        timestamp: formatDateISO(click.timestamp),
        referrer: click.referrer,
        location: click.location,
      })),
    }

    res.json(response)
  } catch (error) {
    await Log("backend", "error", "controller", `Error getting stats: ${error}`)
    res.status(500).json({ error: "Internal server error" })
  }
}
