import Joi from "joi";
import { Request } from "express";

export const profileValidate = (req: Request)=>{
        const { error, value } = profileSchema.validate(req,{
            abortEarly: false, 
            stripUnknown: true,
        });
        return {
            value,
            error
        };
    };

export const emailValidate = (req: Request)=>{
    const { error, value } = emailSchema.validate(req,{
        abortEarly: false, 
        stripUnknown: true,
    });
    return {
        value,
        error
    };
};

    const profileSchema = Joi.object({
    username: Joi.string().min(6).max(200).trim().messages({
        "string.empty" : "Username is not allowed to be empty.",    
        "string.min" : "Username must be 6 characters at least.",
        "string.max" : "Username must be 200 characters at most.",
        }),
    gender:Joi.string().trim().valid("Female", "female", "male", "Male").messages({
        "string.valid": "Gender must be only female or male"
        }),

    location: Joi.object({
        longitude: Joi.number().messages({
            "number.base": "Longitude must be a number",
        }),
        latitude: Joi.number().messages({
            "number.base": "Latitude must be a number",
        }),
        city   : Joi.string().messages({
            "string.base": "City must be a string",
        }),
        state  : Joi.string().messages({
            "string.base": "State must be a string",
        }),
        country: Joi.string().messages({
            "string.base": "Country must be a string",
        }),
        fullAddress: Joi.string().required().messages({
            "string.empty": "Full Address is required",
            "string.base": "Full Address must be a string"
        })
    }).messages({
        "object.base": "Location must be an object"
    }),
    });

    const emailSchema = Joi.object({
        newEmail: Joi.string().email().max(200).required().trim().messages({
            "string.empty" : "Email is required.",
            "string.email": "Email must be a valid address.",
        }),
    });