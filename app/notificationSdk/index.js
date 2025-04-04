import { createLogger } from "../../libs/logger";
import inApp from "./inApp";
import PushApp from "./pushApp";

const logger = createLogger("NOTIFICATION_SDK > INDEX");

class NotificationSdk {
  constructor() {}

  execute = async (job) => {
    const InApp = new inApp();

    // todo actor don't send notification : manage in job
    PushApp.notify(await job.getPushAppTemplate());
    InApp.notify(job.getInAppTemplate());
  };
}

export default new NotificationSdk();
