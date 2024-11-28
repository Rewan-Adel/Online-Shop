import User from "../models/user.model";
import { ICodeService } from "../Interfaces/ICodeService ";
import EncryptionService from "../utils/EncryptionService";
import TokenService from "./TokenService";
import { INotification } from "../Interfaces/INotification";

class verificationServiceImp implements ICodeService{
    private encryptionService  : EncryptionService;
    private notificationService: INotification;

    constructor(encryptionService: EncryptionService,notificationService: INotification){
        this.encryptionService = encryptionService;
        this.notificationService = notificationService;
    };

    public async codeGenerator(): Promise<{ code: string, hashedCode: string, codeExpiration: Date }> {
        const code =  Math.floor(100000 + Math.random() * 900000).toString();
        const hashedCode = await this.encryptionService.hash(code);
        const codeExpiration = new Date(Date.now() + 15 * 60 * 1000);
            
        return{
            code,
            hashedCode,
            codeExpiration
        }
    };
    public async codeVerifier(email: string, code: string): Promise<{isValid:boolean, data:object}> {
        try{
            const user = await User.findOne({email: email});
            if(!user || user.otp == null){
                    return {
                        isValid: false,
                        data:null
                    }
                }
                
                if(user.otpExpires instanceof Date &&  user.otpExpires.getTime()< Date.now()) 
                    throw new Error('Verification code has expired.');
                
                const isValid = await this.encryptionService.compare(code.toString(), user.otp as string);
                if(isValid){
                    user.verified = true;
                    user.otp = null;
                    user.otpExpires = null;
                    await user.save();
                }

                const token = new TokenService().generateToken((user._id).toString());
                return {
                    isValid: isValid,
                    data:{
                        user:user,
                        token:token
                    }
                }

        }catch(error){
            console.log(error.message)
        }
    };

    async codeSender(email:string){
        try {
            const verificationCode = await this.codeGenerator();
            const emailSend = await this.notificationService.send(email, "Your Verification Code", `Your code is ${verificationCode.code}`, `<h2>${verificationCode.code}</h2>`);            
            if (!emailSend) {
                throw new Error("An error occurred while sending the verification code")
            }

            return {
                isSent: true,
                message: "Verification code is sent",
                hashed: verificationCode.hashedCode,
                expiration: verificationCode.codeExpiration
            };
            
        } catch (error) {
            return {
                isSent: false,
                message: `An error occurred while sending the verification code: ${error.message}`,
                hashed: null,
                expiration: null
            };
        }
    };
    
    async codeReSender(email:string){
        try{
            const verificationCode = await this.codeSender(email);            
            if(!verificationCode.isSent )
                throw new Error("An error occurred while sending the verification code")

            const update = await this.updateUser(email,
                verificationCode.hashed,
                verificationCode.expiration
            );
            if(!update.isUpdated){
                return {
                    isSent: false,
                    status: 400,
                    message: update.message,
                };
            };

            return {
                isSent: verificationCode.isSent,
                status: 200,
                message: verificationCode.message,
            };
        }catch (error) {
            console.log(error.message);
            
            return {
                isSent: false,
                status: 500,
                message: "An error occurred while sending the verification code",
                hashed: null,
                expiration: null
            };
        }
    };
    

    
    public async resetPasswordEmailSender(email: string, url:string): Promise<{isSent:boolean, message:string}> {
        try {
            const emailSend = await this.notificationService.send(email, "You requested to reset your password.", `Click the link below to reset your password.`, `<h2>${url}</h2>`);            
            if (!emailSend) {
                throw new Error("An error occurred while sending the reset password email")
            }

            return {
                isSent: true,
                message: "Email is sent",
            };
            
        } catch (error) {
            return {
                isSent: false,
                message: `An error occurred while sending the reset password email: ${error.message}`,
            };
        }
    }

    private async updateUser(email:string, hashedOtp:string,otpExpires:Date, counter?:number, verified?:boolean){
        try{
            const user = await User.findOne({email:email});
            if(!user)
                throw new Error("User not found");
            
            const resendCounter = user.otpCounter as number +1;
            await user.updateOne({
                verified: verified,
                otp: hashedOtp,
                otpCounter: counter? counter : resendCounter,
                otpExpires:otpExpires 
            });
    
            return{
                isUpdated: true,
                message:""
            }  
        }catch(error){
            return{
                isUpdated: false,
                message: error.message
            }
        }
    };
};

export default verificationServiceImp;
