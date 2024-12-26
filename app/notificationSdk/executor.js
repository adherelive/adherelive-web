import EmailManager from "../communications/email/emailManger";
import SmsManager from "../communications/sms/smsManager";
import Logger from "../../libs/log";
import fetch from "node-fetch";
import stream from "getstream";
import { validateMailData } from "../proxySdk/libs/validator";
import NotificationSdk from "./index";

const Log = new Logger("NOTIFICATION_SDK ---> EXECUTOR");

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

      // Uncomment if you need to update the job status
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

      // Uncomment if you need to update the job status
      // if (scheduledJobId && response) {
      //   await Scheduler.updateScheduledJob(scheduledJobId, { status: "completed" });
      // }
    } catch (err) {
      await NotificationSdk.execute(EVENTS.SMS_ERROR, err);
    }
  }

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
      Log.debug("sendPushNotification Response", jsonResponse);
    } catch (err) {
      Log.debug("sendPushNotification 500 error", err);
    }
  }

  async sendAppNotification(template) {
    try {
      Log.debug("sendAppNotification ---> ", template.actor.toString());

      const client = stream.connect(
        process.config.getstream.key,
        process.config.getstream.secretKey,
        process.config.getstream.appId
      );

      const userToken = client.createUserToken(template.actor.toString());
      Log.debug("userToken ---> ", userToken);

      const feed = client.feed("notification", template);
      Log.debug("feed ---> ", feed);

      const response = await feed.addActivity(template);
      Log.debug("sendAppNotification Response", response);

      return response;
    } catch (err) {
      Log.debug("executor sendAppNotification 500 error", err);
    }
  }
}

export default new EventExecutor();
