const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/mailservice");
const otpGeneator = require("../utils/otpGeneator");
const otpModel = require("../models/otp-model");

async function login(req, res) {
  let { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await userModel.findOne({ email });
  if (!user) return res.status(400).send({error:"invalid creditials",isAuthicated:false});

   const isvalidPassword=await bcrypt.compare(password, user.password);
  
    if (!isvalidPassword) return res.status(400).send({error:"invalid creditials",isAuthicated:false});

    let token = jwt.sign({ email: email }, process.env.SECRET);
 
    res.cookie("token", token).status(200).send({message:"Login sucessfully",isAuthicated:true});

    
}

async function register(req, res) {
      try {
        let { email, password, name, age } = req.body;

        if (!email || !password || !name || !age) {
          return res.status(400).json({ error: "All fields are required" });
        }
      
       
      
        const user = await userModel.findOne({ email });
        if (user) return res.status(409).send("User Already exists please Login");
        
        const salt = await bcrypt.genSalt(
            parseInt(process.env.SALT_ROUNDS, 10)
          );
        const hashedPassword = await bcrypt.hash(password, salt);
        userModel.create({
          name,
          age,
          email,
          password: hashedPassword,
        });
        res.status(200).send({message:"User Registered"});
      } catch (error) {
        console.log(error);
      }

  
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

    const user = await userModel.findOne({ email });
    if (user) {
      const otp = await otpGeneator(user._id);

      // Call the sendEmail function
      const emailSent = await sendEmail(email, otp);

      if (emailSent) {
        return res
          .status(200)
          .json({ message: "Password reset email sent!"});
      }
    } else {
      return res.status(500).json({ error: "Failed to send email." });
    }
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({ error: "An error occurred." });
  }
}

async function changePassword(req, res) {
  try {
    const { newPassword, email } = req.body;
    if (!email || !newPassword) {
        return res.status(400).json({ error: "Email and new password are required" });
      }

    const user = await userModel.findOne({ email });

    if (user) {
        
      const otpVerify = await otpModel.findOne({ userId: user._id });
      if (!otpVerify || !otpVerify.verified) {
        return res.status(400).json({ error: "Please authenticate first" });
      }
     
        const salt = await bcrypt.genSalt(
          parseInt(process.env.SALT_ROUNDS, 10)
        );
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.save();
        await otpVerify.deleteOne({userId:user._id});
        res.send({message:"password changed sucessfully"});
     
    } else {
      res.status(400).send({error:"user not found"});
    }
  } catch (error) {
    console.error("Error during changePassword: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

function logout(req, res) {
  res.cookie("token", "").send("logout sucessfully");
}

module.exports = { login, register, forgotPassword, logout, changePassword };
