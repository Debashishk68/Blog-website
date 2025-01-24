const express = require('express');
const postModel = require('../../models/post-model');
const router = express.Router();

router.get("/",async(req,res)=>{
    // const {category}=req.body
    // if(category==="All"||category===""){
    const posts= await postModel.find({createdAt:{$lte:new Date()}}).sort({createdAt:-1});
    res.status(200).json({message:"Welcome to home page",posts});
    // }
    // res.json({message:"Home page"});
});



module.exports= router;