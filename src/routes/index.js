const router = require('express').Router();
const path = require('path')
const loginRoutes = require('./login')
const registerRoutes = require('./register')
const homeRoutes = require('./home');

router.use('/login', loginRoutes)
router.use('/register', registerRoutes)

//Ruta Home (default)
router.use('/home', homeRoutes);

module.exports = router;