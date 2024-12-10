const userModel = require('../models/user-model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const sendEmail = require('../services/mailservice');



async function login(req,res) {

        let{email,password}=req.body;
        
        const user=await userModel.findOne({email});
        if(!user.email) return res.send('invalid creditials');

        bcrypt.compare(password, user.password, function(err, result) {
                if(!result) return res.send("invalid creditials");
                
                let token = jwt.sign({ email: email }, process.env.SECRET);
                res.cookie('token',token);

                res.send("LOGIN");
                // console.log(token)
                
            });
                
        
}

async function register(req,res) {
         let{email,password,name,age}=req.body;
         const saltRounds = parseInt(process.env.SALT_ROUNDS,10);

         const user=await userModel.findOne({email});
         if (user) res.send("User Already exists please Login")

        bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                       try {
                        userModel.create({
                                name,
                                age,
                                email,
                                password:hash
                            })
                            res.send("User Registered")
                       } catch (error) {
                           console.log(error)
                       }
                                 });
                });
        
}


async function forgotPassword(req, res) {
        const { email } = req.body;

    // Logic to generate a reset token
//     const resetToken = Math.random().toString(36).substring(2); // Example token
//     const resetLink = `http://your-frontend-url/reset-password/${resetToken}`;

    try {
        // Call the sendEmail function
        const emailSent = await sendEmail(
            email,
            
        );

        if (emailSent) {
            return res.status(200).json({ message: "Password reset email sent!" });
        } else {
            return res.status(500).json({ error: "Failed to send email." });
        }
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ error: "An error occurred." });
    }
             
}

function logout(req,res){

      res.cookie('token',"").send("logout sucessfully");
      
}


module.exports={login,register,forgotPassword,logout};
