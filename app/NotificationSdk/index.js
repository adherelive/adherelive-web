import Log from "../../libs/log";
import inApp from "./inApp";
import PushApp from "./pushApp";

const Logger = new Log("NOTIFICATION_SDK > INDEX");

class NotificationSdk {
  constructor() {
  }
  
  execute = async (job) => {
    const InApp = new inApp();
    
    // todo actor don't send notification : manage in job
    PushApp.notify(await job.getPushAppTemplate());
    InApp.notify(job.getInAppTemplate());
  };
}

export default new NotificationSdk();
