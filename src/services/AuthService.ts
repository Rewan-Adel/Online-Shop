import crypto from "crypto";    
import User from "../models/user.model";

import AuthRepository    from "../repositories/AuthRepository";
import UserRepository    from "../repositories/UserRepository";

import Otp               from "../utils/otp";
import Encryption        from "../utils/Encryption";
import INotification     from "../utils/INotification";
import { IToken } from "../utils/Token";
import Logger            from "../utils/Logger";
import UserType from "../types/userType";

class AuthService implements AuthRepository {
    private userService : UserRepository;
    private Token: IToken;
    
    private notificationService: INotification;
    private Encryption: Encryption;
    private otp = new Otp();

    constructor(
        userService: UserRepository,
        Token: IToken,
        Encryption: Encryption,
        notificationService: INotification
    ) {
        this.Token = Token;
        this.userService = userService;
        this.notificationService = notificationService;
        this.Encryption = Encryption;
    };

    public async signup( username: string, email: string, password: string ): Promise<{isSignup:boolean, message:string, data?:object | null}>{
        const userExist = await this.userService.findByEmail(email);
        if(userExist && userExist.active && userExist.verified){
            return {
                isSignup: false,
                message: "Email already exists"
            };
        };
        
        if(userExist && !userExist.verified){
            const code    = await this.generateAndSaveOtp(userExist);
            await this.notificationService.send(
                email,
                "Verification Code",
                `Your code is ${code}`,
                `<p>Your code is: <strong>${code}</strong></p>`
            );

            return {
                isSignup: true,
                message: "Account already exists but not verified. Verification code resent.",
                data: { user: userExist }
            };
        };

        if (userExist && !userExist.active) {
            return {
                isSignup: false,
                message: "Account is inactive. Please contact support.",
            };
        };

        const newUser =  new User({username, email, password});
        await newUser.save();
        const code    = await this.generateAndSaveOtp(newUser);
        Logger.info(`Verification code ${code} for ${email}`);
        await this.notificationService.send(
            email,
            "Verification Code",
            `Your code is ${code}`,
            `<p>Your code is: <strong>${code}</strong></p>`
        );

        return {
            isSignup: true,
            message: "Verification code sent.",
            data: {user:newUser}
        };
    };

    public async ValidateUserEmail(email: string, code: string): Promise<{isValid:boolean, message:string, data?:{user:UserType, token:string} | null}> {
        try{
            let user = await this.userService.findByEmail(email);
            if(!user ){
                return {
                    isValid: false,
                    message: "User not found!",
                    data: null
                }
            }
            const isValid = user.otp && await this.Encryption.compare(code.toString(), user.otp as string);
            const isExpired = user.otpExpires instanceof Date &&  user.otpExpires.getTime()< Date.now();
            
            if(user.otp == null || !isValid || isExpired){
                return {
                    isValid: false,
                    message: 'Invalid verification code or expired !',
                    data: null
                }
            };
            
            user = await this.userService.updateUser(user._id.toString(), {
                verified: true,
                active  : true,
                otpCounter:0,
                otp: null,
                otpExpires: null
            });
            
            if (!user) {
                return {
                    isValid: false,
                    message: "User not found after update.",
                    data: null
                };
            }
            const token = this.Token.generateToken(user._id.toString());
            return {
                isValid: true,
                message: "Email verified successfully",
                data:{
                    user,
                    token
                }
            };

        }catch (error: unknown) {
            console.log(error);
            
            if (error instanceof Error) {
               Logger.error(error)
            } else {
                Logger.error('Unknown error');
            }
            return {
                isValid: false,
                message: "Internal server error",
                data: null,
            };
        }
    };
    
    public async login(email: string, password: string ): Promise<{isLogin: boolean, message:string,  data?:{user:UserType, token:string} | null }>{
        try {
            const user = await this.userService.findByEmail(email);
            if (!user || !await this.Encryption.compare(password.trim(), user.password as string)) {
                return {
                    isLogin: false,
                    message: "Invalid email or password.",
                    data: null,
                };
            };
            const token = this.Token.generateToken(user._id.toString());
            if(!user.verified && user.active){
                const code    = await this.generateAndSaveOtp(user);
                await this.notificationService.send(
                    email,
                    "Verification Code",
                    `Your code is ${code}`,
                    `<p>Your code is: <strong>${code}</strong></p>`
                );
    
                return {
                    isLogin:  true,
                    message: "Account already exists but not verified. Verification code resent.",
                    data: { 
                        user,
                        token
                    }
                };
            };
            if(!user.active){
                return {
                    isLogin: false,
                    message: "Account is inactive. Please contact support.",
                    data: null,
                };
            }
            
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
               Logger.error(error)
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
    
    public async forgotPassword(email: string ): Promise<{isSent:boolean, message:string, data:{ userID: string,
        resetToken: string} | null} >{
        try{
            const user = await this.userService.findByEmail(email);
            if(!user){
                return {
                    isSent: false,
                    message: "Invalid email",
                    data: null
                };
            };
            // if (!user.verified && active) {
            //     return {
            //         isSent: false,
            //         message: "Your email is not verified. Please verify your email first.",
            //         data: null
            //     };
            // };

            if (!user.active) {
                return {
                    isSent: false,
                    message: "Account is inactive. Please contact support.",
                    data:null
                };
            };

            const code = await this.generateAndSaveOtp(user);
    
            await this.notificationService.send(
                email,
                "Reset Password",
                `Your code is ${code}`,
                `<p>Your code is: <strong>${code}</strong></p>`
            );
            const token= await crypto.randomBytes(20).toString('hex');
            
            await this.userService.updateUser(user._id.toString(),{
                resetPasswordToken: await this.Encryption.hash(token),
                verified: false
            });

            return {
                isSent: true,
                message: "Reset password code sent",
                data: {
                    userID: user._id.toString(),
                    resetToken: token
                }
            };

        }catch (error: unknown) {
            if (error instanceof Error) {
               Logger.error(error)
            } else {
                Logger.error('Unknown error');
            }
            return {
                isSent: false,
                message: "An error occurred.",
                data: null
            };
        }

    };

    public async resetPassword(resetToken:string,userID, password:string): Promise<{isReset: boolean, message:string, data:{user:object, token:string} | null}>{
        try{
            const user    = await this.userService.findById(userID.toString());
            if (!user)
                return {
                    isReset:false,
                    message: "User not found.",
                    data: null
                };
            if(!user.verified){
                return {
                    isReset:false,
                    message: "Email not verified.",
                    data: null
                };
            }
            
            const isToken = await this.Encryption.compare(resetToken, user.resetPasswordToken as string);
            if(!isToken || user.otpExpires instanceof Date && user.otpExpires.getTime() < Date.now()){
                return{
                    isReset:false,
                    message: "Invalid token or expired.",
                    data: null
                }
            }
            await this.userService.updateUser(user._id.toString(), {
                password: password,
                otp: null,
                otpExpires: null,
                resetPasswordToken: null
            });
            
            const token = this.Token.generateToken(user._id.toString());
            return{
                isReset:true,
                message: "password reset successful",
                data:{
                    user,
                    token
                }
            }
        }catch (error : unknown) {
            if (error instanceof Error) {
               Logger.error(error)
                return {
                    isReset:false,
                    message: error.message,
                    data:null
                }
            }else{
                Logger.error('Unknown error');
                return {
                    isReset:false,
                    message: "An error occurred.",
                    data:null
                }
            }
        };
    };

    public async sendSignupCode(email:string): Promise<{isSent:boolean, message:string }>{
        const user = await this.userService.findByEmail(email);
        if(!user){
            return {
                isSent: false,
                message: "Invalid email"
            };
        };
        const checkCounter = await this.checkAndIncrementOtpCounter(user);
        if(!checkCounter.isAllowed){
            return {
                isSent:false,
                message: checkCounter.message
            }
        }
        const code = await this.generateAndSaveOtp(user);

        try{
            await this.notificationService.send(
            email,
            "Verification Code",
            `Your code is ${code}`,
            `<p>Your code is: <b>${code}</b></p>`
            );
        }catch (error) {
            console.error("Error sending email:", error);
            return {
                isSent: false,
                message: "Failed to send verification code. Please try again later."
            };
        };

        return { 
            isSent: true,
            message: "Verification code sent."
        };
        
    };

    public async sendResetPasswordCode(email:string): Promise<{ message:string }>{
        const user = await this.userService.findByEmail(email);
        if(!user){
            return {
                message: "Invalid email"
            };
        };
        const checkCounter = await this.checkAndIncrementOtpCounter(user);
        if(!checkCounter.isAllowed){
            return {
                message: checkCounter.message
            }
        }
        const otpCode = await this.generateAndSaveOtp(user);
        try {
            await this.notificationService.send(
                email,
                "Reset Password Code",
                `Your code is ${otpCode}`,
                `<p>Your code is: <b>${otpCode}</b></p>`
            );
        } catch (error) {
            console.error("Error sending email:", error);
            return { message: "Failed to send reset password code. Please try again later." };
        }
    
        return { message: "Reset password code sent." };

    };

    private async checkAndIncrementOtpCounter(user){
        const maxAttempts = 5;
        let otpCounter = user.otpCounter as number;
        
        if(otpCounter >= maxAttempts){
            return{
                isAllowed: false,
                message: "You have exceeded the maximum number of code resend attempts. Please try again later."
            }
        };
        
        await this.userService.updateUser(user._id, {
            otpCounter : ++otpCounter
        });

        return { isAllowed: true, message: "" };
    };

    private async generateAndSaveOtp(user){
        const { code, hashedCode, codeExpiration } = await this.otp.otpGenerator();

        await this.userService.updateUser(user._id,{
            otpExpires : codeExpiration,
            otp        : hashedCode
        });

        return code;
    };
}

export default AuthService;