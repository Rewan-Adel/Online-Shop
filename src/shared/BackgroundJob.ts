import cron from "node-cron";
import  Logger  from "./Logger"; 
import User from "../models/user.model";

class BackgroundJob{
    constructor(){
        console.log("Background job working....");
    };
    
    otpCleanupJob(){
        cron.schedule("*/10 * * * *", async()=>{ // every 10 minutes
            try{
                const result = await User.updateMany(
                    { otpExpires: {$lt :  Date.now() }},
                    {  $unset: { otp: null, otpCounter:0 ,otpExpires: null, resetPasswordToken:null } }
                );
    
                console.log(`Expired OTPs cleared. Updated ${result.modifiedCount} records.`);
    
            }
            catch (error: unknown) {
                if (error instanceof Error) {
                    Logger.error(error.message);
                } else {
                    Logger.error('Unknown error');
                }
                return {
                    isSent: false,
                    message: "An error occurred.",
                    data: null
                };
            }
        })
    
    };
    
    userCleanupJob(){
        cron.schedule("*/120 * * * *", async()=>{ // every 2 hours
            try{
                const result =await User.deleteMany(
                    { 
                        $and:[
                            { verified: false},
                            { active: false }
                        ]
                    }
                );
    
                console.log(`Unverified and inactive users are deleted. Delete ${result.deletedCount} records.`);
                
    
            }catch (error: unknown) {
                if (error instanceof Error) {
                    Logger.error(error.message);
                } else {
                    Logger.error('Unknown error');
                }
                return {
                    isSent: false,
                    message: "An error occurred.",
                    data: null
                };
            }
        })
    }
}
export default BackgroundJob;
