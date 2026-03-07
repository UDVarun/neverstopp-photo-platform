const jwt =
require("jsonwebtoken")


module.exports=(req,res,next)=>{

const token=
req.headers.authorization


if(!token)

return res.status(401).json({

error:"No Token"

})


try{

const [scheme, rawToken] = token.split(" ")
const jwtToken = scheme === "Bearer" ? rawToken : token

const decoded=
jwt.verify(

jwtToken,

process.env.JWT_SECRET

)


req.user=decoded

next()

}
catch{

res.status(401).json({

error:"Invalid Token"

})

}

}
