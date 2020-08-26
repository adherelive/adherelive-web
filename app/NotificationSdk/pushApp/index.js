import EventExecutor from "../executor";
import Logger from "../../../libs/log";
import fetch from "node-fetch";

const Log = new Logger("NOTIFICATION_SDK > PUSH_APP");
// Log.filename("NOTIFICATION_SDK > PUSH_APP");

class PushNotification {
    constructor() {
    }

    notify = (templates = []) => {
        for(const template of templates) {
            this.sendPushNotification(template).then(res => {
                Log.debug("PushNotification notify response", res);
            });
        }
    }

    sendPushNotification = async (template) => {
        try {
            // TODO: add one-signal rest api call code here
            Log.debug("sendPushNotification template", template);
            await fetch(
                "https://onesignal.com/api/v1/notifications",
                {
                    method:"POST",
                    port: 443,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        Authorization: "Basic " + process.config.one_signal.key
                    },
                    body: template
                }
            ).then(res => {
                Log.debug("sendPushNotification res", res.json());
            }).catch(err => {
                Log.debug("sendPushNotification err fetch", err);
            });
            // Log.debug("sendPushNotification Response", response);
        } catch (err) {
            Log.debug("sendPushNotification 500 error", err);
        }
    };
}

export default new PushNotification();