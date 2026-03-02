import {useState} from "react"

export default function SearchBar(){

const [text,setText]=useState("")

function submit(e){

if(e.key==="Enter"){

window.dispatchEvent(
new CustomEvent("search",
{detail:text})
)

}

}

return(

<input

className="border p-2
rounded-full"

value={text}

onChange={e=>
setText(e.target.value)
}

onKeyDown={submit}

placeholder="Search photos"

/>

)

}