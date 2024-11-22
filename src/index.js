const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
//Cargar variables de entorno
const dotenv = require('dotenv');
dotenv.config();

//Crear instancia de express
const app = express();
const port = process.env.PORT || 3000;

//Middleware JSON y URL-encode
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, '..', 'public')))
//app.use('/', express.static(path.join(__dirname, '..', 'src')))

//conf Rutas
app.use('/', routes);

app.get('', (req, res) => {
    res.send("!Hola! Bienvenido a TiesOnDrive")
})

app.listen(port, () => {
    console.log(`🚀 API is running on port ${port}`);
});