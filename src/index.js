const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 3000;


app.use(fileUpload());
app.use('/', express.static(path.join(__dirname, '..', 'public')))
//app.use(express.json());
app.use('/', routes);


app.get('', (req, res) => {
    res.send("HOLA")
})

app.listen(port, () => {
    console.log(`API is running in port ${port}`)
})