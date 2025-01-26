import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import * as https from "https";
import fs from "fs";
import Log from "../../../libs/log";

const log = Log("AWS S3 Service");

class S3Service {
    constructor() {
        // JS SDK v3 does not support global configuration.
        // Codemod has attempted to pass values to each service client in this file.
        // You may need to update clients outside of this file, if they use global config.
        // AWS.config.update({
        //     accessKeyId: process.config.aws.access_key_id,
        //     secretAccessKey: process.config.aws.access_key,
        //     region: process.config.aws.region,
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
            console.log("Callback error in S3 services: ", error);
        } else {
            console.log("S3 response data: ", data);
        }
    };

    async createBucket() {
        try {
            const bucketExists = await this.s3Client
                .headBucket({ Bucket: this.bucket })
                .then(() => true)
                .catch((err) => {
                    if (err.statusCode === 404) return false;
                    throw err;
                });

            if (!bucketExists) {
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
                            Resource: [`arn:aws:s3:::${this.bucket}/*`],
                        },
                    ],
                };

                await this.s3Client
                    .createBucket({ Bucket: this.bucket });

                await this.s3Client
                    .putBucketPolicy({ Bucket: this.bucket, Policy: JSON.stringify(policy) });

                await this.uploadFile(`${__dirname}/../../../other/logo.png`, "logo.png", "image/png");
                await this.uploadFile(`${__dirname}/../../../other/push_notification_sound.wav`, "push_notification_sound.wav", "audio/mpeg");
            }
        } catch (err) {
            console.log("Error creating bucket: ", err);
            throw err;
        }
    }

    async getSignedUrl(path) {
        return await getSignedUrl(this.s3Client, new GetObjectCommand({
            Bucket: this.bucket,
            Key: path,
        }), {
            expiresIn: 60 * parseInt(process.config.s3.EXPIRY_TIME),
        });
    }

    async uploadFile(filepath, key, contentType) {
        try {
            const data = fs.readFileSync(filepath);
            const params = {
                Bucket: this.bucket,
                Key: key,
                Body: data,
                ContentType: contentType,
            };
            await new Upload({
                client: this.s3Client,
                params,
            }).done();
            console.log(`${key} uploaded successfully.`);
        } catch (err) {
            console.log(`Error uploading ${key}: `, err);
            throw err;
        }
    }

    async saveBuffer(buffer, key, contentType = "application/octet-stream") {
        try {
            const params = {
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: contentType,
            };
            await new Upload({
                client: this.s3Client,
                params,
            }).done();
            console.log(`Buffer saved as ${key}.`);
        } catch (err) {
            console.log("Error saving buffer: ", err);
            throw err;
        }
    }

    async downloadFile(key, filePath) {
        try {
            const url = this.getSignedUrl(key);
            const file = fs.createWriteStream(filePath);
            return new Promise((resolve, reject) => {
                https.get(url, (response) => {
                    response.pipe(file).on("finish", () => resolve(true));
                }).on("error", (err) => {
                    console.log("Error downloading file: ", err);
                    reject(err);
                });
            });
        } catch (err) {
            console.log("Error in the download file object: ", err);
            throw err;
        }
    }

    async removeObject(key) {
        try {
            await this.s3Client.deleteObject({
                Bucket: this.bucket,
                Key: key,
            });
            console.log(`${key} removed successfully.`);
        } catch (err) {
            console.log("Error removing object: ", err);
            throw err;
        }
    }
}

module.exports = new S3Service();
