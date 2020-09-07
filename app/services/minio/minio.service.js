const Minio = require("minio");
const fs = require("fs");

const Log = require("../../../libs/log")("minioService");

class MinioService {
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.config.minio.MINIO_ENDPOINT,
      port: 9000,
      useSSL: false,
      accessKey: process.config.minio.MINIO_ACCESS_KEY,
      secretKey: process.config.minio.MINIO_SECRET_KEY
      // endPoint: "s3.amazonaws.com",
      // accessKey: process.config.aws.access_key,
      // secretKey: process.config.minio.MINIO_SECRET_KEY
    });
  }

  async createBucket() {
    try {
      let result;
      let doesBucketExists = await this.minioClient.bucketExists(
        process.config.minio.MINIO_BUCKET_NAME
      );
      Log.debug("doesBucketExists",doesBucketExists);
      const bucket_name = process.config.minio.MINIO_BUCKET_NAME;
      if (!doesBucketExists) {
        const policy = {
          Version: "2012-10-17",
          Id: "adherepolicy",
          Statement: [
            {
              Action: ["s3:GetObject"],
              Effect: "Allow",
              Principal: {
                AWS: ["*"]
              },
              Resource: [`arn:aws:s3:::${bucket_name}/*`] //${bucket_name}
            }
          ]
        };

        result = await this.minioClient.makeBucket(
          process.config.minio.MINIO_BUCKET_NAME,
          process.config.minio.MINIO_REGION
        );

        await this.minioClient.setBucketPolicy(
          process.config.minio.MINIO_BUCKET_NAME,
          JSON.stringify(policy)
        );

        fs.readFile(`${__dirname}/../../../logo.png`, (err, data) => {
          if(!err) {
            const emailLogo = this.saveBufferObject(data, "logo.png");
            Log.debug("emailLogo", emailLogo);
          } else {
            Log.debug("err", err);
          }
        });


      }
      this.bucket = process.config.minio.MINIO_BUCKET_NAME;
      return result;
    } catch (err) {
      // console.log("u19281011 err --> ", err);
      throw err;
    }
  }

  async saveFileObject(filepath, file, metaData) {
    try {
      if (metaData == null || metaData == undefined) {
        metaData = { "Content-Type": "application/octet-stream" };
      }
      let result = await this.minioClient.fPutObject(
        this.bucket,
        file,
        filepath,
        metaData
      );
      return result;
    } catch (err) {
      throw err;
    }
  }

  async saveBufferObject(buffer, file, metaData) {
    try {
      if (metaData == null || metaData == undefined) {
        metaData = { "Content-Type": "application/octet-stream" };
      }
      let result = await this.minioClient.putObject(
        this.bucket,
        file,
        buffer,
        metaData
      );

      return result;
    } catch (err) {
      console.log("minio error ---------------------------\n\n\n", err);
      // throw err;
    }
  }

  async removeObject(file) {
    try {
      let result = await this.minioClient.removeObject(this.bucket, file);
      return result;
    } catch (err) {
      throw err;
    }
  }

  saveAudioObject = async (buffer, file, metaData = null) => {
    try {
      if (metaData === null || metaData === undefined) {
        metaData = { "Content-Type": "audio/mpeg" };
      }
      let result = await this.minioClient.putObject(
          this.bucket,
          file,
          buffer,
          metaData
      );

      return result;
    } catch (err) {
      Log.debug("saveAudioObject error", err);
      // throw err;
    }
  };
}

module.exports = new MinioService();
