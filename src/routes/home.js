const router = require('express').Router();
const path = require('path');
const upload = require('../middlewares/s3');
const listFiles = require('../controllers/fileCont');
const awsService = require('../services/aws.service');
const { uploadFileToDB } = require('../controllers/fileCont');


//GET | /home | home
router.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
});


router.post('/uploads', upload.single('file'), async (req, res) => {
    try {
        // Primero, maneja la carga del archivo a S3.
        if (!req.file) {
            return res.status(400).json({ message: 'Error al subir el archivo a S3' });
        }

        // Luego, registra el archivo en RDS usando la función `uploadFileToDB`.
        const { userId } = req.body;
        const fileName = req.file.originalname; // Nombre original del archivo
        const fileUrl = req.file.location; // URL del archivo generado en S3

        // Validar datos requeridos
        if (!userId || !fileName || !fileUrl) {
            return res.status(400).json({ message: 'Faltan datos necesarios para registrar el archivo.' });
        }

        // Registrar archivo en RDS
        await FileModel.createFile(userId, fileName, fileUrl);

        // Opcional: Enviar notificación por correo si se desea.
        // await awsService.sendNotification();

        // Responder al cliente
        res.status(200).json({ message: 'Archivo subido y registrado correctamente.' });
    } catch (error) {
        console.error('Error en /uploads:', error);
        res.status(500).json({ message: 'Error interno al subir el archivo.' });
    }
});

/*

router.post('/uploads', upload.single('file'),async (req, res) => {

    //console.log(req.body.userId)
    console.log('Archivo: ', req.body.file);
    if (req.file) {
        //Mandar notificacion (Correo)
        //await awsService.sendNotification();
        res.status(200).send('File uploaded succesfully')
    } else {
        res.status(400).send('Error uploading files')
    }
})

*/
router.get('/uploads/:userId', listFiles);

module.exports = router;