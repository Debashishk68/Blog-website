const postModel = require('../models/post-model');


function createPost(req,res){
   try {
    let {title,category,description}=req.body;
    postModel.create({
        title,
        description,
        category,
        author:req.id.user,
        createdAt:Date.now(),

    })
    res.send("Post sucessfully created")
   } catch (error) {
      cosole.log("error")
   }

    
}
module.exports=createPost;