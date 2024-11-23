const { s3 } = require("../models/aws");
const FileModel = require('../models/file');

//Controlador para subir el archivo a la tabla de RDS de archivos
const uploadFile = async (req, res) => {
    const { userId } = req.body;
    const file = req.file;

    if (!userId || !file) {
        return res.status(400).json({ success: false, message: 'user_id o archivo no proporcionado' });
    }

    try {
        //Almacenar en RDS
        const urlArchivo = file.location;
        const tituloArchivo = file.originalName;

        await FileModel.createFile(userId, tituloArchivo, urlArchivo);

        res.status(200).json({ success: true, message: 'Archivo subido exitosamente' });
    } catch (error) {
        console.error('Error al subir el archivo', error);
        res.status(500).json({ success: false, message: 'Error interno al subir el archivo.' });
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

module.exports = listFiles, uploadFile;