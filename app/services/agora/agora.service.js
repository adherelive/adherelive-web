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
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 86400;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const accessToken = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      userId,
      role,
      privilegeExpiredTs
    );
    // console.log("Token With Integer Number Uid: " + accessToken);

    return accessToken;
  }
}

export default new AgoraService();
