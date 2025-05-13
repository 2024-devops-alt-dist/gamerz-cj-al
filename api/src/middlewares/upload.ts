import multer from 'multer';
import path from 'path';

// Dossier de destination
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname.replace(/\s+/g, '_');
        cb(null, originalName);
    }
});

const upload = multer({ storage });

export default upload;
