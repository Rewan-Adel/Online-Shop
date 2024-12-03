import { Response } from "express";

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

