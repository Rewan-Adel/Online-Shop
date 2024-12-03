import UserRepository from '../repositories/UserRepository';
import User from '../models/user.model';
import Logger from '../shared/Logger';
// import EncryptionService  from '../utils/Encryption';
import { ObjectId } from "mongoose";

class UserService implements UserRepository{
    // private encryptionService = new EncryptionService();
    //IsActiveUser
    //enableUser

    public async findById(id: ObjectId){
        try{
            const user = await User.findById(id);
            return user || {};

        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error.message);
            else
                Logger.error('Unknown error');
            
            return {};
        }
    };

    public async findByEmail(email: string){
        try{
            const user = await User.findOne({email:email});
            return user;
        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error.message);
            else
                Logger.error('Unknown error');

            return {};
        }
    };

    // public async findAll(): Promise<[]> {
    //     try{
    //         const users = await User.find();
    //         return [users] || [];
    //     }catch(error: unknown){
    //         if(error instanceof Error)
    //             Logger.error(error.message);
    //         else
    //             Logger.error('Unknown error');

    //         return [];
    //     }
    // };

    public async createUser(username: string, email: string, password: string){
        try{
            const user = new User({
                username,
                email,
                password
            });
            await user.save();
            return user;
        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error.message);
            else
                Logger.error('Unknown error');

            return {};
        }
    };

    public async updateUser(userID, data: object) {
        try{
            const user = await  User.findByIdAndUpdate(userID, data, {new: true});
            return user || {};
        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error.message);
            else
                Logger.error('Unknown error');

            return {};
        }
    };

    public async deleteUser(userID): Promise<void> {
        try{
            await User.findByIdAndDelete(userID);
        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error.message);
            else
                Logger.error('Unknown error');
        }
    };

    public async deleteAll(): Promise<void> {
        try{
            await User.deleteMany();
        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error.message);
            else
                Logger.error('Unknown error');
        }
    };

};
export default UserService;