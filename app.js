const express = require('express');
const user = require('./src/routes/private/userRoute');
const auth = require('./src/routes/auth/index');
const cookieParser=require('cookie-parser');
const userRouter = require('./src/routes/private/userRoute');
const homeRoute = require('./src/routes/public/home');
const blogRoute = require('./src/routes/public/blog');
const otp= require('./src/utils/otpGeneator');
require('./src/tasks/clean-otp');



const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');

const {connectMongoDb}= require('./src/config/connection');



connectMongoDb(process.env.MONGODB);

app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

//public Routes

app.get('/',homeRoute);
app.get('/blog',blogRoute);
// app.use('/blog/:id',)    //post details
// app.use('/about',)       //info about author
// app.use('/contact')     //contact or send feedback

//authication routes
app.use('/auth',auth);



//private routes
app.use("/user/profile",userRouter);

// app.use("/user/blogs");
// app.use("/user/blogs/:id/edit");
// app.use("/user/profile/:id/delete");
app.use("/otp",otp)


app.listen(process.env.PORT);