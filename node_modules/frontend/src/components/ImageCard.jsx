import {

toggleFavorite,
isFavorite

} from "../services/favorites"

import { useState,useEffect } from "react"



export default function ImageCard({
photo,
onClick
}){


const [liked,setLiked]=useState(false)



useEffect(()=>{

setLiked(
isFavorite(photo.id)
)

},[])



const likeHandler=(e)=>{

e.stopPropagation()

toggleFavorite(photo)

setLiked(!liked)

}



return(

<div

className="break-inside-avoid group relative cursor-pointer"

onClick={()=>onClick(photo)}

>



<img

src={photo.urls.small}

className="w-full rounded-xl transition duration-500 group-hover:brightness-75"

/>



<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition p-4">


<button

onClick={likeHandler}

className="bg-black/60 text-white px-3 py-2 rounded-full"

>

{liked ? "❤️":"🤍"}

</button>


</div>


</div>

)
}