export default function SkeletonGrid(){

const items = Array(12).fill(0)

return(

<div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">

{items.map((_,i)=>(

<div
key={i}
className="break-inside-avoid animate-pulse"
>

<div className="bg-[#222] h-80 rounded-xl"/>

</div>

))}

</div>

)

}