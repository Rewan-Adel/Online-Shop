import { Request, Response, NextFunction } from "express";
import { failedResponse } from "../../../middlewares/responseHandler";
import Logger from "../../../logger";
import TokenService from "../services/TokenService";
import User from  "../../user/models/user.model";

interface Payload {
    userID: string;
    [key: string]: unknown;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: Payload; 
    }
}

class AuthMiddleware {
    private tokenService: TokenService;

    constructor(tokenService: TokenService) {
        this.tokenService = tokenService;
    };

    public async protect(req: Request, res: Response, next: NextFunction): Promise<void> {
        let token: string | undefined;
        if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) 
            return failedResponse(res, 404, "Token not found");     

        try {
            const decoded = this.tokenService.verifyToken(token) as Payload;
            const user    = await User.findById(decoded.userID);

            if (!user)
                return failedResponse(res, 400, "Invalid or expired token.");
            
            if (user.resetPasswordExpires && user.resetPasswordExpires.getTime() < Date.now())
                return failedResponse(res, 400, "Token has expired.");
            
            if (!user.verified) 
                return failedResponse(res, 401, "Please, verify your email.");
            
            req.user = {
                userID: user._id.toString(),
                email: user.email,
                ...user.toObject(),
            };
            next();
        } catch (error) {
            Logger.error(error.message);
            return failedResponse(res, 500, "Authorization failed.");
        }
    };

    
}

export default AuthMiddleware;