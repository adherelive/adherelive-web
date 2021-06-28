import VitalJob from "../";
import moment from "moment";
import { EVENT_TYPE, NOTIFICATION_VERB } from "../../../../constant";

import UserDeviceService from "../../../services/userDevices/userDevice.service";

import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";
import VitalWrapper from "../../../ApiWrapper/mobile/vitals";

class ResponseJob extends VitalJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { _data } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        details: { name, category: actorCategory } = {}
      } = {},
      vital_templates,
      vital_templates: { basic_info: { name: vitalName = "" } = {} } = {},
      vital = {},
      event_id = null,
      patient_id = null
    } = _data || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    participants.forEach(participant => {
      if (participant !== actorId) {
        userIds.push(participant);
      }
    });

    const userDevices = await UserDeviceService.getAllDeviceByData({
      user_id: userIds
    });

    if (userDevices.length > 0) {
      for (const device of userDevices) {
        const userDevice = await UserDeviceWrapper({ data: device });
        playerIds.push(userDevice.getOneSignalDeviceId());
      }
    }

    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id,
      headings: { en: `${name} added reading for ${vitalName} vital.` },
      contents: {
        en: `Tap here to see ${vitalName} details.`
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: {
        url: "/vital_response",
        params: {vital, vital_id: event_id, vital_templates, patient_id}
      }
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getData } = this;
    const data = getData();
    const {
      participants = [], actor: { id: actorId } = {},
      event_id = null,
      id = null
    } = data || {};

    const templateData = [];
    const now = moment();

    const currentTime = new moment().utc().toISOString();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      if (participant !== actorId) {
        templateData.push({
          actor: actorId,
          object: `${participant}`,
          foreign_id: `${id}`,
          verb: `${NOTIFICATION_VERB.VITAL_RESPONSE}:${currentTimeStamp}`,
          event: EVENT_TYPE.VITALS,
          time: currentTime,
          create_time: currentTime
        });
      }
    }

    return templateData;
  };
}

export default ResponseJob;
