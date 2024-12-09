import { Request, Response } from "express";
import { successResponse, failedResponse, handleError} from "../middlewares/responseHandler";
import CategoryRepository from "../repositories/CategoryRepository";


class CategoryController{
    private categoryRepository: CategoryRepository;
    constructor(categoryRepository: CategoryRepository){
        this.categoryRepository = categoryRepository;
    };

    async addCategory(req: Request, res: Response): Promise<void>{
        try{
            const { name, parent } = req.body;
            if(!name)
                return failedResponse(res, 400, "Category name is required.");

            if(!req.file)
                return failedResponse(res, 400, "Category image is required.");

            const response = await this.categoryRepository.createCategory(name, req.file.path, parent);
            if(response.data != null)
                successResponse(res, 200, response.message, response.data ?? undefined);
            else
                failedResponse(res, 400, response.message);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async getCategories(req: Request, res: Response): Promise<void>{
        try{
            const response = await this.categoryRepository.findAll( req.query.page as string);
            successResponse(res, 200, response.message, response.data?? undefined);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async getCategory(req: Request, res: Response): Promise<void>{
        try{
            if(!req.params.categoryID || req.params.categoryID == null|| req.params.categoryID == undefined|| 
                req.params.categoryID == "" || req.params.categoryID == ":categoryID"
            ) 
                return failedResponse(res, 400, "Category ID is required.");

            const response = await this.categoryRepository.findOne(req.params.categoryID);
            if(response.data != null)
                return successResponse(res, 200, response.message, response.data);
            else
            return failedResponse(res, 400, response.message);
        }
        catch(error: unknown){
            return handleError(error, res);
        }
    };

    async deleteCategory(req: Request, res: Response): Promise<void>{
        try{
            if(!req.params.categoryID || req.params.categoryID == null|| req.params.categoryID == undefined|| 
                req.params.categoryID == "" || req.params.categoryID == ":categoryID"
            )                 
                return failedResponse(res, 400, "Category ID is required.");

            const response = await this.categoryRepository.deleteCategory(req.params.categoryID);
            if(response.data != null)
                successResponse(res, 200, response.message, response.data);
            else
                failedResponse(res, 404, response.message);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async deleteAllCategories(req: Request, res: Response): Promise<void>{
        try{
            const response = await this.categoryRepository.deleteAll();
            successResponse(res, 200, response.message);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async updateCategory(req: Request, res: Response): Promise<void>{
        try{
            if(!req.params.categoryID || req.params.categoryID == null|| req.params.categoryID == undefined|| 
                req.params.categoryID == "" || req.params.categoryID == ":categoryID"
            )                 
                return failedResponse(res, 400, "Category ID is required.");

            const { name, parent } = req.body;
            
            if(!name && !parent)
                return failedResponse(res, 400, "Please provide category name or parent category.");

            const response = await this.categoryRepository.updateCategory(req.params.categoryID, { name,  parent });
            if(response.data != null)
                successResponse(res, 200, response.message, response.data);
            else
                failedResponse(res, 404, response.message);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async changeImage(req: Request, res: Response): Promise<void>{
        try{
            if(!req.file)
                return failedResponse(res, 400, "Category image is required.");

            if(!req.params.categoryID || req.params.categoryID == null|| req.params.categoryID == undefined|| 
                req.params.categoryID == "" || req.params.categoryID == ":categoryID"
            )                 
                return failedResponse(res, 400, "Category ID is required.");

            const response = await this.categoryRepository.changeImage(req.params.categoryID, req.file.path);
            if(response.data != null)
                successResponse(res, 200, response.message, response.data);
            else
                failedResponse(res, 404, response.message);

        }catch(error: unknown){
            handleError(error, res);
        }
    };
};

export default CategoryController;