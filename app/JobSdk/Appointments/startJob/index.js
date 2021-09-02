import AppointmentJob from "../";
import moment from "moment";
import { DEFAULT_PROVIDER, EVENT_TYPE } from "../../../../constant";

import UserRoleService from "../../../services/userRoles/userRoles.service";
import ProviderService from "../../../services/provider/provider.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";

import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

class StartJob extends AppointmentJob {
  constructor(data) {
    super(data);
  }

  getEmailTemplate = () => {
    const { getAppointmentData } = this;
    const { details: {} = {} } = getAppointmentData() || {};

    const templateData = [];

    return templateData;
  };

  getSmsTemplate = () => {};

  getPushAppTemplate = async () => {
    const { getAppointmentData } = this;
    const {
      details: {
        participants = [],
        actor: {
          id: actorId,
          user_role_id,
          details: { name, category: actorCategory } = {}
        } = {}
      }
    } = getAppointmentData() || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    // const userRoleIds = [];

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
      const {user_identity, linked_id} = userRole || {};
        userIds.push(user_identity);
        if(linked_id) {
          providerId = linked_id;
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
      user_id: userIds
    });

    if (userDevices.length > 0) {
      for (const device of userDevices) {
        const userDevice = await UserDeviceWrapper({ data: device });
        playerIds.push(userDevice.getOneSignalDeviceId());
      }
    }

    // for (const participant of participants) {
      // if (participant !== actorId) { // todo: add actor after testing (deployment)

      templateData.push({
        small_icon: process.config.app.icon_android,
        app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
        headings: { en: `Appointment started (${providerName})` },
        contents: {
            en: `Appointment with ${actorCategory} ${name} has started! Tap here to join`
        },
        // buttons: [{ id: "yes", text: "Yes" }, { id: "no", text: "No" }],
        include_player_ids: [...playerIds],
        priority: 10,
        android_channel_id: process.config.one_signal.urgent_channel_id,
        data: { url: "/appointments", params: getAppointmentData() }
      });
      // }
    // }

    return templateData;
  };

  getInAppTemplate = () => {
    const { getAppointmentData } = this;
    const {
      details: {
        participants = [],
        actor: {
          id: actorId,
          user_role_id,
          details: { name, category: actorCategory } = {}
        } = {}
      },
      id,
      start_time
    } = getAppointmentData() || {};

    const templateData = [];
    const now = moment();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      templateData.push({
        actor: actorId,
        actorRoleId: user_role_id,
        object: `${participant}`,
        foreign_id: `${id}`,
        verb: `appointment_start:${currentTimeStamp}`,
        event: EVENT_TYPE.APPOINTMENT,
        time: start_time,
        start_time: `${start_time}`
      });
    }
    return templateData;
  };
}

export default StartJob;
