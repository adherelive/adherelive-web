import DietJob from "../";
import moment from "moment";
import { EVENT_TYPE, NOTIFICATION_VERB } from "../../../../constant";

import UserRoleService from "../../../services/userRoles/userRoles.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

class ResponseJob extends DietJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { _data } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        user_role_id,
        details: { name, category: actorCategory } = {}
      } = {}
    } = _data || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];
    const userRoleIds = [];
    let doctorRoleId = null;

    participants.forEach(participant => {
      if (participant !== user_role_id) {
        doctorRoleId = participant;
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
      headings: { en: `Diet Response from ${name}` },
      contents: {
        en: `Diet Response has been added by ${name}. Tap here to know more!`
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: {
        url: `/${NOTIFICATION_VERB.DIET_RESPONSE}`,
        params: {...this.getDietData(), doctorRoleId}
      }
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getDietData } = this;
    const data = getDietData();
    const {
      participants = [], actor: { id: actorId, user_role_id } = {},
      id = null
    } = data || {};

    const templateData = [];
    const now = moment();

    const currentTime = new moment().utc().toISOString();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      if (participant !== user_role_id) {
        templateData.push({
          actor: actorId,
          actorRoleId: user_role_id,
          object: `${participant}`,
          foreign_id: `${id}`,
          verb: `${NOTIFICATION_VERB.DIET_RESPONSE}:${currentTimeStamp}`,
          event: EVENT_TYPE.DIET,
          time: currentTime,
          create_time: currentTime
        });
      }
    }

    return templateData;
  };
}

export default ResponseJob;
