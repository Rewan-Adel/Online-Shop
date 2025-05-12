import CartRepository from "../repositories/CartRepository";
import ProductService from "./ProductService";
import CartType       from "../types/CartType";
import Logger         from "../utils/Logger";
import Cart           from "../models/Cart.model";
import {Types }    from "mongoose";
import Product from "../models/product.model";
class CartServices implements CartRepository{
    private productService: ProductService = new ProductService();

    private async createCart(productId:Types.ObjectId,product_price:number, quantity: number, userId: string, discountNum?: number, discountType?: string): Promise<CartType | null>{ 
        try{
            const cart = await Cart.create({
                userId,
                products: [{
                    product: productId,
                    quantity,
                    discount_number: discountNum,
                    discount_type: discountType
                }],
                total_price: product_price * quantity,
                total_quantity: quantity
            });
            return cart as unknown as CartType;
        }
        catch(error){
            Logger.error(error);
            return null;
        }
    };

    async addProductToCart(slug: string, quantity: number, userId: string, discountNum?: number, discountType?: string): Promise<CartType | string>{
        try{
            // const product = await this.productService.findOne(slug);
            // if(!product) return "Product not found";

            // if(quantity > product.stock_num) return `Only ${product.stock_num} left in stock for ${product.name}`;
            // else if(quantity <= 0) return "Invalid quantity";
            
            const product = await this.productService.checkProductQuantity(slug, quantity);
            if(typeof product === "string") return product;
            if(!product) return "Product not found";
            
            const cart = await Cart.findOne({userId: userId});
            if(!cart){
                await this.createCart(product._id, product.original_price, quantity, userId, discountNum, discountType);
            }else{
                const productIndex = cart.products.findIndex((p) => String(p.product) ===  String(product._id));
                if(productIndex == -1){
                    cart.products.push({product:  product._id, quantity});
                }else{
                    cart.products[productIndex].quantity += quantity;
                }
                cart.total_quantity += quantity;
                cart.total_price += product.original_price * quantity;
                await cart.save();
            }
            // if(discountNum && discountType){
            //     cart.products.discount_number = discountNum;
            //     cart.products.discount_type = discountType;
            //     cart.total_price = product.original_price * quantity * (1 - discountNum);
            //     await cart.save();
            // }

            // await Product.updateOne({_id: product._id}, {stock_num: product.stock_num - quantity});
            const updatedCart = await Cart.findOne({userId: userId}).populate("products.product");
            return updatedCart as unknown as CartType;
        }
        catch(error){
            Logger.error(error);
            return "Internal server error";
        }
    };

    async removeProductFromCart(slug: string, userId: string): Promise<CartType | null>{
        try{
            const product = await this.productService.findOne(slug);
            if(!product) return null;

            const cart = await Cart.findOne({userId: userId});
            if(!cart) return null;

            const productIndex = cart.products.findIndex((p) => String(p.product) ===  String(product._id));
            if(productIndex == -1) return null;

            cart.products[productIndex].quantity --;
            cart.total_quantity --;
            cart.total_price -= product.original_price;
            if(cart.products[productIndex].quantity == 0){
                cart.products.splice(productIndex, 1);
            };

            await cart.save();
            const updatedCart = await Cart.findOne({userId: userId}).populate("products.product");
            return updatedCart as unknown as CartType;
        }
        catch(error){
            Logger.error(error);
            return null;
        }
    };

    async removeAllProductsFromCart(userId?: string): Promise<boolean>{
        try{
            const cart = await Cart.findOne({userId: userId});
            if(!cart) return false;
            
            cart.products.splice(0, cart.products.length);
            cart.total_price = 0;
            cart.total_quantity = 0;
            // cart.discount_number = 0;
            // cart.discount_type = "";
            await cart.save();

            return true;
        }catch(error){
            Logger.error(error);
            return false;
        }
    };

    async getCart(userId: string): Promise< CartType | null >{
        try{
            const cart = await Cart.findOne({userId: userId}).populate("products.product");
            if(!cart) return null;
            return cart as unknown as  CartType ;
        }
        catch(error){
            Logger.error(error);
            return null;    
        }
    };
};

export default CartServices;