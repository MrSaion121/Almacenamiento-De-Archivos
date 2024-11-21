const router = require('express').Router();
const path = require('path');
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

function uploadFile(event){
    
}

module.exports = router;