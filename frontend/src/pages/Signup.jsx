import { useState } from "react"
import { registerUser } from "../services/auth"
import { useNavigate,Link } from "react-router-dom"



export default function Signup(){

const nav=useNavigate()

const [name,setName]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")



const submit=async(e)=>{

e.preventDefault()

await registerUser({

name,
email,
password

})

nav("/login")

}



return(

<div className="bg-[#111] min-h-screen flex items-center justify-center">


<form

onSubmit={submit}

className="bg-[#1a1a1a] p-10 rounded-2xl w-[400px] shadow-xl border border-gray-800"

>


<h1 className="text-white text-3xl mb-8">

Create Account

</h1>



<input

placeholder="Name"

value={name}

onChange={(e)=>setName(e.target.value)}

className="w-full mb-4 p-3 rounded-lg bg-[#111] border border-gray-700 text-white"

/>



<input

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="w-full mb-4 p-3 rounded-lg bg-[#111] border border-gray-700 text-white"

/>



<input

type="password"

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="w-full mb-4 p-3 rounded-lg bg-[#111] border border-gray-700 text-white"

/>



<button

className="w-full bg-white text-black py-3 rounded-lg font-medium"

>

Create Account

</button>



<div className="text-gray-400 mt-5 text-center">


Already have account?


<Link

to="/login"

className="text-white ml-2"

>

Login

</Link>


</div>



</form>


</div>

)
}