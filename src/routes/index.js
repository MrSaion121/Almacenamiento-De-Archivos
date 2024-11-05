const router = require('express').Router();
const path = require('path')
const loginRoutes = require('./login')
const registerRoutes = require('./register')

router.use('/login', loginRoutes)
router.use('/register', registerRoutes)

module.exports = router; 