const router =
require("express").Router()
const rateLimit =
require("express-rate-limit")

const {

createOrder,
verifyPayment

} = require("../controllers/paymentController")
const supabaseAuth =
require("../middleware/supabaseAuth")

const paymentLimiter = rateLimit({
windowMs: 15 * 60 * 1000,
max: 20,
message: "Too many payment requests"
})


router.post("/create-order",
paymentLimiter,
supabaseAuth,
createOrder)
router.post("/verify",
paymentLimiter,
supabaseAuth,
verifyPayment)


module.exports = router
