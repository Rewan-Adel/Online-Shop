import ProductType from "../types/ProductType";
interface ProductRepository{
    findOne(slug: string):  Promise<ProductType | null>
    findAll(page:string): Promise<{message: string, data:{
        products      : ProductType [] | [],
        total_products:  number  | 0,
        current_page  :  number,
        total_pages   :  number,
    }|null}>;

    deleteProduct(productID: string): Promise<boolean | null>;
    deleteAll(): Promise<void>;
    
    createProduct(value: object): Promise<{message: string, data: ProductType | null}>;
    addMultipleImage(slug: string, images: Array<string>): Promise<ProductType | null>
    
    updateProduct(productID: string, data:object): Promise<ProductType | null>

    // findProductsByCategory(categoryID: string): Promise<{message: string, data: ProductType[] | null}>;
    
};

export default ProductRepository;