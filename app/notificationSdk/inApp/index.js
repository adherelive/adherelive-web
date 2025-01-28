import EventExecutor from "../executor";
import Logger from "../../../libs/log";
import stream from "getstream";

const Log = new Logger("NOTIFICATION_SDK > IN_APP > STREAM");

class AppNotification {
  constructor() {
    Log.info(`AppNotification get-stream key : ${process.config.getstream.key}`);
    Log.info(`AppNotification get-stream secretKey : ${process.config.getstream.secretKey}`);
    Log.info(`AppNotification get-stream appId : ${process.config.getstream.appId}`);

    this.client = stream.connect(
      process.config.getstream.key,
      process.config.getstream.secretKey,
      process.config.getstream.appId
    );
  }

  notify = (templates = []) => {
    for (const template of templates) {
      Log.debug("template data -->", template);
      this.sendAppNotification(template).then((res) => {
        Log.debug("AppNotification notify response", res);
      });
    }
  };

  getUserToken = (id) => {
    const userToken = this.client.createUserToken(`${id}`);
    console.log("", userToken);
    return userToken;
  };

  sendAppNotification = async (template) => {
    try {
      // TODO: Add get-stream rest api call code here
      Log.debug("sendAppNotification inApp get-stream --> template.actor: ", template.actor.toString());
      const client = stream.connect(
        process.config.getstream.key,
        process.config.getstream.secretKey,
        process.config.getstream.appId
      );
      const userToken = client.createUserToken(template.actor.toString());

      Log.debug("sendAppNotification client --> ", client);

      let result = {};
      const feed = client.feed("notification", template.object);

      Log.debug("feed --> ", template);
      const response = await feed.addActivity(template).catch((err) => {
        Log.debug("inApp get-stream sendAppNotification response err ---> ", err);
      });

      Log.debug("sendAppNotification get-stream response: ", response);

      return result;
    } catch (err) {
      Log.debug("inApp get-stream sendAppNotification 500 error: ", err);
    }
  };
}

export default AppNotification;
