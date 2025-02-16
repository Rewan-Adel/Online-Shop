import Cloudinary from '../config/Cloudinary';
import Logger     from './Logger';

class CloudImage{
    private cloudinary = new Cloudinary();

    public async uploadImgs(images: string[]): Promise<{ secure_url: string, public_id: string }[]| null>{
        try{
            const uploadedImgs: { secure_url: string, public_id: string }[] = [];
            for(const img of images){
                const image = await this.cloudinary.upload(img);
                if(!image) return null;

                uploadedImgs.push({
                    secure_url: image.secure_url,
                    public_id : image.public_id,
                }); 
            };
            return uploadedImgs;

        }catch(error: unknown){
            Logger.error(error);
            return null;
        }
    };

    public async deleteImgs(images_public_id: string[]): Promise<void>{
        try{
            await Promise.all(
                images_public_id.map(async (public_id: string) => await this.cloudinary.delete(public_id))
            );
            return ;
        }catch(error){
            Logger.error(error)
            throw new Error("Remove image failed");
        }
    };
};

export default CloudImage;