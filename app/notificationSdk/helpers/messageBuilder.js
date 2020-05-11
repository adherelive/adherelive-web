const moment = require("moment");
const { isEmpty } = require("lodash");
const { NOTIFICATION_VERB } = require("../../../constant");
const {
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
  REMINDER,
  REMINDER_CREATE,
  REMINDER_UPDATE,
  REMINDER_START,
  REMINDER_DELETE,
  REMINDER_DELETE_ALL,
  REMINDER_EDIT_NOTES,
  MEDICATION_REMINDER,
  HOSPITALISATION
} = NOTIFICATION_VERB;

const actionList = {
  CREATE: "create",
  RESCHEDULE: "reschedule",
  START: "start",
  PRIOR: "prior",
  DELETE: "delete",
  SHARE: "share",
  UPDATE: "update",
  DELETE_ALL: "delete_all"
};

const userService = require("../../services/user/user.service");
const productService = require("../../services/product/product.service");

class PayloadBuilder {
  constructor(data) {
    this.data = data;
  }

  action(actionName) {
    this.activityType = actionName;
    return this;
  }

  type(type) {
    this.eventType = type;
    return this;
  }

  async getReminderPayload() {
    const { user = {}, payload } = this.data;
    console.log("REMINDER PAYLOAD ----", payload);
    const {
      data: {
        participantOne: detailsParticipantOne,
        details: {
          startTime: detailsStartTime,
          notes: detailsNotes,
          title: detailsTitle
        } = {},
        data: {
          startTime: dataStartTime,
          notes: dataNotes,
          title: dataTitle,
          participantOne: dataParticipantOne
        } = {},
        prevStartDate,
        currentStartDate
      } = {}
    } = payload;
    let startTime = detailsStartTime ? detailsStartTime : dataStartTime;
    let notes = detailsNotes ? detailsNotes : dataNotes;
    let title = detailsTitle ? detailsTitle : dataTitle;
    let participantOne = detailsParticipantOne
      ? detailsParticipantOne
      : dataParticipantOne;

    const patientDetails = await userService.getUserById(participantOne);
    const { basicInfo: { name } = {}, category } = patientDetails;
    const { contactNo } = user;

    switch (this.activityType) {
      // case actionList.CREATE:
      //   return {
      //     phonenumber: contactNo.countryCode + contactNo.phoneNumber,
      //     sender: "rpm",
      //     message: `${name} ${
      //       category ? `(${category})` : ""
      //     } has created a reminder for ${title} at ${moment(startTime)
      //       .utcOffset(process.config.UTC_OFFSET_STR)
      //       .format("LLLL")}. Notes - ${notes}`
      //   };
      case actionList.START:
        //case actionList.PRIOR:
        return {
          //phonenumber: contactNo.countryCode + contactNo.phoneNumber,
          countryCode: contactNo.countryCode,
          phoneNumber: contactNo.phoneNumber,
          sender: "rpm",
          message: `It is time for ${title}`
        };
      // case actionList.RESCHEDULE:
      //   return {
      //     phonenumber: contactNo.countryCode + contactNo.phoneNumber,
      //     sender: "rpm",
      //     message: `Reminder ${title} is rescheduled from ${moment(
      //       currentStartDate
      //     )
      //       .utcOffset(process.config.UTC_OFFSET_STR)
      //       .format("LLLL")} to ${moment(prevStartDate)
      //       .utcOffset(process.config.UTC_OFFSET_STR)
      //       .format("LLLL")}. Notes - ${notes}`
      //   };
      // case actionList.DELETE_ALL:
      //   return {
      //     phonenumber: contactNo.countryCode + contactNo.phoneNumber,
      //     sender: "rpm",
      //     message: `Reminder ${title} is deleted. Notes - ${notes}`
      //   };
      // case actionList.UPDATE:
      //   return {
      //     phonenumber: contactNo.countryCode + contactNo.phoneNumber,
      //     sender: "rpm",
      //     message: `Reminder ${title} is updated. Notes - ${notes}`
      //   };
      default:
        return null;
    }
  }

  async getMedicationReminderPayload() {
    const { user = {}, payload } = this.data;
    console.log("MEDICATION_REMINDER PAYLOAD ----", payload);
    const {
      data: {
        data: {
          medicine,
          quantity,
          strength,
          unit,
          whenToTake,
          participantOne
        } = {}
      } = {}
    } = payload;

    const patientDetails = await userService.getUserById(participantOne);
    const medicineData = await productService.getProduct({ _id: medicine });

    const { name: medicineName } = medicineData || {};
    const { basicInfo: { name } = {}, category } = patientDetails;
    const { contactNo } = user;

    switch (this.activityType) {
      case actionList.START:
        //case actionList.PRIOR:
        return {
          //phonenumber: contactNo.countryCode + contactNo.phoneNumber,
          countryCode: contactNo.countryCode,
          phoneNumber: contactNo.phoneNumber,
          sender: "rpm",
          message: `It is time for your medicaine - ${medicineName}-${strength}${unit}. Take ${quantity}, ${whenToTake}.  `
        };
      default:
        return null;
    }
  }

  async getAppointmentPayload() {
    const { user = {}, payload } = this.data;
    const {
      data: {
        participantOne: detailsParticipantOne,
        startTime: rescheduleStartTime,
        details: {
          activityMode: detailsMode,
          activityType: detailsType,
          startTime: detailsStartTime
        } = {},
        data: {
          activityMode: dataMode,
          activityType: dataType,
          participantOne: dataParticipantOne
        } = {},
        prevStartDate,
        currentStartDate
      } = {}
    } = payload;
    let activityMode = detailsMode ? detailsMode : dataMode;
    let activityType = detailsType ? detailsType : dataType;
    let startTime = detailsStartTime ? detailsStartTime : rescheduleStartTime;
    let participantOne = detailsParticipantOne
      ? detailsParticipantOne
      : dataParticipantOne;
    console.log("payload ---XXXXXXXXXXXXXXXXXXXXXXXX-", payload);
    const patientDetails = await userService.getUserById(participantOne);
    const { basicInfo: { name } = {}, category } = patientDetails;

    const { contactNo } = user;
    let smsPayload = {
      //phonenumber: contactNo.countryCode + contactNo.phoneNumber,
      countryCode: contactNo.countryCode,
      phoneNumber: contactNo.phoneNumber,
      sender: "rpm",
      message: `${name} (${category}) has created an appointment.
      ${activityMode}, ${activityType}`
    };
    switch (this.activityType) {
      case actionList.CREATE:
        return {
          //phonenumber: contactNo.countryCode + contactNo.phoneNumber,
          countryCode: contactNo.countryCode,
          phoneNumber: contactNo.phoneNumber,
          sender: "rpm",
          message: `${name} ${
            category ? `(${category})` : ""
          } has created an appointment. ${activityMode}, ${activityType} at ${moment(
            startTime
          )
            .utcOffset(process.config.UTC_OFFSET_STR)
            .format("LLLL")}`
        };
      case actionList.START:
        return {
          //phonenumber: contactNo.countryCode + contactNo.phoneNumber,
          countryCode: contactNo.countryCode,
          phoneNumber: contactNo.phoneNumber,
          sender: "rpm",
          message: `${activityMode}, ${activityType} with ${name} started at ${moment(
            startTime
          )
            .utcOffset(process.config.UTC_OFFSET_STR)
            .format("LLLL")} `
        };
      case actionList.PRIOR:
        return {
          //phonenumber: contactNo.countryCode + contactNo.phoneNumber,
          countryCode: contactNo.countryCode,
          phoneNumber: contactNo.phoneNumber,
          sender: "rpm",
          message: `An appointment is about to start at ${moment(startTime)
            .utcOffset(process.config.UTC_OFFSET_STR)
            .format("LLLL")} of ${activityMode}, ${activityType} with ${name}`
        };

      case actionList.RESCHEDULE:
        return {
          //phonenumber: contactNo.countryCode + contactNo.phoneNumber,
          countryCode: contactNo.countryCode,
          phoneNumber: contactNo.phoneNumber,
          sender: "rpm",
          message: `An appointment with ${name} is rescheduled to ${moment(
            currentStartDate
          )
            .utcOffset(process.config.UTC_OFFSET_STR)
            .format("LLLL")} from ${moment(prevStartDate)
            .utcOffset(process.config.UTC_OFFSET_STR)
            .format("LLLL")}`
        };
      case actionList.DELETE_ALL:
        return {
          //phonenumber: contactNo.countryCode + contactNo.phoneNumber,
          countryCode: contactNo.countryCode,
          phoneNumber: contactNo.phoneNumber,
          sender: "rpm",
          message: `Your appointment scheduled at ${moment(startTime)
            .utcOffset(process.config.UTC_OFFSET_STR)
            .format("LLLL")} with ${name} is deleted`
        };

      case actionList.DELETE:
        return {
          //phonenumber: contactNo.countryCode + contactNo.phoneNumber,
          countryCode: contactNo.countryCode,
          phoneNumber: contactNo.phoneNumber,
          sender: "rpm",
          message: `Your appointment scheduled at ${moment(startTime)
            .utcOffset(process.config.UTC_OFFSET_STR)
            .format("LLLL")} with ${name} is deleted`
        };
      case actionList.UPDATE:
        return {
          //phonenumber: contactNo.countryCode + contactNo.phoneNumber,
          countryCode: contactNo.countryCode,
          phoneNumber: contactNo.phoneNumber,
          sender: "rpm",
          message: `An appointment is about to start at 
          ${moment(startTime)
            .utcOffset(process.config.UTC_OFFSET_STR)
            .format("LLLL")} of ${activityMode}, ${activityType} with ${name}`
        };
        return smsPayload;
    }
  }

  async getAdverseEventPayload() {
    const { user = {}, payload } = this.data;
    const {
      data: { details: { severity, description, patient, on } = {} } = {}
    } = payload;
    const patientDetails = await userService.getUserById(patient);
    const { basicInfo: { name } = {} } = patientDetails;
    const { contactNo } = user;
    let smsPayload = {
      //phonenumber: contactNo.countryCode + contactNo.phoneNumber,
      countryCode: contactNo.countryCode,
      phoneNumber: contactNo.phoneNumber,
      sender: "rpm",
      message: `${name} reported an adverse event with ${severity} severity at ${moment(
        on
      ).format("LLLL")}. Description - ${description}`,
      MessageAttributes: {
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional"
        }
      }
    };

    switch (this.activityType) {
      case actionList.CREATE:
        return smsPayload;
      default:
        return null;
    }
  }

  async getHospitalizationPayload() {
    const { user = {}, payload } = this.data;
    const { data: { userId: patient } = {} } = payload;
    console.log("payload================================ :", user, payload);
    const patientDetails = await userService.getUserById(patient);
    const { basicInfo: { name } = {} } = patientDetails;
    const { contactNo } = user;
    let smsPayload = {
      //phonenumber: contactNo.countryCode + contactNo.phoneNumber,
      countryCode: contactNo.countryCode,
      phoneNumber: contactNo.phoneNumber,
      sender: "rpm",
      message: `${name} reported a hospitalisation`,
      MessageAttributes: {
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional"
        }
      }
    };

    switch (this.activityType) {
      case actionList.CREATE:
        return smsPayload;
      default:
        return null;
    }
  }

  getBuild() {
    try {
      switch (this.eventType) {
        case APPOINTMENT:
          return this.getAppointmentPayload();
        case REMINDER:
          return this.getReminderPayload();
        case ADVERSE_EVENT:
          return this.getAdverseEventPayload();
        case MEDICATION_REMINDER:
          return this.getMedicationReminderPayload();
        case HOSPITALISATION:
          return this.getHospitalizationPayload();
        default:
          return null;
      }
    } catch (err) {
      console.log("error---IN MESSAGE BUILDER-->", err.message);
      // throw err;
    }
  }
}

module.exports = data => new PayloadBuilder(data);
