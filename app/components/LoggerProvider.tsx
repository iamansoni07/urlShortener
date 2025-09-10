"use client"
import { useEffect } from "react"
import type React from "react"

import { setupLogger } from "../lib/logger-config"

export default function LoggerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupLogger()
  }, [])

  return <>{children}</>
}
