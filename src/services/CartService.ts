import CartRepository from "../repositories/CartRepository";
import ProductService from "./ProductService";
import CartType       from "../types/CartType";
import Logger         from "../utils/Logger";
import Cart           from "../models/Cart.model";
class CartServices implements CartRepository{
    private productService: ProductService = new ProductService();

    async addProductToCart(slug: string, quantity: number, userId: string ): Promise<CartType | null>{
        try{
            const product = await this.productService.findOne(slug);
            if(!product) return null;

            const cart = await Cart.findOne({userId: userId});
            if(!cart){
                await Cart.create({
                    userId,
                    products: [{product: product._id, quantity}],
                    total_price: product.original_price * quantity,
                    total_quantity: quantity
                });
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

            const updatedCart = await Cart.findOne({userId: userId}).populate("products.product");
            return updatedCart as unknown as CartType;
        }
        catch(error){
            Logger.error(error);
            return null;
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

    async removeAllProductsFromCart(userId?: string): Promise<Boolean>{
        try{
            const cart = await Cart.findOne({userId: userId});
            if(!cart) return false;
            
            await Cart.deleteOne({userId: userId});
            return true;
        }catch(error){
            Logger.error(error);
            return false;
        }
    };

    async getCart(userId: string): Promise< CartType | null >{
        try{
            const cart = await Cart.findOne({userId: userId});
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