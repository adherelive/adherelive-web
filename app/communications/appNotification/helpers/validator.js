const {isEmpty} = require("lodash");
const eventServices = require("../../../services/event/event.service");
const userServices = require("../../../services/user/user.service");
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

class Validator {
  constructor(data) {
    this.notificatonID = data.notificationId;
    this.sendTo = data.sendTo || null;
  }
  
  type(type) {
    if (NOTIFICATION_ENUM.indexOf(type) != -1) {
      this.notificationType = type;
      return this;
    } else {
      throw new Error("invalid notification type!!");
    }
  }
  
  async isValidReminderData() {
    try {
      let reminderData = await eventServices.getEventById(this.notificatonID);
      if (isEmpty(reminderData)) throw new Error("no such reminder created");
      if (
        isEmpty(reminderData.eventCategory) ||
        reminderData.eventCategory.toLowerCase() != REMINDER
      ) {
        throw new Error("event doesn't belong to reminder category");
      }
      
      if (isEmpty(reminderData.participantOne))
        throw new Error("participant one data is undefined or invalid");
      if (isEmpty(reminderData.participantTwo))
        throw new Error("participant two is undefined or invalid");
      let participantOneData = await userServices.getUser({
        _id: reminderData.participantOne,
      });
      let participantTwoData = await userServices.getUser({
        _id: reminderData.participantTwo,
      });
      
      if (isEmpty(participantOneData))
        throw new Error("participant one doesn't exist");
      if (isEmpty(participantTwoData))
        throw new Error("participant two doesn't exist");
      
      if (isEmpty(reminderData.details))
        throw new Error("reminder details doesn't exist");
      if (isEmpty(reminderData.details.startTime))
        throw new Error("start time for reminder is undefined");
      if (isEmpty(reminderData.details.endTime))
        throw new Error("end time for reminder is undefined");
      // if (isEmpty(reminderData.details.notes))
      
      //   if (isEmpty(reminderData.details.title))
    } catch (err) {
      throw err;
    }
  }
  
  async isValidAppointementData() {
    try {
      let appointmentData = await eventServices.getEventById(
        this.notificatonID
      );
      // console.log("appointment data", appointmentData);
      if (isEmpty(appointmentData))
        throw new Error("no such appointment created");
      
      if (
        isEmpty(appointmentData.eventCategory) ||
        appointmentData.eventCategory.toLowerCase() != APPOINTMENT
      )
        throw new Error("event doesn't belong to appointment category");
      
      if (isEmpty(appointmentData.participantOne))
        throw new Error("no participant one data");
      if (isEmpty(appointmentData.participantTwo))
        throw new Error("no participant two data");
      let sendTo;
      
      let participantOneData = await userServices.getUser({
        _id: appointmentData.participantOne,
      });
      
      let participantTwoData = await userServices.getUser({
        _id: appointmentData.participantTwo,
      });
      if (!isEmpty(this.sendTo)) {
        if (
          [
            appointmentData.participantOne.toString(),
            appointmentData.participantTwo.toString(),
          ].indexOf(this.sendTo.toString()) == -1
        )
          throw new Error("user is not participant for this appointment");
        sendTo = this.sendTo;
        // appointmentData.participantOne.toString() == this.sendTo.toString()
        //   ? "participantOne"
        //   : "participantTwo";
      }
      
      if (isEmpty(participantOneData))
        throw new Error("participant one doesn't exist");
      
      if (isEmpty(participantTwoData))
        throw new Error("participant two doesn't exist");
      
      if (isEmpty(appointmentData.details))
        throw new Error("appointment details doesn't exist");
      
      if (isEmpty(appointmentData.details.startTime))
        throw new Error("startTime invalid or undefined");
      
      if (isEmpty(appointmentData.details.endTime))
        throw new Error("endTime invalid or undefined");
      
      if (isEmpty(appointmentData.details.activityMode))
        throw new Error("invalid or undefined activity mode");
      
      if (isEmpty(appointmentData.details.activityType))
        throw new Error("invalid or undefined activity type");
      
      let result = {
        ...appointmentData,
        ...{
          participantOneDetails: {
            name: participantOneData.name,
            category: participantOneData.category,
            contact: participantOneData.email,
            gender: participantOneData.gender,
            status: participantOneData.status,
          },
        },
        ...{
          participantTwoDetails: {
            name: participantTwoData.name,
            category: participantTwoData.category,
            contact: participantTwoData.email,
            gender: participantTwoData.gender,
            status: participantTwoData.status,
          },
        },
        ...{
          sendTo: sendTo,
        },
      };
      // console.log("result at validator app", result);
      return result;
    } catch (err) {
      throw err;
    }
  }
  
  async isValidArticleData() {
    let payload = !isEmpty(arguments) ? arguments[0] : {...{}, ...this.data};
    
    if (isEmpty(payload)) return false;
    if (
      isEmpty(payload.eventCategory) ||
      payload.eventCategory.toLowerCase() != ARTICLE
    )
      return false;
    if (isEmpty(payload._id)) return false;
    if (isEmpty(payload.participantOne)) return false;
    if (isEmpty(payload.participantTwo)) return false;
    if (isEmpty(payload.status)) return false;
    // if (this.type === "create") {
    //   //validation related to create article
    // }
    // if (this.type === "update") {
    //   //validation related to update article
    // }
    return true;
  }
  
  async isValidSurveyData() {
    let payload = !isEmpty(arguments) ? arguments[0] : {...{}, ...this.data};
    if (isEmpty(payload)) return false;
    if (
      isEmpty(payload.eventCategory) ||
      payload.eventCategory.toLowerCase() !== SURVEY
    ) {
      return false;
    }
    // if (this.type === "create") {
    //   //validation related to create survey
    // }
    // if (this.type === "update") {
    //   //validation related to update survey
    // }
    return true;
  }
  
  async isValidPatientDischargeData() {
    let payload = !isEmpty(arguments) ? arguments[0] : {...{}, ...this.data};
    if (isEmpty(payload)) return false;
    if (
      isEmpty(payload.eventCategory) ||
      payload.eventCategory.toLowerCase() !== PROGRAM
    ) {
      return false;
    }
    
    // if (this.type === "create") {
    //   //validation related to create patient Discharge
    // }
    // if (this.type === "update") {
    //   //validation related to update reminder
    // }
    return true;
  }
  
  async isValidAdverseEventData() {
    let payload = !isEmpty(arguments) ? arguments[0] : {...{}, ...this.data};
    if (isEmpty(payload)) return false;
    if (
      isEmpty(payload.eventCategory) ||
      payload.eventCategory.toLowerCase() !== ADVERSE_EVENT
    ) {
      return false;
    }
    
    // if (this.type === "create") {
    //   //validation related to create reminder
    // }
    // if (this.type === "update") {
    //   //validation related to update reminder
    // }
    return true;
  }
  
  async isValidVitalsData() {
    let payload = !isEmpty(arguments) ? arguments[0] : {...{}, ...this.data};
    if (isEmpty(payload)) return false;
    if (
      isEmpty(payload.eventCategory) ||
      payload.eventCategory.toLowerCase() !== VITALS
    ) {
      return false;
    }
    
    // if (this.type === "create") {
    //   //validation related to create reminder
    // }
    // if (this.type === "update") {
    //   //validation related to update reminder
    // }
    return true;
  }
  
  async isValidPrescriptionData() {
    let payload = !isEmpty(arguments) ? arguments[0] : {...{}, ...this.data};
    if (isEmpty(payload)) return false;
    if (
      isEmpty(payload.eventCategory) ||
      payload.eventCategory.toLowerCase() !== PRESCRIPTION
    ) {
      return false;
    }
    // if (this.type === "create") {
    //   //validation related to create reminder
    // }
    // if (this.type === "update") {
    //   //validation related to update reminder
    // }
    return true;
  }
  
  async isValidProgramData() {
    let payload = !isEmpty(arguments) ? arguments[0] : {...{}, ...this.data};
    if (isEmpty(payload)) return false;
    if (
      isEmpty(payload.eventCategory) ||
      payload.eventCategory.toLowerCase() !== PROGRAM
    ) {
      return false;
    }
    // if (this.type === "create") {
    //   //validation related to create reminder
    // }
    // if (this.type === "update") {
    //   //validation related to update reminder
    // }
    return true;
  }
  
  async isValid() {
    let notificatonID = this.notificatonID;
    if (isEmpty(this.notificationType))
      throw new Error("invalid or undefined notification type");
    if (isEmpty(notificatonID))
      return new Error("empty or undefined notificationId");
    switch (this.notificationType) {
      case APPOINTMENT:
        return await this.isValidAppointementData();
      case REMINDER:
        return await this.isValidReminderData(notificatonID);
      case ARTICLE:
        return await this.isValidArticleData(notificatonID);
      case SURVEY:
        return await this.isValidSurveyData(notificatonID);
      case PRESCRIPTION:
        return await this.isValidPrescriptionData(notificatonID);
      case ADVERSE_EVENT:
        return await this.isValidAdverseEventData(notificatonID);
      case VITALS:
        return await this.isValidVitalsData(notificatonID);
      case PROGRAM:
        return await this.isValidProgramData(notificatonID);
      default:
        throw new Error("invalid notification type");
    }
  }
}

module.exports = (data) => new Validator(data);
