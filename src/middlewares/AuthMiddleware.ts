import { Request, Response, NextFunction } from "express";
import { failedResponse } from "./responseHandler";
import Logger from "../utils/Logger";
// import Token from "../utils/Token";
import User from  "../models/user.model";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        user: {
            userID: string;
            [key: string]: unknown;
        };
    }
}

class AuthMiddleware {
    private secret: string;
    private expiresIn: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || "defaultSecret";
        this.expiresIn = "90d";
    };
    public async authenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
        let token: string | undefined;
        if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token || token === "undefined" || token === "null")     
            return failedResponse(res, 404, "Token not found");     

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret") as JwtPayload;
            const user    = await User.findById(decoded.userID);            
            if (!user)
                return failedResponse(res, 400, "Invalid or expired token.");
            
            if(user.otpExpires instanceof Date && user.otpExpires.getTime() < Date.now())
                return failedResponse(res, 400, "Token has expired.");
            
            // if (!user.verified) 
            //     return failedResponse(res, 401, "Please, verify your email.");
            
            req.user = {
                userID: user._id.toString(),
                ...user.toObject(),
            };
            next();
        }catch (error: unknown) {
            console.log(error);
            if (error instanceof Error) {
                //Logger.error(error)
                return failedResponse(res, 500, error.message);
            } else {
                Logger.error('Unknown error');
                return failedResponse(res, 500);
            }
        };
    };


    public async isAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.user) return failedResponse(res, 401, "Unauthorized");
        if (req.user.role !== "admin") return failedResponse(res, 401, "Unauthorized");
        next();
    };

    generateToken(userId:string){
        const token = jwt.sign({
            userID: userId,
        }, this.secret);

        return token;
    }

    verifyToken(token: string) {
        return jwt.verify(token, this.secret) ;
    }
}

export default AuthMiddleware;
