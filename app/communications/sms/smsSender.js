import AWS from "aws-sdk";
// const log = require("../../../libs/log")("communications ---> smsManger");
import Log from "../../../libs/log";
const log = Log("communications ---> smsManger");
const axios = require("axios");

class SmsManager {
  constructor(payload) {
    this.payload = payload;
    AWS.config.update({
      accessKeyId: process.config.aws.access_key_id,
      secretAccessKey: process.config.aws.access_key,
      region: process.config.aws.region,
    });

    this.TopicArn = process.config.aws.topic_arn;

    this.sns = new AWS.SNS();
  }

  async sendSms() {
    try {
      const smsPayload = this.payload;
      //log.info("validating sms payload!!");

      let isSmsDataValid = this.smsDataValidator(smsPayload);
      if (isSmsDataValid.error && isSmsDataValid.error == 1)
        return isSmsDataValid;

      log.success("Sms payload is valid!!");

      log.info("transforming sms payload to aws payload!!");
      let smsData = this.smsDataTransformer(smsPayload);
      log.info("Sms payload successfully transformed!!");

      log.info(`Sending SMS...!!`);

      let options = {
        method: "POST",
        url: process.config.MSG91_SMS_URL,
        headers: {
          authkey: process.config.MSG91_AUTH_KEY,
          "content-type": "application/json",
        },
        data: {
          sender: process.config.MSG91_SENDER,
          route: "4",
          country: smsData.countryCode,
          sms: [
            {
              message: smsData.Message,
              to: [smsData.PhoneNumber],
            },
          ],
        },
      };

      let response = await axios(options);
      log.info("SMS sent to manager: ", response.data);
      return response.data;
      // let smsPublishResponse = await this.sns
      //   .publish(smsData, (err, data) => {
      //     if (err) {
      //       log.info("Sending SMS error ---> ", err);
      //     }
      //     if (data) {
      //       log.info("SMS sent successfully", data);
      //     }
      //   })
      //   .promise();
      // .promise(response => {

      // });

      // let smsPublishResponse = await this.sns
      //   .publish(smsData, (err, data) => {

      //     if (err) {
      //       log.info("Sending SMS error ---> ", err);
      //     }
      //     if (data) {
      //       log.info("SMS has been sent: ", data);
      //     }
      //   })
      //   .promise();
      //return smsPublishResponse;
    } catch (err) {
      log.info("Sending SMS error --->", err);
      return err.data;
    }
  }

  smsDataTransformer(smsData) {
    let smsTransformedData = {}; // new Object();
    smsTransformedData.PhoneNumber = smsData.phoneNumber;
    smsTransformedData.countryCode = smsData.countryCode;
    smsTransformedData.Message = smsData.message;
    smsTransformedData.MessageStructure = smsData.messageStructure || "string";
    smsTransformedData.Subject = smsData.Subject || "EconsultingAppWaala";
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

module.exports = (payload) => {
  return new SmsManager(payload);
};
