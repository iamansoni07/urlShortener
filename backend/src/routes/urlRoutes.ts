import { Router } from "express"
import { createShortUrl, redirectToUrl, listShortUrls, getUrlStats } from "../controllers/urlController"

const router = Router()

// Create short URL
router.post("/shorturls", createShortUrl)

// List all short URLs
router.get("/shorturls", listShortUrls)

// Get URL statistics
router.get("/shorturls/:shortcode/stats", getUrlStats)

// Redirect (must be last to avoid conflicts)
router.get("/:shortcode", redirectToUrl)

export default router
