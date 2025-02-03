import { faker } from '@faker-js/faker';
import twilioService from "../../../services/twilio/twilio.service";
import Controller from "../../index";

import { createLogger } from "../../../../libs/log";

// Log.setFileName("MOBILE > TWILIO > CONTROLLER");
const log = createLogger("MOBILE > TWILIO > CONTROLLER");

class TwilioController extends Controller {
  constructor() {
    super();
  }

  generateTwilioChatAccessToken = async (req, res) => {
    try {
      const deviceId = req.query.device ? req.query.device : "application";
      const {
        userDetails: { userId, userRoleId },
      } = req;
      const identity = req.query.identity
        ? req.query.identity
        : `${userRoleId}`;

      const token = await twilioService.chatTokenGenerator(identity, deviceId);

      return this.raiseSuccess(
        res,
        200,
        { identity: identity, token: token },
        "Created new chat token."
      );

      // const response = new Response(true, 200);
      // response.setData({ identity: identity, token: token });
      // response.setMessage("Created new chat token with userId");
      // return res.send(response.getResponse());
    } catch (error) {
      log.debug("generateTwilioChatAccessToken 50 error", error);
      return this.raiseServerError(res);
      // let response = new Response(false, 500);
      // response.setError({ error: err });
      // res.status(500).json(response.getResponse());
    }
  };

  generateTwilioVideoAccessToken = async (req, res) => {
    try {
      // const userId = req.query.userId ? req.query.userId : null;
      const {
        userDetails: { userId, userRoleId },
      } = req;
      const identity = userRoleId ? `${userRoleId}` : faker.name.findName();

      const token = await twilioService.videoTokenGenerator(identity);

      return this.raiseSuccess(
        res,
        200,
        { identity: identity, token: token },
        "Created new video token."
      );

      // const response = new Response(true, 200);
      // response.setData({ identity: identity, token: token });
      // response.setMessage("Created new video token with userId");
      //
      // return res.send(response.getResponse());
    } catch (error) {
      log.debug("generateTwilioVideoAccessToken 50 error", error);
      return this.raiseServerError(res, 500, error, error.message());
      // let response = new Response(false, 500);
      // response.setError({ error: err });
      // res.status(500).json(response.getResponse());
    }
  };

  getConnectedParticipants = async (req, res) => {
    try {
      const { roomId } = req.params;

      const connectedParticipantsList =
        await twilioService.getRoomConnectedParticipants(roomId);
      let connectedParticipants = {};
      connectedParticipantsList.forEach((participant) => {
        const { status, identity } = participant;
        connectedParticipants[identity] = status;
      });

      return this.raiseSuccess(
        res,
        200,
        {
          connectedParticipants,
        },
        "Fetched Connected Participants"
      );
    } catch (err) {
      log.debug("getConnectedParticipants 50 error", error);
      return this.raiseServerError(res);
    }
  };
}

export default new TwilioController();
