const Razorpay =
require("razorpay")
const crypto =
require("crypto")


const razor =
new Razorpay({

key_id:
process.env.RAZOR_KEY,

key_secret:
process.env.RAZOR_SECRET

})

const plans = {
monthly: 50000,
yearly: 499900
}


exports.createOrder =
async(req,res)=>{

try {
const plan =
req.body?.plan || "monthly"
const amount = plans[plan]

if (!amount) {
return res.status(400).json({
error:"Invalid plan"
})
}

const order =
await razor.orders.create({

amount,

currency:"INR"

})


res.json(order)
} catch {
res.status(500).json({
error:"Failed to create order"
})
}
}

exports.verifyPayment =
async(req,res)=>{
try {
const {
razorpay_order_id,
razorpay_payment_id,
razorpay_signature
} = req.body || {}

if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
return res.status(400).json({
error:"Invalid payment payload"
})
}

const expectedSignature = crypto
.createHmac("sha256", process.env.RAZOR_SECRET)
.update(`${razorpay_order_id}|${razorpay_payment_id}`)
.digest("hex")

if (expectedSignature.length !== razorpay_signature.length) {
return res.status(400).json({
error:"Invalid payment signature"
})
}

const valid = crypto.timingSafeEqual(
Buffer.from(expectedSignature),
Buffer.from(razorpay_signature)
)

if (!valid) {
return res.status(400).json({
error:"Invalid payment signature"
})
}

return res.json({
verified:true
})
} catch {
res.status(500).json({
error:"Failed to verify payment"
})
}


}
