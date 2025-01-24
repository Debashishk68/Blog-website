const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");

const { login, register, forgotPassword, logout, changePassword } = require('../../controllers/authController');
const { otpVerify } = require('../../controllers/otpController');
const isLoggedIn = require('../../middlewares/isLoggedIn');

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/otpverify', otpVerify);
router.post('/changePassword', changePassword);
router.post('/logout',isLoggedIn, logout);

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/callback', 
  passport.authenticate('google', {
    successRedirect: '/auth/callback/success',
    failureRedirect: '/auth/callback/failure',
    failureMessage: true
  })
);

router.get('/callback/success', (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect('/auth/callback/failure');
    }
    const token = jwt.sign({ email: req.user.email }, process.env.SECRET);
    res.cookie("token", token);
    res.redirect(`http://localhost:5173/dashboard`);
    // res.send(req.user)
    // res.status(200).send({ message: "Login successfully", isAuthenticated: true });
  } catch (error) {
    next(error);
  }
});

router.get('/callback/failure', (req, res) => {
  res.status(401).send({ message: "Authentication failed", error: req.query.error || "Invalid credentials" });
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.message || "Internal Server Error" });
});

module.exports = router;
