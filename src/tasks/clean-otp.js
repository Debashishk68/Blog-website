const cron = require('node-cron');
const otp = require('../models/otp-model');

cron.schedule('*/10 * * * *', async () => {
    try {
        const result = await otp.deleteMany({ expiresAt: { $lt: new Date() } });
        console.log("Deleted expired OTPs:", result);

    }
    catch (error) {
        console.error("Error in cron job:", error);
    }
});
