import EmailManager from "../communications/email/emailManger";
import SmsManager from "../communications/sms/smsManger";

import Logger from "../../libs/log";
import fetch from "node-fetch";
import stream from "getstream";
import { validateMailData } from "../proxySdk/libs/validator";

const Log = new Logger("NOTIFICATION_SDK > EXECUTOR");

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
      NotificationSdk.execute(EVENTS.EMAIL_ERROR, err, "mail_error");
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
      NotificationSdk.execute(EVENTS.SMS_ERROR, err);
    }
  }

  sendPushNotification = async (template) => {
    try {
      // TODO: add one-signal rest api call code here
      const response = await fetch(
        "https://onesignal.com/api/v1/notifications",
        {
          method: "POST",
          port: 443,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: "Basic " + process.config.ONE_SIGNAL_KEY,
          },
          body: template,
        }
      );
      Log.debug("sendPushNotification Response", response);
    } catch (err) {
      Log.debug("sendPushNotification 500 error", err);
    }
  };

  sendAppNotification = async (template) => {
    try {
      // TODO: add get stream rest api call code here
      Log.debug("sendAppNotification --> ", template.actor.toString());
      const client = stream.connect(
        process.config.getstream.key,
        process.config.getstream.secretKey
      );
      const userToken = client.createUserToken(template.actor.toString());

      Log.debug("userToken --> ", userToken);
      Log.debug("client --> ", client);

      let result = {};
      // console.log("notification payload=>>>>>>>>>>>>>>>>>", data);
      const feed = client.feed("notification", template);

      Log.debug("feed --> ", feed);
      // console.log("Data....OBBBjeeeect: ", data.object);
      // console.log("FFFFFEeeeeeedddddd: ", feed);
      const response = await feed.addActivity(template).catch((err) => {
        Log.debug("response err ------>", err);
      });

      Log.debug("sendAppNotification Response", response);

      return result;
    } catch (err) {
      Log.debug("executor sendAppNotification 500 error", err);
    }
  };
}

export default new EventExecutor();
