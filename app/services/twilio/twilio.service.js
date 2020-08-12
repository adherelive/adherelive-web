const twilio = require("twilio");

import Log from "../../../libs/log";
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const IpMessagingGrant = AccessToken.ChatGrant;
const accountSid = process.config.twilio.TWILIO_ACCOUNT_SID;
const apiKey = process.config.twilio.TWILIO_API_KEY;
const apiSecret = process.config.twilio.TWILIO_API_SECRET;
const chatServiceId = process.config.twilio.TWILIO_CHAT_SERVICE_SID;
const authToken = process.config.twilio.TWILIO_AUTH_TOKEN;

const Logger = new Log("TWILIO SERVICES");

class TwilioService {
    constructor() { }

    async createRoom(name) {
        const client = require("twilio")(accountSid, authToken);
        let createdRoom;
        client.video.rooms
            .create({ uniqueName: name })
            .then(room => (createdRoom = room));
        return createdRoom;
    }

    async chatTokenGenerator(identity, deviceId) {

        // const client = twilio(accountSid, authToken);
        // client.chat.services(chatServiceId)
        //     .update({ reachabilityEnabled: true })
        //     .then(service => console.log(service));

        const token = new AccessToken(accountSid, apiKey, apiSecret);
        token.identity = identity;


        const appName = "TwilioChat";
        const endpointId = appName + ":" + identity + ":" + deviceId;
        Logger.debug("endpointId ---> ", endpointId);
        Logger.debug("accountSid ---> ", accountSid);
        Logger.debug("apiKey ---> ", apiKey);
        Logger.debug("apiSecret ---> ", apiSecret);
        Logger.debug("process.config.twilio.TWILIO_CHAT_SERVICE_SID ---> ", process.config.twilio.TWILIO_CHAT_SERVICE_SID);
        const ipmGrant = new IpMessagingGrant({
            serviceSid: process.config.twilio.TWILIO_CHAT_SERVICE_SID,
            endpointId: endpointId
        });
        Logger.debug("ipmGrant ---> ", ipmGrant);
        token.addGrant(ipmGrant);

        return token.toJwt();
    }

    async videoTokenGenerator(identity) {
        const token = new AccessToken(accountSid, apiKey, apiSecret);
        token.identity = identity;

        const grant = new VideoGrant();
        token.addGrant(grant);

        return token.toJwt();
    }

    async getRoomConnectedParticipants(roomId) {
        return new Promise(async (res, rej) => {
            try {
                const client = require("twilio")(accountSid, authToken);
                let connectedParticipants = [];
                await client.video
                    .rooms(roomId)
                    .participants.list(null, (err, items) => {
                        res(items);
                    });
                return connectedParticipants;
            } catch (error) {
                rej(error);
                console.log("error------------->", error);
            }
        });
    }
}

export default new TwilioService();