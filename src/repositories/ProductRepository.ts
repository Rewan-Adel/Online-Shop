import ProductType from "../types/ProductType";
import { Types } from "mongoose";

interface ProductRepository{
    findOne(slug: string):  Promise<ProductType | null>
    findAll(page:string): Promise<{message: string, data:{
        products      : ProductType [] | [],
        total_products:  number  | 0,
        limit         :  number,
        current_page  :  number,
        total_pages   :  number,
    }|null}>;

    deleteProduct(productID: string): Promise<boolean | null>;
    deleteAll(): Promise<void>;
    
    createProduct(value: object): Promise<{message: string, data: ProductType | null}>;
    updateProduct(slug: string, data:object): Promise<ProductType | null>
    addProductImgs(slug: string, images: (string | undefined)[]): Promise<ProductType | null>
    
    // findProductsByCategory(categoryID: string): Promise<{message: string, data: ProductType[] | null}>;
    // addMultipleImage(slug: string, images: Array<string>): Promise<ProductType | null>
    addToWishlist(productID: Types.ObjectId, userID: string): Promise<boolean | null>;
    removeFromWishlist(productID: Types.ObjectId, userID: string): Promise<boolean | null>;
    removeAllFromWishlist(userID: string): Promise<boolean>;
    getWishlist(userID: string): Promise<ProductType[] | null>;
};

export default ProductRepository;