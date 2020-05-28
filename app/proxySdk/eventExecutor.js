const EmailManager = require("../communications/email/emailManger");
const SmsManager = require("../communications/sms/smsManger");
const Logger = require("./libs/logger");
const assert = require("assert");
const { validateMailData, validateSmsData } = require("./libs/validator");
const { Proxy_Sdk, EVENTS } = require(".");
const Scheduler = require("./scheduler");

class EventExecutor {
  async sendMail(mailData, scheduledJobId) {
    try {
      let isValid = await validateMailData(mailData);
      let response = await EmailManager.sendEmail(mailData);
      Object.assign(
        mailData,
        response ? { status: "SENT" } : { status: "FAILED" }
      );
      let logger = new Logger("email", mailData);
      logger.log();
      // if (scheduledJobId && response) {
      //   let updatedJob = await Scheduler.updateScheduledJob(scheduledJobId, {
      //     status: "completed"
      //   });
      // }
    } catch (err) {
      Proxy_Sdk.execute(EVENTS.EMAIL_ERROR, err, "mail_error");
    }
  }

  async sendSms(smsData, scheduledJobId) {
    try {
      let response = SmsManager.sendSms(smsData);
      Object.assign(
        smsData,
        response ? { status: "SENT" } : { status: "FAILED" }
      );
      let logger = new Logger("sms", smsData);
      logger.log();
      // if (scheduledJobId && response) {
      //   let updatedJob = await Scheduler.updateScheduledJob(scheduledJobId, {
      //     status: "completed"
      //   });
      // }
    } catch (err) {
      Proxy_Sdk.execute(EVENTS.SMS_ERROR, err);
    }
  }
}

module.exports = new EventExecutor();
