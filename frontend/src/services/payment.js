import api from "./api"


export const payPremium =
async()=>{


const order =
await api.post(
"/payment/create-order"
)



const options={

key:"rzp_test_xxxxxx",

amount:
order.data.amount,

currency:
order.data.currency,

order_id:
order.data.id,


handler:()=>{

alert("Payment Success")

}


}


const razor =
new window.Razorpay(options)

razor.open()


}