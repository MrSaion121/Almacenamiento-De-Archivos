const { s3 } = require("../models/aws");
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");


async function createFolder(Bucket, Key) {
  const client = new S3Client();
  const command = new PutObjectCommand({ Bucket, Key });
  return client.send(command);
}

async function existsFolder(Bucket, Key) {
  const client = new S3Client();
  const command = new HeadObjectCommand({ Bucket, Key });

  try {
    await client.send(command);
    return true;
  } catch (error) {
    if (error.name === "NotFound") {
      return false;
    } else {
      throw error;
    }
  }
}

async function createFolderIfNotExist(Bucket, Key) {
  if (!(await existsFolder(Bucket, Key))) {
    return createFolder(Bucket, Key);
  }
}

var upload = multer({

  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: (req, file, cb) => {

      const id_usuario = req.body.id_usuario;

      createFolderIfNotExist(`${process.env.AWS_BUCKET_NAME}`, `${req.body.id_usuario}/`)
      const extension = file.originalname.split('.').pop();
      const filename = `${req.body.id_usuario}/${uuidv4()}.${extension}`;
      cb(null, filename);
    }
  })


})

module.exports = upload;