export default function Trending({

setQuery,
setImages,
setPage

}){


const trends=[

"Nature",
"Cars",
"Mountains",
"Technology",
"Street",
"City",
"Ocean",
"Minimal",
"Space",
"Art"

]


const selectTrend=(t)=>{

setImages([])

setPage(1)

setQuery(t.toLowerCase())

}


return(

<div className="bg-[#111] border-b border-gray-800">


<div className="max-w-[1600px] mx-auto px-8 py-4 flex gap-6 text-gray-400 text-sm overflow-x-auto">



<span className="text-gray-500">

Trending:

</span>


{trends.map(t=>(

<div

key={t}

onClick={()=>selectTrend(t)}

className="cursor-pointer hover:text-white transition whitespace-nowrap"

>

{t}

</div>

))}


</div>


</div>

)

}