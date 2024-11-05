const router = require('express').Router();
const path = require('path')
const homeRoutes = require('./home');

//Ruta Home (default)
router.use('/home', homeRoutes);

module.exports = router;