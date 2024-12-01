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

        likes:{
            type:Array
        },
        views:{
            type:Number
        }

})
module.exports=mongoose.model('post',postModel)
