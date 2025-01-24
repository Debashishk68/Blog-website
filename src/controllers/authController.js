const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/mailservice");
const otpGeneator = require("../utils/otpGeneator");
const otpModel = require("../models/otp-model");


async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ error: "Invalid credentials", isAuthenticated: false });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials", isAuthenticated: false });
    }

    const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true }).status(200).json({ message: "Login successful", isAuthenticated: true });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


async function register(req, res) {
      try {
        let { email, password, name, age } = req.body;

        if (!email || !password || !name ) {
          return res.status(400).json({ error: "All fields are required" });
        }
      
        // googleId = googleId || null
      
        const user = await userModel.findOne({ email });
        if (user) return res.status(409).send("User Already exists please Login");
        
        const salt = await bcrypt.genSalt(
            parseInt(process.env.SALT_ROUNDS, 10)
          );
        const hashedPassword = await bcrypt.hash(password, salt);
        userModel.create({
          googleId:jwt.sign({ email: email }, process.env.SECRET),
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
  if(req.id.user==="") return res.status(400).send({message:"You are already logout"})
  res.cookie("token", "").status(200).send({message:"Sucessfully Logout"})
}

module.exports = { login, register, forgotPassword, logout, changePassword };
