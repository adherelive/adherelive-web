import stream from "getstream";
import Logger from "../../../libs/log";
import EventExecutor from "../executor";

const Log = new Logger("NOTIFICATION_SDK > IN_APP > STREAM");

class AppNotification {
  constructor() {
    Log.info("Connecting to Get-Stream for notification information");

    // Log credentials for debugging
    // Log.info(`API Key: ${process.config.getstream.key}`);
    // Log.info(`Secret Key: ${process.config.getstream.secretKey}`);
    // Log.info(`App ID: ${process.config.getstream.appId}`);

    this.client = stream.connect(
        process.config.getstream.key,
        process.config.getstream.secretKey,
        process.config.getstream.appId,
        {
          location: 'us-east', // or 'eu-central', depending on your app's region
        }
    );
    Log.info("GetStream client initialized in constructor");
  }

  notify = (templates = []) => {
    for (const template of templates) {
      Log.debug("Template data: ", template);
      this.sendAppNotification(template).then((res) => {
        Log.debug("AppNotification notify response: ", res);
      });
    }
  };

  getUserToken = (id) => {
    const userToken = this.client.createUserToken(`${id}`);
    Log.debug("Generated get-stream userToken: ", userToken);
    return userToken;
  };

  sendAppNotification = async (template) => {
    try {
      // TODO: Add get-stream rest api call code here
      Log.debug("Template Actor: ", template.actor.toString());
      const client = stream.connect(
          process.config.getstream.key,
          process.config.getstream.secretKey,
          process.config.getstream.appId,
          {
            location: 'us-east', // or 'eu-central', depending on your app's region
          }
      );
      Log.info("GetStream client initialized in sendAppNotification");
      const userToken = client.createUserToken(template.actor.toString());
      Log.debug("Generated get-stream userToken in use: ", userToken);
      Log.debug("Get-Stream client --> ", client);

      const feed = client.feed("notification", template.object);
      Log.debug("Feed Initialized: ", feed);
      const response = await feed.addActivity(template).catch((err) => {
        Log.debug("Get-Stream response error: ", err);
      });
      Log.debug("Activity Added: ", response);

      return response;
    } catch (err) {
      Log.error("Error in sendAppNotification: ", err);
      throw err; // Re-throw the error for further handling
    }
  };
}

export default AppNotification;
