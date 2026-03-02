import { useEffect,useRef,useState } from "react"
import axios from "axios"

export default function ImageModal({

photo,
images,
setSelected,
onClose

}){


const modalRef = useRef(null)

const [animate,setAnimate]=useState(false)
const [fullscreen,setFullscreen]=useState(false)


if(!photo) return null



/*
ANIMATION START
*/

useEffect(()=>{

setTimeout(()=>{
setAnimate(true)
},10)

},[])



/*
INDEX
*/

const index =
images.findIndex(i=>i.id===photo.id)



const prevImage=()=>{

if(index>0){

setSelected(images[index-1])

}

}


const nextImage=()=>{

if(index < images.length-1){

setSelected(images[index+1])

}

}



/*
KEYBOARD NAVIGATION
*/

useEffect(()=>{

const keyHandler=(e)=>{


if(e.key==="Escape") onClose()

if(e.key==="ArrowLeft") prevImage()

if(e.key==="ArrowRight") nextImage()

if(e.key==="f") setFullscreen(!fullscreen)

}

window.addEventListener("keydown",keyHandler)

return ()=>window.removeEventListener("keydown",keyHandler)

})



/*
CLICK OUTSIDE CLOSE
*/

const outsideClick=(e)=>{

if(
modalRef.current &&
!modalRef.current.contains(e.target)
){

onClose()

}

}



/*
PROFESSIONAL DOWNLOAD
*/

const downloadImage=async()=>{

try{

await axios.get(
photo.links.download_location
)

window.open(
photo.urls.full,
"_blank"
)

}
catch(err){

console.log(err)

}

}



return(

<div

className={`

fixed inset-0 z-50 flex items-center justify-center p-6

transition duration-300

${animate
? "bg-black/90 backdrop-blur-md"
: "bg-black/0"}

`}

onClick={outsideClick}

>



<div

ref={modalRef}

className={`

relative

${fullscreen
? "w-full h-full"
: "max-w-6xl w-full"}

transition duration-300

${animate
? "scale-100 opacity-100"
: "scale-90 opacity-0"}

`}

>



{/* TOP BAR */}

<div className="flex justify-between items-center mb-4">


<div className="flex items-center gap-3">


<img
src={photo.user.profile_image.medium}
className="w-10 h-10 rounded-full"
/>


<div className="text-white font-medium">

{photo.user.name}

</div>


</div>



<div className="flex gap-3">


{/* FULLSCREEN */}

<button

onClick={()=>setFullscreen(!fullscreen)}

className="bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black"

>

{fullscreen?"Exit":"Fullscreen"}

</button>



{/* DOWNLOAD */}

<button

onClick={downloadImage}

className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-lg"

>

Download

</button>


</div>


</div>



{/* LEFT ARROW */}

<button

onClick={prevImage}

className="absolute left-[-70px] top-1/2 text-white text-5xl hover:scale-125 transition"

>

‹

</button>



{/* RIGHT ARROW */}

<button

onClick={nextImage}

className="absolute right-[-70px] top-1/2 text-white text-5xl hover:scale-125 transition"

>

›

</button>



{/* IMAGE */}

<img

src={photo.urls.full}

className={`

rounded-lg mx-auto

transition duration-300

${fullscreen
? "max-h-screen"
: "max-h-[85vh]"}

object-contain

`}

/>



</div>


</div>

)
}