"use client"
import { useState } from "react"
import { Box, TextField, Button, Typography, Alert, Card, CardContent, Grid, CircularProgress } from "@mui/material"
import { Add as AddIcon, Link as LinkIcon } from "@mui/icons-material"
import { Log } from "../../logging-middleware/src/index"

interface UrlForm {
  id: string
  url: string
  validity: string
  shortcode: string
  result?: {
    shortLink: string
    expiry: string
  }
  error?: string
  loading?: boolean
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const isValidShortcode = (shortcode: string): boolean => {
  if (!shortcode) return true // Optional field
  return /^[a-zA-Z0-9]{3,10}$/.test(shortcode)
}

export default function UrlShortenerPage() {
  const [forms, setForms] = useState<UrlForm[]>([{ id: "1", url: "", validity: "", shortcode: "" }])

  const addForm = async () => {
    if (forms.length >= 5) return

    await Log("frontend", "info", "component", "Adding new URL form")
    setForms([
      ...forms,
      {
        id: Date.now().toString(),
        url: "",
        validity: "",
        shortcode: "",
      },
    ])
  }

  const updateForm = (id: string, field: keyof UrlForm, value: string) => {
    setForms(forms.map((form) => (form.id === id ? { ...form, [field]: value, error: undefined } : form)))
  }

  const validateForm = (form: UrlForm): string | null => {
    if (!form.url.trim()) {
      return "URL is required"
    }
    if (!isValidUrl(form.url)) {
      return "Invalid URL format"
    }
    if (form.validity && (!Number.isInteger(Number(form.validity)) || Number(form.validity) <= 0)) {
      return "Validity must be a positive integer"
    }
    if (!isValidShortcode(form.shortcode)) {
      return "Shortcode must be alphanumeric, 3-10 characters"
    }
    return null
  }

  const submitForm = async (form: UrlForm) => {
    const error = validateForm(form)
    if (error) {
      setForms(forms.map((f) => (f.id === form.id ? { ...f, error } : f)))
      await Log("frontend", "warn", "component", `Form validation failed: ${error}`)
      return
    }

    setForms(forms.map((f) => (f.id === form.id ? { ...f, loading: true, error: undefined } : f)))

    try {
      await Log("frontend", "info", "api", "Submitting URL shortening request")

      const requestBody: any = { url: form.url }
      if (form.validity) requestBody.validity = Number(form.validity)
      if (form.shortcode) requestBody.shortcode = form.shortcode

      const response = await fetch("http://localhost:4000/shorturls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create short URL")
      }

      setForms(
        forms.map((f) =>
          f.id === form.id
            ? {
                ...f,
                loading: false,
                result: data,
                error: undefined,
              }
            : f,
        ),
      )

      await Log("frontend", "info", "api", "URL shortened successfully")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setForms(
        forms.map((f) =>
          f.id === form.id
            ? {
                ...f,
                loading: false,
                error: errorMessage,
              }
            : f,
        ),
      )
      await Log("frontend", "error", "api", `URL shortening failed: ${errorMessage}`)
    }
  }

  const removeForm = async (id: string) => {
    if (forms.length <= 1) return
    await Log("frontend", "info", "component", "Removing URL form")
    setForms(forms.filter((form) => form.id !== id))
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Shorten Your URLs
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        You can shorten up to 5 URLs concurrently. Each URL can have an optional validity period and custom shortcode.
      </Typography>

      <Grid container spacing={3}>
        {forms.map((form) => (
          <Grid item xs={12} key={form.id}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LinkIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">URL #{forms.indexOf(form) + 1}</Typography>
                  {forms.length > 1 && (
                    <Button size="small" color="error" sx={{ ml: "auto" }} onClick={() => removeForm(form.id)}>
                      Remove
                    </Button>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Original URL"
                      placeholder="https://example.com/very-long-url"
                      value={form.url}
                      onChange={(e) => updateForm(form.id, "url", e.target.value)}
                      error={!!form.error && form.error.includes("URL")}
                      required
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Validity (minutes)"
                      placeholder="30"
                      type="number"
                      value={form.validity}
                      onChange={(e) => updateForm(form.id, "validity", e.target.value)}
                      error={!!form.error && form.error.includes("Validity")}
                      helperText="Default: 30 minutes"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Custom Shortcode (optional)"
                      placeholder="mycode123"
                      value={form.shortcode}
                      onChange={(e) => updateForm(form.id, "shortcode", e.target.value)}
                      error={!!form.error && form.error.includes("Shortcode")}
                      helperText="3-10 alphanumeric characters"
                    />
                  </Grid>
                </Grid>

                {form.error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {form.error}
                  </Alert>
                )}

                {form.result && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Short URL Created!</Typography>
                    <Typography variant="body2">
                      <strong>Short Link:</strong> {form.result.shortLink}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Expires:</strong> {new Date(form.result.expiry).toLocaleString()}
                    </Typography>
                  </Alert>
                )}

                <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    onClick={() => submitForm(form)}
                    disabled={form.loading}
                    startIcon={form.loading ? <CircularProgress size={20} /> : undefined}
                  >
                    {form.loading ? "Creating..." : "Shorten URL"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {forms.length < 5 && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addForm}>
            Add Another URL ({forms.length}/5)
          </Button>
        </Box>
      )}
    </Box>
  )
}
