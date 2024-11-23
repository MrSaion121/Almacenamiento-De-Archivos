const { topic, sns } = require("../models/aws");

class AwsService {
    sendNotification = async () => {
        const message = `Se ha subido su archivo con exito.`

        const params = {
            Message: message,
            Subject: 'Archivo subido',
            TopicArn: topic
        }

        //Manejo de errores
        try {
            const result = await sns.publish(params).promise();
            console.log('Notificacion enviada con exito: ',result);
            return result;
        } catch (error){
            console.error('Error al enviar Notificacion', error);
            throw new Error('No se pudo enviar la notificacion');
        }
    }
}

module.exports = new AwsService();