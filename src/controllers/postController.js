const postModel = require("../models/post-model");
const userModel = require("../models/user-model");
// const path= require('path')

 function createPost(req, res) {
  try {
    let { title, category, description, tags } = req.body;
     
  
    
    if(!title||!description||!tags){
      return res.status(400).send({message:"Empty field"})
    }

    const file= req.file;
     postModel.create({
      title,
      description,
      category,
      thumbnail:`uploads/${file.filename}`,
      tags: tags,
      author: req.id.user,
      createdAt: Date.now(),
    });
    res.status(200).send({ message: "Post sucessfully created" });
  } catch (error) {
    console.log(error.message);
  }
}

async function showPosts(req,res) {
   const _id =req.id.user;
   const user = await userModel.findOne({_id});
   if(!_id) return res.status(400).send({message:"Please Login first"})
   const posts=await postModel.find({author:user._id});
   if(!posts) return res.status(400).send({message:"Zero Posts"});
   res.status(200).send({message:"Here are the Posts",posts:posts})
}

// async function deletePost(res,res) {
//    const id = req.
// }

module.exports = {createPost,showPosts};
