import CategoryType from "../types/CategoryType";

interface CategoryRepository{
    findOne(cat: string): Promise<{message: string, data: CategoryType | null}>
    findAll(page:string): Promise<{message: string, data:{
        categories      : CategoryType [] | null,
        total_categories:  number  | 0,
        current_page  :  number,
        total_pages   :  number,
    }| null}>;

    createCategory(name: string, image: string, parent?: string): Promise<{message: string, data: CategoryType | null}>;
    updateCategory(categoryID: string, data:{name?: string, parent?:string, imagePath?:string}): Promise<{message: string, data: CategoryType | null}>
    
    deleteCategory(CategoryID: string): Promise<{message: string, data: null}>;
    deleteAll(): Promise<{message: string, data:  null}>;    
};

export default CategoryRepository;
