import { getFavorites, removeFavorite } from "../services/favorites"
import ImageModal from "../components/ImageModal"
import { useEffect, useState } from "react"

export default function Favorites(){

const [favorites, setFavorites] = useState(getFavorites())

const [selected,setSelected]=useState(null)

useEffect(() => {
const sync = () => {
const latest = getFavorites()
setFavorites(latest)
if (selected) {
const stillExists = latest.find((item) => item.id === selected.id)
if (!stillExists) setSelected(null)
}
}

window.addEventListener("favorites-updated", sync)
window.addEventListener("storage", sync)
return () => {
window.removeEventListener("favorites-updated", sync)
window.removeEventListener("storage", sync)
}
}, [selected])


return(

<div className="bg-[#111] min-h-screen px-4 py-6 sm:px-5 md:px-7 md:py-8">


<h1 className="text-white text-2xl md:text-3xl mb-6 md:mb-8">

Favorites

</h1>



<div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-6 space-y-3 md:space-y-6">


{favorites.map(photo=>(
<div key={photo.id} className="relative group">

<img
src={photo.urls?.regular || photo.urls?.small}
alt={photo.alt_description || "favorite photo"}
onClick={()=>setSelected(photo)}
className="rounded-lg cursor-pointer w-full"
/>

<button
onClick={(e)=>{
e.stopPropagation()
removeFavorite(photo.id)
if (selected?.id === photo.id) setSelected(null)
}}
className="absolute top-2.5 right-2.5 md:top-3 md:right-3 bg-[#e0315b] text-white text-xs px-3 py-1.5 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
>
Unlike
</button>

<button
onClick={(e)=>{
e.stopPropagation()
setSelected(photo)
}}
className="absolute bottom-2.5 right-2.5 md:bottom-3 md:right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
>
Fullscreen
</button>

</div>

))}


</div>



<ImageModal
photo={selected}
images={favorites}
setSelected={setSelected}
onClose={()=>setSelected(null)}
/>



</div>

)
}
