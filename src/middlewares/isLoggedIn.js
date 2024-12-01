const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

async function isLoggedIn(req,res,next){
    try {
        const token = req.cookies.token;
        if(!token)return res.send("please Login");

    const decoded = jwt.verify(token, process.env.SECRET);
    const user= await userModel.findOne({email:decoded.email})
    if(!user) return res.send("Please Login");
        req.id={user:user._id};
    console.log(decoded.email) ;
    next();
    } catch (error) {
        console.log(error)
    }
}

module.exports=isLoggedIn;