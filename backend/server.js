import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.js"
import studyBlockRoutes from "./routes/studyBlocks.js"
import { startScheduler } from "./utils/scheduler.js"

dotenv.config()

// Debug: Check if email credentials are loaded
console.log("🔍 Environment variables check:")
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Not set")
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "✅ Set" : "❌ Not set")

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/study-blocks")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/study-blocks", studyBlockRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" })
})

startScheduler()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
