import CartRepository from "../repositories/CartRepository";
import ProductService     from "./ProductService";
import Cart from "../models/Cart.model";
import { ObjectId } from "mongoose";
import CartType from "../types/CartType";

class CartServices implements CartRepository{
    private productService: ProductService = new ProductService();

    async addProductToCart(productID: string, quantity: number, userId: ObjectId ): Promise<boolean | null>{
        try{
            const product = await this.productService.findProductById(productID);
            if(!product) return null;

            const cart = await Cart.findOne({userId: userId});
            if(!cart){
                await Cart.create({
                    userId,
                    products: [{product: productID, quantity}],
                    total_price: product.original_price * quantity,
                    total_quantity: quantity
                });
            }else{
                const productIndex = cart.products.findIndex((product) => product.product == productID);
                if(productIndex == -1){
                    cart.products.push({product: productID, quantity});
                }else{
                    cart.products[productIndex].quantity += quantity;
                }
                cart.total_quantity += quantity;
                cart.total_price += product.original_price * quantity;
                await cart.save();
            }
            return true;
        }
        catch(error){
            return null;
        }
    };

    async removeProductFromCart(productID: string, userId: string): Promise<boolean | null>{
        try{
            const product = await this.productService.findProductById(productID);
            if(!product) return null;

            const cart = await Cart.findOne({userId: userId});
            if(!cart) return null;

            const productIndex = cart.products.findIndex((p) =>p.product == productID);
            if(productIndex == -1) return null;

            cart.products[productIndex].quantity --;
            cart.total_quantity --;
            cart.total_price -= product.original_price;
            if(cart.products[productIndex].quantity == 0){
                cart.products.splice(productIndex, 1);
            };

            await cart.save();
            return true;
        }
        catch(error){
            return null;
        }
    };

    async removeAllProductsFromCart(userId?: string): Promise<void>{
        if (userId) {
            await Cart.deleteOne({userId: userId});
        }
    };

    async getCart(userId: string): Promise< CartType | null >{
        try{
            const cart = await Cart.findOne({userId: userId});
            if(!cart) return null;
            return cart as unknown as  CartType ;
        }
        catch(error){
            return null;    
        }
    };
};

export default CartServices;