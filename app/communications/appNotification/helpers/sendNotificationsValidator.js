const { isEmpty } = require("lodash");
const eventServices = require("../../../services/event/event.service");
const userServices = require("../../../services/user/user.service");
const NOTIFIER = require("./notify");
const payloadBuilder = require("./payloadBuilder");
const {
  REMINDER,
  APPOINTMENT,
  ARTICLE,
  ADVERSE_EVENT,
  SURVEY,
  PROGRAM,
  PRESCRIPTION,
  VITALS,
} = require("../contants");

const NOTIFICATION_ENUM = [
  REMINDER,
  APPOINTMENT,
  ARTICLE,
  ADVERSE_EVENT,
  SURVEY,
  PROGRAM,
  PRESCRIPTION,
  VITALS,
];

const actionList = {
  CREATE: "create",
  RESCHEDULE: "reschedule",
  START: "start",
  PRIOR: "prior",
  DELETE: "delete",
};

class SendNotificationValidator {
  type(type) {
    if (NOTIFICATION_ENUM.indexOf(type) !== -1) {
      this.notificationType = type;
      return this;
    } else {
      throw new Error("invalid notification type!!");
    }
  }

  action(actionName) {
    this.actionType = actionName;
    return this;
  }

  async sendNotification(validData) {
    return result;
  }

  async isValidReminderData() {
    try {
    } catch (err) {
      throw err;
    }
  }

  async isValidAppointmentData(validData) {
    try {
      switch (this.actionType) {
        case actionList.CREATE:
          return await this.sendNotification(validData);

        case actionList.RESCHEDULE:
          return await this.sendNotification(validData);

        case actionList.PRIOR:
          await this.sendNotification(validData);
          break;
        case actionList.START:
          await this.sendNotification(validData);
          break;

        default:
          break;
      }
    } catch (err) {
      throw err;
    }
  }

  async isValidArticleData() {}

  async isValidSurveyData() {}

  async isValidPatientDischargeData() {}

  async isValidAdverseEventData() {}

  async isValidVitalsData() {}

  async isValidPrescriptionData() {}

  async isValidProgramData() {}

  async shouldSendNotificationTo(validData) {
    if (isEmpty(this.notificationType))
      throw new Error("invalid or undefined notification type");

    switch (this.notificationType) {
      case APPOINTMENT:
        return await this.isValidAppointmentData(validData);
      //   case REMINDER:
      //     return await this.isValidReminderData(notificatonID);
      //   case ARTICLE:
      //     return await this.isValidArticleData(notificatonID);
      //   case SURVEY:
      //     return await this.isValidSurveyData(notificatonID);
      //   case PRESCRIPTION:
      //     return await this.isValidPrescriptionData(notificatonID);
      //   case ADVERSE_EVENT:
      //     return await this.isValidAdverseEventData(notificatonID);
      //   case VITALS:
      //     return await this.isValidVitalsData(notificatonID);
      //   case PROGRAM:
      //     return await this.isValidProgramData(notificatonID);
      default:
        throw new Error("invalid notification type");
    }
  }
}

module.exports = () => new SendNotificationValidator();
