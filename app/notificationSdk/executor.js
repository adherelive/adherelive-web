import EmailManager from "../communications/email/emailManger";
import SmsManager from "../communications/sms/smsManager";
import { createLogger } from "../../libs/logger";
import fetch from "node-fetch";
import stream from "getstream";
import { validateMailData } from "../proxySdk/libs/validator";
import NotificationSdk from "./index";
import EVENTS from "../proxySdk/proxyEvents";

const logger = createLogger("NOTIFICATION_SDK ---> EXECUTOR");

class EventExecutor {
  async sendMail(mailData, scheduledJobId) {
    try {
      const isValid = await validateMailData(mailData);
      if (!isValid) {
        throw new Error("Invalid mail data");
      }

      const response = await EmailManager.sendEmail(mailData);
      mailData.status = response ? "SENT" : "FAILED";

      const logger = new Logger("email", mailData);
      logger.log();

      // TODO: Uncomment if you need to update the job status
      // if (scheduledJobId && response) {
      //   await Scheduler.updateScheduledJob(scheduledJobId, { status: "completed" });
      // }
    } catch (err) {
      await NotificationSdk.execute(EVENTS.EMAIL_ERROR, err, "mail_error");
    }
  }

  async sendSms(smsData, scheduledJobId) {
    try {
      const response = await SmsManager.sendSms(smsData);
      smsData.status = response ? "SENT" : "FAILED";

      const logger = new Logger("sms", smsData);
      logger.log();

      // TODO: Uncomment if you need to update the job status
      // if (scheduledJobId && response) {
      //   await Scheduler.updateScheduledJob(scheduledJobId, { status: "completed" });
      // }
    } catch (err) {
      await NotificationSdk.execute(EVENTS.SMS_ERROR, err);
    }
  }

  /**
   * The same function is available in (app/notificationSdk/pushApp/index.js)
   *
   async sendPushNotification(template) {
    try {
      const response = await fetch(
        "https://onesignal.com/api/v1/notifications",
        {
          method: "POST",
          port: 443,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: "Basic " + process.config.ONE_SIGNAL_KEY,
          },
          body: JSON.stringify(template),
        }
      );

      const jsonResponse = await response.json();
      logger.debug("sendPushNotification Response: ", jsonResponse);
    } catch (err) {
      logger.debug("Event executor sendPushNotification 500 error: ", err);
    }
  }
   */

  /**
   * The same function is available in (app/notificationSdk/inApp/index.js)
   *
  sendAppNotification = async (template) => {
    try {
      // TODO: Add get-stream rest api call code here
      logger.debug("Template Actor: ", template.actor.toString());
      const client = stream.connect(
          process.config.getstream.key,
          process.config.getstream.secretKey,
          process.config.getstream.appId
      );
      const userToken = client.createUserToken(template.actor.toString());
      logger.debug("Generated get-stream userToken in use: ", userToken);
      logger.debug("Get-Stream client --> ", client);

      const feed = client.feed("notification", template.object);
      logger.debug("Feed Initialized: ", feed);
      const response = await feed.addActivity(template).catch((err) => {
        logger.debug("Get-Stream response error: ", err);
      });
      logger.debug("Activity Added: ", response);

      return response;
    } catch (err) {
      logger.debug("Error in sendAppNotification: ", err);
      throw err; // Re-throw the error for further handling
    }
  };
   */
}

export default new EventExecutor();
