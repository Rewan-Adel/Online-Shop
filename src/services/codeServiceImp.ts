import User from "../models/user.model";
import { ICodeService } from "../repositories/ICodeService ";
import EncryptionService from "../utils/Encryption";
import TokenService from "./TokenService";
import { INotification } from "../repositories/INotification";
import Logger from "../logger";

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


    public async codeVerifier(email: string, code: string): Promise<{isValid:boolean, data:object | null }> {
        try{
            const user = await User.findOne({email: email});
            if(!user || user.otp == null){
                    return {
                        isValid: false,
                        data: null
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

        } catch (error: unknown) {
            if (error instanceof Error) {
                Logger.error(error.message);
            } else {
                Logger.error('Unknown error');
            }
            return {
                isValid: false,
                data: null,
            };
        }
    };

}

export default verificationServiceImp;
