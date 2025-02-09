import Joi from "joi";
import { Request } from "express";

export const createProductValidate = (req: Request)=>{
    const {error, value} = createProductSchema.validate(req);
    return{
        value,
        error
    }
};

export const updateProductValidate = (req: Request)=>{
    const {error, value} = updateProductSchema.validate(req);
    return{
        value,
        error
    }
};


const createProductSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base" : "Name must be a string",
        "string.empty" : "Name is not allowed to be empty.",
        "any.required": "Name is required",
    }),
    category:Joi.string().required().messages({
        "string.base" : "Category must be a string",
        "string.empty" : "Category is not allowed to be empty.",
        "any.required": "Category is required",
    }),
    brand: Joi.string().required().messages({
        "string.base" : "Brand must be a string",
        "string.empty" : "Brand is not allowed to be empty.",
        "any.required": "Brand is required",
    }),
    description:Joi.string().required().messages({
        "string.base" : "Description must be a string",
        "string.empty" : "Description is not allowed to be empty.",
        "any.required": "Description is required",
    }),
    original_price:Joi.number().required().messages({
        "number.base" : "Price must be a number.",
        "any.required": "Price is required",
    }),
    stock_num:Joi.number().required().messages({
        "number.base" : "Number of stock must be a number.",
        "any.required": "Number of stock is required",

    }),
    // variations:Joi.array().items(Joi.object({
    //     color: Joi.array().items(Joi.object({
    //         hexadecimal:Joi.string().messages({
    //             "string.base" : "Hexadecimal must be a string",
    //             "string.empty" : "Hexadecimal is not allowed to be empty.",
    //         }),
    //         plus_price:Joi.number().messages({
    //             "number.base" : "Price must be a number."
    //         }),
    //         stock_num:Joi.number().messages({
    //             "number.base" : "Number of stock must be a number."
    //         })
    //     })),
    //     size:Joi.string().messages({
    //         "string.base" : "Size must be a string",
    //         "string.empty" : "Size is not allowed to be empty.",
    //         "any.required": "Size is required",
    //     }),
    // })),
    available:Joi.boolean().messages({
        "boolean.base": "Available must be true or false"
    }),
    isOffered:Joi.boolean().messages({
        "boolean.base": "Offered must be true or false"
    })
}).unknown(); 

const updateProductSchema =Joi.object({
    name: Joi.string().messages({
        "string.base" : "Name must be a string",
        "string.empty" : "Name is not allowed to be empty.",
    }),
    category:Joi.string().messages({
        "string.base" : "Category must be a string",
        "string.empty" : "Category is not allowed to be empty.",
    }),
    brand: Joi.string().messages({
        "string.base" : "Brand must be a string",
        "string.empty" : "Brand is not allowed to be empty.",
    }),
    description:Joi.string().messages({
        "string.base" : "Description must be a string",
        "string.empty" : "Description is not allowed to be empty.",
    }),
    original_price:Joi.number().messages({
        "number.base" : "Price must be a number.",
    }),
    stock_num:Joi.number().messages({
        "number.base" : "Number of stock must be a number.",

    }),
    // variations:Joi.array().items(Joi.object({
    //     color: Joi.array().items(Joi.object({
    //         hexadecimal:Joi.string().messages({
    //             "string.base" : "Hexadecimal must be a string",
    //             "string.empty" : "Hexadecimal is not allowed to be empty.",
    //         }),
    //         plus_price:Joi.number().messages({
    //             "number.base" : "Price must be a number."
    //         }),
    //         stock_num:Joi.number().messages({
    //             "number.base" : "Number of stock must be a number."
    //         })
    //     })),
    //     size:Joi.string().messages({
    //         "string.base" : "Size must be a string",
    //         "string.empty" : "Size is not allowed to be empty.",
    //         "any.required": "Size is required",
    //     }),
    // })),
    available:Joi.boolean().messages({
        "boolean.base": "Available must be true or false"
    }),
    isOffered:Joi.boolean().messages({
        "boolean.base": "Offered must be true or false"
    })
}).unknown(); 


