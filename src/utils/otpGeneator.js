const otpGenerator = require("otp-generator");
const otpModel = require("../models/otp-model");

async function generateOTP(user) {
  try {
    const oldotps = await otpModel.find({ userId: user });

    if (oldotps) {
      await otpModel.deleteMany({ userId: user });
    }

    const userId = user;
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    const createAt = Date.now();
    const expiresAt = createAt + 10 * 60 * 1000;
    const newotp = new otpModel({ userId, otp, createAt, expiresAt });

    await newotp.save();
    return otp;
  } catch (error) {
    console.log(error);
  }
}
module.exports = generateOTP;
