import { Request, Response } from "express";
import { successResponse, failedResponse, handleError} from "../middlewares/responseHandler";

import AuthRepository from "../repositories/AuthRepository";
import AuthValidator  from "../validators/AuthValidator";
import { ValidationResult } from "joi";

class AuthController{
    private authService: AuthRepository;
    constructor(authService: AuthRepository) {
        this.authService = authService;
    };

    async signup(req: Request, res:Response): Promise<void> {
        try {
            if (!this.handleValidation(new AuthValidator().signupValidate(req.body), res)) return;

            const { username, email, password } = req.body;
            const response = await this.authService.signup(username, email, password);

            if(!response.isSignup) return failedResponse(res, 400, response.message);

            return successResponse(res, 201, response.message, response.data?? undefined);
        
        }catch (error: unknown) {
            handleError(error, res);
        };
    };
    
    async ValidateUserEmail(req:Request, res:Response){
        try{
            const {email, code} = req.body;
        
            const response = await this.authService.ValidateUserEmail(email,code)
            if(response.isValid){
                res.cookie("token",
                    response.data?.token, 
                    {httpOnly: true, secure: true, sameSite: "none" , maxAge: 90 * 24 * 60 * 60 * 1000});
                return successResponse(res, 200, response.message, response.data?? undefined);
            }else
                return failedResponse(res, 400, response.message);

        }catch (error: unknown) {
            handleError(error, res);
        };
    };

    async login(req: Request, res: Response): Promise<void> {
        try {
            if (!this.handleValidation(new AuthValidator().loginValidate(req.body), res)) return;

            const {email, password } = req.body;
            const response = await this.authService.login(email, password );
            if(!response.isLogin) 
                return failedResponse(res, 400, response.message);
            else{
            res.cookie("token",
                response.data?.token, 
                {httpOnly: true, secure: true, sameSite: "none", maxAge: 90 * 24 * 60 * 60 * 1000});
                return successResponse(res, 200, response.message, response.data ?? undefined);}
        } catch (error: unknown) {
            handleError(error, res);
        };
    };

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            if (!this.handleValidation(new AuthValidator().forgotPasswordValidate(req.body), res)) return;
            const { email } = req.body;
            const response = await this.authService.forgotPassword(email);

            if(!response.isSent)
                return failedResponse(res, 400, response.message);

            return successResponse(res, 200, response.message, response.data??undefined);
        }catch (error: unknown) {
            handleError(error, res);
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try { 
            if (!this.handleValidation(new AuthValidator().resetPasswordValidate(req.body), res)) return;

            const {newPassword } = req.body;
            const {resetToken, userID}  = req.params;

            const response = await this.authService.resetPassword(resetToken, userID, newPassword);
            if(!response.isReset)
                return failedResponse(res, 400, response.message);
            
            return successResponse(res, 200, response.message);

        }catch (error: unknown) {
            handleError(error, res);
        };
    };

    async resendCodeForSignup(req: Request, res: Response): Promise<void> {
        try { 
            const { email } = req.body;

            const response = await this.authService.sendVerificationCode(email)
            if(!response.isSent)
                return failedResponse(res, 400, response.message);

            return successResponse(res, 200, response.message);

        } catch (error: unknown) {
            handleError(error, res);
        };
    };

    async resendCodeForReset(req: Request, res: Response): Promise<void> {
        try { 
            const { email } = req.body;

            const response = await this.authService.sendResetPasswordCode(email);
            if(!response.isSent)
                return failedResponse(res, 400, response.message)

            return successResponse(res, 200, response.message, response.data??undefined);

        } catch (error: unknown) {
            handleError(error, res);
        }
    }

    private handleValidation(validation: ValidationResult, res: Response): boolean {
        const {  error } = validation;
        if (error) {
            failedResponse(res, 400, error.message);
            return false;
        }
            return true;
    }
};


export default AuthController;