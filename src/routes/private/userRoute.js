const express = require("express");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const postModel = require("../../models/post-model");
const postController = require("../../controllers/postController");
const userModel = require("../../models/user-model");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const { likeController } = require("../../controllers/likeController");
const { commentController } = require("../../controllers/commentController");
const { showComments } = require("../../controllers/commentController");
const changeProfilePic = require("../../controllers/userController");


const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get("/", isLoggedIn, async (req, res) => {
  let author = req.id.user;
  

  try {
    const posts = await postModel.find({ author });
    const user = await userModel.findOne({_id:author});

    if (!posts) return res.status(404).send("Please Login");

    res
      .status(200)
      .json({
        message: "Sucessfully retrived posts",
        posts: posts,
        profileImg:user.profileImg,
        user: user.email,
        name:user.name
      });
  } catch (error) {
    console.log(error);
  }
});

router.post("/createpost", isLoggedIn, upload.single('file'), postController.createPost);

router.get("/posts",isLoggedIn,postController.showPosts);

router.get("/post/:id",isLoggedIn,postController.findPostById)

router.delete("/delete/:id",isLoggedIn,postController.deletePost)

router.post('/editpost/:id',isLoggedIn, upload.single('file'),postController.editPost);
 
router.post('/likepost/:id',isLoggedIn,likeController);

router.post('/addcomment/:id',isLoggedIn,commentController);

router.post('/showcomments/:id',showComments);

router.post("/changeprofilepic",isLoggedIn,upload.single('file'),changeProfilePic)

module.exports = router;
