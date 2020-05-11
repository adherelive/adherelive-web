const Log = require("../../../libs/log")("twilio.controller");
const twilioTokenService = require("../../services/twilio/tokenService");
const twilioService = require("../../services/twilio/twilio.service");
const Response = require("../../helper/responseFormat");
const faker = require("faker");

class TwilioController {
  async generateTwilioChatAccessToken(req, res) {
    try {
      const deviceId = req.query.device;
      const identity = req.query.identity;

      const token = await twilioService.chatTokenGenerator(identity, deviceId);

      const response = new Response(true, 200);
      response.setData({ identity: identity, token: token });
      response.setMessage("Created new chat token with userId");

      return res.send(response.getResponse());
    } catch (err) {
      let response = new Response(false, 500);
      response.setError({ error: err });
      res.status(500).json(response.getResponse());
    }
  }

  async generateTwilioVideoAccessToken(req, res) {
    try {
      const userId = req.query.userId ? req.query.userId : null;
      const identity = userId ? userId : faker.name.findName();

      const token = await twilioService.videoTokenGenerator(identity);

      const response = new Response(true, 200);
      response.setData({ identity: identity, token: token });
      response.setMessage("Created new video token with userId");

      return res.send(response.getResponse());
    } catch (err) {
      let response = new Response(false, 500);
      response.setError({ error: err });
      res.status(500).json(response.getResponse());
    }
  }

  async getConnectedParticipants(req, res) {
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

      const response = new Response(true, 200);
      response.setData({ connectedParticipants });
      response.setMessage("Fetched Connected Participants");

      return res.send(response.getResponse());
    } catch (err) {
      console.log("err", err);
      let response = new Response(false, 500);
      response.setError({ error: err });
      res.status(500).json(response.getResponse());
    }
  }
}

module.exports = new TwilioController();
