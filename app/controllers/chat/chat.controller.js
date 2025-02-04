import Controller from "../index";

import { createLogger } from "../../../libs/log";
import ChatJob from "../../jobSdk/Chat/observer";

const logger = createLogger("WEB > CHAT > CONTROLLER");

class ChatController extends Controller {
  constructor() {
    super();
  }

  notify = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        body,
        userDetails: {
          userId,
          userData: { category } = {},
          userCategoryData: { basic_info: { full_name } = {} } = {},
        } = {},
      } = req;

      const { doctor_id, patient_id, message } = body || {};

      const actor = {
        id: userId,
        details: {
          category,
          name: full_name,
        },
      };

      const notificationData = {
        actor,
        participants: [doctor_id, patient_id],
        details: {
          message,
        },
      };

      const UserMessageJob = ChatJob.execute();
    } catch (error) {
      logger.debug("notify 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new ChatController();
