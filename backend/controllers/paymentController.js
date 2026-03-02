const Razorpay =
require("razorpay")


const razor =
new Razorpay({

key_id:
process.env.RAZOR_KEY,

key_secret:
process.env.RAZOR_SECRET

})



exports.createOrder =
async(req,res)=>{


const order =
await razor.orders.create({

amount:50000,

currency:"INR"

})


res.json(order)


}