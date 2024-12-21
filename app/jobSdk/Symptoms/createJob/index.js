import SymptomsJob from "../";
import moment from "moment";
import {
  DEFAULT_PROVIDER,
  EVENT_TYPE,
  USER_CATEGORY,
} from "../../../../constant";

import UserRoleService from "../../../services/userRoles/userRoles.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
// import ProviderService from "../../../services/provider/provider.service";

import UserDeviceWrapper from "../../../apiWrapper/mobile/userDevice";

class CreateJob extends SymptomsJob {
  constructor(data) {
    super(data);
  }

  getPushAppTemplate = async () => {
    const { getSymptomsData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        user_role_id,
        details: { name, category: actorCategory } = {},
      } = {},
      event_id = null,
      patient_id = null,
      care_plan_id_data = null,
    } = getSymptomsData() || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    const { rows: userRoles = [] } =
      (await UserRoleService.findAndCountAll({
        where: {
          id: participants,
        },
      })) || {};

    // let providerId = null;
    let doctorRoleId = null;

    for (const userRole of userRoles) {
      const { id, user_identity, linked_id } = userRole || {};
      if (id !== user_role_id) {
        doctorRoleId = id;
        userIds.push(user_identity);
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
      headings: { en: `Symptom Added` },
      contents: {
        en: `${name} added a new symptom.`,
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: {
        url: "/symptoms-add",
        params: {
          actorId,
          symptom_id: event_id,
          care_plan_id_data,
          patient_id,
          doctorRoleId,
        },
      },
    });

    return templateData;
  };

  getInAppTemplate = () => {
    const { getSymptomsData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        user_role_id,
        details: { name, category: actorCategory } = {},
      } = {},
      event_id,
    } = getSymptomsData() || {};

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
          verb: `symptoms_create:${currentTimeStamp}`,
          event: EVENT_TYPE.SYMPTOMS,
          time: `${currentTime}`,
          create_time: `${currentTime}`,
        });
      }
    }
    return templateData;
  };
}

export default CreateJob;
