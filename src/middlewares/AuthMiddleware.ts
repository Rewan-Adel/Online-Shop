import { Request, Response, NextFunction } from "express";
import { failedResponse } from "./responseHandler";
import Logger from "../shared/Logger";
import Token from "../shared/Token";
import User from  "../models/user.model";
import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            userID: string;
            [key: string]: unknown;
        };
    }
}

class AuthMiddleware {
    private Token: Token;

    constructor(Token: Token) {
        this.Token = Token;
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
            const decoded = this.Token.verifyToken(token) as JwtPayload;
            const user    = await User.findById(decoded.userID);

            if (!user)
                return failedResponse(res, 400, "Invalid or expired token.");
            
            if(user.otpExpires instanceof Date && user.otpExpires.getTime() < Date.now())
                return failedResponse(res, 400, "Token has expired.");
            
            if (!user.verified) 
                return failedResponse(res, 401, "Please, verify your email.");
            
            req.user = {
                userID: user._id.toString(),
                ...user.toObject(),
            };
            next();
        }catch (error: unknown) {
            if (error instanceof Error) {
                Logger.error(error.message);
                return failedResponse(res, 500, error.message);
            } else {
                Logger.error('Unknown error');
                return failedResponse(res, 500);
            }
        };
    };

}

export default AuthMiddleware;
