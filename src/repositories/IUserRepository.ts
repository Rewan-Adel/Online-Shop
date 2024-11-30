import { ObjectId } from "mongoose";

interface IUserRepository{
    findById(id:ObjectId): Promise<object>;
    findByEmail(email:string): Promise<object>;
    findAll(): Promise<object>;
    
    createUser(username: string, email:string, password:string): Promise<object>;
    updateUser(data:object): Promise<object>;
    
    deleteUser(): Promise<void>;
    deleteAll(id:ObjectId): Promise<void>;
};

export default IUserRepository;