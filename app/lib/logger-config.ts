import { initializeLogger } from "../../logging-middleware/src/index"

export const setupLogger = () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_LOGGING_API_URL || "http://20.244.56.144/evaluation-service"
    const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN || ""

    if (!accessToken) {
      console.warn("[Logger] No access token provided. Logging will be disabled.")
      return
    }

    initializeLogger({
      apiUrl,
      accessToken,
    })

    console.log("[Logger] Logger initialized successfully")
  } catch (error) {
    console.warn("[Logger] Failed to initialize logger:", error)
  }
}
