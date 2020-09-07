import AppointmentJob from "../";
import moment from "moment";
import { EVENT_TYPE, USER_CATEGORY } from "../../../../constant";

import UserDeviceService from "../../../services/userDevices/userDevice.service";

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
      appointmentId
    } = getAppointmentData() || {};

    const templateData = [];

    for (const participant of participants) {
      // if (participant !== actorId) { // todo: add actor after testing (deployment)
      const userDevices = await UserDeviceService.getDeviceByData({
        user_id: participant
      });

      let userIds = [];

      if (userDevices && userDevices.length > 0) {
        for (const device of userDevices) {
          const { one_signal_user_id } = device;
          if (one_signal_user_id) {
            userIds.push(one_signal_user_id);
          }
        }
      }

      const currentTime = new moment().utc().toISOString();

      const params = {
        actor: actorId,
        object: `${participant}`,
        foreign_id: `${appointmentId}`,
        verb: "appointment_create",
        // message: `${name}(${actorCategory}) has created an appointment with you`,
        event: EVENT_TYPE.APPOINTMENT,
        time: currentTime
      };

      templateData.push({
        app_id: process.config.one_signal.app_id,
        headings: { en: `Appointment Created` },
        contents: {
          en: `${name}(${actorCategory}) has created an appointment with you`
        },
        // buttons: [{ id: "yes", text: "Yes" }, { id: "no", text: "No" }],
        include_player_ids:  userIds, //["1d5c5ba9-b7f2-4e46-ac40-30bc7a3ce91d"],
        priority: 10,
        data: { url: "/appointments", params }
      });
      // }
    }

    return templateData;
  };

  getInAppTemplate = () => {
    const { getAppointmentData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
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

export default CreateJob;
