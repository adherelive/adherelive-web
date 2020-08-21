import EventExecutor from "../executor";
import Log from "../../../libs/log_new";

Log.fileName("NOTIFICATION_SDK > IN_APP");

class AppNotification {
    constructor() {
    }

    notify = (templates = []) => {
        for(const template of templates) {
            Log.debug("template data -->", template);
            EventExecutor.sendAppNotification(template).then(res => {
                Log.debug("AppNotification notify response", res);
            });
        }
    }
}

export default new AppNotification();