"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Container, Typography, Box, Tabs, Tab, Paper } from "@mui/material"
import { initializeLogger } from "../logging-middleware/src/index"
import UrlShortenerPage from "./components/UrlShortenerPage"
import UrlStatsPage from "./components/UrlStatsPage"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default function Home() {
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    // Initialize logging middleware
    initializeLogger({
      apiUrl: "http://20.244.56.144/evaluation-service",
      accessToken: process.env.NEXT_PUBLIC_ACCESS_TOKEN || "",
    })
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        URL Shortener
      </Typography>

      <Paper elevation={3} sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="URL shortener tabs">
            <Tab label="Shorten URLs" />
            <Tab label="Statistics" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <UrlShortenerPage />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <UrlStatsPage />
        </TabPanel>
      </Paper>
    </Container>
  )
}
