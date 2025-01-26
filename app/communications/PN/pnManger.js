import { SNS } from "@aws-sdk/client-sns";
import Log from "../../../libs/log";

const log = Log("communications --> pnManger");

const PNpayloadBuilder = require("./PNpayloadBuilder");

class pnManger {
  constructor() {
    // JS SDK v3 does not support global configuration.
    // Codemod has attempted to pass values to each service client in this file.
    // You may need to update clients outside of this file, if they use global config.
    // AWS.config.update({
    //   accessKeyId: process.config.aws.access_key_id,
    //   secretAccessKey: process.config.aws.access_key,
    //   region: process.config.aws.region,
    // });
    this.sns = new SNS({
      credentials: {
        accessKeyId: process.config.aws.access_key_id,
        secretAccessKey: process.config.aws.access_key,
      },
      region: process.config.aws.region,
    });
  }

  async sendPN(payload, token) {
    try {
      let isValidData = this.validatePayload(payload);
      Log.info("validating payload");
      if (isValidData.error && isValidData.error == 1) return isValidData;
      Log.success("payload valid!!");
      Log.info("creating endpointArn...!!");

      let PNendpointData =
        payload.type == "android"
          ? await this.sns
              .createPlatformEndpoint({
                PlatformApplicationArn: process.config.aws.platform_arn,
                Token: token,
              })
          : payload.targetArn;

      Log.success("endpointArn creation successful!!");
      let PNendpointArn =
        payload.type == "android" ? PNendpointData.EndpointArn : PNendpointData;
      Log.info("transforming payload to aws payload");
      let payloadBuilder = new PNpayloadBuilder(payload);
      Log.success("payload build successfull!!");
      let tranformedPayload = payloadBuilder.getPayload();
      Log.info("sending push notification");
      tranformedPayload = JSON.stringify(tranformedPayload);
      //
      let PNpublishResponse = await this.sns
        .publish({
          Message: tranformedPayload,
          MessageStructure: "json",
          TargetArn: PNendpointArn,
        });
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
