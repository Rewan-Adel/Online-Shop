import { ObjectId } from "mongoose";

interface UserRepository{
    findById(id:ObjectId): Promise<object>;
    findByEmail(email:string): Promise<object | null>;
    // findAll(): Promise<[]>;
    updateUser(userID, data: object): Promise<object>
    deleteUser(userID): Promise<void>;
    deleteAll(id:ObjectId): Promise<void>;
};

export default UserRepository;