const { s3, sns, bucket } = require("../models/aws");

class AwsService {
    uploadToS3 = async(fileName, fileBuffer) => {
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
}

module.exports = new AwsService();