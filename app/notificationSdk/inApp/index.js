import stream from "getstream";
import { createLogger } from "../../../libs/logger";
import EventExecutor from "../executor";

const logger = createLogger("NOTIFICATION_SDK > IN_APP > STREAM");

class AppNotification {
  constructor() {
    logger.debug("Connecting to Get-Stream for notification information");

    // Log credentials for debugging
    // logger.debug(`API Key: ${process.config.getstream.key}`);
    // logger.debug(`Secret Key: ${process.config.getstream.secretKey}`);
    // logger.debug(`App ID: ${process.config.getstream.appId}`);

    this.client = stream.connect(
        process.config.getstream.key,
        process.config.getstream.secretKey,
        process.config.getstream.appId,
        {
          location: 'us-east', // or 'eu-central', depending on your app's region
        }
    );
    logger.debug("GetStream client initialized in constructor");
  }

  notify = (templates = []) => {
    for (const template of templates) {
      logger.debug("Template data: ", template);
      this.sendAppNotification(template).then((res) => {
        logger.debug("AppNotification notify response: ", res);
      });
    }
  };

  getUserToken = (id) => {
    const userToken = this.client.createUserToken(`${id}`);
    logger.debug("Generated get-stream userToken: ", userToken);
    return userToken;
  };

  sendAppNotification = async (template) => {
    try {
      // TODO: Add get-stream rest api call code here
      logger.debug("Template Actor: ", template.actor.toString());
      const client = stream.connect(
          process.config.getstream.key,
          process.config.getstream.secretKey,
          process.config.getstream.appId,
          {
            location: 'us-east', // or 'eu-central', depending on your app's region
          }
      );
      logger.debug("GetStream client initialized in sendAppNotification");
      const userToken = client.createUserToken(template.actor.toString());
      logger.debug("Generated get-stream userToken in use: ", userToken);
      logger.debug("Get-Stream client: ", client);

      const feed = client.feed("notification", template.object);
      logger.debug("Feed Initialized: ", feed);
      const response = await feed.addActivity(template).catch((err) => {
        logger.error("Get-Stream response error: ", err);
      });
      logger.debug("Activity Added: ", response);

      return response;
    } catch (err) {
      logger.error("Error in sendAppNotification: ", err);
      throw err; // Re-throw the error for further handling
    }
  };
}

export default AppNotification;
