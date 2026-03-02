const router =
require("express").Router()

const {
getPhotos
} = require("../controllers/photosController")


router.get("/",
getPhotos)

module.exports = router