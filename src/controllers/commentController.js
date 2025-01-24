const commentModel = require('../models/comment-model')

async function commentController(req, res) {
  const { text } = req.body; 
  const postId = req.params.id;
  const userId = req.id.user; 

  // return console.log(typeof(postId))

  if (!text || text.trim().length === 0) {
    return res.status(400).send({ message: "Comment text cannot be empty." });
  }

  try {
    const newComment = await commentModel.create({
      post: postId,
      user: userId,
      text:text,
    });
    res.status(201).send({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: "Failed to add comment. Please try again later.",
    });
  }
}

async function showComments(req, res) {
  const postId = req.params.id;

  if (!postId) {
    return res.status(400).send({ message: "Post ID is required." });
  }

  try {
    const comments = await commentModel.find({ post: postId }).populate("user","name profileImg").sort({createdAt:-1});

    if (!comments || comments.length === 0) {
      return res.status(404).send({ message: "No comments found for this post." });
    }

    res.status(200).send({
      message: "Comments retrieved successfully.",
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error.message);

    res.status(500).send({
      message: "Failed to retrieve comments. Please try again later.",
      error: error.message,
    });
  }
}

module.exports={commentController,showComments}
