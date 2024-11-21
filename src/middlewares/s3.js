const { s3 } = require("../models/aws");
const multer = require('multer');
const multerS3 = require('multer-s3')
const { v4: uuidv4 } = require('uuid');

var upload = multer({
    storage: multerS3({
        s3:s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: (req, file, cb) => {
            const extension = file.originalname.split('.').pop();
            const filename = `${uuidv4()}.${extension}`;
            cb(null, filename);
        }
    })
})

module.exports = upload;