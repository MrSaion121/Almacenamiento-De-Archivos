const express = require('express');
const routes = require('./src/routes');
const path = require('path');
const fileUpload = require('express-fileupload');
const awsService = require('./src/services/aws.service');

const app = express();
const port = process.env.PORT || 3000;


app.use(fileUpload());
//app.use(express.json());
app.use('/', routes);

app.get('', (req, res) => {
    res.send("HOLA")
    //awsService.uploadToDynamoDB('usuarioPrueba');
    //awsService.sendSQS('Mensaje de prueba');
})

app.listen(port, () => {
    console.log(`API is running in port ${port}`)
})