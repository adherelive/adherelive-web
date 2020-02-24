const moment = require("moment");
const { isEmpty } = require("lodash");
const { NOTIFICATION_VERB } = require("../../../constant");
const {
  ARTICLE,
  ARTICLE_SHARE,
  ARTICLE_UPDATE,
  APPOINTMENT,
  APPOINTMENT_CREATE,
  APPOINTMENT_START,
  APPOINTMENT_PRIOR,
  APPOINTMENT_UPDATE,
  APPOINTMENT_EDIT_NOTES,
  APPOINTMENT_DELETE,
  APPOINTMENT_DELETE_ALL,
  ADVERSE_EVENT,
  ADVERSE_EVENT_CREATE,
  PRESCRIPTION,
  PRESCRIPTION_CREATE,
  PRESCRIPTION_UPDATE,
  REMINDER,
  REMINDER_CREATE,
  REMINDER_UPDATE,
  REMINDER_START,
  REMINDER_DELETE,
  REMINDER_DELETE_ALL,
  REMINDER_EDIT_NOTES,
  SURVEY,
  SURVEY_CREATE,
  SURVEY_UPDATE,
  VITALS,
  VITALS_UPDATE,
  BASIC,
  BASIC_UPDATE,
  CLINICAL_READING,
  CLINICAL_READING_CREATE,
  CLINICAL_READING_UPDATE,
  CLINICAL_READING_DELETE,
  MEDICATION,
  MEDICATION_CREATE,
  MEDICATION_DELETE,
  MEDICATION_UPDATE,
  MEDICATION_REMINDER,
  MEDICATION_REMINDER_CREATE,
  MEDICATION_REMINDER_START,
  MEDICATION_REMINDER_DELETE,
  MEDICATION_REMINDER_DELETE_ALL,
  MEDICATION_REMINDER_EDIT_NOTES,
  MEDICATION_REMINDER_UPDATE,
  HOSPITALISATION,
  HOSPITALISATION_CREATE,
  BENEFIT_DOCS_VERIFIED,
  CHARITY_APPROVAL,
  MRL_GENERATION
} = NOTIFICATION_VERB;

const actionList = {
  CREATE: "create",
  RESCHEDULE: "reschedule",
  START: "start",
  PRIOR: "prior",
  DELETE: "delete",
  SHARE: "share",
  UPDATE: "update",
  DELETE_ALL: "delete_all",
  APPROVED: "approve"
};

const notificationMessage = require("./notificationMessages");
const userServices = require("../../services/user/user.service");

class PayloadBuilder {
  constructor(data) {
    this.data = data;
  }

  action(actionName) {
    this.activityType = actionName;
    return this;
  }

  type(type) {
    this.notificationType = type;
    return this;
  }

  getReminderPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };
    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.CREATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: REMINDER_CREATE,
          time: currentTime
        };
      case actionList.RESCHEDULE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          prev: {
            startDate: payload.prevStartDate,
            endDate: payload.prevEndDate
          },
          current: {
            startDate: payload.currentStartDate,
            endDate: payload.currentEndDate
          },
          verb: REMINDER_UPDATE,
          time: currentTime
        };

      case actionList.START:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: REMINDER_START,
          startTime: payload.startTime,
          time: currentTime
        };
      case actionList.DELETE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: REMINDER_DELETE,
          time: currentTime
        };
      case actionList.DELETE_ALL:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: REMINDER_DELETE_ALL,
          time: currentTime
        };
      case actionList.UPDATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: REMINDER_EDIT_NOTES,
          time: currentTime
        };
      default:
        return null;
    }
  }

  getMedicationReminderPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };
    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.CREATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: MEDICATION_REMINDER_CREATE,
          time: currentTime
        };

      case actionList.START:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: MEDICATION_REMINDER_START,
          startTime: payload.startTime,
          time: currentTime
        };

      default:
        return null;
    }
  }

  getAppointmentPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };

    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.CREATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: APPOINTMENT_CREATE,
          time: currentTime
        };
      case actionList.RESCHEDULE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          prev: {
            startDate: payload.prevStartDate,
            endDate: payload.prevEndDate
          },
          current: {
            startDate: payload.currentStartDate,
            endDate: payload.currentEndDate
          },
          verb: APPOINTMENT_UPDATE,
          time: currentTime
        };

      case actionList.START:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: APPOINTMENT_START,
          startTime: payload.startTime,
          time: currentTime
        };
      case actionList.PRIOR:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: APPOINTMENT_PRIOR,
          startTime: payload.startTime,
          time: currentTime
        };
      case actionList.DELETE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: APPOINTMENT_DELETE,
          time: currentTime
        };
      case actionList.DELETE_ALL:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: APPOINTMENT_DELETE_ALL,
          time: currentTime
        };
      case actionList.UPDATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: APPOINTMENT_EDIT_NOTES,
          time: currentTime
        };
      default:
        return null;
    }
  }

  getAdverseEventPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };
    // console.log("app payload========>", this.activityType);
    let newPayload = {};

    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.CREATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: ADVERSE_EVENT_CREATE,
          time: currentTime
        };

      default:
        return null;
    }
  }

  getArticlePayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };

    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.SHARE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: ARTICLE_SHARE,
          time: currentTime
        };

      default:
        return null;
    }
  }

  getSurveyPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };

    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.CREATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: SURVEY_CREATE,
          time: currentTime
        };

      default:
        return null;
    }
  }

  getVitalsPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };

    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.UPDATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: VITALS_UPDATE,
          time: currentTime
        };

      default:
        return null;
    }
  }

  getBasicPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };

    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.UPDATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: BASIC_UPDATE,
          time: currentTime
        };

      default:
        return null;
    }
  }

  getClinicalReadingPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };

    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.CREATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: CLINICAL_READING_CREATE,
          time: currentTime
        };
      case actionList.UPDATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: CLINICAL_READING_UPDATE,
          time: currentTime
        };
      case actionList.DELETE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: CLINICAL_READING_DELETE,
          time: currentTime
        };

      default:
        return null;
    }
  }

  getMedicationPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };

    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.CREATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: MEDICATION_CREATE,
          time: currentTime
        };
      case actionList.UPDATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: MEDICATION_UPDATE,
          time: currentTime
        };
      case actionList.DELETE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: MEDICATION_DELETE,
          time: currentTime
        };

      default:
        return null;
    }
  }

  getHospitalizationDataPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };

    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.CREATE:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: HOSPITALISATION_CREATE,
          time: currentTime
        };
      default:
        return null;
    }
  }

  getBenefitDataPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };

    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.APPROVED:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: BENEFIT_DOCS_VERIFIED,
          time: currentTime
        };
      default:
        return null;
    }
  }

  getCharityPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };

    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.APPROVED:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: CHARITY_APPROVAL,
          time: currentTime
        };
      default:
        return null;
    }
  }

  getMRLGenerationPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };

    const currentTime = new moment().utcOffset(process.config.UTC_OFFSET_STR);
    switch (this.activityType) {
      case actionList.APPROVED:
        return {
          actor: payload.actor,
          object: `${payload.sendTo}`,
          foreign_id: `${payload._id}`,
          verb: MRL_GENERATION,
          time: currentTime
        };
      default:
        return null;
    }
  }

  getBuild() {
    try {
      let payload = { ...{}, ...this.data };
      // console.log("payload @ getBuild", payload);

      switch (this.notificationType) {
        case APPOINTMENT:
          return this.getAppointmentPayload(payload);
        case REMINDER:
          return this.getReminderPayload(payload);
        case MEDICATION_REMINDER:
          return this.getMedicationReminderPayload(payload);
        case ADVERSE_EVENT:
          return this.getAdverseEventPayload(payload);
        case ARTICLE:
          return this.getArticlePayload(payload);
        case SURVEY:
          return this.getSurveyPayload(payload);
        case PRESCRIPTION:
          return this.getPrescriptionPayload(payload);
        case VITALS:
          return this.getVitalsPayload(payload);
        case BASIC:
          return this.getBasicPayload(payload);
        case CLINICAL_READING:
          return this.getClinicalReadingPayload(payload);
        case MEDICATION:
          return this.getMedicationPayload(payload);
        case HOSPITALISATION:
          return this.getHospitalizationDataPayload(payload);
        case BENEFIT_DOCS_VERIFIED:
          return this.getBenefitDataPayload(payload);
        case CHARITY_APPROVAL:
          return this.getCharityPayload(payload);
        case MRL_GENERATION:
          return this.getMRLGenerationPayload(payload);
        default:
          return null;
      }
    } catch (err) {
      console.log("error--------------->", err.message);
      // throw err;
    }
  }
}

module.exports = data => new PayloadBuilder(data);
