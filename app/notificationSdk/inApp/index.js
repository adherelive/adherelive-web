import stream from "getstream";
import { createLogger } from "../../../libs/log";
import EventExecutor from "../executor";

const log = createLogger("NOTIFICATION_SDK > IN_APP > STREAM");

class AppNotification {
  constructor() {
    log.debug("Connecting to Get-Stream for notification information");

    // Log credentials for debugging
    // log.debug(`API Key: ${process.config.getstream.key}`);
    // log.debug(`Secret Key: ${process.config.getstream.secretKey}`);
    // log.debug(`App ID: ${process.config.getstream.appId}`);

    this.client = stream.connect(
        process.config.getstream.key,
        process.config.getstream.secretKey,
        process.config.getstream.appId,
        {
          location: 'us-east', // or 'eu-central', depending on your app's region
        }
    );
    log.debug("GetStream client initialized in constructor");
  }

  notify = (templates = []) => {
    for (const template of templates) {
      log.debug("Template data: ", template);
      this.sendAppNotification(template).then((res) => {
        log.debug("AppNotification notify response: ", res);
      });
    }
  };

  getUserToken = (id) => {
    const userToken = this.client.createUserToken(`${id}`);
    log.debug("Generated get-stream userToken: ", userToken);
    return userToken;
  };

  sendAppNotification = async (template) => {
    try {
      // TODO: Add get-stream rest api call code here
      log.debug("Template Actor: ", template.actor.toString());
      const client = stream.connect(
          process.config.getstream.key,
          process.config.getstream.secretKey,
          process.config.getstream.appId,
          {
            location: 'us-east', // or 'eu-central', depending on your app's region
          }
      );
      log.debug("GetStream client initialized in sendAppNotification");
      const userToken = client.createUserToken(template.actor.toString());
      log.debug("Generated get-stream userToken in use: ", userToken);
      log.debug("Get-Stream client --> ", client);

      const feed = client.feed("notification", template.object);
      log.debug("Feed Initialized: ", feed);
      const response = await feed.addActivity(template).catch((err) => {
        log.debug("Get-Stream response error: ", err);
      });
      log.debug("Activity Added: ", response);

      return response;
    } catch (err) {
      log.debug("Error in sendAppNotification: ", err);
      throw err; // Re-throw the error for further handling
    }
  };
}

export default AppNotification;
