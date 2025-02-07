import AWS from "aws-sdk";
import { createLogger } from "../../../libs/logger";

const logger = createLogger("communications --> pnManger");

const PNpayloadBuilder = require("./PNpayloadBuilder");

class pnManger {
  constructor() {
    AWS.config.update({
      accessKeyId: process.config.aws.access_key_id,
      secretAccessKey: process.config.aws.access_key,
      region: process.config.aws.region,
    });
    this.sns = new AWS.SNS();
  }

  async sendPN(payload, token) {
    try {
      //
      //
      let isValidData = this.validatePayload(payload);
      logger.info("Validating the PN payload!");
      if (isValidData.error && isValidData.error == 1) return isValidData;
      logger.info("PN payload is valid!");
      logger.info("Creating PN endpoint for ARN!");
      //
      let PNendpointData =
        payload.type == "android"
          ? await this.sns
              .createPlatformEndpoint({
                PlatformApplicationArn: process.config.aws.platform_arn,
                Token: token,
              })
              .promise()
          : payload.targetArn;

      logger.info("PN endpoint ARN creation successful!");
      let PNendpointArn =
        payload.type == "android" ? PNendpointData.EndpointArn : PNendpointData;
      logger.info("Transforming PN payload to AWS payload");
      let payloadBuilder = new PNpayloadBuilder(payload);
      logger.info("PN payload transformation to AWS payload successful!");
      let transformedPayload = payloadBuilder.getPayload();
      logger.info("Sending push notification for PN");
      transformedPayload = JSON.stringify(transformedPayload);

      let PNpublishResponse = await this.sns
        .publish({
          Message: transformedPayload,
          MessageStructure: "json",
          TargetArn: PNendpointArn,
        })
        .promise();
      return PNpublishResponse;
    } catch (err) {}
  }

  validatePayload(payload) {
    if (!payload.type || ["ios", "android"].indexOf(payload.type) == -1)
      return {
        error: 1,
        message: "invalid or undefined type",
      };

    if (payload.type == "android") {
      return this.validateGCMpayload(payload);
    }
    if (payload.type == "ios") {
      return this.validateAPNpayload(payload);
    }
  }

  validateAPNpayload(payload) {
    if (!payload.alert)
      return {
        error: 1,
        message: "invalid or empty alert!!",
      };
    return {
      error: 0,
      message: "valid apns payload",
    };
  }

  validateGCMpayload(payload) {
    if (!payload.data)
      return {
        error: 1,
        message: "invalid  or empty message!!",
      };
    if (!payload.notification)
      return {
        error: 1,
        message: "invalid or empty notification",
      };

    return {
      error: 0,
      message: "valid gcm payload",
    };
  }
}

module.exports = new pnManger();
