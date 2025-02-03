import {
  AGORA_CALL_NOTIFICATION_TYPES,
  USER_CATEGORY,
  DEFAULT_PROVIDER,
} from "../../../constant";
import { createLogger } from "../../../libs/log";
import EventExecutor from "../executor";
import fetch from "node-fetch";

const log = createLogger("NOTIFICATION_SDK > PUSH_APP");

// log.filename("NOTIFICATION_SDK > PUSH_APP");

class PushNotification {
  constructor() {}

  notify = (templates = []) => {
    for (const template of templates) {
      log.debug("templates one signal app: ", template);
      this.sendPushNotification(template);
    }
  };

  /**
   * OneSignal push notifications
   * @param template
   */
  sendPushNotification = (template) => {
    try {
      const headers = {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Basic " + process.config.one_signal.key,
        // host: "onesignal.com"
      };

      if (template.android_channel_id) {
        delete template.android_channel_id;
      }

      if (
        template.data.params.event_type == AGORA_CALL_NOTIFICATION_TYPES.START_CALL
      ) {
        // template.android_channel_id = "sound_channel"
        template.android_sound = "tone_loop";
        template.existing_android_channel_id = "sound_channel";
      }

      log.info("sendPushNotification template: ", template);

      const options = {
        // host: '104.18.226.52',
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers,
      };

      const https = require("https");
      const req = https.request(options, function (res) {
        res.on("data", function (data) {
          log.info("sendPushNotification response template: ", template);
          log.info("Push Notification sendPushNotification Data: ", data);
        });

        res.on("error", function (err) {
          log.info("Error in listening in push notification: ", err);
        });
      });

      req.on("error", function (e) {
        log.info("Error in sending push notification: ", e);
        log.info(e);
      });
      log.info("sendPushNotification JSON -> template: ", JSON.stringify(template));
      req.write(JSON.stringify(template));
      req.end();
    } catch (err) {
      log.debug("OneSignal sendPushNotification 500 error: ", err);
    }
  };
}

export default new PushNotification();
