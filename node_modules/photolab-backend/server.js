require("dotenv").config()

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

const photoRoutes = require("./routes/photoRoutes")
const paymentRoutes = require("./routes/paymentRoutes")

const app = express()



/* ============================= */
/* SECURITY HEADERS */
/* ============================= */

app.use(helmet())



/* ============================= */
/* CORS (SAFE DEFAULT) */
/* ============================= */

app.use(cors({
  origin: process.env.NODE_ENV === "production" ? true : (process.env.CLIENT_URL || "http://localhost:5173"),
  credentials: true
}))



/* ============================= */
/* JSON PARSER */
/* ============================= */

app.use(express.json())



/* ============================= */
/* RATE LIMITER */
/* ============================= */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests"
})

app.use(limiter)



/* ============================= */
/* API ROUTES (UNCHANGED) */
/* ============================= */

app.use("/photos", photoRoutes)
app.use("/payment", paymentRoutes)



/* ============================= */
/* HEALTH CHECK */
/* ============================= */

app.get("/", (req, res) => {
  res.send("Server running")
})



/* ============================= */
/* 404 HANDLER */
/* ============================= */

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  })
})



/* ============================= */
/* ERROR HANDLER */
/* ============================= */

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Server error"
  })
})



/* ============================= */
/* START SERVER */
/* ============================= */

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})