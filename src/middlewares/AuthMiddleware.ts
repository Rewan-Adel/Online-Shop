import { Request, Response, NextFunction } from "express";
import { failedResponse } from "./responseHandler";
import Logger from "../utils/Logger";
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
            return failedResponse(res, 404, "Please, login to get access.");     

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
            if (error instanceof jwt.TokenExpiredError) {
                return failedResponse(res, 401, "Token has expired. Please login again.");
            } else if (error instanceof jwt.JsonWebTokenError) {
                return failedResponse(res, 400, "Invalid token.");
            } else {
                Logger.error("Unexpected authentication error:", error);
                return failedResponse(res, 500, "An unexpected error occurred.");
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
        }, this.secret,
        { expiresIn: this.expiresIn });

        return token;
    }

    verifyToken(token: string) {
        return jwt.verify(token, this.secret) ;
    }
}

export default AuthMiddleware;
