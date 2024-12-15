const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
 userId:{type:String,required:true},
  otp:{
    type:Number,
    required:true
  },
   createdAt:{
    type:Date,
    default:Date.now()
   },
   expiresAt:{
    type:Date,
    required:true
   }
});
module.exports=mongoose.model("OTP",otpSchema);
