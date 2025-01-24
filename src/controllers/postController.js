const postModel = require("../models/post-model");
const userModel = require("../models/user-model");
// const path= require('path')

 function createPost(req, res) {
  try {
    let { title, category, description, tags } = req.body;
     
  
    
    if(!title||!description||!tags){
      return res.status(400).send({message:"Empty field"})
    }
    const userName = userModel.findOne({_id:req.id.user});

    const file= req.file;
     postModel.create({
      title,
      description,
      category,
      thumbnail:`uploads/${file.filename}`,
      tags: tags,
      authorName:userName.name,
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
   const posts=await postModel.find({author:user._id}).sort({createdAt:-1});
   if(!posts) return res.status(400).send({message:"Zero Posts"});
   res.status(200).send({message:"Here are the Posts",posts:posts})
}

async function findPostById(req,res) {
      const id = req.params.id;
      const user = req.id.user;
      if(!id) return res.status(400).send({message:"unknown error"});
      const post = await postModel.findOne({_id:id});
      if(!post) return res.status(400).send({message:"Post not found"});
      res.status(200).send({post,user});
}

async function deletePost(req, res) {
  const id = req.params.id; 
  const userId = req.id.user; 
  
  try {
    if (!id) return res.status(400).send({ message: "Please enter what to delete" });

    if (!userId) return res.status(401).send({ message: "Unauthorized user" });

    const userdata = await userModel.findOne({ _id: userId });
    if (!userdata) return res.status(404).send({ message: "User not found" });

    const postdata = await postModel.findOne({ _id: id });

    console.log({post:postdata.author,user:userId});
    
    if (!postdata) return res.status(404).send({ message: "Post not found" });

    if (postdata.author.toString() !== userId.toString() && userdata.role !== "admin") {
      return res.status(403).send({ message: "Unauthorized to delete this post" });
    }

    const postDelete = await postModel.findByIdAndDelete(id);
    if (!postDelete) return res.status(400).send({ message: "Failed to delete the post" });

    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

async function editPost(req, res) {
  try {
    const id = req.params.id;
    const { title, category, description, tags } = req.body;

    if (!title || !description || !tags) {
    
      return res.status(400).send({ message: "Empty field" });
      
    }

  
    const post = await postModel.findOne({ _id:id });
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

 
    post.title = title;
    post.description = description;
    post.category = category;
    post.tags = tags;

    if (req.file) {
      post.thumbnail = `uploads/${req.file.filename}`;
    }

  
    await post.save();

    res.status(200).send({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send({ message: "Internal server error" });
  }
}


module.exports = {createPost,showPosts,deletePost,findPostById,editPost};
