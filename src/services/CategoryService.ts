import Logger         from '../utils/Logger';
import CloudImage     from '../utils/CloudImage';
import Pagination     from "../utils/Pagination";
import CategoryRepository from '../repositories/CategoryRepository';
import CategoryType from '../types/CategoryType';
import Category           from '../models/category.model';

class CategoryService implements CategoryRepository{
    private cloudImage =  new CloudImage();

    public async findOne(categoryID: string): Promise<{message: string, data: CategoryType | null}>{
        try{
            const category = await Category.findById(categoryID);
            if(!category){
                return {
                    message: "Category Not Found",
                    data: null
                }
            }
            return {
                message: "Category Found",
                data   : Category as unknown as CategoryType
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
        categories      : CategoryType [] | [],
        total_categories:  number  | 0,
        current_page  :  number,
        total_pages   :  number,
    }| null }>{
        try{
            const pagination = await Pagination(page, Category);
            const categories = await Category.find().limit(pagination.limit).skip(pagination.skip);

            return {
                message: "Categories Fetched.",
                data:{
                    categories      : categories as unknown as CategoryType[],
                    total_categories: pagination.totalObj,
                    current_page    : pagination.currentPage,
                    total_pages     : pagination.totalPages,
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

    public async deleteCategory(CategoryID: string): Promise<{message: string, data: null}>{
        try{
            const category = await Category.findById(CategoryID);
            if(!category){
                return{
                    message: "Category not found.",
                    data: null
                };
            };
            //Delete images from cloud
            await this.cloudImage.deleteImage(category.image?.public_id as string);

            await category.deleteOne();
            return{
                message: "Category deleted.",
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
            const categories = await Category.find();
            if(!categories){
                return{
                    message: "Empty Categories",
                    data: null
                };
            };
            //Delete all images from cloud
            categories.map((category)=> {
                this.cloudImage.deleteImage(category.image?.public_id as string);
            });

            await Category.deleteMany();
            return{
                message: "All Categories deleted.",
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

    public async changeImage(categoryID: string, image: string): Promise<{message: string, data: CategoryType | null}>{
        try{
            const category = await Category.findById(categoryID);
            if(!category) 
                return{
                    message: "Category not found.",
                    data: null
                };
            
            const img = await this.cloudImage.uploadImage(image);
            if( img == undefined)
                return {
                    message: "Can't upload an image",
                    data: null
                };

            await this.cloudImage.deleteImage(category.image?.public_id as string);
            const updatedCategory = await Category.findByIdAndUpdate(categoryID, {
                image: {
                    url       : img.secure_url,
                    public_id : img.public_id
                }
            });

            return {
                message:  `Category image updated`,
                data: updatedCategory as unknown as CategoryType
            };
        }
        catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');
        }
        return {
            message:  "an error occurred",
            data: null
        };
    };

};
export default CategoryService;