import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { isLoggedIn, logoutUser } from "../services/auth"



export default function Navbar({

search,
setSearch,
handleSearch

}){


const navigate = useNavigate()

const [shrink, setShrink] = useState(false)

const suggestions = [

"Nature",
"Cars",
"People",
"Travel",
"Technology",
"Animals",
"Architecture",
"Food",
"Space",
"City"

]



/*
ANIMATED NAVBAR SHRINK
*/

useEffect(() => {

const onScroll = () => {

setShrink(window.scrollY > 40)

}

window.addEventListener("scroll", onScroll)

return () => window.removeEventListener("scroll", onScroll)

}, [])



const handleSuggestionClick = (value) => {

setSearch(value)

handleSearch({ key: "Enter" })

}



/*
LOGOUT HANDLER
*/

const handleLogout = () => {

logoutUser()

navigate("/")

window.location.reload()

}



return (

<div

className={`

sticky top-0 z-50

bg-[#111]

border-b border-gray-800

transition-all duration-300

${shrink ? "py-2" : "py-4"}

`}

>


<div className="max-w-[1600px] mx-auto px-8 flex items-center justify-between">


{/* LEFT SIDE */}

<div className="flex items-center gap-8">


<Link

to="/"

className="text-white text-xl font-semibold tracking-wide"

>

NeverStop

</Link>


<Link

to="/favorites"

className="text-gray-400 hover:text-white transition"

>

Favorites

</Link>


</div>



{/* CENTER SEARCH */}

<div className="relative">


<input

value={search}

onChange={(e) => setSearch(e.target.value)}

onKeyDown={handleSearch}

placeholder="Search high-resolution photos"

className="bg-[#1a1a1a] w-[420px] px-6 py-3 rounded-full border border-gray-700 text-white outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition"

/>



{/* SEARCH SUGGESTIONS */}

{search && (

<div className="absolute top-14 w-full bg-[#1a1a1a] rounded-xl border border-gray-700 shadow-xl overflow-hidden">


{suggestions
.filter((s) =>
s.toLowerCase().includes(search.toLowerCase())
)
.map((s) => (

<div

key={s}

onClick={() => handleSuggestionClick(s)}

className="px-5 py-3 text-gray-300 hover:bg-[#222] cursor-pointer transition"

>

{s}

</div>

))}


</div>

)}


</div>



{/* RIGHT SIDE AUTH */}

<div className="flex items-center gap-5">


{isLoggedIn() ? (

<button

onClick={handleLogout}

className="text-gray-400 hover:text-white transition"

>

Logout

</button>

) : (

<>

<Link

to="/login"

className="text-gray-400 hover:text-white transition"

>

Login

</Link>


<Link

to="/signup"

className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"

>

Sign Up

</Link>

</>

)}


</div>


</div>


</div>

)

}