import { mongo, ObjectId } from "mongoose";

interface UserRepository{
    findById(id:ObjectId): Promise<mongo.Document>;
    findByEmail(email:string);
    updateUser(userID, data: object);
    
    deleteUser(userID): Promise<void>;
    deleteAll(): Promise<void>;

    //findAll(): Promise<[]>;
    //IsActiveUser
    //enableUser
};

export default UserRepository;