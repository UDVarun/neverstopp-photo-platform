import { useEffect } from "react"



export default function ImageModal({

photo,
images,
setSelected,
onClose

}){


if(!photo) return null



const index =
images.findIndex(i => i.id === photo.id)



const prevImage = () => {

if(index > 0){

setSelected(images[index - 1])

}

}



const nextImage = () => {

if(index < images.length - 1){

setSelected(images[index + 1])

}

}



/* KEYBOARD NAVIGATION */

useEffect(()=>{

const keyHandler = (e)=>{

if(e.key === "Escape"){

onClose()

}

if(e.key === "ArrowLeft"){

prevImage()

}

if(e.key === "ArrowRight"){

nextImage()

}

}

window.addEventListener("keydown", keyHandler)

return ()=>window.removeEventListener("keydown", keyHandler)

},[photo])



/* PROFESSIONAL DOWNLOAD */

const handleDownload = async () => {

try {

if(photo.links?.download_location){

await fetch(photo.links.download_location)

}

/* Fetch actual image */
const response = await fetch(photo.urls.full)

const blob = await response.blob()

/* Create temporary download link */
const url = window.URL.createObjectURL(blob)

const a = document.createElement("a")

a.href = url
a.download = `${photo.id}.jpg`

document.body.appendChild(a)
a.click()
a.remove()

window.URL.revokeObjectURL(url)

}
catch (err) {

console.log("Download error:", err)

}

}



return(

<div

className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"

onClick={onClose}

>



<div

className="relative max-w-6xl w-full"

onClick={(e)=>e.stopPropagation()}

>



{/* TOP BAR */}

<div className="flex justify-between items-center mb-4">


<div className="flex items-center gap-3">


<img
src={photo.user.profile_image.medium}
className="w-10 h-10 rounded-full"
alt="user"
/>


<div className="text-white">

{photo.user.name}

</div>


</div>



<button

onClick={handleDownload}

className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"

>

Download

</button>


</div>



{/* LEFT BUTTON */}

<button

onClick={prevImage}

className="absolute left-[-60px] top-1/2 text-white text-4xl"

>

‹

</button>



{/* RIGHT BUTTON */}

<button

onClick={nextImage}

className="absolute right-[-60px] top-1/2 text-white text-4xl"

>

›

</button>



<img

src={photo.urls.full}

className="w-full max-h-[85vh] object-contain rounded-lg"

alt="preview"

/>



</div>


</div>

)
}