const mongoose = require('mongoose');

const postModel=mongoose.Schema({
        title:{
            type:String,

        },
        description:{
            type:String
        },
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user-model'
        },
        thumbnail:{
            type:String

        },
        authorName:{type:String},
        tags:{
            type:Array
        },
        category:{
            type:String,
        },
        createdAt:{
            type:Date
        },
        updatedAt:{
            type:Date
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
          }],
        views:{
            type:Number
        }

})
module.exports=mongoose.model('post',postModel)
