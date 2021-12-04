import {AGORA_CALL_NOTIFICATION_TYPES} from "../../../constant";

export const NOTIFICATION_URLS = {
  [AGORA_CALL_NOTIFICATION_TYPES.START_CALL]: "agora-video-call-start",
  [AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL]: "agora-video-call-missed",
};

export default class AgoraJob {
  constructor(data) {
    this._data = data;
  }
  
  getAgoraData = () => {
    return this._data;
  };
  
  getNotificationUrl = (type) => {
    const {[type]: url} = NOTIFICATION_URLS;
    return url;
  };
}
