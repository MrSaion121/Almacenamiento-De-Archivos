const { s3, bucket, db, sqs } = require("../models/aws");
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();
class AwsService {
    uploadToS3 = async (fileName, fileBuffer) => {
        const params = {
            Bucket: bucket,
            Key: fileName,
            Body: fileBuffer,
            ContentType: 'application/pdf',
        };

        try {
            const uploadResult = await s3.upload(params).promise();
            console.log('Archivo subido a S3:', uploadResult.Location);
            return uploadResult.Location;
        } catch (error) {
            console.error('Error al subir a S3:', error);
            throw new Error('Error al subir el archivo a S3');
        }
    }

    uploadToDynamoDB = async (username) => {
        const params = {
            TableName: 'Usuarios',
            Item: {
                user_id: uuidv4(),
                username: username
            },
        };

        try {
            const data = await db.put(params).promise();
            console.log('Usuario registrado en DynamoDB correctamente');
        } catch (err) {
            console.error('No se pudo registrar el usuario', err);
        }
    }

    sendSQS = async (message) => {
        const params = {
            QueueUrl: process.env.QueueURL,
            MessageBody: message
        };

        try {
            const data = await sqs.sendMessage(params).promise();
            console.log('Message Sent, ID: ', data.MessageId);
        } catch (err) {
            console.error("Something went wrong", err);
        }
    }

    //Obtener lista de archivos S3
    async listFilesFromS3() {
        const params = {
            Bucket: bucket,
        };

        try {
            const data = await s3.listObjectsV2(params).promise();
            return data.Contents.map(file => ( {
                Key: file.Key,
                Size: file.Size,
                LastModified: file.LastModified,
            }));
        } catch (error) {
            console.error('Error al obtener lista de archivos de S3', error);
        }
    }

    //Obtener URLs Firmadas para descargar archivos seleccionados
    async getDownloadUrls(fileKeys) {
        try {
            const urls = await Promise.all(fileKeys.map(fileKey => {
                const params = {
                    Bucket: bucket,
                    Key: fileKey,
                    Expires: 60 * 5 // 5 minute expiration
                };
                return s3.getSignedUrlPromise('getObject', params); //Generar URL firmada
            }));
            return urls
        } catch (error) {
            console.error('Error al obtener URL firmada para descargar archivo', error);
            throw error;
        }
    }
}

module.exports = new AwsService();