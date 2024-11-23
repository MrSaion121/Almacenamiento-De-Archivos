const { s3 } = require("../models/aws");
const FIleModel = require('../models/file');

const uploadFileToDB = async (req, res) => {
    try {
        const { userId } = req.body;
        const fileName = req.file.originalname;
        const fileUrl = req.file.location;

        //Validacion de existencia de datos
        if (!userId || !fileName || !fileUrl) {
            return res.status(400).json({ message: "Falta de datos necesarios para registrar" });
        }

        //REgistrar el archivo en la base de datos
        await FIleModel.createFile(userId, fileName, fileUrl);
        return res.status(201).json({ message: "Archivo subido y registrado con exito" });
    } catch (error) {
        console.error('Error al registrar el archivo:',error);
        return res.status(500).json({ message: "Error al registrar el archivo" });

    }
}

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

module.exports = {
    listFiles,
    uploadFileToDB,
};