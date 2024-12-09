import { Request, Response } from "express";
import { successResponse, failedResponse, handleError} from "../middlewares/responseHandler";
import ProductRepository from "../repositories/ProductRepository";


class ProductController{
    private ProductRepository: ProductRepository;
    constructor(ProductRepository: ProductRepository){
        this.ProductRepository = ProductRepository;
    };

    // async addProduct(req: Request, res: Response): Promise<void>{
    //     try{
    //         const { name, image, parent } = req.body;
    //         if(!name)
    //             return failedResponse(res, 400, "Product name is required.");

    //         if(!req.file)
    //             return failedResponse(res, 400, "Product image is required.");

    //         const response = await this.ProductRepository.createProduct(name, req.file.path, parent);
    //         if(response.data != null)
    //             successResponse(res, 200, response.message, response.data ?? undefined);
    //         else
    //             failedResponse(res, 400, response.message);
    //     }
    //     catch(error: unknown){
    //         handleError(error, res);
    //     }
    // };

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
            const response = await this.ProductRepository.findOne(req.params.id);
            if(response.data != null)
                successResponse(res, 200, response.message, response.data);
            else
                failedResponse(res, 404, response.message);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async deleteProduct(req: Request, res: Response): Promise<void>{
        try{
            const response = await this.ProductRepository.deleteProduct(req.params.id);
            if(response.data != null)
                successResponse(res, 200, response.message, response.data);
            else
                failedResponse(res, 404, response.message);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async deleteAllProducts(req: Request, res: Response): Promise<void>{
        try{
            const response = await this.ProductRepository.deleteAll();
            if(response.data != null)
                successResponse(res, 200, response.message, response.data);
            else
                failedResponse(res, 404, response.message);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    // async updateProduct(req: Request, res: Response): Promise<void>{
    //     try{
    //         const { name, image, parent } = req.body;
    //         if(!name)
    //             return failedResponse(res, 400, "Product name is required.");

    //         const response = await this.ProductRepository.updateProduct(req.params.id, name, image, parent);
    //         if(response.data != null)
    //             successResponse(res, 200, response.message, response.data);
    //         else
    //             failedResponse(res, 404, response.message);
    //     }
    //     catch(error: unknown){
    //         handleError(error, res);
    //     }
    // };
};

export default ProductController;