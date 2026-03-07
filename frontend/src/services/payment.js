import api from "./api"
import { supabase } from "../lib/supabase"

const loadRazorpayScript = () =>
new Promise((resolve) => {
if (window.Razorpay) {
resolve(true)
return
}

const script = document.createElement("script")
script.src = "https://checkout.razorpay.com/v1/checkout.js"
script.async = true
script.onload = () => resolve(true)
script.onerror = () => resolve(false)
document.body.appendChild(script)
})


export const payPremium =
async()=>{

const { data } = await supabase.auth.getSession()
const accessToken = data.session?.access_token

if (!accessToken) {
throw new Error("You must be logged in to pay")
}

const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID

if (!razorpayKeyId) {
throw new Error("Payment key is not configured")
}

const scriptLoaded = await loadRazorpayScript()
if (!scriptLoaded) {
throw new Error("Unable to load payment gateway")
}

const order =
await api.post(
"/payment/create-order",
{ plan: "monthly" },
{
headers: {
Authorization: `Bearer ${accessToken}`
}
}
)



const options={

key:razorpayKeyId,

amount:
order.data.amount,

currency:
order.data.currency,

order_id:
order.data.id,


handler: async (response)=>{

await api.post(
"/payment/verify",
{
razorpay_order_id: response.razorpay_order_id,
razorpay_payment_id: response.razorpay_payment_id,
razorpay_signature: response.razorpay_signature
},
{
headers: {
Authorization: `Bearer ${accessToken}`
}
}
)

alert("Payment Success")

},
modal: {
ondismiss: () => {
console.log("Payment modal closed")
}
}


}


const razor =
new window.Razorpay(options)

razor.open()


}
