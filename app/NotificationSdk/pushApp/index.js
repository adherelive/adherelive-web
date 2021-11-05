import EventExecutor from "../executor";
import Logger from "../../../libs/log";
import fetch from "node-fetch";

const Log = new Logger("NOTIFICATION_SDK > PUSH_APP");

// Log.filename("NOTIFICATION_SDK > PUSH_APP");

class PushNotification {
  constructor() {}

  notify = (templates = []) => {
    for (const template of templates) {
      Log.debug("templates push app--> ", template);
      this.sendPushNotification(template);
    }
  };

  sendPushNotification = (template) => {
    try {
      const headers = {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: "Basic " + process.config.one_signal.key,
        // host: "onesignal.com"
      };

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
          console.log("Response:", template);
          console.log("Data:", data);
        });

        res.on("error", function (err) {
          console.log("ERROR: in listening in push notification");
          console.log("err:", err);
        });
      });

      req.on("error", function (e) {
        console.log("ERROR in sending push notification:");
        console.log(e);
      });

      req.write(JSON.stringify(template));
      req.end();
    } catch (err) {
      Log.debug("sendPushNotification 500 error", err);
    }
  };
}

export default new PushNotification();
