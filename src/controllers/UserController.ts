import UserRepository from "../repositories/UserRepository";
import { Request, Response } from "express";
import { successResponse, failedResponse, handleError} from "../middlewares/responseHandler";
import { emailValidate, profileValidate } from "../validators/UserValidator";
class UserController {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    };
    async changeEmail(req: Request, res: Response): Promise<void>{
        try{
            const {error, value} = emailValidate(req.body);
            if(error) 
                return failedResponse(res, 400, error.details[0].message );
            
            const { userID } = req.user;
            const { newEmail } = value;
            const response = await this.userRepository.changeEmail(userID, newEmail);

            if(response.isSent)
                return successResponse(res, 200, response.message);
            else
                return failedResponse(res, 400, response.message);
            
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async getProfile(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.user;
            const response = await this.userRepository.findById(userID);
            if(response != null)
                return successResponse(res, 200, "Profile Details Fetched.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            console.log(error);
            handleError(error, res);
        }
    };

    async updateProfile(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.user;            
            const {error, value} = profileValidate(req.body);            
            if(error) {
                return failedResponse(res, 400, error.details[0].message );
}
            const response = await this.userRepository.updateUser(userID, value);
            if(response != null)
                return successResponse(res, 200, "Profile Updated.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async deleteProfile(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.user;
            await this.userRepository.deleteUser(userID);
            return successResponse(res, 200, "Profile Deleted.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async changeAvatar(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.user;
            if(!req.file){
                failedResponse(res, 400, "Please upload an image file.");
            }
            const response = await this.userRepository.changeAvatar(userID, req.file?.path || '');
            
            if(response != null)
                return successResponse(res, 200, "Avatar Changed.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async deleteAvatar(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.user;
            const response = await this.userRepository.deleteAvatar(userID);
            if(response != null)
                return successResponse(res, 200, "Avatar Deleted.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async checkUserActivity(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.params;
            const response = await this.userRepository.isActiveUser(userID);
            return successResponse(res, 200, "User Activity Checked.",  response.data);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    }

    /**
     * Only Admins can access this route
     */
    async getUser(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.params;
            const response = await this.userRepository.findById(userID);
            if(response != null)
                return successResponse(res, 200, "User Fetched.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };
    async getAllUsers(req: Request, res: Response): Promise<void>{
        try{
            const response = await this.userRepository.findAll(req.user.userID.toString(), req.query.page as string);
            return successResponse(res, 200, "All Users Fetched.",  response.data);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async enableUser(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.params;
            const response = await this.userRepository.enableUser(userID);
            if(response != null)
                return successResponse(res, 200, "User Enabled.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async disableUser(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.params;
            const response = await this.userRepository.disableUser(userID);
            if(response != null)
                return successResponse(res, 200, "User Disabled.",  response);
            else
                return failedResponse(res, 404, "User not found.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async deleteAllUsers(req: Request, res: Response): Promise<void>{
        try{
            await this.userRepository.deleteAll();
            return successResponse(res, 200, "All Users Deleted.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async deleteUser(req:Request, res:Response){
        try{
            const { userID } = req.params;
            await this.userRepository.deleteUser(userID);
            return successResponse(res, 200, "User Deleted.");
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async filterUsers(req: Request, res: Response): Promise<void>{
        try{
            if(!req.query.search)
                return failedResponse(res, 400, "Please provide a query.");
            const response = await this.userRepository.filterUsers(req.user.userID.toString(), req.query.search as string, req.query.page as string);
            return successResponse(res, 200, "Users Fetched.",  response.data);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };

    async filterByStatus(req: Request, res: Response): Promise<void>{
        try{            
            if(!req.query.status)
                return failedResponse(res, 400, "Please provide a status.");
            const response = await this.userRepository.filterByStatus(req.user.userID.toString(), req.query.status as string, req.query.page as string);
            return successResponse(res, 200, "Users Fetched.",  response.data);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    }

    async changePassword(req: Request, res: Response): Promise<void>{
        try{
            const { userID } = req.user;
            const { currentPassword, newPassword, confirmPassword } = req.body;

            //Validate the request body
            if(!currentPassword || !newPassword || !confirmPassword)
                return failedResponse(res, 400, "Please provide current, new and confirm password.");
            if(newPassword !== confirmPassword)
                return failedResponse(res, 400, "New password and confirm password do not match.");
            if(newPassword.length < 8)
                return failedResponse(res, 400, "New password must be at least 8 characters long.");

            const response = await this.userRepository.changePassword(userID, currentPassword, newPassword);

            if(response.isChanged)
                return successResponse(res, 200, response.message);
            else
                return failedResponse(res, 400, response.message);
        }
        catch(error: unknown){
            handleError(error, res);
        }
    };
};

export default  UserController;