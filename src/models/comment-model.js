const mongoose = require('mongoose');

const commentModel = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', 
      required: true
    },
    text: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

module.exports=mongoose.model("comment",commentModel);
