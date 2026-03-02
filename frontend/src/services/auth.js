import axios from "axios"

const API="http://localhost:5000"



export const loginUser = async(data)=>{

const res = await axios.post(

API+"/auth/login",

data

)

localStorage.setItem(
"token",
res.data.token
)

return res.data

}



export const registerUser = async(data)=>{

const res = await axios.post(

API+"/auth/register",

data

)

return res.data

}



export const logoutUser=()=>{

localStorage.removeItem("token")

}



export const isLoggedIn=()=>{

return localStorage.getItem("token")

}