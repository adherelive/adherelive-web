import DietJob from "../";
import moment from "moment";

import UserRoleService from "../../../services/userRoles/userRoles.service";
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
        user_role_id,
        details: { name, category: actorCategory } = {}
      } = {}
    } = getDietData() || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];
    const userRoleIds = [];

    participants.forEach(participant => {
      if (participant !== user_role_id) {
        userRoleIds.push(participant);
      }
    });

    const {rows: userRoles = []} = await UserRoleService.findAndCountAll({
      where: {
        id: userRoleIds
      }
    }) || {};

    for(const userRole of userRoles) {
      const {user_identity} = userRole || {};
      userIds.push(user_identity);
    }

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
        id: actorId,
        user_role_id
      } = {},
      event_id
    } = getDietData() || {};

    const templateData = [];
    const currentTime = new moment().utc().toISOString();
    const now = moment();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      if (participant !== user_role_id) {
        templateData.push({
          actor: actorId,
          actorRoleId: user_role_id,
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
