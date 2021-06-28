import DietJob from "../";
import moment from "moment";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";
import { EVENT_TYPE, NOTIFICATION_VERB } from "../../../../constant";

class CreateJob extends DietJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { getDietData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        details: { name, category: actorCategory } = {}
      } = {}
    } = getDietData() || {};

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
      headings: { en: `Diet Created` },
      contents: {
        en: `${name}(${actorCategory}) has created a diet with you. Tap here to know more!`
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: { url: `/${NOTIFICATION_VERB.DIET_CREATION}`, params: getDietData() }
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getDietData } = this;
    const {
      participants = [],
      actor: {
        id: actorId
      } = {},
      event_id
    } = getDietData() || {};

    const templateData = [];
    const currentTime = new moment().utc().toISOString();
    const now = moment();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      if (participant !== actorId) {
        templateData.push({
          actor: actorId,
          object: `${participant}`,
          foreign_id: `${event_id}`,
          verb: `${NOTIFICATION_VERB.DIET_CREATION}:${currentTimeStamp}`,
          event: EVENT_TYPE.DIET,
          time: currentTime,
          create_time: `${currentTime}`
        });
      }
    }

    return templateData;
  };
}

export default CreateJob;
