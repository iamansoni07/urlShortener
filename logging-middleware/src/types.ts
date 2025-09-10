export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal"
export type LogStack = "backend" | "frontend"

export interface LogRequest {
  stack: LogStack
  level: LogLevel
  package: string
  message: string
}

export interface LogResponse {
  logID: string
  message: string
}

export interface LoggerConfig {
  apiUrl: string
  accessToken: string
}
