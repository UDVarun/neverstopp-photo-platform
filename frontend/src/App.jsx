import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Favorites from "./pages/Favorites"

import {

BrowserRouter,
Routes,
Route

} from "react-router-dom"



export default function App(){

return(

<BrowserRouter>


<Routes>


<Route path="/" element={<Home/>}/>

<Route path="/login" element={<Login/>}/>

<Route path="/signup" element={<Signup/>}/>

<Route path="/favorites" element={<Favorites/>}/>


</Routes>


</BrowserRouter>

)

}