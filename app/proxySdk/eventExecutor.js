import { createLogger } from "../../libs/logger";

const EmailManager = require("../communications/email/emailManger");
const SmsManager = require("../communications/sms/smsManager");
const assert = require("assert");
const Logger = require("./libs/logger")
const { validateMailData, validateSmsData } = require("./libs/validator");
const { Proxy_Sdk, EVENTS } = require(".");
const Scheduler = require("./scheduler");

const logger = createLogger("Event Executor");

class EventExecutor {
  async sendMail(mailData, scheduledJobId) {
    try {
      logger.debug("INSIDE THE SEND MAIL TRY");
      // let isValid = await validateMailData(mailData);
      let response = await EmailManager.sendEmail(mailData);

      logger.debug("INSIDE THE SEND MAIL Object Assign ---> ", response);
      Object.assign(
        mailData,
        response ? { status: "SENT" } : { status: "FAILED" }
      );

      logger.debug("INSIDE THE SEND MAIL Logger: ", mailData, response);
      let proxyLogger = new Logger("email", mailData);
      await proxyLogger.log();
      // if (scheduledJobId && response) {
      //   let updatedJob = await Scheduler.updateScheduledJob(scheduledJobId, {
      //     status: "completed"
      //   });
      // }
    } catch (err) {
      logger.error("Inside the SendMail: ", err);
      // Proxy_Sdk.execute(EVENTS.EMAIL_ERROR, err, "mail_error");
    }
  }

  async sendSms(smsData, scheduledJobId) {
    try {
      let response = await SmsManager.sendSms(smsData);
      Object.assign(
        smsData,
        response ? { status: "SENT" } : { status: "FAILED" }
      );
      let proxyLogger = new Logger("sms", smsData);
      await proxyLogger.log();
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
