const router = require('express').Router();
const path = require('path');
const HomeController = require('../controllers/home')

const  upload  = require('../middlewares/s3')
//GET | /home | home
router.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
});


router.post('/uploads', upload.single('file'),(req,res) => {
    console.log(req.body)
    console.log('Archivo: ', req.file);
    if(req.file){
        res.status(200).send('File uploaded succesfully')
    }else{
        res.status(400).send('Error uploading files')
    }
})

//GET | /home/files | Obtener archivos
router.get('/files', HomeController.getFiles);

//POST | /home/downloads | Descargar archivos seleccionados
router.post('/download', HomeController.downloadFile);

module.exports = router;