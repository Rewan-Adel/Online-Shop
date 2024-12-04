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

export const uploadSingle = multer({
    storage: storage,
    fileFilter: filter
}).single('image');

export const uploadArray = multer({
    storage: storage,
    fileFilter: filter
}).array('images', 10);
