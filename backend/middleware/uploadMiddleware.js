import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the directory exists dynamically
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only! We only accept JPEG and PNG formts.'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB Upload limit 
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

export default upload;
