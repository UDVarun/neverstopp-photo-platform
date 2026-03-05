import { getFavorites } from "../services/favorites"
import ImageModal from "../components/ImageModal"
import { useState } from "react"

export default function Favorites(){

const favorites=getFavorites()

const [selected,setSelected]=useState(null)


return(

<div className="bg-[#111] min-h-screen p-10">


<h1 className="text-white text-3xl mb-10">

Favorites

</h1>



<div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">


{favorites.map(photo=>(

<img

key={photo.id}

src={photo.urls.regular}

onClick={()=>setSelected(photo)}

className="rounded-lg cursor-pointer"

/>

))}


</div>



<ImageModal
photo={selected}
onClose={()=>setSelected(null)}
/>



</div>

)
}