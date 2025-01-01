const express = require('express');
const auth = require('./src/routes/auth/index');
const path = require('path')
const cookieParser=require('cookie-parser');
const userRouter = require('./src/routes/private/userRoute');
const homeRoute = require('./src/routes/public/home');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./src/tasks/clean-otp');



const app = express();
require('dotenv').config();

app.use(express.json())

const {connectMongoDb}= require('./src/config/connection');



connectMongoDb(process.env.MONGODB);

const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST','PUT','DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
  };
  
  app.use(cors(corsOptions));
  

app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());



//public Routes

app.get('/',homeRoute);
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


app.listen(process.env.PORT);