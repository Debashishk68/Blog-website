const mongoose = require('mongoose');

const userModel=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    age:{
        type:Number,
        require:false
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        enum:['admin','author','reader'],
        default:'reader'
    },
 
   
});

module.exports=mongoose.model('user',userModel)

