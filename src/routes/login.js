const router = require('express').Router();
const path = require('path')
const LoginController = require('../controllers/login');


// GET | /login
router.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'))
});

//POST | /login
router.post('', LoginController.loginUser);

module.exports = router;