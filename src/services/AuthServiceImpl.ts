import { IAuthService } from "../repositories/IAuthRepository";
import User from "../models/user.model";

import { ICodeService } from "../repositories/ICodeService ";
import EncryptionService from "../utils/EncryptionService";
import TokenService from "./TokenService";
import { INotification } from "../repositories/INotification";
import { ITokenService } from "../repositories/ITokenService";
// import IUserRepository from "../repositories/IUserRepository";
import crypto from "crypto";    
import Logger from "../logger";

class AuthServiceImpl implements IAuthService {
    // private userRepository: IUserRepository;
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

    async signup( username: string, email: string, password: string ): Promise<{ message:string, data:object | null}>{
        const userExist = await this.isUserExist(email);
        if(userExist)
            return {
                message: "Email already exists",
                data: null
            };
        
        
        const newUser = await User.create({
            username,
            email,
            password
        });
        const code = await this.otpHandler(newUser);
        
        await this.notificationService.send(
            email,
            "Verification Code",
            `Your code is ${code}`,
            `<p>Your code is: <strong>${code}</strong></p>`
        );

        return { message: "Verification code sent.", data: {user:newUser} };
    };
    
    async login(email: string, password: string ): Promise<{isLogin: boolean, message:string, data:object | null}>{
        try {
            const user = await this.isUserExist(email);  
            if (!user || !await this.encryptionService.compare(password.trim(), user.password as string)) {
                return {
                    isLogin: false,
                    message: "Invalid email or password.",
                    data: null,
                };
            };
            if(!user.verified){
                return {
                    isLogin: false,
                    message: "Email not verified.",
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
        }catch (error: unknown) {
            if (error instanceof Error) {
                Logger.error(error.message);
                return {
                    isLogin: false,
                    message: error.message,
                    data: null,
                };
            } else {
                Logger.error('Unknown error');
                return {
                    isLogin: false,
                    message: "An error occurred.",
                    data: null,
                };
            }
        } 
    };
    
    async forgotPassword(email: string ): Promise<{ message:string, data:object | null}>{
        try{
            const user = await this.isUserExist(email);
            if(!user){
                return {
                    message: "Invalid email",
                    data: null
                };
            };
            
            const code = await this.otpHandler(user);
    
            await this.notificationService.send(
                email,
                "Reset Password",
                `Your code is ${code}`,
                `<p>Your code is: <strong>${code}</strong></p>`
            );
            const token= crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = await this.encryptionService.hash(token);
            await user.save();

            return {
                message: "Reset password code sent",
                data: {
                    userID: user._id,
                    token
                }
            };

        }catch (error: unknown) {
            if (error instanceof Error) {
                Logger.error(error.message);
            } else {
                Logger.error('Unknown error');
            }
            return {
                message: "An error occurred.",
                data: null
            };
        }

    };

    async resetPassword(resetToken:string,userID, password:string): Promise<{message:string, data:{user:object, token:string} | null}>{
        try{
            const user    = await User.findById(userID);
            if (!user)
                return { message: "User not found.", data: null };
            if(!user.verified){
                return{
                    message: "Email not verified.",
                    data: null,
                }
            }
            
            const isToken = await this.encryptionService.compare(resetToken, user.resetPasswordToken as string);
            if(!isToken || user.otpExpires instanceof Date && user.otpExpires.getTime() < Date.now()){
                return{
                    message: "Invalid token or expired.",
                    data: null
                }
            }
            
            user.password = password;
            user.resetPasswordToken = null;
            user.otp = null;
            user.otpExpires   = null;
            await user.save();
            
            const token = new TokenService().generateToken(user._id.toString());
            return{
                message: "password reset successful",
                data:{
                    user,
                    token
                }
            }
        }catch (error : unknown) {
            if (error instanceof Error) {
                Logger.error(error.message);
                return {
                    message: error.message,
                    data:null
                }
            }else{
                Logger.error('Unknown error');
                return {
                    message: "An error occurred.",
                    data:null
                }
            }
        };
    };

    async resendCodeForSignup(email:string): Promise<{ message:string }>{
        const user = await this.isUserExist(email);
        if(!user){
            return {
                message: "Invalid email"
            };
        };
        // let counter = user.otpCounter as number;
        // counter++;
        // await user.save();
        // if(counter as number > 5){
        //     setTimeout(()=>{
        //         user.otpCounter =0;
        //         user.save();
        //     })
        //     return{
        //         message: "You have exceeded the maximum number of code resend attempts. Please try again later."
        //     }
        // }
        const code = await this.otpHandler(user);

        await this.notificationService.send(
            email,
            "Verification Code",
             `Your code is ${code}`,
            `<p>Your code is: <b>${code}</b></p>`
        );
        return { message: "Verification code sent." };
        };

    async resendCodeForReset(email:string): Promise<{ message:string }>{
        const user = await this.isUserExist(email);
        if(!user){
            return {
                message: "Invalid email"
            };
        };
        // let counter = user.otpCounter as number;
        // counter++;
        // await user.save();

        // if(counter as number > 5){
        //     setTimeout(()=>{
        //         user.otpCounter =0;
        //         user.save();
        //     })
        //     return{
        //         message: "You have exceeded the maximum number of code resend attempts. Please try again later."
        //     }
        // }
        const code = await this.otpHandler(user);
        
        await this.notificationService.send(
            email,
            "Reset Password Code",
            `Your code is ${code}`,
            `<p>Your code is: <b>${code}</b></p>`
        );
        return { message: "Reset Password code sent." };

    };

    private async otpHandler(user){
        const { code, hashedCode, codeExpiration } = await this.codeService.codeGenerator();

        user.verified   = false;
        user.otpExpires = codeExpiration;
        user.otp        = hashedCode;
        await user.save();

        setTimeout(()=>{
            user.otp = null;
            user.otpExpires = null;
            user.save();
        }, 15 * 60 * 1000)

        return code;
    }

    private async isUserExist(email: string){
        const user = await User.findOne({email});
        return user;
    };
}

export default AuthServiceImpl;