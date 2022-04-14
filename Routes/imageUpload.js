const router = require("express").Router();
const AWS = require("aws-sdk");
const fs = require("fs");
const User = require("../models/user");
const verify = require("../middlewares/verify");
const multiparty = require("multiparty");
require("dotenv").config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// create S3 instance
const s3 = new AWS.S3();

const uploadFile = (buffer, name, ext) => {
  const params = {
    ACL: "public-read",
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    Key: `${name}.${ext}`,
  };
  return s3.upload(params).promise();
};

router.post("/", verify, (request, response) => {
  const form = new multiparty.Form();
  form.parse(request, async (error, fields, files) => {
    if (error) {
      return response.status(400).json({ error });
    }
    try {
      const path = files.file[0].path;
      const ext = path.split(".").slice(-1)[0];
      //   console.log(ext);
      const buffer = fs.readFileSync(path);
      const fileName = `bucketFolder/${Date.now().toString() + request.userId}`;
      const data = await uploadFile(buffer, fileName, ext);
    //   console.log(data);
      const result = await User.findByIdAndUpdate(request.userId, {
        $set: { imageURL: data.Location },
      });
    //   console.log(result);
      return response.status(200).json({ imageURL:data.Location });
    } catch (err) {
      return response.status(400).json({ err });
    }
  });
});

module.exports = router;
