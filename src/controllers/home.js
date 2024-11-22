const awsService = require('../services/aws.services');

//Obtener los archivos almacenados en S3
class HomeController {

    //Metodo para obtener Archivos s3
    async getFiles(req, res) {
        try {
            const files = await awsService.listFilesFromS3();
            res.json(files); //Devolver archivos como json
        } catch (error) {
            console.error("Error al obtener archivos:", error);
            res.status(500).send("Error al obtener los archivos");
        }
    }

    //Metodo para manejar descarga de archivos
    async downloadFile(req, res) {
        const { files } = req.body;
        try {
            const downloadUrls = await awsService.getDownloadUrls(files);
            res.json(downloadUrls); //Devolver urls para descargar
        } catch (error) {
            console.error('Error al obtener URLs de descarga', error);
            res.status(500).send("Error al obtener URLs de descarga");
        }
    }
}

module.exports = new HomeController();