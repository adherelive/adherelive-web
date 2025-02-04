import AWS from "aws-sdk";
import * as https from "https";
import fs from "fs";
import { createLogger } from "../../../libs/logger";

const logger = createLogger("AWS S3 Service");

class AwsS3Service {
  constructor() {
      /**
       * Minio is not used in the project. It is commented out.
       * TODO: Maybe uncomment this for local runs and for Test/Dev servers?
      this.minioClient = new Minio.Client({
      endPoint: process.config.minio.MINIO_ENDPOINT,
      port: 9000,
      useSSL: false,
      accessKey: process.config.minio.MINIO_ACCESS_KEY,
      secretKey: process.config.minio.MINIO_SECRET_KEY
    });
       */
    AWS.config.update({
      accessKeyId: process.config.aws.access_key_id,
      secretAccessKey: process.config.aws.access_key,
      region: process.config.aws.region,
    });
    this.s3Client = new AWS.S3();
    this.bucket = process.config.s3.BUCKET_NAME;
  }

  callback = (error, data) => {
    if (error) {
      // throw error;
      logger.error("Callback error in AWS S3 services: ", error);
    } else {
      logger.debug("AWS S3 has sent response data: ", data);
    }
  };

  raiseServerError(res) {
    res.status(500).json({ error: 'Internal Server Error in AWS S3 Module' });
  }

  /**
   * Create a bucket in the S3, if it does not exist
   * @returns {Promise<*>}
   */
  async createBucket() {
    try {
      let result;

      let doesBucketExists = true;
      logger.debug("Check if the S3 Bucket exists: ", doesBucketExists);
      const bucket_name = process.config.s3.BUCKET_NAME;
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
              Resource: [`arn:aws:s3:::${bucket_name}/`],
            },
          ],
        };

        result = await this.s3Client.makeBucket(
          process.config.s3.BUCKET_NAME,
          process.config.aws.region
        );

        await this.s3Client.setBucketPolicy(
          process.config.s3.BUCKET_NAME,
          JSON.stringify(policy)
        );

        // AdhereLive logo for email
        // after upload (to access) : https://{DOMAIN}/{BUCKET_NAME}/logo.png
        fs.readFile(`${__dirname}/../../../other/logo.png`, (err, data) => {
          if (!err) {
            const emailLogo = this.saveBufferObject(data, "logo.png");
            logger.debug("Image name for emailLogo: ", emailLogo);
            //logger.debug("Email logo has been uploaded successfully: ", logoImage);
          } else {
            logger.error("Error in getting the logo image: ", err);
          }
          if (!err) {
            const emailLogo = this.saveBufferObject(data, "logo.png");
            logger.debug("Image for emailLogo: ", emailLogo);
          } else {
            logger.error("Error in getting the email logo image: ", err);
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
              logger.debug("File for wave sound audioObject: ", audioObject);
            } else {
              logger.error("Error in getting the wave sound file: ", err);
            }
          }
        );
      }
      return result;
    } catch (err) {
      // logger.error("Error in Create Bucket for S3: ", err);
      throw err;
    }
  }

  getSignedUrl = (path) => {
    logger.debug("getSignedUrl path needs to be defined: ", { path });
    if (!path) {
      throw new Error("Invalid path provided. Path cannot be null or undefined.");
    }

    return this.s3Client.getSignedUrl("getObject", {
      Bucket: this.bucket,
      Key: path?.substring(1, path.length),
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

      logger.debug("Save Buffer Object file: ", file);
      let result = await this.s3Client.putObject(
        {
          Bucket: this.bucket,
          Key: file,
          Body: buffer,
          ContentType: metaData["Content-Type"],
        },
        this.callback
      );

      /**
       * TODO: Check why these lines are commented out?
      let url = this.s3Client.getSignedUrl("getObject", {
        Bucket: this.bucket,
        Key: file,
        Expires: 60
      });

      logger.debug("AWS S3 URL: ", url);*/

      return result;
    } catch (err) {
      logger.error("AWS S3 service has an error ---> \n", err);
      // throw err;
    }
  }

  async downloadFileObject(objectName, filePath) {
    try {
      if (!objectName) {
        logger.error("Invalid objectName provided. Cannot download file.");
        return { success: false, message: "Invalid objectName" };
      }
      const signedUrl = await this.getSignedUrl(objectName);

      return new Promise((resolve, reject) => {
        https.get(signedUrl, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download file. Status code: ${response.statusCode}`));
          }

          const file = fs.createWriteStream(filePath);
          const stream = response.pipe(file);

          stream.on("finish", () => {
            resolve(true);
          });

          stream.on("error", (err) => {
            reject(err);
          });
        }).on("error", (err) => {
          reject(err);
        });
      });
    } catch (err) {
      logger.error("Error in the download file object: ", err);
      return { success: false, message: err.message };
    }
  }

  async removeObject(file) {
    try {
      let result = await this.s3Client.removeObject(this.bucket, file);
      return result;
    } catch (err) {
      logger.error("Error in the remove file object: ", err);
      throw err;
    }
  }

  saveAudioObject = async (buffer, file, metaData = null) => {
    try {
      if (metaData === null || metaData === undefined) {
        metaData = { "Content-Type": "audio/mpeg" };
      }

      logger.debug("Save Audio Object in S3 audio file: ", file);
      let result = await this.s3Client.putObject(
        {
          Bucket: this.bucket,
          Key: file,
          Body: buffer,
          ContentType: metaData["Content-Type"],
        },
        this.callback
      );

      return result;
    } catch (err) {
      logger.error("Error in the saveAudioObject function: ", err);
      // throw err;
    }
  };

  saveVideoObject = async (buffer, file, metaData = null) => {
    try {
      if (metaData === null || metaData === undefined) {
        metaData = { "Content-Type": "video/mp4" };
      }

      logger.debug("Save video object file: ", file);
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
      logger.error("Error in the saveVideoObject function: ", err);
      // throw err;
    }
  };
}

module.exports = new AwsS3Service();
