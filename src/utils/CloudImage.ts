import Cloudinary  from '../config/Cloudinary';
import Logger      from './Logger';
import CompressImg from './CompressImg';
class CloudImage{
    private cloudinary = new Cloudinary();

    public async uploadImgs(images: string[]): Promise<{ secure_url: string, public_id: string }[]| null>{
        try{
            const uploadedImgs: { secure_url: string, public_id: string }[] = [];
            
            for(const img of images){
                // Compress image
                // const compressedImg = await CompressImg.compress(img);
                // if(!compressedImg) {
                //     Logger.error("Compress image failed: ", compressedImg);
                //     return null;
                // }

                //upload image
                const image = await this.cloudinary.upload(img);
                if(!image) {
                    Logger.error("Upload image failed: ", image);
                    return null;
                };

                //push images into uploadedImgs array
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
            console.log("Images public id: ", images_public_id);
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