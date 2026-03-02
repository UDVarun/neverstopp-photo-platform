const User =
require("./models/User")

const bcrypt =
require("bcrypt")

const jwt =
require("jsonwebtoken")



exports.register=
async(req,res)=>{

try{

const {email,password}=
req.body


const hash=
await bcrypt.hash(password,10)


const user=
new User({

email,
password:hash

})

await user.save()


res.json({

message:"User created"

})

}
catch{

res.status(500).json({

error:"Register Error"

})

}

}



exports.login=
async(req,res)=>{

try{

const {email,password}=
req.body


const user=
await User.findOne({email})


if(!user)

return res.status(401).json({

error:"Invalid Login"

})


const valid=
await bcrypt.compare(

password,
user.password

)


if(!valid)

return res.status(401).json({

error:"Invalid Login"

})


const token=
jwt.sign(

{id:user._id},

process.env.JWT_SECRET,

{expiresIn:"7d"}

)


res.json({

token

})

}
catch{

res.status(500).json({

error:"Login Error"

})

}

}