import AWS from "aws-sdk";
import axios from "axios";
import { createLogger } from "../../../libs/logger";

const logger = createLogger("Communications ---> SMS Sender");

class SmsSender {
  constructor(payload) {
    this.payload = payload;
    AWS.config.update({
      accessKeyId: process.config.aws.access_key_id,
      secretAccessKey: process.config.aws.access_key,
      region: process.config.aws.region,
    });

    this.sns = new AWS.SNS();
  }

  async sendSms() {
    try {
      const smsPayload = this.payload;

      // Validate SMS payload
      const validationResponse = this.smsDataValidator(smsPayload);
      if (validationResponse.error) return validationResponse;

      logger.success("SMS payload is valid!");

      logger.debug("Transforming SMS payload to AWS payload...");
      const smsData = this.smsDataTransformer(smsPayload);
      logger.debug("SMS payload successfully transformed!");

      logger.debug("Sending SMS...");

      // Setup options for axios request
      const options = {
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

      // Send SMS via axios
      const response = await axios(options);
      logger.debug("SMS sent via SMS sender: ", response.data);
      return { success: true, data: response.data };

      // let smsPublishResponse = await this.sns
      //   .publish(smsData, (err, data) => {
      //     if (err) {
      //       logger.debug("Sending SMS error ---> ", err);
      //     }
      //     if (data) {
      //       logger.debug("SMS sent successfully", data);
      //     }
      //   })
      //   .promise();
      // .promise(response => {
      // });

      // let smsPublishResponse = await this.sns
      //   .publish(smsData, (err, data) => {

      //     if (err) {
      //       logger.debug("Sending SMS has an error ---> ", err);
      //     }
      //     if (data) {
      //       logger.debug("SMS has been sent: ", data);
      //     }
      //   })
      //   .promise();
      //return smsPublishResponse;
    } catch (error) {
      logger.error("Error sending SMS: ", error);
      return { success: false, error: error.message };
    }
  }

  smsDataTransformer(smsData) {
    return {
      PhoneNumber: smsData.phoneNumber,
      countryCode: smsData.countryCode,
      Message: smsData.message,
      MessageStructure: smsData.messageStructure || "string",
      Subject: smsData.Subject || "AdhereLive Patient Alert",
    };
  }

  smsDataValidator(smsData) {
    if (!smsData.countryCode) {
      return { error: true, message: "Invalid or empty country code" };
    }
    if (!smsData.phoneNumber) {
      return { error: true, message: "Invalid or empty phone number" };
    }
    if (!smsData.message) {
      return { error: true, message: "Message can't be empty" };
    }
    return { error: false, message: "Valid" };
  }
}

export default (payload) => new SmsSender(payload);
