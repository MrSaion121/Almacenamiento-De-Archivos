const router = require('express').Router();
const path = require('path');
const upload = require('../middlewares/s3');
const listFiles = require('../controllers/fileCont');
const awsService = require('../services/aws.service');
const uploadFile = require('../controllers/fileCont');


//GET | /home | home
router.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
});

router.post('/uploads', upload.single('file'), uploadFile, async (req, res) => {
    //console.log(req.body.userId)
    console.log('Archivo: ', req.body.file);
    if (req.file) {
        await awsService.sendNotification()
        res.status(200).send('File uploaded succesfully')
    } else {
        res.status(400).send('Error uploading files')
    }
})

router.get('/uploads/:userId', listFiles);

//router.post('/uploads', upload.single('file'), uploadFile);

module.exports = router;