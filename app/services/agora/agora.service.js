import Log from "../../../libs/log";

const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const appID = process.config.agora.app_id;
const appCertificate = process.config.agora.app_certificate;

const Logger = new Log("AGORA SERVICES");

class AgoraService {
  constructor() {}

  getRoomId = (doctor, patient) => {
    return `${doctor}-${process.config.twilio.CHANNEL_SERVER}-${patient}`;
  };

  async videoTokenGenerator(userId, channelName) {
    console.log("==================================================");
    console.log("user id is" + userId);
    console.log("channelName" + channelName);

    console.log("==================================================");
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 86400;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    console.log({
      appID,
      appCertificate,
      channelName,
      userId,
      role,
      privilegeExpiredTs,
    });
    const accessToken = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      userId,
      role,
      privilegeExpiredTs
    );
    console.log("Token With Integer Number Uid: " + accessToken);

    return "006e43158c06dc841ebb186afb1854a125cIAD8D+NTIxnA2KTz0aSNmrRlFgdfEu0wQQPHrvhvEwYNDXyLSGQAAAAAEADC8VeA/67jYQEAAQD/ruNh";
  }
}

export default new AgoraService();
