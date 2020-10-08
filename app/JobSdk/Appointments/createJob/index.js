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
      event_id = null
    } = getAppointmentData() || {};

    const templateData = [];

    for (const participant of participants) {
      // if (participant !== actorId) { // todo: add actor after testing (deployment)

      templateData.push({
        app_id: process.config.one_signal.app_id, // TODO: add the same in pushNotification handler in notificationSdk
        headings: { en: `Appointment Created` },
        contents: {
          en: `${name}(${actorCategory}) has created an appointment with you`
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
      participants = [],
      actor: {
        id: actorId,
        details: { name, category: actorCategory } = {}
      } = {},
      appointmentId,
      event_id
    } = getAppointmentData() || {};

    const templateData = [];
    const currentTime = new moment().utc().toISOString();
    const now = moment();
    const currentTimeStamp = now.unix();
    for (const participant of participants) {
      // if (participant !== actorId) {
      templateData.push({
        actor: actorId,
        object: `${participant}`,
        foreign_id: `${event_id}`,
        verb: `appointment_create:${currentTimeStamp}`,
        // message: `${name}(${actorCategory}) has created an appointment with you`,
        event: EVENT_TYPE.APPOINTMENT,
        time: `${currentTime}`,
        create_time: `${currentTime}`
      });
      // }
    }
    return templateData;
  };
}

export default CreateJob;
