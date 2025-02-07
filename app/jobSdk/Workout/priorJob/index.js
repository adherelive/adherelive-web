import WorkoutJob from "../";
import moment from "moment";
import { DEFAULT_PROVIDER, EVENT_TYPE, NOTIFICATION_VERB, } from "../../../../constant";

import UserRoleService from "../../../services/userRoles/userRoles.service";
import ProviderService from "../../../services/provider/provider.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../apiWrapper/mobile/userDevice";

class PriorJob extends WorkoutJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { getWorkoutData } = this;
    const {
      details: {
        workouts = {},
        workout_id = null,
        participants = [],
        actor: { id: actorId, user_role_id } = {},
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

    let workoutName = "";
    if (workout_id) {
      const { basic_info: { name } = {} } = workouts[workout_id] || {};
      workoutName = name;
    }

    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id,
      headings: { en: `Upcoming Workout Reminder (${providerName})` },
      contents: {
        en: `${workoutName} is starting in ${process.config.app.workout_prior_time}. Tap here to know more!`,
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: {
        url: `/${NOTIFICATION_VERB.WORKOUT_PRIOR}`,
        params: getWorkoutData(),
      },
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getWorkoutData } = this;
    const {
      details: {
        participants = [],
        actor: { id: actorId, user_role_id } = {},
      } = {},
      id,
    } = getWorkoutData() || {};

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
          verb: `${NOTIFICATION_VERB.WORKOUT_PRIOR}:${currentTimeStamp}`,
          event: EVENT_TYPE.WORKOUT,
          time: currentTime,
          create_time: `${currentTime}`,
        });
      }
    }

    return templateData;
  };
}

export default PriorJob;
