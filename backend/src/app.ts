import express from "express"
import cors from "cors"
import { initializeLogger } from "../../logging-middleware/src/index"
import { requestLogger, errorLogger } from "./middleware/logging"
import urlRoutes from "./routes/urlRoutes"

const app = express()

// Initialize logging middleware
initializeLogger({
  apiUrl: "http://20.244.56.144/evaluation-service",
  accessToken: process.env.ACCESS_TOKEN || "",
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// Routes
app.use("/", urlRoutes)

// Error handling
app.use(errorLogger)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" })
})

export default app
