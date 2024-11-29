const router = require('express').Router();
const path = require('path');
const upload = require('../middlewares/s3');
const { listFiles, uploadFileToDB } = require('../controllers/fileCont');
const awsService = require('../services/aws.service');

//GET | /home | home
router.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
});

// POST | /uploads | Subida y registro de archivo

router.post('/uploads', upload.single('file'), uploadFileToDB, async (req, res) => {
    try {
        //console.log(req.body.userId)
        console.log('Archivo: ', req.body.file);
        if (req.file) {
            //Mandar notificacion (Correo)
            await awsService.sendNotification();

            res.status(200).json({
                success: true,
                message: 'Archivo subido correctamente',
                fileName: req.file.originalname
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Error al subir archivo',
            });
        }
    } catch (error) {
        console.error('Error al procesar la subida:', error);
        res.status(500).json({ success: false, message: 'Error interno del server' });
    }
});


/*
router.post('/uploads', upload.single('file'), uploadFileToDB, async (req, res) => {

    //console.log(req.body.userId)
    console.log('Archivo: ', req.body.file);
    if (req.file) {
        //Mandar notificacion (Correo)
        await awsService.sendNotification();
        res.status(200).send('File uploaded succesfully');
    } else {
        res.status(400).send('Error uploading files');
    }
});
*/
router.get('/uploads/:userId', listFiles);

router.post('/download', downloadFiles)

module.exports = router;