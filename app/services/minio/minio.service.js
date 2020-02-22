const Minio = require("minio");
const Log = require("../../../libs/log")("minioService");

class MinioService {
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.config.minio.MINIO_ENDPOINT,
      port: 9000,
      useSSL: false,
      accessKey: process.config.minio.MINIO_ACCESS_KEY,
      secretKey: process.config.minio.MINIO_SECRET_KEY
    });
  }

  async createBucket() {
    try {
      let result;
      let doesBucketExists = await this.minioClient.bucketExists(
        process.config.minio.MINIO_BUCKET_NAME
      );
      Log.debug(doesBucketExists);
      if (!doesBucketExists) {
        const policy = {
          Version: "2012-10-17",
          Id: "rpmpolicy",
          Statement: [
            {
              Action: ["s3:GetObject"],
              Effect: "Allow",
              Principal: {
                AWS: ["*"]
              },
              Resource: ["arn:aws:s3:::rpm/*"]
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
      }
      this.bucket = process.config.minio.MINIO_BUCKET_NAME;
      return result;
    } catch (err) {
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
      throw err;
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
}

module.exports = new MinioService();
