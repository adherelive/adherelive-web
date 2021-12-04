export const getTwilioVideoAccessToken = () => {
  return "/twilio/getTwilioVideoAccessToken";
};
export const getTwilioChatAccessToken = () => {
  return "/twilio/getTwilioChatAccessToken";
};
export const getConnectedParticipants = (roomId) => {
  return `/twilio/getConnectedParticipants/${roomId}`;
};
