const { s3, bucket } = require('../models/aws'); 

async function generateDownloadUrls(userId, files) {
    const expirationTime = 60 * 5; 

    const promises = files.map((fileName) => {
        const params = {
            Bucket: bucket,
            Key: `${userId}/${fileName}`, 
            Expires: expirationTime,
        };
        return s3.getSignedUrlPromise('getObject', params);
    });

    // Resolver todas las promesas de las URLs
    return Promise.all(promises);
}

module.exports = generateDownloadUrls