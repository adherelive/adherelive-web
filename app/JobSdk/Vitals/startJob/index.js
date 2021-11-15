import VitalJob from "../";
import moment from "moment";
import { DEFAULT_PROVIDER, EVENT_TYPE } from "../../../../constant";

import UserRoleService from "../../../services/userRoles/userRoles.service";
import ProviderService from "../../../services/provider/provider.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";

import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";
import VitalWrapper from "../../../ApiWrapper/mobile/vitals";

class StartJob extends VitalJob {
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
        details: { name, category: actorCategory } = {},
      } = {},
      vital_templates,
      vital_templates: { basic_info: { name: vitalName = "" } = {} } = {},
      eventId = null,
    } = _data.getDetails() || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    const vitals = await VitalWrapper({ id: _data.getEventId() });
    const { vitals: latestVital } = await vitals.getAllInfo();

    // participants.forEach(participant => {
    //   if (participant !== user_role_id) {
    //     userRoleIds.push(participant);
    //   }
    // });

    const {rows: userRoles = []} = await UserRoleService.findAndCountAll({
      where: {
        id: participants
      }
    }) || {};

    let providerId = null;

    for(const userRole of userRoles) {
      const {id, user_identity, linked_id} = userRole || {};
      if(id !== user_role_id) {
        userIds.push(user_identity);
      } 
      else {
        if(linked_id) {
          providerId = linked_id;
        }
      }
    }

    // provider
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

    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
      headings: { en: `${vitalName} Reminder` },
      contents: {
        en: `Tap here to update your ${vitalName}`,
      },
      // buttons: [{ id: "yes", text: "Yes" }, { id: "no", text: "No" }],
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: {
        url: "/vitals",
        vital: latestVital[_data.getEventId()],
        vital_template: vital_templates,
        type: "modal",
      },
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getData } = this;
    const data = getData();
    const {
      details: { participants = [], actor: { id: actorId, user_role_id } = {} },
      id = null,
      start_time = null,
      event_id = null,
    } = data.getAllInfo() || {};

    const templateData = [];
    const now = moment();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      if (participant !== user_role_id) {
        templateData.push({
          actor: actorId,
          actorRoleId: user_role_id,
          object: `${participant}`,
          foreign_id: `${event_id}`,
          verb: `vital_start:${currentTimeStamp}`,
          event: EVENT_TYPE.VITALS,
          time: start_time,
          start_time: start_time,
        });
      }
    }

    return templateData;
  };
}

export default StartJob;
