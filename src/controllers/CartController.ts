import { Request, Response } from "express";
import { successResponse, failedResponse, handleError } from "../middlewares/responseHandler";
import CartRepository from "../repositories/CartRepository";

class CartController{
    private cartRepository: CartRepository;
    constructor(cartRepository: CartRepository){
        this.cartRepository = cartRepository;
    };

    async addProductToCart(req: Request, res: Response): Promise<void>{
        try {
            const { slug, quantity } = req.body;
            if(!slug) return failedResponse(res, 400, "Missing required product slug");
            else if(!quantity) return failedResponse(res, 400, "Missing required quantity");
            
            const response = await this.cartRepository.addProductToCart(slug, quantity, req.user?.userID as string);
            if (typeof response === "string") return failedResponse(res, 400, response);
            return successResponse(res, 200, "Product added to cart", {cart: response});
        } catch (error) {
            handleError(error, res);
        }
    };
    
    async removeProductFromCart(req: Request, res: Response): Promise<void>{
        try {
            const { slug } = req.params;
            if(!slug) return failedResponse(res, 400, "Missing required product slug");
            
            const response = await this.cartRepository.removeProductFromCart(slug, req.user.userID);
            if(!response) return failedResponse(res, 404, "Product not found");
            return successResponse(res, 200, "Product removed from cart", {cart: response});
        } catch (error) {
            handleError(error, res);
        }
    };

    async removeAllProductsFromCart(req: Request, res: Response): Promise<void>{
        try {
            const response = await this.cartRepository.removeAllProductsFromCart(req.user.userID);
            if(!response) return failedResponse(res, 404, "Cart not found");
            return successResponse(res, 200, "All products removed from cart");
        } catch (error) {
            handleError(error, res);
        }
    };

    async getCart(req: Request, res: Response): Promise<void>{
        try {
            const response = await this.cartRepository.getCart(req.user.userID);
            if(!response) return successResponse(res, 200, "Cart retrieved", {cart: []});
            return successResponse(res, 200, "Cart retrieved", {cart: response});
        } catch (error) {
            handleError(error, res);
        }
    };
};

export default CartController;