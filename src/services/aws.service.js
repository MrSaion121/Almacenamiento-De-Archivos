const { topic, sns } = require("../models/aws");

class AwsService {
    sendNotification = async () => {
        const message = `
        Se ha subido su archivo con exito.`
 
        const params = {
            Message: message,
            Subject: 'Archivo subido',
            TopicArn: topic
        }

        await sns.publish(params).promise();
    }
}

module.exports = new AwsService();