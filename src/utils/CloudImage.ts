import Cloudinary from '../config/Cloudinary';
import Logger from './Logger';

class CloudImage{
    private cloudinary = new Cloudinary();

    async uploadImage(imagePath: string): Promise<{ secure_url: string, public_id: string } | undefined>{
        try {
            const result = await this.cloudinary.upload(imagePath);
            return {
                secure_url: result.secure_url,
                public_id : result.public_id,
            };
        } catch (error) {
            Logger.error(error)
            throw new Error("Image upload failed");
        }
    };

    async deleteImage(public_id: string): Promise<{ result: string } | Error>{
        try {
            const result = await this.cloudinary.delete(public_id);
            return result;
        }catch (error) {
            Logger.error(error)
            throw new Error("Remove image failed");
        }
    };

    async changeImage(public_id: string | undefined,imagePath: string): Promise<{ secure_url: string, public_id: string } | undefined>{
        try {
            const result = await this.uploadImage(imagePath);
            await this.deleteImage(public_id?? "");
            return result;
        }catch (error) {
            Logger.error(error)
            throw new Error("Change image failed");
        };
    };

    async uploadMultipleImage(images: string[]): Promise< {url: string | undefined;  public_id: string | undefined}[]>{
        try{
            const cloudImages = await Promise.all(images.map(async (img: string) => await this.uploadImage(img)));
            const imagesData = cloudImages.map((img)=>({
                url: img?.secure_url,
                public_id: img?.public_id
            }));
            return imagesData;
        }catch(error){
            Logger.error(error)
            throw new Error("Image upload failed");
        }
    };

    async deleteMultipleImage(images_public_id: string[]): Promise<void>{
        try{
            await Promise.all(images_public_id.map(async (public_id: string) => await this.deleteImage(public_id)));
            return ;
        }catch(error){
            Logger.error(error)
            throw new Error("Remove image failed");
        }
    };
};

export default CloudImage;