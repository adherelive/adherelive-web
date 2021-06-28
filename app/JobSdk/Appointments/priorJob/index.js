import AppointmentJob from "../";
import moment from "moment";
import { APPOINTMENT_TYPE, EVENT_TYPE } from "../../../../constant";
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
      details: {
        participants = [],
        actor: {
          id: actorId,
          details: { name, category: actorCategory } = {},
        } = {},
        basic_info: {
          details: {
            type = "",
            type_description = "",
            radiology_type = "",
          } = {},
        } = {},
      } = {},
    } = getAppointmentData() || {};

    const templateData = [];
    const playerIds = [];
    const userIds = [];

    // participants.forEach(participant => {
    //   if (participant !== actorId) {
    //     userIds.push(participant);
    //   }
    // });

    const userDevices = await UserDeviceService.getAllDeviceByData({
      user_id: participants,
    });

    if (userDevices.length > 0) {
      for (const device of userDevices) {
        const userDevice = await UserDeviceWrapper({ data: device });
        playerIds.push(userDevice.getOneSignalDeviceId());
      }
    }

    const { title: appointmentType = "" } = APPOINTMENT_TYPE[type] || {};

    templateData.push({
      small_icon: process.config.app.icon_android,
      app_id: process.config.one_signal.app_id,
      headings: { en: `Upcoming Appointment Reminder` },
      contents: {
        en: `An appointment ${appointmentType}-${type_description}${
          radiology_type ? `-${radiology_type}` : ""
        } is about to start soon. Tap here to know more!`,
      },
      include_player_ids: [...playerIds],
      priority: 10,
      android_channel_id: process.config.one_signal.urgent_channel_id,
      data: { url: "/appointments", params: "", content: getAppointmentData() },
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
        details: { name, category: actorCategory } = {}
      } = {},
      id,
    } = getAppointmentData() || {};

    const templateData = [];
    const currentTime = new moment().utc();
    for (const participant of participants) {
      // if (participant !== actorId) {
      templateData.push({
        actor: actorId,
        actorRoleId: user_role_id,
        object: `${participant}`,
        foreign_id: `${id}`,
        verb: "appointment_prior",
        // message: `${name}(${actorCategory}) has created an appointment with you`,
        event: EVENT_TYPE.APPOINTMENT,
        time: currentTime,
        create_time: `${currentTime}`
      });
      // }
    }

    return templateData;
  };
}

export default PriorJob;
