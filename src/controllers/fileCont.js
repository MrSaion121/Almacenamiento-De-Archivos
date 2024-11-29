const { s3 } = require("../models/aws");
const FileModel = require('../models/file');
const generateDownloadUrls = require('../services/download.service')

//Registrar el archivo subido - RDS
const uploadFileToDB = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const fileName = req.file.originalname;
        const fileUrl = req.file.location;

        //Validacion de existencia de datos
        if (!userId || !fileName || !fileUrl) {
            return res.status(400).json({ message: "Falta de datos necesarios para registrar" });
        }

        //REgistrar el archivo en la base de datos - RDS
        await FileModel.createFile(userId, fileName, fileUrl);
        console.log('Archivo registrado en la base de datos correctamente');

        next();
        //return res.status(201).json({ message: "Archivo subido y registrado con exito" });
    } catch (error) {
        console.error('Error al registrar el archivo:', error);
        next(error)
        //return res.status(500).json({ message: "Error al registrar el archivo" });
    }
}

const listFiles = async (req, res) => {
    const { userId } = req.params;
    const params = {
        Bucket: `${process.env.AWS_BUCKET_NAME}`,
        Prefix: `${userId}/`
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const files = data.Contents.map(file => ({
            Key: file.Key,
            Size: file.Size,
            LastModified: file.LastModified
        }));
        res.status(200).json(files);
    } catch(error){
        console.error('Error fetching archivos desde S3:', error);
        res.status(500).json({ message: "Error al listar los archivos" });
    }
};

/*
const listFiles = async (req, res) => {
    //console.log(req.body.userId)
    const { userId } = req.params
    //console.log(userId);
    var params = {
        Bucket: `${process.env.AWS_BUCKET_NAME}`,
        Prefix: `${userId}/`
    }

    s3.listObjects(params, function (err, data) {
        console.log(data.Contents);
    })

}
*/

const downloadFiles = async (req, res) => {
    const { files, userId } = req.body
    
    try {
        const downloadUrls = await generateDownloadUrls(userId, files);
        res.status(200).json({ message: 'Archivos descargados exitosamente.', files: downloadedFiles });
    } catch (error) {
        res.status(500).json({ message: 'Error descargando archivos.', error: error.message });
    }
}

module.exports = { listFiles, uploadFileToDB };