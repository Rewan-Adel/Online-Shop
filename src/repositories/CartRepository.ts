import CartType from "../types/CartType";
interface CartRepository{
    addProductToCart(slug: string, quantity: number, userId: string ): Promise<CartType | string>;
    removeProductFromCart(slug: string, userId: string): Promise<CartType | null>; 
    removeAllProductsFromCart(userId: string): Promise<boolean>;
    getCart(userId: string): Promise< CartType | null >;
}

export default CartRepository;