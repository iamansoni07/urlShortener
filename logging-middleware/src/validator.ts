import { ALLOWED_LEVELS, ALLOWED_STACKS, getAllowedPackages } from "./constants"
import type { LogLevel, LogStack } from "./types"

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export const validateLogInput = (
  stack: string,
  level: string,
  packageName: string,
  message: string,
): { stack: LogStack; level: LogLevel; package: string; message: string } => {
  // Validate stack
  if (!ALLOWED_STACKS.includes(stack)) {
    throw new ValidationError(`Invalid stack: ${stack}. Allowed values: ${ALLOWED_STACKS.join(", ")}`)
  }

  // Validate level
  if (!ALLOWED_LEVELS.includes(level)) {
    throw new ValidationError(`Invalid level: ${level}. Allowed values: ${ALLOWED_LEVELS.join(", ")}`)
  }

  // Validate package
  const allowedPackages = getAllowedPackages(stack)
  if (!allowedPackages.includes(packageName)) {
    throw new ValidationError(
      `Invalid package: ${packageName} for stack: ${stack}. Allowed values: ${allowedPackages.join(", ")}`,
    )
  }

  // Validate message
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    throw new ValidationError("Message is required and must be a non-empty string")
  }

  return {
    stack: stack as LogStack,
    level: level as LogLevel,
    package: packageName,
    message: message.trim(),
  }
}
