/*
GET FAVORITES
*/

export const getFavorites = ()=>{

try {
const raw = localStorage.getItem("favorites")
if (!raw) return []
const parsed = JSON.parse(raw)
return Array.isArray(parsed) ? parsed : []
} catch {
return []
}

}

const saveFavorites = (favs) => {
localStorage.setItem("favorites", JSON.stringify(favs))
window.dispatchEvent(new Event("favorites-updated"))
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

saveFavorites(favs)
return !exists

}

export const addFavorite = (photo) => {
if (isFavorite(photo.id)) return false
const favs = [...getFavorites(), photo]
saveFavorites(favs)
return true
}

export const removeFavorite = (id) => {
const favs = getFavorites()
const nextFavs = favs.filter((f) => f.id !== id)
if (nextFavs.length === favs.length) return false
saveFavorites(nextFavs)
return true
}



/*
COUNT FAVORITES
*/

export const favoriteCount=(id)=>{

const favs=getFavorites()

return favs.filter(f=>f.id===id).length

}
