import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import * as https from "https";
import fs from "fs";
import Log from "../../../libs/log";

//const logoImage = require("../../../other/logo.png");
const log = Log("AWS S3 Service");

const Minio = require("minio");

class MinioService {
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
    // JS SDK v3 does not support global configuration.
    // Codemod has attempted to pass values to each service client in this file.
    // You may need to update clients outside of this file, if they use global config.
    // AWS.config.update({
    //   accessKeyId: process.config.aws.access_key_id,
    //   secretAccessKey: process.config.aws.access_key,
    //   region: process.config.aws.region,
    // });
    this.s3Client = new S3({
      credentials: {
        accessKeyId: process.config.aws.access_key_id,
        secretAccessKey: process.config.aws.access_key,
      },
      region: process.config.aws.region,
    });
    this.bucket = process.config.s3.BUCKET_NAME;
  }

  callback = (error, data) => {
    if (error) {
      // throw error;
      console.log("Callback error in Minio services: ", error);
    } else {
      console.log("Minio has sent response data: ", data);
    }
  };

  /**
   * Create a bucket in the S3, if it does not exist
   * @returns {Promise<*>}
   */
  async createBucket() {
    try {
      let result;

      let doesBucketExists = true;
      console.log("Check if the S3 Bucket exists: ", doesBucketExists);
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
              Resource: [`arn:aws:s3:::${bucket_name}/*`],
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
            console.log("Image name for emailLogo: ", emailLogo);
            //console.log("Email logo has been uploaded successfully: ", logoImage);
          } else {
            console.log("Error in getting the logo image", err);
          }
          if (!err) {
            const emailLogo = this.saveBufferObject(data, "logo.png");
            console.log("Image for emailLogo: ", emailLogo);
          } else {
            console.log("Error in getting the email logo image: ", err);
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
              console.log("File for wave sound audioObject: ", audioObject);
            } else {
              console.log("Error in getting the wave sound file: ", err);
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

  getSignedUrl = async (path) => {
    console.log({path});
    return await getSignedUrl(this.s3Client, new GetObjectCommand({
      Bucket: this.bucket,
      Key: path.substring(1, path.length),
    }), {
      expiresIn: 60 * parseInt(process.config.s3.EXPIRY_TIME),
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

      console.log("Save Buffer Object file: ", file);
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
      // console.log("AWS S3 URL: ", url);

      return result;
    } catch (err) {
      console.log("AWS S3 service has an error ---> \n", err);
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
      console.log("Error in the download file object: ", err);
      throw err;
    }
  }

  async removeObject(file) {
    try {
      let result = await this.s3Client.removeObject(this.bucket, file);
      return result;
    } catch (err) {
      console.log("Error in the remove file object: ", err);
      throw err;
    }
  }

  saveAudioObject = async (buffer, file, metaData = null) => {
    try {
      if (metaData === null || metaData === undefined) {
        metaData = { "Content-Type": "audio/mpeg" };
      }

      console.log("Save Audio Object in S3 audio file: ", file);
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
      console.log("Error in the saveAudioObject function: ", err);
      // throw err;
    }
  };

  saveVideoObject = async (buffer, file, metaData = null) => {
    try {
      if (metaData === null || metaData === undefined) {
        metaData = { "Content-Type": "video/mp4" };
      }

      console.log("Save video object file: ", file);
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
      console.log("Error in the saveVideoObject function: ", err);
      // throw err;
    }
  };
}

module.exports = new MinioService();
