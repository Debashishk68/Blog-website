const cron = require('node-cron');
const otp = require('../models/otp-model');

// cron.schedule('*/10 * * * * *', async () => {
//     console.log("corn initialized")
//     const expiredOtps=await otp.Find({ expiresAt: { $lt: new Date() } });
//     const duplicateusers=otp.aggregate([

//         { $group: { 
      
//           userId: "$userId",  // Group by the email field
      
//           count: { $sum: 1 } 
      
//         }},
      
//         { $match: { count: { $gt: 1 } } }  // Filter for groups with count > 1
      
//       ]) ;
      
//     await otp.deleteMany({ expiresAt: { $lt: new Date() } }).then(console.log("otp deleted sucessfully"))
    


//         for (const duplicate of duplicateusers) {
//             const [ firstId ,...olderIds]= duplicate.userId;
//             await otp.deleteMany({userId:{$in:olderIds}}).then(console.log("deleted duplicate user"))
//         }
       
    

// });

cron.schedule('*/10 * * * *', async () => {
    console.log("Cron job triggered");

    try {
        const result = await otp.deleteMany({ expiresAt: { $lt: new Date() } });
        console.log("Deleted expired OTPs:", result);

        // const duplicates = await otp.aggregate([
        //     {
        //         $group: {
        //             _id: "$userId",
        //             ids: { $push: "$_id" },
        //             createdAt:{$push:"$createAt"},
        //             count: { $sum: 1 },
        //         },
        //     },
        //     {
        //         $match: { count: { $gt: 1 } },
        //     },
        // ]);

        // console.log("Found duplicates:", duplicates);

    //     for (const duplicate of duplicates) {
    //         const [firstId, ...olderIds] = duplicate.ids;
    //         const deleteResult = await otp.deleteMany({ _id: { $in: olderIds } });
    //         console.log(`Deleted older duplicates for user ${duplicate._id}:`, deleteResult);
    //     }
    } 
    catch (error) {
        console.error("Error in cron job:", error);
    }
});
