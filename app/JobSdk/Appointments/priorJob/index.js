import AppointmentJob from "../";
import moment from "moment";
import { EVENT_TYPE } from "../../../../constant";
import UserDeviceService from "../../../services/userDevices/userDevice.service";
import UserDeviceWrapper from "../../../ApiWrapper/mobile/userDevice";

class PriorJob extends AppointmentJob {
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
      } = {}
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

    // if (participant !== actorId) { // todo: add actor after testing (deployment)
    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
      headings: { en: `Appointment Created` },
      contents: {
        en: `An appointment with ${name}(${actorCategory}) is about to start in 10 minutes`
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id
      // data: { url: "/", params: "" }
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
        details: { name, category: actorCategory } = {}
      } = {},
      appointmentId
    } = getAppointmentData() || {};

    const templateData = [];
    const currentTime = new moment().utc();
    for (const participant of participants) {
      // if (participant !== actorId) {
      templateData.push({
        actor: actorId,
        actorRoleId: user_role_id,
        object: `${participant}`,
        foreign_id: `${appointmentId}`,
        verb: "appointment_create",
        // message: `${name}(${actorCategory}) has created an appointment with you`,
        event: EVENT_TYPE.APPOINTMENT,
        time: currentTime
      });
      // }
    }

    return templateData;
  };
}

export default PriorJob;
