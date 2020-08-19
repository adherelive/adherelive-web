import EventExecutor from "../executor";
import Log from "../../../libs/log_new";

Log.filename("NOTIFICATION_SDK > PUSH_APP");

class PushNotification {
    constructor() {
    }

    notify = (templates = []) => {
        for(const template of templates) {
            EventExecutor.sendPushNotification(template).then(res => {
                Log.debug("PushNotification notify response", res);
            });
        }
    }
}

export default new PushNotification();