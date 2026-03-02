require("dotenv").config()

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

const photoRoutes =
require("./routes/photoRoutes")

const paymentRoutes =
require("./routes/paymentRoutes")


const app = express()



/*
SECURITY HEADERS
*/

app.use(helmet())



/*
CORS (UNCHANGED)
*/

app.use(cors({

origin:
process.env.CLIENT_URL

}))



/*
JSON PARSER
*/

app.use(express.json())



/*
RATE LIMITER
SAFE LIMITS
*/

const limiter = rateLimit({

windowMs:15*60*1000,

max:300,

message:"Too many requests"

})

app.use(limiter)



/*
API ROUTES
(UNCHANGED)
*/

app.use("/photos",photoRoutes)

app.use("/payment",paymentRoutes)



/*
HEALTH CHECK
Safe addition
*/

app.get("/",(req,res)=>{

res.send("Server running")

})



/*
404 HANDLER
Safe addition
*/

app.use((req,res)=>{

res.status(404).json({

error:"Route not found"

})

})



/*
ERROR HANDLER
Safe addition
*/

app.use((err,req,res,next)=>{

console.error(err)

res.status(500).json({

error:"Server error"

})

})



/*
START SERVER
(UNCHANGED PORT)
*/

app.listen(

process.env.PORT,

()=>console.log("Server running")

)