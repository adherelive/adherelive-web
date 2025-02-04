import MedicationJob from "../";
import moment from "moment";

import ProviderService from "../../../services/provider/provider.service";
import UserRoleService from "../../../services/userRoles/userRoles.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../apiWrapper/mobile/userDevice";
import { DEFAULT_PROVIDER, EVENT_TYPE } from "../../../../constant";

class CreateJob extends MedicationJob {
  constructor(data) {
    logger.debug("medication job called in create job");
    super(data);
  }

  getPushAppTemplate = async () => {
    const { getMedicationData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        user_role_id,
        details: { name, category: actorCategory } = {},
      } = {},
      event_id = null,
    } = getMedicationData() || {};

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
      app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
      headings: { en: `Medication Created (${providerName})` },
      contents: {
        en: `${name}(${actorCategory}) has created a medication reminder with you. Tap here to know more!`,
      },
      // buttons: [{ id: "yes", text: "Yes" }, { id: "no", text: "No" }],
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: { url: "/medications", params: getMedicationData() },
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getMedicationData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        user_role_id,
        details: { name, category: actorCategory } = {},
      } = {},
      event_id,
    } = getMedicationData() || {};

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
          verb: `medication_create:${currentTimeStamp}`,
          event: EVENT_TYPE.MEDICATION_REMINDER,
          // message: `${name}(${actorCategory}) has created a medication reminder`,
          time: currentTime,
          create_time: `${currentTime}`,
        });
      }
    }

    return templateData;
  };
}

export default CreateJob;
