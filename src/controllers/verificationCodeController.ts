//VerificationCodeController
import { Request, Response } from "express";
import Logger from "../logger";
import { successResponse, failedResponse } from "../middlewares/responseHandler";
import { ICodeService } from "../repositories/ICodeService ";

class VerificationCodeController{
    private verificationCodeService : ICodeService

    constructor(verificationCodeService:ICodeService){
        this.verificationCodeService = verificationCodeService;
    };
    async codeReSender(req:Request, res:Response){
        // const {email} = req.body;
        // const response = await this.verificationCodeService.codeReSender(email);
        // if(!response.isSent){
            // return failedResponse(res, response.status, response.message)
        // }
        return successResponse(res, 200)
    };

    async codeVerifier(req:Request, res:Response){
        try{
            const {email, code} = req.body;
        
            const response = await this.verificationCodeService.codeVerifier(email, code);
            if(response.isValid)
                return successResponse(res, 200, "Email verified successfully", response.data?? undefined);
            else
                return failedResponse(res, 400, "Invalid code!")
        }
        catch (error : any) {
            Logger.error(error.message);
            console.log(error);
            
            return failedResponse(res, 500, error.message);
        }
    };
    
};

export default VerificationCodeController;