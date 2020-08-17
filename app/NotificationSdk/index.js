import UserPreferenceWrapper from "../ApiWrapper/web/userPreference";
import Email from "./email";
// import {EVENT_TYPE} from "../../constant";

class NotificationSdk {
    constructor() {
    }

    execute = async (job) => {
        const users = job.getUsers();
        for (const id of users) {
            const userPreference = await UserPreferenceWrapper(null, id);

            // todo actor don't send notification

            if (job.isCritical()) {
                Email.notify(job.getEmailTemplate());
                // Sms.notify(job.getSmsTemplate());
            } else {
                if (userPreference.allowEmail()) {
                    Email.notify(job.getEmailTemplate());
                }

                if (userPreference.allowSms()) {
                    // Sms.notify(job.getSmsTemplate());
                }
            }

            // more to come todo
        }
    }
}

export default new NotificationSdk();