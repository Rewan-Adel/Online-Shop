import CartType from "../types/CartType";
interface CartRepository{
    addProductToCart(slug: string, quantity: number, userId: string ): Promise<CartType | String>;
    removeProductFromCart(slug: string, userId: string): Promise<CartType | null>; 
    removeAllProductsFromCart(userId: string): Promise<Boolean>;
    getCart(userId: string): Promise< CartType | null >;
}

export default CartRepository;