/*
GET FAVORITES
*/

export const getFavorites = ()=>{

return JSON.parse(
localStorage.getItem("favorites")
) || []

}



/*
CHECK FAVORITE
*/

export const isFavorite=(id)=>{

const favs=getFavorites()

return favs.some(f=>f.id===id)

}



/*
TOGGLE FAVORITE
*/

export const toggleFavorite=(photo)=>{

let favs=getFavorites()

const exists =
favs.find(f=>f.id===photo.id)


if(exists){

favs =
favs.filter(f=>f.id!==photo.id)

}else{

favs.push(photo)

}


localStorage.setItem(
"favorites",
JSON.stringify(favs)
)

}



/*
COUNT FAVORITES
*/

export const favoriteCount=(id)=>{

const favs=getFavorites()

return favs.filter(f=>f.id===id).length

}