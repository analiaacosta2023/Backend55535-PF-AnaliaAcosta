import fs from "fs";
import multer from "multer";
import __dirname from "../utils.js";

const getDestination = function (req, file, cb) {

    const documentType = req.body.document_type;

    const folderMappings = {
        product: `${__dirname}/public/products`,
        document: `${__dirname}/public/documents`,
        profile: `${__dirname}/public/profiles`,
    };

    const folder = folderMappings[documentType] || `${__dirname}/public/uploads`;

    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
};

const storage = multer.diskStorage({
    destination: getDestination,
    filename: (req,file,cb) => {
        console.log(file);
        cb(null, `${Date.now()}---${file.originalname}`)
    }
})

export const uploader = multer({storage})