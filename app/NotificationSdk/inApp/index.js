import EventExecutor from "../executor";
import Logger from "../../../libs/log";
import stream from "getstream";

const Log = new Logger("NOTIFICATION_SDK > IN_APP");

class AppNotification {
    constructor() {
        this.client = stream.connect(process.config.getstream.key, process.config.getstream.secretKey);
    }

    notify = (templates = []) => {
        for(const template of templates) {
            Log.debug("template data -->", template);
            this.sendAppNotification(template).then(res => {
                Log.debug("AppNotification notify response", res);
            });
        }
    }

    getUserToken = (id) => {
        const userToken = this.client.createUserToken(
            `${id}`
        );
        return userToken;
    };

    sendAppNotification = async (template) => {
        try {
            // TODO: add get stream rest api call code here
            Log.debug("sendAppNotification --> ", template.actor.toString());
            const client = stream.connect(process.config.getstream.key, process.config.getstream.secretKey);
            const userToken = client.createUserToken(
                template.actor.toString()
            );

            // Log.debug("client --> ", client);

            let result = {};
            const feed = client.feed("notification", template.object);

            Log.debug("feed --> ", template);
            const response = await feed.addActivity(template).catch(err => {
                Log.debug("response err ------>", err);
            });

            Log.debug("sendAppNotification Response", response);

            return result;
        } catch (err) {
            Log.debug("sendAppNotification 500 error", err);
        }
    };
}

export default AppNotification;