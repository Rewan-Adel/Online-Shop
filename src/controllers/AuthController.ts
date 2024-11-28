import { Request, Response } from "express";
import { successResponse, failedResponse } from "../middlewares/responseHandler";
import { IAuthService } from "../Interfaces/IAuthService";
import AuthValidator from "../utils/AuthValidator";
import Logger from "../logger";

class signupController{
    private authService: IAuthService;
    constructor(authService: IAuthService) {
        this.authService = authService;
    };
    private handleValidation(validation: any, res: Response): boolean {
        const { value, error } = validation;
        if (error) {
            failedResponse(res, 400, error.message);
            return false;
        }
        return true;
    }
    async signup(req: Request, res: Response): Promise<void> {
        try {
            if (!this.handleValidation(new AuthValidator().signupValidate(req.body), res)) return;

            const { username, email, password } = req.body;
            const response = await this.authService.signup(username, email, password);
    
            return successResponse(res, 201, response.message, response.data);
        } catch (error) {
            Logger.error(error.message);
            return failedResponse(res, 500, "Internal Server Error");
        }
    };

    async login(req: Request, res: Response): Promise<void> {
        try {
            if (!this.handleValidation(new AuthValidator().loginValidate(req.body), res)) return;

            const {email, password } = req.body;
            const response = await this.authService.login(email, password );
            if(!response.isLogin) 
                return failedResponse(res, 400, response.message);
            else
                return successResponse(res, 200, response.message, response.data);
        } catch (error) {
                Logger.error(error.message);
                return failedResponse(res, 500, "Internal Server Error");
        }
    };

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            if (!this.handleValidation(new AuthValidator().forgotPasswordValidate(req.body), res)) return;
            const { email } = req.body;
            const response = await this.authService.forgotPassword(email);

            return successResponse(res, 200, response.message);
        } catch (error) {
            Logger.error(error.message);
            return failedResponse(res, 500, "Internal Server Error");
    }
    };

    async resetPassword(req: Request, res: Response): Promise<void> {
        try { 
            if (!this.handleValidation(new AuthValidator().resetPasswordValidate(req.body), res)) return;

            const { newPassword } = req.body;
            const {token, userID} = req.params;

            const response = await this.authService.resetPassword(token, userID, newPassword);
            return successResponse(res, 200, response.message);

        } catch (error) {
            Logger.error(error.message);
            return failedResponse(res, 500, "Internal Server Error");
    }
    };
};

export default signupController;