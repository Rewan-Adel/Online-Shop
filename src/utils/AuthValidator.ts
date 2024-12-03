import Joi from "joi";
import { Request } from "express";

class AuthValidator{
    public signupValidate(req:Request){
        const { error, value } = this.signupSchema.validate(req);
        return {
            value,
            error
        };
    };

    public loginValidate(req: Request){
        const { error, value } = this.loginSchema.validate(req);
        return {
            value,
            error
        };
    };

    public forgotPasswordValidate(req: Request){
        const { error, value } = this.forgotPasswordSchema.validate(req);
        return {
            value,
            error
        };
    };

    public resetPasswordValidate(req: Request){
        const { error, value } = this.resetPasswordSchema.validate(req);
        return {
            value,
            error
        };
    };


    private signupSchema = Joi.object({
    username: Joi.string().min(8).max(200).required().trim().messages({
        "string.empty" : "Username is required.",
        "string.min" : "Username must be 8 characters at least.",
    }),
    email: Joi.string().email().max(200).required().trim().messages({
        "string.empty" : "Email is required.",
        "string.email": "Email must be a valid address.",
    }),
    password:Joi.string().min(8).max(200).required().trim().messages({
        "string.empty" : "Password is required.",
        "string.min" : "Password must be 8 characters at least.",
    }),
    });

    private loginSchema = Joi.object({
        email: Joi.string().email().max(200).required().trim().messages({
            "string.empty" : "Email is required.",
            "string.email": "Email must be a valid address.",
        }),
    }).unknown();

    private forgotPasswordSchema = Joi.object({
            email: Joi.string().email().max(200).required().trim().messages({
                "string.empty" : "Email is required.",
                "string.email": "Email must be a valid address.",
            })
    });
    
    private resetPasswordSchema = Joi.object({
        newPassword:Joi.string().min(8).max(200).required().trim().messages({
            "string.empty" : "Password is required.",
            "string.min" : "Password must be 8 characters at least.",
        }),
    });    
}

export default AuthValidator;