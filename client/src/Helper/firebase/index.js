import moment from "moment";
import config from "../../config";

export const logEvent = ({ client, ...data }) => {
  client.logEvent(config.FIREBASE_CHANNEL, {
    ...data,
    device: "web",
    timestamp: moment().format("dd/mm/yyyy hh:mm A"),
  });
};
