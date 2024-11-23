const { s3 } = require("../models/aws");

const listFiles = async (req, res) => {
    //console.log(req.body.userId)
    const { userId } = req.params
    //console.log(userId);
    var params = {
        Bucket: `${process.env.AWS_BUCKET_NAME}`,
        Prefix: `${userId}/`
    }

    s3.listObjects(params, function (err, data) {
        console.log(data.Contents);
    })

}

module.exports = listFiles;