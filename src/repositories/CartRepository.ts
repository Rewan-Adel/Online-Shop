import CartType from "../types/CartType";
import { ObjectId } from "mongoose";

interface CartRepository{
    addProductToCart(productID: string, quantity: number, userId: ObjectId ): Promise<boolean | null>;
    removeProductFromCart(productID: string, userId: string): Promise<boolean | null>;    removeAllProductsFromCart(): Promise<void>;
    removeAllProductsFromCart(userId: string): Promise<void>;
    getCart(userId: string): Promise< CartType | null >;
}

export default CartRepository;