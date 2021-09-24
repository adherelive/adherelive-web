import VitalJob from "../";
import moment from "moment";
import {
  DEFAULT_PROVIDER,
  EVENT_TYPE,
  NOTIFICATION_VERB
} from "../../../../constant";

import UserRoleService from "../../../services/userRoles/userRoles.service";
import ProviderService from "../../../services/provider/provider.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";

import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";
import VitalWrapper from "../../../ApiWrapper/mobile/vitals";

class ResponseJob extends VitalJob {
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
      } = {},
      vital_templates,
      vital_templates: { basic_info: { name: vitalName = "" } = {} } = {},
      vital = {},
      event_id = null,
      patient_id = null
    } = _data || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    // participants.forEach(participant => {
    //   if (participant !== user_role_id) {
    //     userRoleIds.push(participant);
    //   }
    // });

    const { rows: userRoles = [] } =
      (await UserRoleService.findAndCountAll({
        where: {
          id: participants
        }
      })) || {};

    let doctorRoleId = null;

    for (const userRole of userRoles) {
      const { id, user_identity, linked_id } = userRole || {};
      if (id !== user_role_id) {
        userIds.push(user_identity);
        doctorRoleId = id;
      }
      // else {
      //   if(linked_id) {
      //     providerId = linked_id;
      //   }
      // }
    }

    // provider
    // let providerName = DEFAULT_PROVIDER;
    // if(providerId) {
    //   const provider = await ProviderService.getProviderByData({id: providerId});
    //   const {name} = provider || {};
    //   providerName = name;
    // }

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
      headings: { en: `${name} added reading for ${vitalName} vital.` },
      contents: {
        en: `Tap here to see ${vitalName} details.`
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: {
        url: "/vital_response",
        params: {
          vital,
          vital_id: event_id,
          vital_templates,
          patient_id,
          actorId,
          doctorRoleId
        }
      }
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getData } = this;
    const data = getData();
    const {
      participants = [],
      actor: { id: actorId, user_role_id } = {},
      event_id = null,
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
          verb: `${NOTIFICATION_VERB.VITAL_RESPONSE}:${currentTimeStamp}`,
          event: EVENT_TYPE.VITALS,
          time: currentTime,
          create_time: currentTime
        });
      }
    }

    return templateData;
  };
}

export default ResponseJob;
