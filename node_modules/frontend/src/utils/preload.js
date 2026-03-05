export const preloadImages = (images)=>{

images.forEach(img=>{

const image = new Image()

image.src = img.urls.regular

})

}