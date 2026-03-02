import { payPremium } from "../services/payment"


export default function PhotoCard({photo}){


return(

<div className="rounded-xl overflow-hidden shadow-lg bg-white">


<img
src={photo.urls.small}
className="w-full"
/>


<div className="p-4">


<button

onClick={payPremium}

className="bg-black text-white px-4 py-2 rounded-lg w-full"

>

Download Premium

</button>


</div>

</div>

)

}