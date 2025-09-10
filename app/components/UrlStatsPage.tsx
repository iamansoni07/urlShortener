"use client"
import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import { ExpandMore as ExpandMoreIcon, Link as LinkIcon, Analytics as AnalyticsIcon } from "@mui/icons-material"
import { Log } from "../../logging-middleware/src/index"

interface ShortUrl {
  shortLink: string
  originalUrl: string
  createdAt: string
  expiry: string
  clickCount: number
}

interface UrlStats {
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

export default function UrlStatsPage() {
  const [urls, setUrls] = useState<ShortUrl[]>([])
  const [stats, setStats] = useState<Record<string, UrlStats>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUrls = async () => {
    try {
      await Log("frontend", "info", "api", "Fetching URL list")

      const response = await fetch("http://localhost:4000/shorturls")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch URLs")
      }

      setUrls(data)
      await Log("frontend", "info", "api", `Fetched ${data.length} URLs`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(errorMessage)
      await Log("frontend", "error", "api", `Failed to fetch URLs: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async (shortcode: string) => {
    if (stats[shortcode]) return // Already loaded

    try {
      await Log("frontend", "info", "api", `Fetching stats for ${shortcode}`)

      const response = await fetch(`http://localhost:4000/shorturls/${shortcode}/stats`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch stats")
      }

      setStats((prev) => ({ ...prev, [shortcode]: data }))
      await Log("frontend", "info", "api", `Fetched stats for ${shortcode}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      await Log("frontend", "error", "api", `Failed to fetch stats for ${shortcode}: ${errorMessage}`)
    }
  }

  useEffect(() => {
    fetchUrls()
  }, [])

  const getShortcode = (shortLink: string) => {
    return shortLink.split("/").pop() || ""
  }

  const isExpired = (expiry: string) => {
    return new Date() > new Date(expiry)
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">Failed to load URLs: {error}</Alert>
  }

  if (urls.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No URLs have been shortened yet.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Go to the "Shorten URLs" tab to create your first short URL.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        URL Statistics
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        View all your shortened URLs and their analytics data.
      </Typography>

      <Grid container spacing={3}>
        {urls.map((url) => {
          const shortcode = getShortcode(url.shortLink)
          const urlStats = stats[shortcode]
          const expired = isExpired(url.expiry)

          return (
            <Grid item xs={12} key={url.shortLink}>
              <Accordion
                onChange={(_, expanded) => {
                  if (expanded) {
                    fetchStats(shortcode)
                  }
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <LinkIcon sx={{ mr: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">{url.shortLink}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {url.originalUrl}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
                      <Chip label={`${url.clickCount} clicks`} size="small" color="primary" />
                      <Chip label={expired ? "Expired" : "Active"} size="small" color={expired ? "error" : "success"} />
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            <AnalyticsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                            URL Details
                          </Typography>
                          <Typography variant="body2">
                            <strong>Created:</strong> {new Date(url.createdAt).toLocaleString()}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Expires:</strong> {new Date(url.expiry).toLocaleString()}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Total Clicks:</strong> {url.clickCount}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      {urlStats ? (
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Click Analytics
                            </Typography>
                            {urlStats.clicks.length > 0 ? (
                              <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Time</TableCell>
                                      <TableCell>Referrer</TableCell>
                                      <TableCell>Location</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {urlStats.clicks
                                      .slice(-5)
                                      .reverse()
                                      .map((click, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                                          <TableCell>{click.referrer}</TableCell>
                                          <TableCell>{click.location}</TableCell>
                                        </TableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No clicks recorded yet.
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      ) : (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                          <CircularProgress size={24} />
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
