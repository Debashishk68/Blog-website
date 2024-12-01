const express = require('express');
const isLoggedIn = require('../../middlewares/isLoggedIn');
const postModel = require('../../models/post-model');
const createPost = require('../../controllers/postController');
const router = express.Router();
 
router.get('/',isLoggedIn,async (req,res)=>{
    let author=req.id.user;

    try {
        const posts= await postModel.find({author});
        if(!posts) return res.status(404).send("Please Login");

        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
    }
    

})
router.post("/createpost",isLoggedIn,createPost);

module.exports=router;