import { useState } from "react"
import { useNavigate,Link } from "react-router-dom"
import { loginUser } from "../services/auth"



export default function Login(){

const nav = useNavigate()

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [error,setError]=useState("")
const [show,setShow]=useState(false)



const submit=async(e)=>{

e.preventDefault()

try{

await loginUser({

email,
password

})

nav("/")

}
catch{

setError("Invalid credentials")

}

}



return(

<div className="bg-[#111] min-h-screen flex items-center justify-center">


<form

onSubmit={submit}

className="bg-[#1a1a1a] p-10 rounded-2xl w-[400px] shadow-xl border border-gray-800"

>


<h1 className="text-white text-3xl mb-8">

Login

</h1>



{error && (

<div className="text-red-400 mb-4">

{error}

</div>

)}



<input

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="w-full mb-4 p-3 rounded-lg bg-[#111] border border-gray-700 text-white"

/>



<div className="relative">


<input

type={show?"text":"password"}

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="w-full mb-4 p-3 rounded-lg bg-[#111] border border-gray-700 text-white"

/>



<span

onClick={()=>setShow(!show)}

className="absolute right-3 top-3 text-gray-400 cursor-pointer"

>

👁

</span>


</div>



<button

className="w-full bg-white text-black py-3 rounded-lg font-medium"

>

Login

</button>



<div className="text-gray-400 mt-5 text-center">


No account?


<Link

to="/signup"

className="text-white ml-2"

>

Sign up

</Link>


</div>



</form>


</div>

)
}