import slugify           from 'slugify';
import Logger            from '../utils/Logger';
import CloudImage        from '../utils/CloudImage';
import Pagination        from "../utils/Pagination";
import ProductRepository from '../repositories/ProductRepository';
import ProductType       from '../types/ProductType';
import Product           from '../models/product.model';
import CategoryService   from './CategoryService';
import { ObjectId } from 'mongoose';
class ProductService implements ProductRepository{
    private cloudImage =  new CloudImage();
    private category   = new CategoryService();

    public async findOne(slug: string): Promise<ProductType | null>{
        try{
            const product = await Product.findOne({slug});
            if(!product) return null
    
            return product as unknown as ProductType

        }catch(error: unknown){
            Logger.error(error);
            return null 
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

    public async deleteProduct(slug: string): Promise<boolean | null>{
        try{
            const product = await Product.findOne({slug});
            if(!product) return null

            // Delete all images in parallel
            const imagePromises = [
                this.cloudImage.deleteMultipleImage(product.images.map(img => img.public_id as string)),
                this.cloudImage.deleteImage((product.main_image as { public_id?: string })?.public_id as string)
            ];
            await Promise.all(imagePromises);
            
            await product.deleteOne();
            return true;
        }
        catch(error: unknown){
            Logger.error(error);
            return null;
        }
    };

    public async deleteAll(): Promise<void>{
        try {
            const products = await Product.find({}, { main_image: 1, images: 1 });
            
            await Promise.all(products.map(async (product) => {
            const imagePromises = [
                this.cloudImage.deleteImage((product.main_image as { public_id?: string })?.public_id as string),
                this.cloudImage.deleteMultipleImage(product.images.map(img => img.public_id as string))
            ];
            await Promise.all(imagePromises);
            }));

            await Product.deleteMany();
            return;
        }
        catch(error: unknown){
            Logger.error(error);
            return;
        }
    };

    public async createProduct(value: { name: string, category: string, description: string, price: number, stock_num: number, image: string, variations: Array<object> }): Promise<{message: string, data: ProductType | null}>{
        try{
            const findCategory = await this.category.findOne(value.category);
            if(findCategory.data == null){
                return {
                    message: "Category not found",
                    data: null
                }
            };
            const productSlug = slugify(value.name, {lower: true});
            const findProduct = await this.findOne(productSlug);
            if(findProduct !== null){
                return {
                    message: "Product name exists",
                    data: null
                }
            }
            const mainImage    = await this.cloudImage.uploadImage(value.image);
            const product = new Product({
                main_image: {
                    url: mainImage?.secure_url as string,
                    public_id: mainImage?.public_id as string
                },
                slug: productSlug,
                ...value,
                category: findCategory.data._id,
            });
            await product.save();

            return {
                message: "Product created",
                data: product as unknown as ProductType
            }
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

    public async addMultipleImage(slug: string, images: []): Promise<ProductType | null>{
        try{
            const product = await Product.findOne({slug});
            if(!product) return null;
        
            const imagesData = await this.cloudImage.uploadMultipleImage(images);
            product.images.push(imagesData.map((img)=>({url: img.url, public_id: img.public_id})));

            await product.save();
            console.log("Product images added");
            return product as unknown as ProductType;
        }catch(error: unknown){
            Logger.error(error)
            return null;
        }
    };

    public async updateProduct(slug: string, value: {name?: string, category?: string, description?: string, price?: number, stock_num?: number, main_image?: string, variations?: Array<object>, remove_public_ids?: Array<string> }): Promise<ProductType | null>{
        try{
            const product = await Product.findOne({slug});
            if(!product) return null;

            if(value.remove_public_ids)
                await this.cloudImage.deleteMultipleImage(value.remove_public_ids);
                product.images = product.images.filter((img)=> !value.remove_public_ids?.includes(img.public_id as string));
            
            if(value.name) product.slug = slugify(value.name);
            
            if(value.category){
                const findCategory = await this.category.findOne(value.category);
                if(findCategory.data == null){
                    return null
                };
                product.category = findCategory.data._id as unknown as string;
            };
            if(value.main_image){
                const mainImage = product.main_image as { public_id?: string };
                this.cloudImage.deleteImage(mainImage?.public_id as string);  

                const newImage = await this.cloudImage.changeImage(mainImage.public_id, value.main_image);
                product.main_image = {
                    url: newImage?.secure_url as string,
                    public_id: newImage?.public_id as string
                };
            };
            await product.save();
            await Product.updateOne(product._id, value, {new: true});
            return product as unknown as ProductType
        }
        catch(error: unknown){
            Logger.error(error);
            return null ;
        }
    };


};
export default ProductService;