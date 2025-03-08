import { Request, Response } from "express";
import { successResponse,failedResponse, handleError}  from "../middlewares/responseHandler";
import { createProductValidate, updateProductValidate} from '../validators/ProductValidator';
import ProductRepository from "../repositories/ProductRepository";
import CloudImage        from '../utils/CloudImage';
class ProductController{
    private ProductRepository: ProductRepository;
    private cloudImage =  new CloudImage();

    constructor(ProductRepository: ProductRepository){
        this.ProductRepository = ProductRepository;
    };

    async addProduct(req: Request, res: Response): Promise<void>{
        try{
            const {error, value} = createProductValidate(req.body);
            if(error)
                return failedResponse(res, 400, error.details[0].message as unknown as string);
            if(!req.file)
                return failedResponse(res, 400, "Product image is required.");

            value.main_image = req.file.path;
            const response = await this.ProductRepository.createProduct(value);
            if(response.data != null)
                successResponse(res, 200, response.message, response.data ?? undefined);
            else
                failedResponse(res, 400, response.message);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async getProducts(req: Request, res: Response): Promise<void>{
        try{
            const response = await this.ProductRepository.findAll( 
                req.query.page as string, req.query.name as string, req.query.brand as string, req.query.categoryName as string,
                req.query.min as unknown as number, req.query.max as unknown as number);
            successResponse(res, 200, response.message, response.data?? undefined);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async getProduct(req: Request, res: Response): Promise<void>{
        try{
            const response = await this.ProductRepository.findOne(req.params.slug);
            if(response != null)
                successResponse(res, 200, "Product fetched.", {product: response});
            else
                failedResponse(res, 404, "Product not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async deleteProduct(req: Request, res: Response): Promise<void>{
        try{
            const response = await this.ProductRepository.deleteProduct(req.params.slug);
            if(response != null)
                successResponse(res, 200, "product deleted");
            else
                failedResponse(res, 404, "Product not found");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async deleteAllProducts(req: Request, res: Response): Promise<void>{
        try{
            await this.ProductRepository.deleteAll();
            successResponse(res, 200, "All products deleted." );
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async updateProduct(req: Request, res: Response): Promise<void>{
        try{
            const {error, value} = updateProductValidate(req.body);
            if(error)
                return failedResponse(res, 400, error.details[0].message as unknown as string);

            if(req.file){
                value.main_image = req.file.path;
            }
            const response = await this.ProductRepository.updateProduct(req.params.slug, value);
            if(response != null)
                successResponse(res, 200, "Product updated.", response);
            else
                failedResponse(res, 404, "Product not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async addProductImages(req: Request, res: Response): Promise<void>{
        try{
            if(!req.file && !req.files )
                return failedResponse(res, 400, "Product images are required.");

            const images = Array.isArray(req.files) ? req.files.map((img: { path: string; }) => img.path) : [req.file?.path];
            const response = await this.ProductRepository.addProductImgs(req.params.slug, images);
            console.log("Response", response);
            if(response != null)
                successResponse(res, 200, "Product image added.", {product: response});
            else
                failedResponse(res, 500, `Failed to add product image.`);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    }

    async addProductToWishlist(req: Request, res: Response): Promise<void>{
        try{
            if(!req.params.slug)
                return failedResponse(res, 400, "Product slug is required.");
            
            const response = await this.ProductRepository.addToWishlist(req.params.slug as string, req.user?.userID as string);
            if(response != null)
                successResponse(res, 200, "Product added to wishlist.", {wishlist: response});
            else
                failedResponse(res, 404, "Product not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async removeProductFromWishlist(req: Request, res: Response): Promise<void>{
        try{
            if(!req.params.slug)
                return failedResponse(res, 400, "Product slug is required.");

            const response = await this.ProductRepository.removeFromWishlist(req.params.slug as string, req.user?.userID as string);  
            if(response != null)
                successResponse(res, 200, "Product removed from wishlist.", {wishlist: response});
            else
                failedResponse(res, 404, "Product not found.");
        }catch(error){
            handleError(error, res);
        }
    };

    async removeAllFromWishlist(req: Request, res: Response): Promise<void>{
        try{
            const response = await this.ProductRepository.removeAllFromWishlist(req.user?.userID as string);
            if(response != null)
                successResponse(res, 200, "All products removed from wishlist.");
            else
                failedResponse(res, 404, "Wishlist is empty.");
        }catch(error){
            handleError(error, res);
        }
    };

    async getWishlist(req: Request, res: Response): Promise<void>{
        try{
            const response = await this.ProductRepository.getWishlist(req.user?.userID as string);
            if(response != null)
                successResponse(res, 200, "Wishlist fetched.", {wishlist: response});
            else
                failedResponse(res, 404, "Wishlist is empty.");
        }catch(error){
            handleError(error, res);
        }
    };
};

export default ProductController;