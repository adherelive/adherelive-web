import AppointmentJob from "../";
import moment from "moment";
import {EVENT_TYPE, USER_CATEGORY} from "../../../../constant";

import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

class CreateJob extends AppointmentJob {
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
      participants = [],
      actor: {
        id: actorId,
        details: { name, category: actorCategory } = {}
      } = {},
      event_id = null
    } = getAppointmentData() || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    participants.forEach(participant => {
      if (participant !== actorId) {
        userIds.push(participant);
      }
    });

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
      headings: { en: `Appointment Created` },
      contents: {
        en: `${actorCategory === USER_CATEGORY.DOCTOR ? "Dr." : ""}${name} created an appointment with you. Tap here to know more!`
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: { url: "/appointments", params: getAppointmentData() }
    });

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
      event_id
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
        verb: `appointment_create:${currentTimeStamp}`,
        // message: `${name}(${actorCategory}) has created an appointment with you`,
        event: EVENT_TYPE.APPOINTMENT,
        time: `${currentTime}`,
        create_time: `${currentTime}`
      });
      }
    }
    return templateData;
  };
}

export default CreateJob;
