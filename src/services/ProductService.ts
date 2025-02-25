import slugify           from 'slugify';
import Logger            from '../utils/Logger';
import CloudImage        from '../utils/CloudImage';
import Pagination        from "../utils/Pagination";
import ProductRepository from '../repositories/ProductRepository';
import ProductType       from '../types/ProductType';
import Product           from '../models/product.model';
import User              from '../models/user.model';
import CategoryService   from './CategoryService';
import { Types } from 'mongoose';

type ProductValue = {
    name?       : string,
    category?   : string,
    description?: string,
    price?      : number,
    stock_num?  : number,
    main_image? : string,
    images?     : Array<string>,
    variations? : Array<object>,
    remove_images?: Array<string>
};

class ProductService implements ProductRepository{
    private cloudImage = new CloudImage();
    private category   = new CategoryService();

    public async findProductById(id: string): Promise<ProductType | null>{
        try{
            const product = await Product.findById(id);
            if(!product) return null
            return product as unknown as ProductType
        }catch(error: unknown){
            Logger.error(error);
            return null 
        }
    };

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
        limit         :  number,
        current_page  :  number,
        total_pages   :  number,
    }| null }>{
        try{
            const pagination = await Pagination(page, Product);
            const products   = await Product.find().limit(pagination.limit).skip(pagination.skip);

            const total_products = await Product.countDocuments();
            return {
                message: "Products Fetched.",
                data:{
                    products      : products as unknown as ProductType[],
                    total_products,
                    limit         : pagination.totalObj,
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
                this.cloudImage.deleteImgs(product.images.map(img => img.public_id as string)),
                this.cloudImage.deleteImgs([(product.main_image as { public_id?: string })?.public_id as string])
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
                this.cloudImage.deleteImgs([(product.main_image as { public_id?: string })?.public_id as string]),
                this.cloudImage.deleteImgs(product.images.map(img => img.public_id as string))
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

    public async createProduct(value: ProductValue): Promise<{message: string, data: ProductType | null}>{
        try{
            const findCategory = await this.category.findOne(value.category as string);
            if(findCategory.data == null){
                return {
                    message: "Category not found",
                    data: null
                }
            };
            const productSlug = slugify(value.name as string, {lower: true});
            const findProduct = await this.findOne(productSlug);
            if(findProduct !== null){
                return {
                    message: "Product name exists",
                    data: null
                }
            }
            value.category     = findCategory.data._id as unknown as string;
            const mainImage    = await this.cloudImage.uploadImgs([value.main_image as string]);
            if (!mainImage) {
                return {
                    message: "Failed to upload image",
                    data: null
                };
            }

            const product = new Product({
                slug: productSlug,
                ...value,
                main_image: {
                    url      : mainImage[0].secure_url,
                    public_id: mainImage[0].public_id
                },
                category: findCategory.data._id,
            });
            await product.save();

            return {
                message: "Product created",
                data: product as unknown as ProductType
            }
        }
        catch(error: unknown){
            Logger.error(error)
            return {
                message: "an error occurred",
                data:  null 
            };
        }
    };

    public async addProductImgs(slug: string, images: (string | undefined)[]): Promise<ProductType | null> {
        try {
            const product = await Product.findOne({ slug });
            if (!product) return null;
    
            // Filter out undefined values and ensure images is an array of strings
            const validImages = images.filter((img): img is string => img !== undefined);
    
            // Upload images to the cloud
            const imagesData = await this.cloudImage.uploadImgs(validImages);
            if (imagesData === null) return null;
    
            // Spread the imagesData array into product.images
            product.images.push(...imagesData.map((img) => ({
                url: img.secure_url,
                public_id: img.public_id
            })));
    
            // Save the updated product
            await product.save();
            console.log("Product images added");
            return product as unknown as ProductType;
        } catch (error: unknown) {
            Logger.error("Error adding product images:", error);
            return null;
        }
    }
    public async updateProduct(slug: string, value: ProductValue): Promise<ProductType | null>{
        try{
            const product = await Product.findOne({slug});
            if(!product) return null;
            
            if(value.name) product.slug = slugify(value.name);         
            if(value.category){
                const findCategory = await this.category.findOne(value.category);
                if(findCategory.data == null){
                    return null
                };
                product.category = findCategory.data._id as unknown as string;
            };
            if(value.main_image){
                await this.cloudImage.deleteImgs([(product.main_image as { public_id?: string })?.public_id as string]);
                const mainImage = await this.cloudImage.uploadImgs([value.main_image]);
                if (!mainImage) {
                    return null;
                }
                product.main_image = {
                    url      : mainImage[0].secure_url,
                    public_id: mainImage[0].public_id
            };
            };
            if(value.images){
                const imagesData = await this.cloudImage.uploadImgs(value.images);
                if(imagesData !== null) {
                    product.images.push(...imagesData.map((img) => ({
                        url: img.secure_url,
                        public_id: img.public_id
                    })));
                }
            };
            if(value.remove_images){
                console.log("Remove images: ", value.remove_images);
                await this.cloudImage.deleteImgs(value.remove_images);
                let image = product.images.filter((img) => value.remove_images?.includes(img.public_id));
                
                if(image.length > 0){
                    product.images = product.images.filter((img) => !value.remove_images?.includes(img.public_id));
                }else{
                    const img = product.main_image == value.remove_images;
                    if(img){
                        product.main_image = {};
                    }
                }
            };

            await product.save();
            await Product.updateOne({ _id: product._id }, value, { new: true });
            return product as unknown as ProductType
        }
        catch(error: unknown){
            Logger.error(error);
            return null ;
        }
    };

    public async addToWishlist(productID: Types.ObjectId, userID: string): Promise<boolean | null>{
        try{
            const product = await Product.findById(productID);
            if(!product) return null;

            const user = await User.findById(userID);
            if(!user) return null;

            const productIndex = user.wishlist.findIndex((product) => product == productID);
            if(productIndex !== -1) return true;

            user.wishlist.push(productID);
            await user.save();
            return true;
        }
        catch(error: unknown){
            Logger.error(error);
            return null;
        }
    };

    public async removeFromWishlist(productID: Types.ObjectId, userID: string): Promise<boolean | null>{
        try{
            const product = await Product.findById(productID);
            if(!product) return null;

            const user = await User.findById(userID);
            if(!user) return null;

            const productIndex = user.wishlist.findIndex((product) => product == productID);
            if(productIndex == -1) return null;

            user.wishlist.splice(productIndex, 1);
            await user.save();
            return true;
        }
        catch(error: unknown){
            Logger.error(error);
            return null;
        }
    };

    public async removeAllFromWishlist(userID: string): Promise<boolean>{
        try{
            const user = await User.findById(userID);
            if(!user) return false;

            user.wishlist = [];
            await user.save();
            return true;
        }
        catch(error: unknown){
            Logger.error(error);
            return false;
        }
    };

    public async getWishlist(userID: string): Promise<ProductType[] | null>{
        try{
            const user = await User.findById(userID).populate('wishlist');
            if(!user) return null;

            return user.wishlist as unknown as ProductType[];
        }
        catch(error: unknown){
            Logger.error(error);
            return null;
        }
    }
};
export default ProductService;