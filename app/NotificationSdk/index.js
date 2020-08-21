// import UserPreferenceWrapper from "../ApiWrapper/web/userPreference";
// import Email from "./email";
// import PushApp from "./pushApp";
// import {EVENT_TYPE} from "../../constant";
import Log from "../../libs/log_new";
import InApp from "./inApp";

Log.fileName("NOTIFICATION_SDK > INDEX");

class NotificationSdk {
    constructor() {
    }

    execute = async (job) => {
        const users = job.getUsers();
        for (const id of users) {
            // const userPreference = await UserPreferenceWrapper(null, id);

            // todo actor don't send notification : manage in job
            // PushApp.notify(job.getPushAppTemplate());
            Log.debug("job ---> ", job.getInAppTemplate());
            InApp.notify(job.getInAppTemplate());

            // todo: when user preferences relevant
            // if (job.isCritical()) {
            //     Email.notify(job.getEmailTemplate());
            //     // Sms.notify(job.getSmsTemplate());
            // } else {
            //     if (userPreference.allowEmail()) {
            //         Email.notify(job.getEmailTemplate());
            //     }
            //
            //     if (userPreference.allowSms()) {
            //         // Sms.notify(job.getSmsTemplate());
            //     }
            // }

            // more to come todo
        }
    };
}

export default new NotificationSdk();