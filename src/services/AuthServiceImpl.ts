import { IAuthService } from "../Interfaces/IAuthService";
import User from "../models/user.model";
import crypto from 'crypto';

import { ICodeService } from "../Interfaces/ICodeService ";
import EncryptionService from "../utils/EncryptionService";
import TokenService from "./TokenService";
import { INotification } from "../Interfaces/INotification";
import { ITokenService } from "../Interfaces/ITokenService";
import IUserRepository from "../Interfaces/IUserRepository";

class AuthServiceImpl implements IAuthService {
    private userRepository: IUserRepository;
    private tokenService: ITokenService;
    private codeService: ICodeService;
    private notificationService: INotification;
    private encryptionService: EncryptionService
    constructor(
        // userRepository: IUserRepository,
        tokenService: ITokenService,
        encryptionService: EncryptionService,
        codeService: ICodeService,
        notificationService: INotification
    ) {
        // this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.codeService = codeService;
        this.notificationService = notificationService;
        this.encryptionService = encryptionService;
    };

    async signup( username: string, email: string, password: string ): Promise<{message:string, data:object}>{
        const userExist = await this.isUserExist(email);
        if(userExist){
            return {
                message: "Email already exists",
                data: null
            };
        }
        const { code, hashedCode, codeExpiration } = await this.codeService.codeGenerator();
        
        await this.notificationService.send(
            email,
            "Your Verification Code",
            `Your code is ${code}`,
            `<p>Your code is: <strong>${code}</strong></p>`
        );

        
        const newUser = await User.create({
            username,
            email,
            password,
            otp: hashedCode,
            otpExpires: codeExpiration,
        });

        return { message: "Verification code sent.", data: {user:newUser} };
    };
    
    async login(email: string, password: string ) {
        try {
            const user = await this.isUserExist(email);  
            if (!user || !await this.encryptionService.compare(password.trim(), user.password as string)) {
                return {
                    isLogin: false,
                    message: "Invalid email or password.",
                    data: null,
                };
            }
            
            const token = new TokenService().generateToken(user._id.toString());
            return {
                isLogin: true,
                message: "Login successful.",
                data: {
                    user,
                    token,
                },
            };
        } catch (error) {
            console.error("Error during login:", error);
            return {
                isLogin: false,
                message: "An error occurred.",
                data: null,
            };
        }
    };
    
    async forgotPassword(email: string ){
        try{
            const user = await this.isUserExist(email);
            if(!user){
                return {
                    message: "Invalid email",
                    data: null
                };
            };
    
            const token = crypto.randomBytes(32).toString('hex');
            const hashedToken = await this.encryptionService.hash(token);
            
            user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
            user.resetPasswordToken = hashedToken;
            await user.save();
    
            setTimeout(()=>{
                user.resetPasswordToken = null;
                user.resetPasswordExpires = null;
                user.save();
            }, 15 * 60 * 1000)
    
            const resetUrl = `${process.env.HOST}/auth/reset-password/${user.id}/${token}`;
            await this.notificationService.send(
                email,
                "Password Reset",
                `Click the link to reset your password: <a href="${resetUrl}">Reset Password</a>`              
            );
            console.log(resetUrl)
            return { 
                message: "Password reset email sent" , 
                data:{resetUrl}
                };

        }catch(error){
            return {
                message: error.message,
                data:null
            }
        }

    };

    async resetPassword(token:string, userID, password:string): Promise<{message:string, token:string}>{
        try{
            const user    = await User.findById(userID);
            if (!user)
                return { message: "User not found.", token: null };

            const isToken = await this.encryptionService.compare(token, user.resetPasswordToken as string);
            if(!isToken)
                return{
                    message: "Invalid token or expired.",
                    token: null
                }
            
            if(user.resetPasswordExpires instanceof Date && user.resetPasswordExpires.getTime() < Date.now()){
                return{
                    message: "Invalid token or expired.",
                    token: null
                }
            }
            console.log("new Pass: ", password);
            
            const hashedPassword = await this.encryptionService.hash(password);
            user.password = hashedPassword;
            user.resetPasswordExpires = null;
            user.resetPasswordToken   = null;
            await user.save();
            
            const jwtToken = new TokenService().generateToken(user._id.toString());
            return{
                message: "Reset password email sent",
                token: jwtToken
            }
        }catch(error){
            return {
                message: error.message,
                token: null
            }
        }
    };
    
    private async isUserExist(email: string){
        const user = await User.findOne({email});
        return user;
    };
}

export default AuthServiceImpl;