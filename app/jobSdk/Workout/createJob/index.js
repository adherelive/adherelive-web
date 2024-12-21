import WorkoutJob from "../";
import moment from "moment";

import UserRoleService from "../../../services/userRoles/userRoles.service";
import ProviderService from "../../../services/provider/provider.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";
import {
  EVENT_TYPE,
  NOTIFICATION_VERB,
  DEFAULT_PROVIDER,
} from "../../../../constant";

class CreateJob extends WorkoutJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { getWorkoutData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        user_role_id,
        details: { name, category: actorCategory } = {},
      } = {},
    } = getWorkoutData() || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    const { rows: userRoles = [] } =
      (await UserRoleService.findAndCountAll({
        where: {
          id: participants,
        },
      })) || {};

    let providerId = null;
    for (const userRole of userRoles) {
      const { id, user_identity, linked_id } = userRole || {};

      if (id === user_role_id) {
        if (linked_id) {
          providerId = linked_id;
        }
      } else {
        userIds.push(user_identity);
      }
    }

    let providerName = DEFAULT_PROVIDER;
    if (providerId) {
      const provider = await ProviderService.getProviderByData({
        id: providerId,
      });
      const { name } = provider || {};
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

    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id,
      headings: { en: `Workout Created (${providerName})` },
      contents: {
        en: `${name}(${actorCategory}) has created a workout with you. Tap here to know more!`,
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: {
        url: `/${NOTIFICATION_VERB.WORKOUT_CREATION}`,
        params: getWorkoutData(),
      },
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getWorkoutData } = this;
    const {
      participants = [],
      actor: { id: actorId, user_role_id } = {},
      event_id,
    } = getWorkoutData() || {};

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
          verb: `${NOTIFICATION_VERB.WORKOUT_CREATION}:${currentTimeStamp}`,
          event: EVENT_TYPE.WORKOUT,
          time: currentTime,
          create_time: `${currentTime}`,
        });
      }
    }

    return templateData;
  };
}

export default CreateJob;
