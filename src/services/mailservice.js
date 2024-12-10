const nodemailer = require("nodemailer");


async function mailSender(email) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "debashishkarmakar326@gmail.com",
      pass: "bbdr ekbm reym kunn",
    },
  });
  
  
  try {
  
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: "raghavsharma6747@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html:  `
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
    `, // html body
      });
        
     
      console.log("Message sent: %s", info.messageId);
      return true;
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    
    
  } catch (error) {
    console.log(error);
    return false;
  }
  
}

module.exports=mailSender;




