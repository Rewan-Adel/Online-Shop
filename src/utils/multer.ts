import multer from 'multer';

const filter = (req: any, file: any, cb: any) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG image files are allowed.'), false);
    };
};

const storage = multer.diskStorage({
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

const settings = {
    storage: storage,
    fileFilter: filter,
    limits: { fileSize: 1024 * 1024 * 5 }
}

export const uploadSingle = multer(settings).single('image');
export const uploadArray  = multer(settings).array('images', 10);
