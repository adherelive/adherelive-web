import AppointmentJob from "../";
import moment from "moment";
import { EVENT_TYPE, USER_CATEGORY } from "../../../../constant";

import UserDeviceService from "../../../services/userDevices/userDevice.service";

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
          details: { name, category: actorCategory } = {}
        } = {}
      }
    } = getAppointmentData() || {};

    const templateData = [];

    for (const participant of participants) {
      // if (participant !== actorId) { // todo: add actor after testing (deployment)

      templateData.push({
        app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
        headings: { en: `Appointment Started` },
        contents: {
          en: `${name}(${actorCategory}) created an appointment with you which is going to start.`
        },
        // buttons: [{ id: "yes", text: "Yes" }, { id: "no", text: "No" }],
        include_player_ids: [...participants],
        priority: 10,
        data: { url: "/appointments", params: getAppointmentData() }
      });
      // }
    }

    return templateData;
  };

  getInAppTemplate = () => {
    const { getAppointmentData } = this;
    const {
      details: {
        participants = [],
        actor: {
          id: actorId,
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
