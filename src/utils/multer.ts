import multer             from 'multer';
import { Request }        from 'express';
import { failedResponse } from "../middlewares/responseHandler";

class Multer{
    private storage = multer.diskStorage({
        filename: function(req, file, cb){
            cb(null, file.originalname)
        }
    });

    private filter(req: any, file: any, cb: any){
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG and PNG image files are allowed.'), false);
        };
    };

    private settings = {
        storage   : this.storage,
        fileFilter: this.filter,
        limits    : { fileSize: 1024 * 1024 * 5 }
    }

    public uploadSingle = multer(this.settings).single('image');
    public uploadArray  = multer(this.settings).array('images', 10);

    public handleValidationError(err: Error, req: Request, res: any, next: any) {
        if (err instanceof multer.MulterError) {
            failedResponse(res, 400, err.message);
        } else if (err) {
            failedResponse(res, 400, err.message);
        } else {
            next();
        }
    }
};


export default new Multer();
