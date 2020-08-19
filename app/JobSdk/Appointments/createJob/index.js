import AppointmentJob from "../";
import moment from "moment";
import { USER_CATEGORY } from "../../../../constant";

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

  getPushAppTemplate = () => {
    const { getAppointmentData } = this;
    const {
      participants = [],
      actor: {
        id: actorId,
        details: { name, category: actorCategory } = {}
      } = {}
    } = getAppointmentData() || {};

    const templateData = [];

    for (const participant of participants) {
      if (participant !== actorId) {
        templateData.push({
          // app_id: process.config.ONE_SIGNAL_APP_ID, // TODO: add the same in pushNotification handler in notificationSdk
          headings: { en: `Appointment Created` },
          contents: {
            en: `${name}(${actorCategory}) has created an appointment with you`
          },
          // buttons: [{ id: "yes", text: "Yes" }, { id: "no", text: "No" }],
          include_player_ids: [participant],
          priority: 10,
          data: { url: "/", params: "" }
        });
      }
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
      if (participant !== actorId) {
        templateData.push({
          actor: actorId,
          object: `${participant}`,
          foreign_id: `appointment:${appointmentId}`,
          verb: "appointment_create",
          message: `${name}(${actorCategory}) has created an appointment with you`,
          time: currentTime
        });
      }
    }

    return templateData;
  };
}

export default CreateJob;
