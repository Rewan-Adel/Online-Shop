import Cloudinary from '../config/Cloudinary';
import Logger from './Logger';

class CloudImage{
    private cloudinary = new Cloudinary();
    constructor(){
    };

    async uploadImage(imagePath: string): Promise<{ secure_url: string, public_id: string } | undefined>{
        try {
            const result = await this.cloudinary.upload(imagePath);
            return {
                secure_url: result.secure_url,
                public_id : result.public_id,
            };
        } catch (error) {
            if (error instanceof Error) {
               Logger.error(error)
                return undefined;
            }else{
               Logger.error(error)
                throw new Error("Image upload failed");
            }
        }
    };

    // async uploadMultiImage()

    async deleteImage(public_id: string): Promise<{ result: string } | Error>{
        try {
            const result = await this.cloudinary.delete(public_id);
            return result;
        } catch (error) {
            if (error instanceof Error) {
               Logger.error(error)
                return error;
            }else{
               Logger.error(error)
                throw new Error("Image delete failed");
            }
        }
    };

};

export default CloudImage;