export default function Categories({

setQuery,
setImages,
setPage

}){


const categories=[

"Nature",
"Wallpapers",
"Travel",
"Architecture",
"People",
"Animals",
"Technology",
"Food",
"Fashion",
"Sports"

]


const selectCategory=(c)=>{

setImages([])

setPage(1)

setQuery(c.toLowerCase())

}


return(

<div className="border-b border-gray-800 bg-[#111]">


<div className="max-w-[1500px] mx-auto px-8 py-3 flex gap-6 overflow-x-auto text-gray-400 text-sm">



{categories.map(cat=>(

<div

key={cat}

onClick={()=>selectCategory(cat)}

className="cursor-pointer hover:text-white transition whitespace-nowrap"

>

{cat}

</div>

))}


</div>


</div>

)

}