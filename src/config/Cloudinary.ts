import cloudinary  from 'cloudinary';

class Cloudinary{
    constructor(){
        this.config();
    };
    
    config(){
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error("Missing Cloudinary configuration. Please check environment variables.");
        };

        cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key   : process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure     : true
        })
    };

    async upload(imgPath: string){ 
        return await cloudinary.v2.uploader.upload(imgPath);
    };

    async delete(public_id: string){ 
        return await cloudinary.v2.uploader.destroy(public_id);
    }
}


export default Cloudinary;