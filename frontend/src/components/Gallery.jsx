import ImageCard from "./ImageCard"


export default function Gallery({

images

}){


return(


<div className="columns-2 md:columns-3 lg:columns-4 gap-4">


{

images.map(img=>(

<ImageCard

key={img.id}
photo={img}

/>

))

}


</div>

)

}
