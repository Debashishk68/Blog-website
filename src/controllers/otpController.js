const otpModel = require('../models/otp-model');
const userModel = require('../models/user-model');

async function otpVerify(req, res) {
    try {
        const { otp, email } = req.body;

        // Fetch the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ text: "User not found", verified: false });
        }

        // Fetch the OTP by userId
        const verify = await otpModel.findOne({ userId:user._id });
        if (!verify) {
            return res.status(404).send({ text: "OTP not found", verified: false });
        }

        // Check if the OTP is expired
        if (new Date() > verify.expiresAt) {
            return res.status(400).send({ text: "OTP expired", verified: false });
        }

        // Verify the OTP
        if (verify.otp === parseInt(otp)) {
            verify.verified = true;
            await verify.save(); // Await the save operation
            return res.status(200).send({ text: "OTP verified", verified: true });
        } else {
            return res.status(400).send({ text: "Incorrect OTP", verified: false });
        }
    } catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).send({ text: "Internal Server Error", verified: false });
    }
}

module.exports = { otpVerify };
