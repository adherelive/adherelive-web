import VitalJob from "../";
import moment from "moment";
import { getFullName } from "../../../helper/common";
import { EVENT_TYPE } from "../../../../constant";

import UserDeviceService from "../../../services/userDevices/userDevice.service";

import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

class CreateJob extends VitalJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { getData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        userCategoryData: {
          basic_info: { first_name, middle_name, last_name } = {}
        } = {},
        category
      } = {},
      vital_templates: { basic_info: { name: vitalName = "" } = {} } = {},
      eventId = null
    } = getData() || {};

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
      app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
      headings: { en: `Vital Added` },
      contents: {
        en: `${getFullName({
          first_name,
          middle_name,
          last_name
        })}(${category}) has added ${vitalName} vital for you`
      },
      // buttons: [{ id: "yes", text: "Yes" }, { id: "no", text: "No" }],
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: { url: "/vitals", params: getData() }
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getData } = this;
    const {
      participants = [],
      actor: { id: actorId } = {},
      event_id: eventId = null
    } = getData() || {};

    const templateData = [];
    const currentTime = new moment().utc().toISOString();

    const now = moment();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      if (participant !== actorId) {
        templateData.push({
          actor: actorId,
          object: `${participant}`,
          foreign_id: `${eventId}`,
          verb: `vital_create:${currentTimeStamp}`,
          event: EVENT_TYPE.VITALS,
          time: currentTime,
          create_time: `${currentTime}`
        });
      }
    }

    return templateData;
  };
}

export default CreateJob;
