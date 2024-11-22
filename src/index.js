const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
//Conexion - RDS
const UserModel = require('./models/user');
//Cargar variables de entorno
const dotenv = require('dotenv');
dotenv.config();

//Crear instancia de express
const app = express();
const port = process.env.PORT || 3000;

//Middleware JSON y URL-encode
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/', express.static(path.join(__dirname, '..', 'public')))
//app.use('/', express.static(path.join(__dirname, '..', 'src')))

//conf Rutas
app.use('/', routes);

app.get('', (req, res) => {
    res.send("!Hola! Bienvenido a TiesOnDrive")
})

//Mensaje de conexion - RDS
(async () => {
    try {
        const connection = await UserModel.connect();
        console.log("Conexión con la base de datos RDS exitosa.");
    } catch (error) {
        console.error("Error al conectar con la base de datos RDS:", error.message);
    }
})();

app.listen(port, () => {
    console.log(`API is running in port ${port}`)
})