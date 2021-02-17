import faker from "faker";
import twilioService from "../../services/twilio/twilio.service";
import Controller from "../";

import Log from "../../../libs/log_new";
Log.fileName("WEB > TWILIO > CONTROLLER");

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
      Log.debug("generateTwilioChatAccessToken 500 error", error);
      return raiseServerError(res);
    }
  };

  generateTwilioVideoAccessToken = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const userId = req.query.userId ? req.query.userId : null;
      const identity = userId ? userId : faker.name.findName();

      const token = await twilioService.videoTokenGenerator(identity);

      return raiseSuccess(
        res,
        200,
        { identity: identity, token: token },
        "Created new video token with userId"
      );
    } catch (error) {
      Log.debug("generateTwilioVideoAccessToken 500 error", error);
      return raiseServerError(res);
    }
  };

  getConnectedParticipants = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { roomId } = req.params;

      const connectedParticipantsList = await twilioService.getRoomConnectedParticipants(
        roomId
      );
      let connectedParticipants = {};
      connectedParticipantsList.forEach(participant => {
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
      Log.debug("getConnectedParticipants 500 error", error);
      return raiseServerError(res);
    }
  };

  deleteChat = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const allChannels = await twilioService.deleteAllMessages();

      return raiseSuccess(
          res,
          200,
          { },
          "DELETED ALL CHAT MESSAGES"
      );
    } catch (error) {
      Log.debug("deleteChat 500 error", error);
      return raiseServerError(res);
    }
  };

  getAllChats = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const allChannels = await twilioService.getAllMessages();

      Log.debug("all Channels", allChannels);

      return raiseSuccess(
          res,
          200,
          { },
          "GET ALL CHAT MESSAGES"
      );
    } catch (error) {
      Log.debug("deleteChat 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new TwilioController();
