import AppointmentJob from "../";
import moment from "moment";
import { EVENT_TYPE, USER_CATEGORY } from "../../../../constant";

import UserRoleService from "../../../services/userRoles/userRoles.service";
import ProviderService from "../../../services/provider/provider.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";

import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

class UpdateJob extends AppointmentJob {
  constructor(data) {
    super(data);
  }

  getEmailTemplate = () => {};

  getSmsTemplate = () => {};

  getPushAppTemplate = async () => {
    const { getAppointmentData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        user_role_id,
        details: { name, category: actorCategory } = {},
      } = {},
    } = getAppointmentData() || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];

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

    const userDevices =
      (await UserDeviceService.getAllDeviceByData({
        user_id: userIds,
      })) || [];

    if (userDevices.length > 0) {
      for (const device of userDevices) {
        const userDevice = await UserDeviceWrapper({ data: device });
        playerIds.push(userDevice.getOneSignalDeviceId());
      }
    }

    // if (participant !== actorId) { // todo: add actor after testing (deployment)

    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
      headings: { en: `Appointment Update (${providerName})` },
      contents: {
        en: `${
          actorCategory === USER_CATEGORY.DOCTOR ? "Dr." : ""
        }${name} updated an appointment with you. Tap here to know more!`,
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: { url: "/appointments", params: getAppointmentData() },
    });
    // }

    return templateData;
  };

  getInAppTemplate = () => {
    const { getAppointmentData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        user_role_id,
        // details: { name, category: actorCategory } = {}
      } = {},
      // appointmentId,
      event_id,
    } = getAppointmentData() || {};

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
          verb: `appointment_update:${currentTimeStamp}`,
          // message: `${name}(${actorCategory}) has created an appointment with you`,
          event: EVENT_TYPE.APPOINTMENT,
          time: `${currentTime}`,
          create_time: `${currentTime}`,
        });
      }
    }
    return templateData;
  };
}

export default UpdateJob;
