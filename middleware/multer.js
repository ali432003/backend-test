import multer from "multer";

const storage = multer.diskStorage({
    destination: "./upload",
    filename: (req, file, cb) => {
        cb(null, `${new Date().getTime()} - ${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB in bytes
    },
});

export default upload;
