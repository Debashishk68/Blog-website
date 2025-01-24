const postModel = require("../models/post-model");

async function likeController(req, res) {
    const postId = req.params.id; 
    const userId = req.id.user;  
    try {
        
        const post = await postModel.findById(postId);
        if (!post) return res.status(404).send({ message: "Post not found" });

        
        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            
            post.likes = post.likes.filter((like) => like.toString() !== userId.toString());
            await post.save();
            return res.status(200).send({ message: "Successfully unliked", likes: post.likes.length,liked:false });
        } else {
            
            post.likes.push(userId);
            await post.save();
            return res.status(200).send({ message: "Successfully liked", likes: post.likes.length,liked:true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while liking the post" });
    }
}

module.exports = { likeController };
