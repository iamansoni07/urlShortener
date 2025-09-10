import { validateLogInput, ValidationError } from "./validator"
import type { LogRequest, LogResponse, LoggerConfig } from "./types"

export class Logger {
  private config: LoggerConfig

  constructor(config: LoggerConfig) {
    this.config = config
  }

  async log(stack: string, level: string, packageName: string, message: string): Promise<LogResponse> {
    try {
      // Validate inputs
      const validatedInput = validateLogInput(stack, level, packageName, message)

      // Prepare request body
      const requestBody: LogRequest = {
        stack: validatedInput.stack,
        level: validatedInput.level,
        package: validatedInput.package,
        message: validatedInput.message,
      }

      // Make API call
      const response = await fetch(`${this.config.apiUrl}/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.accessToken}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: LogResponse = await response.json()
      return result
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error
      }
      throw new Error(`Failed to send log: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}

// Global logger instance
let globalLogger: Logger | null = null

export const initializeLogger = (config: LoggerConfig): void => {
  globalLogger = new Logger(config)
}

export const Log = async (
  stack: string,
  level: string,
  packageName: string,
  message: string,
): Promise<LogResponse | null> => {
  try {
    if (!globalLogger) {
      console.warn("[Logger] Logger not initialized. Skipping log entry.")
      return null
    }
    return await globalLogger.log(stack, level, packageName, message)
  } catch (error) {
    console.warn("[Logger] Failed to send log:", error instanceof Error ? error.message : "Unknown error")
    return null
  }
}
