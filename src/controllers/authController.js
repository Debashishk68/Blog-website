const userModel = require('../models/user-model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");



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
  try {
    // const { email } = req.body;
    // const user = await userModel.findOne({ email });
    // if (!user) return res.status(400).send('Invalid credentials');

  
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, 
      auth: {
        user: "debashishkarmakar326@gmail.com",
        pass: "bbdr ekbm reym kunn",
      },
    });

    
    const mailOptions = {
      from: '"Blog website 👻" <debashishkarmakar326@gmail.com>', 
      to: "raghavsharma6747@gmail.com",
      subject: "Password Reset Request", 
      text: "You requested a password reset.",
      html: 
      `
                <!DOCTYPE html>
                <html>
                <body>
                <div style="width:full;height:full;background-color:black;padding:10px;border-radius:10px;border:2px solid white;">
                    <h1 style="color: #7c8ee0;">Welcome to Our Service!</h1>
                    <p style="color: #555;">
                        We're excited to have you join us. Visit the link below to learn more:
                    </p>
                    <a href="https://example.com" style="display: inline-block; padding: 10px 20px; color: white; background: #007BFF; text-decoration: none; border-radius: 5px;">Get Started</a>
                </div>
                    </body>
                </html>
            `,
      
    };

    
    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    res.status(200).send("Email sent successfully!");

  } catch (error) {
    console.error("Error while sending email:", error.message);
    res.status(500).send("Failed to send email.");
  }
}

function logout(req,res){

      res.cookie('token',"").send("logout sucessfully");
      
}


module.exports={login,register,forgotPassword,logout};
