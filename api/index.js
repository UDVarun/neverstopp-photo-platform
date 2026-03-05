import express from "express"
import cors from "cors"
import serverless from "serverless-http"

import photoRoutes from "../backend/routes/photoRoutes.js"
import paymentRoutes from "../backend/routes/paymentRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/photos", photoRoutes)
app.use("/api/payment", paymentRoutes)

app.get("/", (req, res) => {
  res.send("API Running")
})

export const handler = serverless(app)