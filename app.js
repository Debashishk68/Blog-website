const express = require('express');
const auth = require('./src/routes/auth/index');
const path = require('path')
const cookieParser = require('cookie-parser');
const userRouter = require('./src/routes/private/userRoute');
const homeRoute = require('./src/routes/public/home');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session'); 
const bodyParser = require('body-parser');
require('dotenv').config();
require('./src/tasks/clean-otp');
require('./src/controllers/googleAuth')

const app = express();


app.use(express.json());

const { connectMongoDb } = require('./src/config/connection');
connectMongoDb(process.env.MONGODB);

const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
};
  
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: 'your_secret_key',  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public Routes
app.get('/', homeRoute);

// Authentication Routes
app.use('/auth', auth);

// Private Routes
app.use("/user/profile", userRouter);





app.listen(process.env.PORT);
