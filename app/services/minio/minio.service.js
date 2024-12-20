import AWS from "aws-sdk";
import * as https from "https";
// const fs = require("fs");
import fs from "fs";
// const Log = require("../../../libs/log")("minioService");
import Log from "../../../libs/log";
const log = Log("minioService");

const Minio = require("minio");

class MinioService {
  constructor() {
    // this.minioClient = new Minio.Client({
    //   endPoint: process.config.minio.MINIO_ENDPOINT,
    //   port: 9000,
    //   useSSL: false,
    //   accessKey: process.config.minio.MINIO_ACCESS_KEY,
    //   secretKey: process.config.minio.MINIO_SECRET_KEY
    // });
    AWS.config.update({
      accessKeyId: process.config.aws.access_key_id,
      secretAccessKey: process.config.aws.access_key,
      region: process.config.aws.region,
    });
    this.s3Client = new AWS.S3();
    this.bucket = process.config.minio.MINIO_BUCKET_NAME;
  }

  callback = (error, data) => {
    if (error) {
      // throw error;
      console.log("error", error);
    } else {
      console.log("response data", data);
    }
  };

  async createBucket() {
    try {
      let result;

      let doesBucketExists = true;
      Log.debug("doesBucketExists", doesBucketExists);
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
                AWS: ["*"],
              },
              Resource: [`arn:aws:s3:::${bucket_name}/*`], //${bucket_name}
            },
          ],
        };

        result = await this.s3Client.makeBucket(
          process.config.minio.MINIO_BUCKET_NAME,
          process.config.minio.MINIO_REGION
        );

        await this.s3Client.setBucketPolicy(
          process.config.minio.MINIO_BUCKET_NAME,
          JSON.stringify(policy)
        );

        // AdhereLive logo for email
        // after upload (to access) : https://{DOMAIN}/{BUCKET_NAME}/logo.png
        fs.readFile(`${__dirname}/../../../other/logo.png`, (err, data) => {
          if (!err) {
            const emailLogo = this.saveBufferObject(data, "logo.png");
            Log.debug("emailLogo", emailLogo);
          } else {
            Log.debug("err", err);
          }
          if (!err) {
            const emailLogo = this.saveBufferObject(data, "logo.png");
            Log.debug("emailLogo", emailLogo);
          } else {
            Log.debug("err", err);
          }
        });

        // Push Notification audio for android
        // after upload (to access) : https://{DOMAIN}/{BUCKET_NAME}/push_notification_sound.wav
        fs.readFile(
          `${__dirname}/../../../other/push_notification_sound.wav`,
          (err, data) => {
            if (!err) {
              const audioObject = this.saveAudioObject(
                data,
                "push_notification_sound.wav"
              );
              Log.debug("audioObject", audioObject);
            } else {
              Log.debug("err", err);
            }
          }
        );
      }
      return result;
    } catch (err) {
      // console.log("u19281011 err --> ", err);
      throw err;
    }
  }

  getSignedUrl = (path) => {
    console.log({ path });
    return this.s3Client.getSignedUrl("getObject", {
      Bucket: this.bucket,
      Key: path.substring(1, path.length),
      Expires: 60 * parseInt(process.config.s3.EXPIRY_TIME),
    });
  };

  async saveFileObject(filepath, file, metaData) {
    try {
      if (metaData == null || metaData == undefined) {
        metaData = { "Content-Type": "application/octet-stream" };
      }
      let result = await this.s3Client.fPutObject(
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

      console.log("091381293 buffer", file);
      let result = await this.s3Client.putObject(
        {
          Bucket: this.bucket,
          Key: file,
          Body: buffer,
          ContentType: metaData["Content-Type"],
        },
        this.callback
      );

      // let url = this.s3Client.getSignedUrl("getObject", {
      //   Bucket: this.bucket,
      //   Key: file,
      //   Expires: 60
      // });
      //
      // console.log("81238712 url", url);

      return result;
    } catch (err) {
      console.log("minio error ---------------------------\n\n\n", err);
      // throw err;
    }
  }

  async downloadFileObject(objectName, filePath) {
    try {
      const file = fs.createWriteStream(filePath);

      const test = await this.getSignedUrl(objectName);

      return new Promise((resolve, reject) => {
        https.get(test, (response) => {
          const stream = response.pipe(file);
          stream.on("finish", (res) => {
            resolve(true);
          });
        });
      });
    } catch (err) {
      console.log("Error got in the download file object: ", err);
      throw err;
    }
  }

  async removeObject(file) {
    try {
      let result = await this.s3Client.removeObject(this.bucket, file);
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

      console.log("091381293 audio buffer", file);
      let result = await this.s3Client.putObject(
        {
          Bucket: this.bucket,
          Key: file,
          Body: buffer,
          ContentType: metaData["Content-Type"],
        },
        this.callback
      );

      // let result = await this.s3Client.putObject(
      //   this.bucket,
      //   file,
      //   buffer,
      //   metaData
      // );

      return result;
    } catch (err) {
      Log.debug("saveAudioObject error", err);
      // throw err;
    }
  };

  saveVideoObject = async (buffer, file, metaData = null) => {
    try {
      if (metaData === null || metaData === undefined) {
        metaData = { "Content-Type": "video/mp4" };
      }

      console.log("091381293 video buffer", file);
      let result = await this.s3Client.putObject(
        {
          Bucket: this.bucket,
          Key: file,
          Body: buffer,
          ContentType: metaData["Content-Type"],
        },
        this.callback
      );

      // let result = await this.s3Client.putObject(
      //   this.bucket,
      //   file,
      //   buffer,
      //   metaData
      // );

      return result;
    } catch (err) {
      Log.debug("saveVideoObject error", err);
      // throw err;
    }
  };
}

module.exports = new MinioService();
