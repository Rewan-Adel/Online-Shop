import Logger         from '../utils/Logger';
import CloudImage     from '../utils/CloudImage';
import Pagination     from "../utils/Pagination";
import CategoryRepository from '../repositories/CategoryRepository';
import CategoryType from '../types/CategoryType';
import Category           from '../models/category.model';
class CategoryService implements CategoryRepository{
    private cloudImage =  new CloudImage();

    public async createCategory(name: string, image: string, parent?: string): Promise<{message: string, data: CategoryType | null}>{
        try{
            const category = await Category.findOne({name});
            if(category)
                return {
                    message: "Category is already exist.",
                    data: null
                }
            let parentCategory: CategoryType | null = null;
            if(parent && parent != ''){
                parentCategory = await Category.findOne({name: parent}) ;
                if(!parentCategory ){
                    return {
                        message: `${parent} category not found`,
                        data: null
                    };
                };
            };

            const img = await this.cloudImage.uploadImage(image);
            if( img == undefined)
                return {
                    message: "Can't upload an image",
                    data: null
                };

            const newCategory = new Category({
                name,
                image: {
                    url       : img.secure_url,
                    public_id : img.public_id
                },
                parent: parentCategory?._id
            });
            console.log(newCategory)
            await newCategory.save();
            return {
                message: "Category Added Successfully",
                data   : newCategory as unknown as CategoryType
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

    public async findOne(cat: string): Promise<{message: string, data: CategoryType | null}>{
        try{
            const category = await Category.findOne({
                $or: [
                    { name: RegExp(cat, 'i') },
                    { _id: cat.match(/^[0-9a-fA-F]{24}$/) ? cat : null }
                ]
            }).populate('parent');
            if(!category){
                return {
                    message: "Category Not Found",
                    data: null
                }
            }
            return {
                message: "Category Fetched.",
                data   : category as unknown as CategoryType
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
            const categories = await Category.find().limit(pagination.limit).skip(pagination.skip).populate('parent');

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
            const image = category.image as CategoryType['image'];
            await this.cloudImage.deleteImage(image.public_id as string);

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
            categories.forEach((category) => {
                const image = category?.image as CategoryType['image'];
                this.cloudImage.deleteImage(image?.public_id);
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
            
            const uploadedImage = await this.cloudImage.uploadImage(image);
            if( uploadedImage == undefined)
                return {
                    message: "Can't upload an image",
                    data: null
                };
            
            const existingImage = category?.image as CategoryType['image'];
            this.cloudImage.deleteImage(existingImage?.public_id);

            const updatedCategory = await Category.findByIdAndUpdate(categoryID, {
                image: {
                    url       : uploadedImage.secure_url,
                    public_id : uploadedImage.public_id
                }
            }, {new: true});

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

    public async updateCategory(categoryID: string, data:{name?: string, parent?:string, imagePath?:string}): Promise<{message: string, data: CategoryType | null}>{
        try{
            const category = await this.findOne(categoryID);
            if(category.data == null) 
                return{
                    message: "Category not found.",
                    data: null
                };

            let parentCategory: CategoryType | null = null;
            if(data.parent && data.parent != ''){
                    parentCategory = await Category.findOne({name: parent}) ;
                    if(!parentCategory ){
                        return {
                            message: `${parent} category not found`,
                            data: null
                        };
                    };
            };
            
            if(data.imagePath && category.data){
                const image = await this.cloudImage.changeImage(category.data.image.public_id, data.imagePath);
                if (!image?.secure_url) {
                    return {
                        message: "Failed to update image",
                        data: null
                    };
                }
                category.data.image = {
                    url       : image.secure_url,
                    public_id : image.public_id || ''
                }
            }
            const updatedCategory = await Category.findByIdAndUpdate(category.data?._id, {
                name  : data.name? data.name : category.data?.name,
                parent: parentCategory?._id,
                image : category.data?.image
            }, {new: true});

            return {
                message:  `Category updated`,
                data: updatedCategory as unknown as CategoryType
            };
        }catch(error: unknown){
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