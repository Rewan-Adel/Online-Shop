import { Response } from "express";
import Logger from "../utils/Logger";

export const successResponse= (res:Response, statusCode?:number, msg? : string, data?:object)=>{
    res.status(statusCode?? 200).json({
        status  : true,
        message : msg  || "",
        data    : data || null
    })
};

export const failedResponse = (res:Response, statusCode?:number, msg? : string, data?:object)=>{
    res.status(statusCode?? 500).json({
        status  : false,
        message : msg  || "Internal Server Error",
        data    : data || null
    })
};

export const handleError = (error: unknown, res: Response) =>{
    if (error instanceof Error) {
        Logger.error(error)
        failedResponse(res, 500, error.message);
    } else {
        Logger.error('Unknown error');
        failedResponse(res, 500);
    }
}