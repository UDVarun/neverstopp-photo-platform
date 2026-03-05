import express from "express"
import cors from "cors"
import serverless from "serverless-http"

import photoRoutes from "../routes/photoRoutes.js"
import paymentRoutes from "../routes/paymentRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/photos", photoRoutes)
app.use("/api/payment", paymentRoutes)

export const handler = serverless(app)