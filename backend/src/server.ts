import app from "./app"
import { Log } from "../../logging-middleware/src/index"

const PORT = process.env.PORT || 4000

const server = app.listen(PORT, async () => {
  try {
    await Log("backend", "info", "service", `Server started on port ${PORT}`)
    console.log(`Server running on http://localhost:${PORT}`)
  } catch (error) {
    console.error("Failed to log server start:", error)
  }
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  try {
    await Log("backend", "info", "service", "Server shutting down")
  } catch (error) {
    console.error("Failed to log server shutdown:", error)
  }
  server.close()
})

export default server
