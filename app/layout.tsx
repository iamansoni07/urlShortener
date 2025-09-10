import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"
import theme from "./theme"
import "./globals.css"
import LoggerProvider from "./components/LoggerProvider"

export const metadata: Metadata = {
  title: "URL Shortener - Affordmed Evaluation",
  description: "URL Shortener application with analytics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Wrapped with Material UI providers and Suspense boundary */}
        <Suspense fallback={<div>Loading...</div>}>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <LoggerProvider>{children}</LoggerProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
