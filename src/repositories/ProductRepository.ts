import ProductType from "../types/ProductType";

interface ProductRepository{
    findOne(slug: string): Promise<{message: string, data: ProductType | null}>
    findAll(page:string): Promise<{message: string, data:{
        products      : ProductType [] | [],
        total_products:  number  | 0,
        current_page  :  number,
        total_pages   :  number,
    }|null}>;

    deleteProduct(productID: string): Promise<{message: string, data: null}>;
    deleteAll(): Promise<{message: string, data:  null}>;
    
    // createProduct(name: string, description: string, price: number, stock_num:number, image: string): Promise<{message: string, data: ProductType | null}>;
    // updateProduct(productID: string, data:object): Promise<{message: string, data: ProductType | null}>
    
    // changeImage(productID: string, image: string): Promise<ProductType | null >; //main_image
    // // addMultipleImage(productID: string, images: []);
    // deleteImage(public_id: string): Promise<ProductType | null>;

};

export default ProductRepository;