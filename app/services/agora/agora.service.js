import { createLogger } from "../../../libs/log";

const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const appID = process.config.agora.app_id;
const appCertificate = process.config.agora.app_certificate;
let channelNameAgora = process.config.agora.app_channel_name;

const log = createLogger("AGORA SERVICES");

class AgoraService {
  constructor() {}

  getRoomId = (doctor, patient) => {
    //process.config.twilio.TWILIO_CHAT_SERVICE_SID,app_channel_name
    if (!channelNameAgora) {
      channelNameAgora = "adherelive-demo";
    }
    return `${doctor}-${channelNameAgora}-${patient}`;
  };

  async videoTokenGenerator(userId, channelName) {
    let finalUserId = parseInt(userId);

    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 86400;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const accessToken = RtcTokenBuilder.buildTokenWithUid(
      "e43158c06dc841ebb186afb1854a125c",
      "7df432e4412e432bacf96881010a2f67",
      channelName,
      0,
      role,
      privilegeExpiredTs
    );

    // return "006e43158c06dc841ebb186afb1854a125cIAD8D+NTIxnA2KTz0aSNmrRlFgdfEu0wQQPHrvhvEwYNDXyLSGQAAAAAEADC8VeA/67jYQEAAQD/ruNh";
    return accessToken;
  }
}

export default new AgoraService();
