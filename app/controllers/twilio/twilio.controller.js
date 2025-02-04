import Controller from "../index";

import { faker } from '@faker-js/faker';
import twilioService from "../../services/twilio/twilio.service";
import { createLogger } from "../../../libs/logger";

const logger = createLogger("WEB > TWILIO > CONTROLLER");

// logger.fileName("WEB > TWILIO > CONTROLLER");

class TwilioController extends Controller {
  constructor() {
    super();
  }

  generateTwilioChatAccessToken = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const deviceId = req.query.device;
      const identity = req.query.identity;

      const token = await twilioService.chatTokenGenerator(identity, deviceId);

      return raiseSuccess(
        res,
        200,
        { identity: identity, token: token },
        "Created new chat token with userId"
      );
    } catch (error) {
      logger.error("generateTwilioChatAccessToken 500 error", error);
      return raiseServerError(res);
    }
  };

  generateTwilioVideoAccessToken = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        userDetails: { userRoleId },
      } = req;
      const userId = userRoleId ? userRoleId : null;
      const identity = userId ? userId : faker.name.findName();

      const token = await twilioService.videoTokenGenerator(identity);

      return raiseSuccess(
        res,
        200,
        { identity: identity, token: token },
        "Created new video token"
      );
    } catch (error) {
      logger.error("generateTwilioVideoAccessToken 500 error", error);
      return raiseServerError(res);
    }
  };

  getConnectedParticipants = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { roomId } = req.params;

      const connectedParticipantsList =
        await twilioService.getRoomConnectedParticipants(roomId);
      let connectedParticipants = {};
      connectedParticipantsList.forEach((participant) => {
        const { status, identity } = participant;
        connectedParticipants[identity] = status;
      });

      return raiseSuccess(
        res,
        200,
        { connectedParticipants },
        "Fetched Connected Participants"
      );
    } catch (error) {
      logger.error("getConnectedParticipants 500 error", error);
      return raiseServerError(res);
    }
  };

  deleteChat = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const allChannels = await twilioService.deleteAllMessages();

      return raiseSuccess(res, 200, {}, "DELETED ALL CHAT MESSAGES");
    } catch (error) {
      logger.error("deleteChat 500 error", error);
      return raiseServerError(res);
    }
  };

  getAllChats = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const allChannels = await twilioService.getAllMessages();

      logger.debug("all Channels", allChannels);

      return raiseSuccess(res, 200, {}, "GET ALL CHAT MESSAGES");
    } catch (error) {
      logger.error("deleteChat 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new TwilioController();
