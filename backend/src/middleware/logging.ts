import type { Request, Response, NextFunction } from "express"
import { Log } from "../../../logging-middleware/src/index"

export const requestLogger = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Log("backend", "info", "middleware", `${req.method} ${req.path} - Request received`)
  } catch (error) {
    console.error("Logging failed:", error)
  }
  next()
}

export const errorLogger = async (error: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    await Log("backend", "error", "middleware", `Error in ${req.method} ${req.path}: ${error.message}`)
  } catch (logError) {
    console.error("Error logging failed:", logError)
  }
  next(error)
}
