import CategoryType from "../types/CategoryType";

interface CategoryRepository{
    findOne(categoryID: string): Promise<{message: string, data: CategoryType | null}>
    findAll(page:string): Promise<{message: string, data:{
        categories      : CategoryType [] | null,
        total_categories:  number  | 0,
        current_page  :  number,
        total_pages   :  number,
    }| null}>;

    // createCategory(name: string, price: number, image: string): Promise<{message: string, data: CategoryType | null}>;
    // updateCategory(CategoryID: string, data:object): Promise<{message: string, data: CategoryType | null}>
    
    deleteCategory(CategoryID: string): Promise<{message: string, data: null}>;
    deleteAll(): Promise<{message: string, data:  null}>;
    
    changeImage(CategoryID: string, image: string): Promise<{message: string, data: CategoryType | null}>;
    // deleteImage(public_id: string): Promise<CategoryType | null>;
};

export default CategoryRepository;
