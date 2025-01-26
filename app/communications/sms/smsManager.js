import { SNS } from "@aws-sdk/client-sns";
import Log from "../../../libs/log";

const log = Log("Communications ---> SMS Manager");

class SmsManager {
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

    this.sns.setSMSAttributes({
      attributes: {
        DefaultSenderID: "ADHERE-LIVE",
        DefaultSMSType: "Transactional",
      },
    });
  }

  async sendSms(smsPayload) {
    try {
      log.info("Validating SMS payload...");
      const isSmsDataValid = this.smsDataValidator(smsPayload);
      if (isSmsDataValid.error) return isSmsDataValid;

      log.success("SMS payload is valid!");

      log.info("Transforming SMS payload to AWS payload...");
      const smsData = this.smsDataTransformer(smsPayload);
      log.info("SMS payload successfully transformed!");

      log.info("Sending SMS...");

      const data = await this.sns.publish(smsData);
      log.info("SMS has been sent!", data);
      return { success: true, data };
    } catch (error) {
      log.error("Error sending SMS ---> ", error);
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

export default new SmsManager();
