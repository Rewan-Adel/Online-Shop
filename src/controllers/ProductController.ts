import e, { Request, Response } from "express";
import ProductRepository     from "../repositories/ProductRepository";
import { successResponse,failedResponse, handleError}  from "../middlewares/responseHandler";
import { createProductValidate, updateProductValidate} from '../validators/ProductValidator';
class ProductController{
    private ProductRepository: ProductRepository;

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

            value.image = req.file.path;
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
            const response = await this.ProductRepository.findAll( req.query.page as string);
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
            const response = await this.ProductRepository.deleteAll();
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

            let paths: Array<string> = [];

            if (Array.isArray(req.files)) {
                paths = req.files.map((file: Express.Multer.File) => file.path);
            }else{
                paths.push(req.file?.path as string);
            };

            const response = await this.ProductRepository.addMultipleImage(req.params.slug, paths);
            console.log("Response", response);
            if(response != null)
                successResponse(res, 200, "Product image added.", {product: response});
            else
                failedResponse(res, 404, "Product not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    }
};

export default ProductController;