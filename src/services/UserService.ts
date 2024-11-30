import UserRepository from '../repositories/UserRepository';
import User from '../models/user.model';
import Logger from '../logger';
import { ObjectId } from 'mongoose';

class UserService implements UserRepository{
    //ValidateUser
    //IsActiveUser
    //enableUser

    public async findById(id: ObjectId): Promise<object> {
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

    public async findByEmail(email: string): Promise<object | null> {
        try{
            const user = await User.findOne({email:email});
            return user? user : null;
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

    public async createUser(username: string, email: string, password: string): Promise<object> {
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

    public async updateUser(userID, data: object): Promise<object> {
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