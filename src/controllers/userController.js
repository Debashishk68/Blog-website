const userModel = require("../models/user-model");

async function changeProfilePic(req, res) {
    // console.log("hello")
        const id = req.id.user;
        const user = await userModel.findOne({ _id:id });
    
        if(!req.file) return res.status(400).send({message:"Please provide the file"});
        // console.log(req.file.filename)
       user.profileImg= `uploads/${req.file.filename}`
       await user.save();
       res.status(200).send({message:"Uploaded image sucessfully"})
        
}     

module.exports = changeProfilePic;
