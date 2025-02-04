const twilio = require("twilio");

import { createLogger } from "../../../libs/logger";

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const IpMessagingGrant = AccessToken.ChatGrant;
const accountSid = process.config.twilio.TWILIO_ACCOUNT_SID;
const apiKey = process.config.twilio.TWILIO_API_KEY;
const apiSecret = process.config.twilio.TWILIO_API_SECRET;
const chatServiceId = process.config.twilio.TWILIO_CHAT_SERVICE_SID;
const authToken = process.config.twilio.TWILIO_AUTH_TOKEN;

const logger = createLogger("TWILIO SERVICES");

class TwilioService {
  constructor() {}

  async createRoom(name) {
    const client = require("twilio")(accountSid, authToken);
    let createdRoom;
    client.video.rooms
      .create({ uniqueName: name })
      .then((room) => (createdRoom = room));
    return createdRoom;
  }

  getRoomId = (doctor, patient) => {
    return `${doctor}-${process.config.twilio.CHANNEL_SERVER}-${patient}`;
  };

  async chatTokenGenerator(identity, deviceId) {
    const token = new AccessToken(accountSid, apiKey, apiSecret);
    token.identity = identity;

    const appName = "TwilioChat";
    const endpointId = appName + ":" + identity + ":" + deviceId;
    const ipmGrant = new IpMessagingGrant({
      serviceSid: process.config.twilio.TWILIO_CHAT_SERVICE_SID,
      endpointId: endpointId,
    });
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
        logger.error("Twilio Service error ---> ", error);
      }
    });
  }

  addSymptomMessage = async (channel_id, message) => {
    try {
      const client = require("twilio")(accountSid, authToken);

      const channelExists = await client.chat
        .services(process.config.twilio.TWILIO_CHAT_SERVICE_SID)
        .channels(channel_id);

      if (!channelExists) {
        const newChannel = await client.chat
          .services(process.config.twilio.TWILIO_CHAT_SERVICE_SID)
          .channel.create(channel_id);
      }

      const channel = await client.chat
        .services(process.config.twilio.TWILIO_CHAT_SERVICE_SID)
        .channels(channel_id);

      // issue: http for development
      // link: https://support.twilio.com/hc/en-us/articles/360007130274-Requirements-for-Connecting-to-the-Twilio-REST-API-and-Troubleshooting-Common-Issues
      channel.messages
        .create({
          from: "adhere_bot",
          body: message,
        })
        .then((response) => {
          logger.debug("Bot message sent!", response);
        })
        .catch((err) => {
          logger.error("Failed to send message: ", err);
        });

      logger.debug("channel -> ", channel);
    } catch (error) {
      logger.error("Add Symptom Message has an error: ", error);
    }
  };

  addUserMessage = async (doctor, patient, message) => {
    try {
      const client = require("twilio")(accountSid, authToken);
      const channel = await client.chat
        .services(process.config.twilio.TWILIO_CHAT_SERVICE_SID)
        .channels(this.getRoomId(doctor, patient));

      // issue: http for development
      // link: https://support.twilio.com/hc/en-us/articles/360007130274-Requirements-for-Connecting-to-the-Twilio-REST-API-and-Troubleshooting-Common-Issues
      channel.messages
        .create({
          from: `${doctor}`,
          body: message,
        })
        .then((response) => {
          logger.debug("User message sent!", response);
        })
        .catch((err) => {
          logger.error("Failed to send a message: ", err);
        });

      logger.debug("channel -> ", channel);
    } catch (error) {
      logger.error("Add User Message has an error:", error);
      throw error;
    }
  };

  getAllMessages = async () => {
    try {
      const client = require("twilio")(accountSid, authToken);
      const channel = await client.chat
        .services(process.config.twilio.TWILIO_CHAT_SERVICE_SID)
        .channels.list()
        .then((channels) => {
          logger.debug(
            "Twilio Get All channels ---> ",
            channels,
            channels.length
          );
          return channels;
        })
        .then((channels) => {
          let channelsName = [];
          let friendlyNames = [];
          let channelData = {};
          for (let i = 0; i < channels.length; i++) {
            const { sid, uniqueName, friendlyName } = channels[i] || {};

            if (
              uniqueName &&
              uniqueName.includes(process.config.twilio.CHANNEL_SERVER)
            ) {
              channelsName.push(uniqueName);
              friendlyNames.push(friendlyName);
              channelData[uniqueName] = channels[i];
            }
            logger.debug("DELETED CHANNEL NAMES AND COUNT", {
              channelsName,
              count: channelsName.length,
              friendlyNames: friendlyNames,
              channelData,
            });
          }
        });
    } catch (error) {
      logger.debug("addSymptom message 500 error", error);
    }
  };

  deleteAllMessages = async () => {
    try {
      const client = require("twilio")(accountSid, authToken);
      const channel = await client.chat
        .services(process.config.twilio.TWILIO_CHAT_SERVICE_SID)
        .channels.list()
        .then((channels) => {
          logger.debug(
            "Twilio Delete All channels ---> ",
            channels,
            channels.length
          );
          return channels;
        })
        .then((channels) => {
          let channelsName = [];
          for (let i = 0; i < channels.length; i++) {
            const { sid, uniqueName } = channels[i] || {};

            if (
              uniqueName &&
              uniqueName.includes(process.config.twilio.CHANNEL_SERVER)
            ) {
              const deleteChannel = client.chat
                .services(process.config.twilio.TWILIO_CHAT_SERVICE_SID)
                .channels(sid)
                .remove()
                .then((response) => {
                  logger.debug("delete success response", response);
                  channelsName.push(uniqueName);
                })
                .catch((err) => {
                  logger.error("delete catch error", err);
                });
            }
            logger.debug("DELETED CHANNEL NAMES AND COUNT", {
              channelsName,
              count: channelsName.length,
            });
          }
        });

      // issue: http for development
      // link: https://support.twilio.com/hc/en-us/articles/360007130274-Requirements-for-Connecting-to-the-Twilio-REST-API-and-Troubleshooting-Common-Issues
      // channel.messages.create({
      //     from: "adhere_bot",
      //     body: message
      // }).then(response => {
      //     logger.debug('Bot message sent!', response);
      // }).catch(err => {
      //     logger.error('Failed to send message');
      //     logger.error(err);
      // });
      //
      // logger.debug("channel -> ", channel);
    } catch (error) {
      logger.debug("addSymptom message 500 error", error);
    }
  };

  addMember = async (channelName, identity) => {
    try {
      const client = require("twilio")(accountSid, authToken);
      const newMember = await client.chat
        .services(process.config.twilio.TWILIO_CHAT_SERVICE_SID)
        .channels(channelName)
        .members.create({ identity });

      return newMember ? true : false;
    } catch (error) {
      logger.debug("addMember 500 error", error);
    }
  };
}

export default new TwilioService();
