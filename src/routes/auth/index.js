const express = require('express');
const router = express.Router();
const {login,register,forgotPassword, logout, changePassword} = require('../../controllers/authController');
const { otpVerify } = require('../../controllers/otpController');

router.post('/login',login);
router.post('/register',register);
router.post('/forgot-password',forgotPassword);
router.post('/otpverify',otpVerify);
router.post('/changePassword',changePassword);
router.post('/logout',logout);

module.exports= router;