import DietJob from "../";
import moment from "moment";
import { EVENT_TYPE, NOTIFICATION_VERB, DEFAULT_PROVIDER } from "../../../../constant";

import UserRoleService from "../../../services/userRoles/userRoles.service";
import ProviderService from "../../../services/provider/provider.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

class PriorJob extends DietJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { getDietData } = this;
    const {
      details: {
        diet_id = null,
        diets = {},
        participants = [],
        actor: {
          id: actorId,
          user_role_id,
        } = {}
      } = {},
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

    let providerId = null;
    for(const userRole of userRoles) {
      const {id, user_identity, linked_id} = userRole || {};
      userIds.push(user_identity);

      if(id === user_role_id) {
        if(linked_id) {
          providerId = linked_id;
        }
      }
    }

    let providerName = DEFAULT_PROVIDER;
    if(providerId) {
      const provider = await ProviderService.getProviderByData({id: providerId});
      const {name} = provider || {};
      providerName = name;
    }

    const userDevices = await UserDeviceService.getAllDeviceByData({
      user_id: userIds,
    });

    if (userDevices.length > 0) {
      for (const device of userDevices) {
        const userDevice = await UserDeviceWrapper({ data: device });
        playerIds.push(userDevice.getOneSignalDeviceId());
      }
    }

    // diet name
    let dietName = "Diet";
    if(diet_id) {
      const {basic_info: {name} = {}} = diets[diet_id] || {};
      dietName = name;
    }

    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id,
      headings: { en: `Upcoming Diet Reminder (${providerName})` },
      contents: {
        en: `Your ${dietName} related meal should be taken soon. Tap here to know more!`,
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: { url: `/${NOTIFICATION_VERB.DIET_PRIOR}`, params: getDietData() },
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getDietData } = this;
    const {
      details: {
        participants = [],
        actor: {
          id: actorId,
          user_role_id
        } = {},
      } = {},
      id,
    } = getDietData() || {};

    const templateData = [];
    const currentTime = new moment().utc();
    const currentTimeStamp = currentTime.unix();
    for (const participant of participants) {
      if (participant !== user_role_id) {
        templateData.push({
            actor: actorId,
            actorRoleId: user_role_id,
            object: `${participant}`,
            foreign_id: `${id}`,
            verb: `${NOTIFICATION_VERB.DIET_PRIOR}:${currentTimeStamp}`,
            event: EVENT_TYPE.DIET,
            time: currentTime,
            create_time: `${currentTime}`
        });
      }
    }

    return templateData;
  };
}

export default PriorJob;
