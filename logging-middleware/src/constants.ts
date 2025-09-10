export const ALLOWED_LEVELS: readonly string[] = ["debug", "info", "warn", "error", "fatal"]

export const ALLOWED_STACKS: readonly string[] = ["backend", "frontend"]

export const BACKEND_PACKAGES: readonly string[] = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
]

export const FRONTEND_PACKAGES: readonly string[] = ["api", "component", "hook", "page", "state", "style"]

export const SHARED_PACKAGES: readonly string[] = ["auth", "config", "middleware", "utils"]

export const getAllowedPackages = (stack: string): readonly string[] => {
  if (stack === "backend") {
    return [...BACKEND_PACKAGES, ...SHARED_PACKAGES]
  }
  if (stack === "frontend") {
    return [...FRONTEND_PACKAGES, ...SHARED_PACKAGES]
  }
  return []
}
