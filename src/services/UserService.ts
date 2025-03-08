import UserRepository from '../repositories/UserRepository';
import User           from '../models/user.model';
import Logger         from '../utils/Logger';
import CloudImage     from '../utils/CloudImage';
import UserType       from "../types/userType";
import AuthRepository from '../repositories/AuthRepository';
import Pagination     from "../utils/Pagination";

class UserService implements UserRepository{
    private authService: AuthRepository;
    private cloudImage =  new CloudImage();

    constructor(authService: AuthRepository){
        this.authService = authService;
    };

    public async changeEmail(userID: string, email: string): Promise<{isSent:boolean, message: string }>{
        try{
            const user = await this.findById(userID);
            if(!user) 
                return {
                    isSent:false,
                    message: "User not found!"
                }
            if(user.email === email){
                return {
                    isSent:false,
                    message: "Email is the same!"
                }
            };

            const isExist = await this.findByEmail(email);
            if(isExist && !isExist.verified){
                await this.deleteUser(isExist._id.toString());
            }
            if(isExist && isExist.verified)
                return {
                    isSent:false,
                    message: "Email already exists!"
                }
            await this.updateUser(userID, {email: email, verified: false});
            const sendEmail = await this.authService.sendVerificationCode(email);
            return {
                isSent: sendEmail.isSent,
                message: sendEmail.message,
            }
        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');
            return {
                isSent:false,
                message: "An error occurred while sending the email"
            }
        };
    };

    public async findById(id: string):  Promise<UserType | null>{
        try{
            const user = await User.findById(id);
            return user as UserType || null;

        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');
            
            return null ;
        }
    };

    public async findByEmail(email: string): Promise<UserType | null>{
        try{
            const user = await User.findOne({email:email});
            return user as UserType || null;

        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');

            return null;
        }
    };

    public async findAll(currentUserId: string, page:string): Promise<{data:{
        users: UserType [],
        total_users:  number,
        current_page: number,
        total_pages: number,
    }}> {
        try{
            const pagination = await Pagination(page, User);
            const users = await User.find({
                _id: { $ne: currentUserId }
            }).skip(pagination.skip).limit(pagination.limit);
            return {
                data:{
                    users: users as UserType[],
                    total_users: pagination.totalObj - 1,
                    current_page: pagination.currentPage,
                    total_pages: pagination.totalPages,
                }
            };
        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');

            return {
                data:{
                    users: [],
                    total_users: 0,
                    current_page: 1,
                    total_pages: 0,
                }
            };
        }
    };

    public async createUser(username: string, email: string, password: string): Promise<UserType | null>{
        try{
            const user = new User({
                username,
                email,
                password
            });
            await user.save();
            return user as UserType || null;
        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');

            return null;
        }
    };

    public async updateUser(userID: string, data: object) {
        try{
            const user = await  User.findByIdAndUpdate(userID, { $set: data }, {new: true});                        
            return user as UserType || null;

        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');

            return null;
        }
    };

    public async deleteUser(userID: string): Promise<void> {
        try{
            await this.deleteAvatar(userID);
            await User.findByIdAndDelete(userID);
        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');
        }
    };

    public async deleteAll(): Promise<void> {
        try{
            await User.deleteMany();
        }catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');
        }
    };

    public async changeAvatar(userID: string, avatar: string): Promise< UserType | null>{
        try{
            const user = await this.findById(userID);
            if(!user) return null;
            
            const img = await  this.cloudImage.uploadImgs([avatar as string]);
            if(!img) return null;

            await this.cloudImage.deleteImgs([user.avatar.public_id as string]);
            const updatedUser = await this.updateUser(userID, {
                avatar: {
                    url       : img[0].secure_url,
                    public_id : img[0].public_id
                }
            });

            return updatedUser as UserType || null;
        }
        catch(error: unknown){
            if(error instanceof Error)
               Logger.error(error)
            else
                Logger.error('Unknown error');
        }
        return null;
    };

    public async deleteAvatar(userID: string): Promise<UserType | null>{
        try{
            const user = await this.findById(userID);
            if(!user) return null;
            
            await this.cloudImage.deleteImgs([user.avatar?.public_id as string]);
            
            if(user.avatar.url === process.env.DEFAULT_AVATAR_URL) 
                return user;
            const updatedUser = await this.updateUser(userID, {
                avatar: {
                    url       : process.env.DEFAULT_AVATAR_URL,
                    public_id : process.env.DEFAULT_PUBLIC_ID
                }
            });

            return updatedUser as UserType || null;
        }
        catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');
        }
        return null;
    }

    public async isActiveUser(userID: string): Promise<{data:{message:string,active: boolean|null}}>{
        try{
            const user = await User.findById(userID);
            if(!user) return {
                data:{
                    message: "User not found", 
                    active: null}
            }
            return {
                data:{ 
                    message: "User found",
                    active: user && user.active ? true : false}
            };
        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');
        }
        return {
            data:{
                message: "an error occurred",
                active:  null
            }
        };
    };

    public async enableUser(userID: string): Promise<UserType | null>{
        try{
            const user = await User.findByIdAndUpdate(userID, {active: true},{new:true});
            return user as UserType || null;
        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');
        }  return null;
    };

    public async disableUser(userID: string): Promise<UserType | null>{
        try{
            const user = await User.findByIdAndUpdate(userID, {active: false}, {new:true});
            return user as UserType || null;

        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');
        }
        return null;
    };

    public async filterUsers(currentUserId: string,query: string, page: string): Promise<{data:{
        users: UserType [],
        total_users:  number,
        current_page: number,
        total_pages: number,
    }}>{
        try{
            const pagination = await Pagination(page, User);

            const users = await User.find({
                $and:[
                    { _id: { $ne: currentUserId } },
                    {$or:[
                        {username: {$regex: query,  $options: 'i' }},
                        {email   : {$regex: query,  $options: 'i' }}
                    ]}
                ]
            })
            .skip(pagination.skip).limit(pagination.limit);

            return {
                data:{
                    users: users as UserType[],
                    total_users : users.length,
                    current_page: pagination.currentPage,
                    total_pages :  Math.ceil(users.length / pagination.limit),
                }
            };
        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');

            return {
                data:{
                    users: [],
                    total_users: 0,
                    current_page: 1,
                    total_pages: 0,
                }
            };
        };
    };


    public async filterByStatus(currentUserId: string, query: string, page: string): Promise<{data:{
        users: UserType [],
        total_users:  number,
        current_page: number,
        total_pages: number,
    }}>{
        try{
            const pagination = await Pagination(page, User);

            const users = await User.find({
                $and:[
                    { _id: { $ne: currentUserId } },
                    {active: query === 'active' ? true : false}
                ]
            })
                .skip(pagination.skip).limit(pagination.limit);

            return {
                data:{
                    users: users as UserType[],
                    total_users : users.length,
                    current_page: pagination.currentPage,
                    total_pages :  Math.ceil(users.length / pagination.limit),
                }
            };
        }catch(error: unknown){
            if(error instanceof Error)
                Logger.error(error)
            else
                Logger.error('Unknown error');

            return {
                data:{
                    users: [],
                    total_users: 0,
                    current_page: 1,
                    total_pages: 0,
                }
            };
        };
    }

};
export default UserService;