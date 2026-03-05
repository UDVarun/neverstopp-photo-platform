const express = require("express")
const cors = require("cors")

const photoRoutes = require("../backend/routes/photoRoutes")
const paymentRoutes = require("../backend/routes/paymentRoutes")

const app = express()

app.use(cors())
app.use(express.json())

// Route matching for /api/...
app.use("/api/photos", photoRoutes)
app.use("/api/payment", paymentRoutes)

// Fallback for direct routes
app.use("/photos", photoRoutes)
app.use("/payment", paymentRoutes)

app.get("/", (req, res) => {
  res.send("API is working")
})

module.exports = app