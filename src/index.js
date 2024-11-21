const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
const mysql = require('mysql2/promise');
//Cargar variables de entorno
const dotenv = require('dotenv');
dotenv.config();

//Crear instancia de express
const app = express();
const port = process.env.PORT || 3000;

//Conf. S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION
})

//Conf SNS
const sns = new AWS.SNS({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: process.env.AWS_REGION
})

//Config RDS
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

app.use('/', express.static(path.join(__dirname, '..', 'public')))
//app.use('/', express.static(path.join(__dirname, '..', 'src')))
//app.use(express.json());
app.use('/', routes);


// Prueba de conexión a RDS
app.get('/test-rds', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT NOW() AS currentTime');
        res.json({ success: true, currentTime: rows[0].currentTime });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Prueba de conexión a S3
app.get('/test-s3', async (req, res) => {
    try {
        const buckets = await s3.listBuckets().promise();
        res.json({ success: true, buckets: buckets.Buckets });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Prueba de conexión a SNS
app.get('/test-sns', async (req, res) => {
    try {
        const params = {
            Message: 'Prueba de conexión con SNS desde TiesOnDrive',
            TopicArn: process.env.SNS_TOPIC_ARN
        };
        const result = await sns.publish(params).promise();
        res.json({ success: true, messageId: result.MessageId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('', (req, res) => {
    res.send("!Hola! Bienvenido a TiesOnDrive")
})

app.listen(port, () => {
    console.log(`API is running in port ${port}`)
})