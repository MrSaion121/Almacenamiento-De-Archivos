const router = require('express').Router();
const path = require('path')
const RegisterController = require('../controllers/register');

//GET | /register | Muestra el front
router.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'register.html'))
})

//POST | /register
router.post('', RegisterController.registerUser);

module.exports = router;