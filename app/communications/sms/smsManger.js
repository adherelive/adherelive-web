import AWS from "aws-sdk";
// const log = require("../../../libs/log")("communications ---> smsManger");
import Log from "../../../libs/log";
const log = Log("communications ---> smsManger");
const axios = require("axios");

class SmsManager {
  constructor() {
    AWS.config.update({
      accessKeyId: process.config.aws.access_key_id,
      secretAccessKey: process.config.aws.access_key,
      region: process.config.aws.region,
    });

    this.TopicArn = process.config.aws.topic_arn;

    this.sns = new AWS.SNS();

    this.sns.setSMSAttributes({
      attributes: {
        DefaultSenderID: "ADHERE-LIVE",
        DefaultSMSType: "Transactional",
      },
    });
  }

  async sendSms(smsPayload) {
    try {
      log.info("validating sms payload!!");

      let isSmsDataValid = this.smsDataValidator(smsPayload);
      if (isSmsDataValid.error && isSmsDataValid.error == 1)
        return isSmsDataValid;

      log.success("Sms payload is valid!!");

      log.info("transforming sms payload to aws payload!!");
      let smsData = this.smsDataTransformer(smsPayload);
      log.info("Sms payload successfully transformed!!");

      log.info(`Sending SMS...!!`);

      let smsSent = false;

      await this.sns
        .publish(smsData)
        .promise()
        .then((data) => {
          log.info("sms sent...........!!", data);
          smsSent = true;
        })
        .catch((error) => {
          log.info("sending sms error --->", error);
          smsSent = false;
        });

      return smsSent;

      // return await this.sns
      //   .publish(smsData, (err, data) => {
      //
      //
      //     if (err) {
      //       log.info("sending sms error --->", err);
      //     }
      //     if (data) {
      //       log.info("SMS has been sent: ", data);
      //     }
      //   })
      //   .promise();
      // return smsPublishResponse;
    } catch (err) {
      log.info("sending sms error --->", err);
      return err.data;
    }
  }

  smsDataTransformer(smsData) {
    let smsTransformedData = {}; // new Object();
    smsTransformedData.PhoneNumber = smsData.phoneNumber;
    // smsTransformedData.countryCode = smsData.countryCode;
    smsTransformedData.Message = smsData.message;
    smsTransformedData.MessageStructure = smsData.messageStructure || "string";
    smsTransformedData.Subject = smsData.Subject || "Patient Onboarding";
    // smsTransformedData.TopicArn = this.TopicArn;
    return smsTransformedData;
  }

  async smsDataValidator(smsData) {
    if (!smsData.countryCode)
      return {
        error: 1,
        message: "invalid or empty country code!!",
      };

    if (!smsData.phoneNumber)
      return {
        error: 1,
        message: "invalid or empty phone number!!",
      };

    if (!smsData.message)
      return {
        error: 1,
        message: "message can't be empty",
      };
    return {
      error: 0,
      message: "valid",
    };
  }
}

module.exports = new SmsManager();
