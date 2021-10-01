import CarePlanJob from "../";
import moment from "moment";
import { EVENT_TYPE, DEFAULT_PROVIDER } from "../../../../constant";

import UserRoleService from "../../../services/userRoles/userRoles.service";
import ProviderService from "../../../services/provider/provider.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";

import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

class CreateJob extends CarePlanJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { _data } = this;
    const {
      details: {
        participants = [],
        actor: {
          id: actorId,
          user_role_id,
          details: { name, category: actorCategory } = {}
        } = {}
      },
      event_id = null,
      id = null
    } = _data || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    const {rows: userRoles = []} = await UserRoleService.findAndCountAll({
      where: {
        id: participants
      }
    }) || {};

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
      const provider = await ProviderService.getProviderByData({id: providerId});
      const { name } = provider || {};
      providerName = name;
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
      app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
      headings: { en: `New careplan created! (${providerName})` },
      contents: {
        en: `Did you buy the required medicines for the new careplan?`
      },
      buttons: [
        { id: "yes", text: "Yes" },
        { id: "no", text: "No" }
      ],
      include_player_ids: [...playerIds],
      priority: 10,
      data: {
        url: "/careplan-activation",
        type: "normal",
        params: { care_plan_id: event_id, schedule_event_id: id }
      }
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { _data } = this;
    const {
      details: {
        participants = [],
        actor: {
          id: actorId,
          user_role_id,
          details: { name, category: actorCategory } = {}
        } = {}
      },
      id = null
    } = _data || {};

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
          foreign_id: `${id}`,
          verb: `careplan_create:${currentTimeStamp}`,
          event: EVENT_TYPE.CARE_PLAN_ACTIVATION,
          time: currentTime,
          create_time: `${currentTime}`
        });
      }
    }
    return templateData;
  };
}

export default CreateJob;
