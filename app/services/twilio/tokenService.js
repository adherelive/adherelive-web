const twilio = require("twilio");
const faker = require("faker");
//const chatAccessToken = client.jwt.AccessToken;
const AccessToken = twilio.jwt.AccessToken;
const IpMessagingGrant = AccessToken.ChatGrant;
let VideoGrant = AccessToken.VideoGrant;

function TokenGenerator(identity, deviceId) {
  const appName = "TwilioChat";

  // Create a unique ID for the client on their current device
  const endpointId = appName + ":" + identity + ":" + deviceId;

  // Create a "grant" which enables a client to use IPM as a given user,
  // on a given device
  const ipmGrant = new IpMessagingGrant({
    serviceSid: process.config.twilio.TWILIO_CHAT_SERVICE_SID,
    endpointId: endpointId
  });

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    process.config.twilio.TWILIO_ACCOUNT_SID,
    process.config.twilio.TWILIO_API_KEY,
    process.config.twilio.TWILIO_API_SECRET
  );

  token.addGrant(ipmGrant);
  token.identity = identity;
  return token;
}

function VideoTokenGenerator(identity) {
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created

  var token = new AccessToken(
    process.config.twilio.TWILIO_ACCOUNT_SID,
    process.config.twilio.TWILIO_API_KEY,
    process.config.twilio.TWILIO_API_SECRET
  );

  // Assign the generated identity to the token
  token.identity = identity;

  const grant = new VideoGrant();
  // Grant token access to the Video API features
  token.addGrant(grant);
  return token;
}

module.exports = {
  generate: TokenGenerator,
  VideoTokenGenerator: VideoTokenGenerator
};
