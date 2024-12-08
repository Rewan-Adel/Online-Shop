import Logger         from '../utils/Logger';
import CloudImage     from '../utils/CloudImage';
import Pagination     from "../utils/Pagination";
import ProductRepository from '../repositories/ProductRepository';
import ProductType from '../types/ProductType';
import Product           from '../models/product.model';

class ProductService implements ProductRepository{
    private cloudImage =  new CloudImage();

    public async findOne(slug: string): Promise<{message: string, data: ProductType | null}>{
        try{
            const product = await Product.findOne({slug});
            if(!product){
                return {
                    message: "Product Not Found",
                    data: null
                }
            }
            return {
                message: "Product Found",
                data   : product as unknown as ProductType
            }

        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');
            
            return {
                message: "an error occurred",
                data:  null 
            };
        }
    };

    public async findAll(page:string): Promise<{message: string, data:{
        products      : ProductType [] | [],
        total_products:  number  | 0,
        current_page  :  number,
        total_pages   :  number,
    }| null }>{
        try{
            const pagination = await Pagination(page, Product);
            const products = await Product.find().limit(pagination.limit).skip(pagination.skip);

            return {
                message: "Products Fetched.",
                data:{
                    products      : products as unknown as ProductType[],
                    total_products: pagination.totalObj,
                    current_page  : pagination.currentPage,
                    total_pages   : pagination.totalPages,
                    }
                };
        }
        catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');
            
            return {
                message: "an error occurred",
                data:  null 
            };
        }
    };

    public async deleteProduct(slug: string): Promise<{message: string, data: null}>{
        try{
            const product = await Product.findOne({slug});
            if(!product){
                return{
                    message: "Product not found.",
                    data: null
                };
            };
            //Delete images from cloud
            product.images.map((img)=> this.cloudImage.deleteImage(img?.public_id as string));
            await this.cloudImage.deleteImage(product.main_image?.public_id as string);

            await product.deleteOne();
            return{
                message: "Product deleted.",
                data: null
            };
        }
        catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');
            
            return {
                message: "an error occurred",
                data:  null 
            };
        }
    };

    public async deleteAll(): Promise<{message: string, data:  null}>{
        try{
            const products = await Product.find();
            if(!products){
                return{
                    message: "Empty products",
                    data: null
                };
            };
            //Delete all images from cloud
            products.map((product)=> {
                this.cloudImage.deleteImage(product.main_image?.public_id as string);
                product.images.map((img)=>this.cloudImage.deleteImage(img.public_id as string))
            });

            await Product.deleteMany();
            return{
                message: "All products deleted.",
                data: null
            };
        }
        catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');
            
            return {
                message: "an error occurred",
                data:  null 
            };
        }
    };

};
export default ProductService;