const router = require('express').Router();
const path = require('path');

//GET | /home | home
router.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'home.html'));
});

module.exports = router;