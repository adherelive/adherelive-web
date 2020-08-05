// const Log = require("../../../libs/log")("twilio.controller");
import twilioTokenService from "../../services/twilio/tokenService";
import faker from "faker";
import twilioService from "../../../services/twilio/twilio.service";
import Controller from "../../";

class TwilioController extends Controller {
    async generateTwilioChatAccessToken(req, res) {
        try {
            const deviceId = req.query.device;
            const identity = req.query.identity;

            const token = await twilioService.chatTokenGenerator(identity, deviceId);

            return this.raiseSuccess(res, 200, {identity: identity, token: token}, "Created new chat token with userId");

            // const response = new Response(true, 200);
            // response.setData({ identity: identity, token: token });
            // response.setMessage("Created new chat token with userId");
            // return res.send(response.getResponse());
        } catch (error) {
            return this.raiseServerError(res, 500, error, error.message());
            // let response = new Response(false, 500);
            // response.setError({ error: err });
            // res.status(500).json(response.getResponse());
        }
    }

    async generateTwilioVideoAccessToken(req, res) {
        try {
            const userId = req.query.userId ? req.query.userId : null;
            const identity = userId ? userId : faker.name.findName();

            const token = await twilioService.videoTokenGenerator(identity);

            return this.raiseSuccess(res, 200, {identity: identity, token: token}, "Created new video token with userId");

            // const response = new Response(true, 200);
            // response.setData({ identity: identity, token: token });
            // response.setMessage("Created new video token with userId");
            //
            // return res.send(response.getResponse());
        } catch (error) {
            return this.raiseServerError(res, 500, error, error.message());
            // let response = new Response(false, 500);
            // response.setError({ error: err });
            // res.status(500).json(response.getResponse());
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

            return this.raiseSuccess(res, 200, {
                connectedParticipants
            }, "Fetched Connected Participants");
        } catch (err) {
            console.log("err", err);
            return this.raiseServerError(res);
        }
    }
}

export default new TwilioController();
