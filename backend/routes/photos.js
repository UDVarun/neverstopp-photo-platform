const router =
require("express").Router()

const {

getPhotos

}

=
require("../controllers/photosController")

const auth =
require("../middleware/auth")


router.get("/",getPhotos)

router.get("/secure",auth,getPhotos)


module.exports =
router