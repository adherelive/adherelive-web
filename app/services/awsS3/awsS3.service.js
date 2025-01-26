import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3,
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
  PutObjectCommandInput
} from "@aws-sdk/client-s3";
import * as https from "https";
import * as path from 'path';
import fs from "fs";
import Log from "../../../libs/log";

const log = Log("AWS S3 Service");

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
    // JS SDK v3 does not support global configuration.
    // Codemod has attempted to pass values to each service client in this file.
    // You may need to update clients outside of this file, if they use global config.
    const s3Client = new S3Client({});
    this.s3Client = new S3({
      credentials: {
        accessKeyId: process.config.aws.access_key_id,
        secretAccessKey: process.config.aws.access_key,
      },
      region: process.config.aws.region,
    });
    this.bucketName = process.config.s3.BUCKET_NAME;
  }

  callback = (error, data) => {
    if (error) {
      // throw error;
      console.log("Callback error in AWS S3 services: ", error);
    } else {
      console.log("AWS S3 has sent response data: ", data);
    }
  };

  /**
   * Create a bucket in the S3, if it does not exist
   * @returns {Promise<*>}
   */
  async createBucket() {
    try {
      const bucket_name = process.config.s3.BUCKET_NAME;

      // Check if bucket exists
      let doesBucketExists = false;
      try {
        await this.s3Client.send(new HeadBucketCommand({ Bucket: bucket_name }));
        doesBucketExists = true;
        console.log(`Bucket ${bucket_name} already exists`);
      } catch (error) {
        // If HeadBucketCommand throws an error, the bucket likely doesn't exist
        if (error.$metadata && error.$metadata.httpStatusCode === 404) {
          console.log(`Bucket ${bucket_name} does not exist, will create it`);
        } else {
          // If it's a different error, re-throw
          throw error;
        }
      }

      // If bucket doesn't exist, create it
      if (!doesBucketExists) {
        // import { CreateBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
        // Create bucket
        const createBucketCommand = new CreateBucketCommand({
          Bucket: bucket_name,
          CreateBucketConfiguration: {
            LocationConstraint: process.config.aws.region
          }
        });
        await this.s3Client.send(createBucketCommand);

        // Set bucket policy
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

        const putBucketPolicyCommand = new PutBucketPolicyCommand({
          Bucket: bucket_name,
          Policy: JSON.stringify(policy)
        });
        await this.s3Client.send(putBucketPolicyCommand);
      }

      // Upload logo
      await new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/../../../other/logo.png`, async (err, data) => {
          if (err) {
            console.log("Error reading logo image:", err);
            reject(err);
            return;
          }

          try {
            const { PutObjectCommand } = await import("@aws-sdk/client-s3");
            const uploadCommand = new PutObjectCommand({
              Bucket: bucket_name,
              Key: "logo.png",
              Body: data,
              ContentType: "image/png"
            });

            const uploadResult = await this.s3Client.send(uploadCommand);
            console.log("Logo uploaded successfully:", uploadResult);
            resolve();
          } catch (uploadErr) {
            console.log("Error uploading logo: ", uploadErr);
            reject(uploadErr);
          }
        });
      });

      // Upload wave sound
      await new Promise((resolve, reject) => {
        fs.readFile(
            `${__dirname}/../../../other/push_notification_sound.wav`,
            async (err, data) => {
              if (err) {
                console.log("Error reading wave sound file: ", err);
                reject(err);
                return;
              }

              try {
                const { PutObjectCommand } = await import("@aws-sdk/client-s3");
                const uploadCommand = new PutObjectCommand({
                  Bucket: bucket_name,
                  Key: "push_notification_sound.wav",
                  Body: data,
                  ContentType: "audio/wav"
                });

                const uploadResult = await this.s3Client.send(uploadCommand);
                console.log("Wave sound uploaded successfully:", uploadResult);
                resolve();
              } catch (uploadErr) {
                console.log("Error uploading wave sound:", uploadErr);
                reject(uploadErr);
              }
            }
        );
      });

      return true;
    } catch (err) {
      console.error("Error in createBucket:", err);
      throw err;
    }
  }

  getSignedUrl = async (path) => {
    console.log({path});
    return await getSignedUrl(this.s3Client, new GetObjectCommand({
      Bucket: this.bucketName,
      Key: path.substring(1, path.length),
    }), {
      expiresIn: 60 * parseInt(process.config.s3.EXPIRY_TIME),
    });
  };

  // Optional: Add a method to generate a signed URL
  // async getSignedUrl(file: string, expiresIn = 60) {
  //   try {
  //     const command = new GetObjectCommand({
  //       Bucket: this.bucketName,
  //       Key: file
  //     });
  //
  //     // Generate signed URL using @aws-sdk/s3-request-presigner
  //     const signedUrl = await getSignedUrl(this.s3Client, command, {
  //       expiresIn
  //     });
  //
  //     return signedUrl;
  //   } catch (err) {
  //     console.error("Error generating signed URL: ", err);
  //     throw err;
  //   }
  // }

  async saveFileObject(filepath, file, metaData) {
    try {
      if (metaData == null || metaData == undefined) {
        metaData = { "Content-Type": "application/octet-stream" };
      }
      let result = await this.s3Client.fPutObject(
        this.bucketName,
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
      // If no metadata is provided, use a default content type
      if (!metaData) {
        metaData = { "Content-Type": "application/octet-stream" };
      }

      // Ensure we have a Content-Type, defaulting if not specified
      const contentType = metaData["Content-Type"] || "application/octet-stream";

      // Prepare upload parameters
      const params = {
        Bucket: this.bucketName,
        Key: file,
        Body: buffer,
        ContentType: contentType
      };

      // Create a PutObject command
      const command = new PutObjectCommand(params);

      // Send the command to S3
      const result = await this.s3Client.send(command);

      console.log("File uploaded successfully: ", file);
      return result;
    } catch (err) {
      console.error("AWS S3 upload error: ", err);
      throw err; // Re-throw to allow caller to handle the error
    }
  }

  // Improved download method
  async downloadFileObject(objectName, localFilePath) {
    console.log("Download file object: ", objectName);
    console.log("Local file path: ", localFilePath);

    try {
      // Ensure the directory exists
      // path.dirname helps extract the directory path from the full file path
      const directory = path.dirname(localFilePath);

      // Create directory recursively if it doesn't exist
      // The { recursive: true } option ensures nested directories are created
      fs.mkdirSync(directory, { recursive: true });

      // Prepare the download parameters
      // Simple object without type annotations
      const params = {
        Bucket: this.bucketName,
        Key: objectName
      };

      // Create a GetObject command using the AWS SDK v3 approach
      const command = new GetObjectCommand(params);

      // Download the file directly using SDK
      const response = await this.s3Client.send(command);

      // Create a write stream to save the file
      const writeStream = fs.createWriteStream(localFilePath);

      // Return a Promise that resolves when file download is complete
      return new Promise((resolve, reject) => {
        // Optional chaining replaced with null check
        if (response.Body) {
          response.Body.pipe(writeStream)
              .on('finish', () => resolve(true))
              .on('error', (err) => reject(err));
        } else {
          reject(new Error('No file body found'));
        }
      });
    } catch (err) {
      // Comprehensive error logging
      console.error("Error downloading file: ", err);

      // Re-throw to allow caller to handle the error
      throw err;
    }
  }

  async removeObject(file) {
    try {
      let result = await this.s3Client.removeObject(this.bucketName, file);
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
          Bucket: this.bucketName,
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
          Bucket: this.bucketName,
          Key: file,
          Body: buffer,
          ContentType: metaData["Content-Type"],
        },
        this.callback
      );

      // let result = await this.s3Client.putObject(
      //   this.bucketName,
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

module.exports = new AwsS3Service();
