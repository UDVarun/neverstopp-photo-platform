const axios = require("axios")

const cache =
require("../services/cache")



/*
CATEGORIES
*/

const categories=[

"nature",
"people",
"technology",
"travel",
"animals",
"architecture",
"food",
"street",
"minimal",
"art",
"city",
"cars",
"space",
"ocean",
"mountains",
"fashion"

]



function shuffle(array){

return array.sort(()=>Math.random()-0.5)

}



function randomCategories(count){

return shuffle([...categories]).slice(0,count)

}



exports.getPhotos =
async(req,res)=>{

try{


const query =
req.query.q || ""

const page =
req.query.page || 1



/*
CACHE KEY
*/

const cacheKey =
`photos-${query}-${page}`



const cached =
cache.get(cacheKey)


if(cached){

return res.json(cached)

}



/*
SEARCH MODE
*/

if(query!==""){


const response =
await axios.get(

"https://api.unsplash.com/search/photos",

{

params:{

query:query,

page:page,

per_page:20,

client_id:
process.env.UNSPLASH_KEY

}

}

)


cache.set(cacheKey,response.data)

return res.json(response.data)

}



/*
SMART EXPLORE MODE
*/


const popularRequest=
axios.get(

"https://api.unsplash.com/photos",

{

params:{

order_by:"popular",

per_page:10,

page:Math.floor(Math.random()*10)+1,

client_id:
process.env.UNSPLASH_KEY

}

}

)



const latestRequest=
axios.get(

"https://api.unsplash.com/photos",

{

params:{

order_by:"latest",

per_page:10,

page:Math.floor(Math.random()*10)+1,

client_id:
process.env.UNSPLASH_KEY

}

}

)



const randomCats=
randomCategories(3)



const categoryRequests=
randomCats.map(cat=>{

return axios.get(

"https://api.unsplash.com/search/photos",

{

params:{

query:cat,

per_page:6,

page:Math.floor(Math.random()*10)+1,

client_id:
process.env.UNSPLASH_KEY

}

}

)

})



const responses=
await Promise.all([

popularRequest,
latestRequest,
...categoryRequests

])



let results=[]



responses.forEach(r=>{

if(r.data.results){

results.push(...r.data.results)

}else{

results.push(...r.data)

}

})



const ids=new Set()

results = results.filter(img=>{

if(ids.has(img.id)) return false

ids.add(img.id)

return true

})



results=shuffle(results)



const finalData={

results:results.slice(0,30)

}



cache.set(cacheKey,finalData)



res.json(finalData)



}
catch(error){

console.log(error)

res.status(500).json({

error:"Server Error"

})

}

}