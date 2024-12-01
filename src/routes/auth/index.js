const express = require('express');
const router = express.Router();
const {login,register,forgotPassword, logout} = require('../../controllers/authController');

router.post('/login',login);
router.post('/register',register);
router.post('/forgot-password',forgotPassword);
router.post('/logout',logout);

module.exports= router;