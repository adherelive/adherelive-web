const { isEmpty } = require("lodash");
const eventServices = require("../../services/event/event.service");
import schedulerService from "../../services/scheduler/scheduler.service";
import { USER_CATEGORY } from "../../../constant";

const userServices = require("../../services/user/user.service");
const articleService = require("../../services/article/article.service");
const medicalConditionService = require("../../services/medicalCondition/medicalCondition.service");
const medicationService = require("../../services/medication/medication.service");
const hospitalizationService = require("../../services/hospitalization/hospitalization.service");
const benefitService = require("../../services/benefitPlan/benefitPlan.service");
const { SURVEY: SURVEY_SERVICE } = require("../../surveySdk");
const charityAppliedservice = require("../../services/charitiesApplied/charitiesApplied.service");
const dispensationService = require("../../services/dispensation/dispensation.service");
const { NOTIFICATION_VERB } = require("../../../constant");

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

const {
  REMINDER,
  APPOINTMENT,
  ARTICLE,
  ADVERSE_EVENT,
  SURVEY,
  PROGRAM,
  PRESCRIPTION,
  VITALS,
  BASIC,
  CLINICAL_READING,
  MEDICATION,
  MEDICATION_REMINDER,
  HOSPITALISATION,
  BENEFIT_DOCS_VERIFIED,
  CHARITY_APPROVAL,
  MRL_GENERATION
} = NOTIFICATION_VERB;

const NOTIFICATION_ENUM = [
  REMINDER,
  APPOINTMENT,
  ARTICLE,
  ADVERSE_EVENT,
  SURVEY,
  PROGRAM,
  PRESCRIPTION,
  VITALS,
  BASIC,
  CLINICAL_READING,
  MEDICATION,
  MEDICATION_REMINDER,
  HOSPITALISATION,
  BENEFIT_DOCS_VERIFIED,
  CHARITY_APPROVAL,
  MRL_GENERATION
];

class Validator {
  constructor(data) {
    this.notificatonID = data.notificationId;
    this.sendTo = data.sendTo || null;
    this.actor = data.actor || null;
  }

  action(actionName) {
    this.activityType = actionName;
    return this;
  }

  type(type) {
    // console.log("type------------------->", type);
    if (NOTIFICATION_ENUM.indexOf(type) != -1) {
      this.notificationType = type;
      return this;
    } else {
      throw new Error("invalid notification type!!");
    }
  }

  async isValidReminderData() {
    try {
      let reminderData = {};
      if (
        this.activityType !== actionList.CREATE &&
        this.activityType !== actionList.DELETE_ALL
      ) {
        reminderData = await schedulerService.getScheduleEventById(
          this.notificatonID
        );
      } else {
        reminderData = await eventServices.getEventById(this.notificatonID);
      }
      if (isEmpty(reminderData)) throw new Error("no such appointment created");

      if (this.activityType === actionList.CREATE) {
        if (
          isEmpty(reminderData.eventCategory) ||
          reminderData.eventCategory.toLowerCase() != REMINDER
        )
          throw new Error("event doesn't belong to appointment category");

        if (isEmpty(reminderData.participantOne))
          throw new Error("no participant one data");
        if (isEmpty(reminderData.participantTwo))
          throw new Error("no participant two data");
      }

      let sendTo;

      let participantOneData = {};
      if (
        this.activityType === actionList.CREATE ||
        this.activityType === actionList.DELETE_ALL
      ) {
        participantOneData = await userServices.getUser({
          _id: reminderData.participantOne
        });
      } else {
        participantOneData = await userServices.getUser({
          _id: reminderData.data.participantOne
        });
      }

      let participantTwoData = {};
      if (
        this.activityType === actionList.CREATE ||
        this.activityType === actionList.DELETE_ALL
      ) {
        participantTwoData = await userServices.getUser({
          _id: reminderData.participantTwo
        });
      } else {
        participantTwoData = await userServices.getUser({
          _id: reminderData.data.participantTwo
        });
      }

      if (!isEmpty(this.sendTo)) {
        if (
          this.activityType === actionList.CREATE ||
          this.activityType === actionList.DELETE_ALL
        ) {
          if (
            [
              reminderData.participantOne.toString(),
              reminderData.participantTwo.toString()
            ].indexOf(this.sendTo.toString()) == -1
          )
            throw new Error("user is not participant for this reminder");
          sendTo = this.sendTo;
        } else {
          // if (
          //   [reminderData.data.participantOne.toString()].indexOf(
          //     this.sendTo.toString()
          //   ) == -1
          // )
          //   throw new Error("user is not participant for this appointment");
          sendTo = this.sendTo;
        }
        // appointmentData.participantOne.toString() == this.sendTo.toString()
        //   ? "participantOne"
        //   : "participantTwo";
      }

      // if (isEmpty(participantOneData))
      //   throw new Error("participant one doesn't exist");

      // if (isEmpty(participantTwoData))
      //   throw new Error("participant two doesn't exist");

      // if (isEmpty(reminderData.details))
      //   throw new Error("appointment details doesn't exist");

      // if (isEmpty(reminderData.details.startTime))
      //   throw new Error("startTime invalid or undefined");

      // if (isEmpty(reminderData.details.endTime))
      //   throw new Error("endTime invalid or undefined");

      let result = {
        ...reminderData,

        participantOneDetails: {
          name: participantOneData.name,
          category: participantOneData.category,
          contact: participantOneData.email,
          gender: participantOneData.gender,
          status: participantOneData.status
        },
        participantTwoDetails:
          participantTwoData !== null
            ? {
                name: participantTwoData.name,
                category: participantTwoData.category,
                contact: participantTwoData.email,
                gender: participantTwoData.gender,
                status: participantTwoData.status
              }
            : {},
        sendTo: sendTo,
        actor: this.actor
      };
      // console.log("result at validator app", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async isValidMedicationReminderData() {
    try {
      let medicationReminderData = {};
      if (
        this.activityType !== actionList.CREATE &&
        this.activityType !== actionList.DELETE_ALL
      ) {
        medicationReminderData = await schedulerService.getScheduleEventById(
          this.notificatonID
        );
      } else {
        medicationReminderData = await eventServices.getEventById(
          this.notificatonID
        );
      }
      if (isEmpty(medicationReminderData))
        throw new Error("no such appointment created");

      if (this.activityType === actionList.CREATE) {
        if (
          isEmpty(medicationReminderData.eventCategory) ||
          medicationReminderData.eventCategory.toLowerCase() !=
            MEDICATION_REMINDER
        )
          throw new Error("event doesn't belong to appointment category");
      }

      let sendTo;

      let participantOneData = {};
      if (
        this.activityType === actionList.CREATE ||
        this.activityType === actionList.DELETE_ALL
      ) {
        participantOneData = await userServices.getUser({
          _id: medicationReminderData.participantOne
        });
      } else {
        participantOneData = await userServices.getUser({
          _id: medicationReminderData.data.participantOne
        });
      }

      let participantTwoData = {};
      if (
        this.activityType === actionList.CREATE ||
        this.activityType === actionList.DELETE_ALL
      ) {
        participantTwoData = await userServices.getUser({
          _id: medicationReminderData.participantTwo
        });
      } else {
        participantTwoData = await userServices.getUser({
          _id: medicationReminderData.data.participantTwo
        });
      }

      if (!isEmpty(this.sendTo)) {
        if (
          this.activityType === actionList.CREATE ||
          this.activityType === actionList.DELETE_ALL
        ) {
          if (
            [
              medicationReminderData.participantOne.toString(),
              medicationReminderData.participantTwo.toString()
            ].indexOf(this.sendTo.toString()) == -1
          )
            throw new Error("user is not participant for this reminder");
          sendTo = this.sendTo;
        } else {
          sendTo = this.sendTo;
        }
        // appointmentData.participantOne.toString() == this.sendTo.toString()
        //   ? "participantOne"
        //   : "participantTwo";
      }

      // if (isEmpty(participantOneData))
      //   throw new Error("participant one doesn't exist");

      // if (isEmpty(participantTwoData))
      //   throw new Error("participant two doesn't exist");

      // if (isEmpty(medicationReminderData.details))
      //   throw new Error("appointment details doesn't exist");

      // if (isEmpty(medicationReminderData.details.startTime))
      //   throw new Error("startTime invalid or undefined");

      // if (isEmpty(medicationReminderData.details.endTime))
      //   throw new Error("endTime invalid or undefined");

      let result = {
        ...medicationReminderData,

        participantOneDetails: {
          name: participantOneData.name,
          category: participantOneData.category,
          contact: participantOneData.email,
          gender: participantOneData.gender,
          status: participantOneData.status
        },
        participantTwoDetails:
          participantTwoData !== null
            ? {
                name: participantTwoData.name,
                category: participantTwoData.category,
                contact: participantTwoData.email,
                gender: participantTwoData.gender,
                status: participantTwoData.status
              }
            : {},
        sendTo: sendTo,
        actor: this.actor
      };
      // console.log("result at validator app", result);
      if (this.activityType === actionList.START) {
        console.log(
          "sendTo.toString()",
          sendTo.toString(),
          medicationReminderData.data.participantOne.toString()
        );
        if (
          medicationReminderData.data.participantOne !== null &&
          sendTo.toString() ===
            medicationReminderData.data.participantOne.toString() &&
          participantOneData.category === USER_CATEGORY.CARE_COACH
        ) {
          return;
        } else if (
          medicationReminderData.data.participantTwo &&
          medicationReminderData.data.participantTwo !== null &&
          sendTo.toString() ===
            medicationReminderData.data.participantTwo.toString() &&
          participantTwoData.category === USER_CATEGORY.CARE_COACH
        ) {
          return;
        }
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async isValidAppointementData() {
    try {
      let appointmentData = {};
      if (
        this.activityType !== actionList.CREATE &&
        this.activityType !== actionList.DELETE_ALL
      ) {
        appointmentData = await schedulerService.getScheduleEventById(
          this.notificatonID
        );
      } else {
        appointmentData = await eventServices.getEventById(this.notificatonID);
      }
      // console.log(
      //   "appointment data",
      //   appointmentData,
      //   this.activityType === actionList.DELETE_ALL
      // );
      if (isEmpty(appointmentData))
        throw new Error("no such appointment created");
      if (
        this.activityType === actionList.CREATE ||
        this.activityType === actionList.DELETE_ALL
      ) {
        if (
          isEmpty(appointmentData.eventCategory) ||
          appointmentData.eventCategory.toLowerCase() != APPOINTMENT
        )
          throw new Error("event doesn't belong to appointment category");

        if (isEmpty(appointmentData.participantOne))
          throw new Error("no participant one data");
        if (isEmpty(appointmentData.participantTwo))
          throw new Error("no participant two data");
      }
      let sendTo;

      let participantOneData = {};

      if (
        this.activityType === actionList.CREATE ||
        this.activityType === actionList.DELETE_ALL
      ) {
        participantOneData = await userServices.getUser({
          _id: appointmentData.participantOne
        });
      } else {
        participantOneData = await userServices.getUser({
          _id: appointmentData.data.participantOne
        });
      }

      let participantTwoData = {};
      if (
        this.activityType === actionList.CREATE ||
        this.activityType === actionList.DELETE_ALL
      ) {
        participantTwoData = await userServices.getUser({
          _id: appointmentData.participantTwo
        });
      } else {
        participantTwoData = await userServices.getUser({
          _id: appointmentData.data.participantTwo
        });
      }
      if (!isEmpty(this.sendTo)) {
        if (
          this.activityType === actionList.CREATE ||
          this.activityType === actionList.DELETE_ALL
        ) {
          if (
            [
              appointmentData.participantOne.toString(),
              appointmentData.participantTwo.toString()
            ].indexOf(this.sendTo.toString()) == -1
          )
            throw new Error("user is not participant for this appointment");
          sendTo = this.sendTo;
        } else {
          if (
            [
              appointmentData.data.participantOne.toString(),
              appointmentData.data.participantTwo.toString()
            ].indexOf(this.sendTo.toString()) == -1
          )
            throw new Error("user is not participant for this appointment");
          sendTo = this.sendTo;
        }
        // appointmentData.participantOne.toString() == this.sendTo.toString()
        //   ? "participantOne"
        //   : "participantTwo";
      }

      // if (isEmpty(participantOneData))
      //   throw new Error("participant one doesn't exist");

      // if (isEmpty(participantTwoData))
      //   throw new Error("participant two doesn't exist");

      // if (isEmpty(appointmentData.details))
      //   throw new Error("appointment details doesn't exist");

      // if (isEmpty(appointmentData.details.startTime))
      //   throw new Error("startTime invalid or undefined");

      // if (isEmpty(appointmentData.details.endTime))
      //   throw new Error("endTime invalid or undefined");

      // if (isEmpty(appointmentData.details.activityMode))
      //   throw new Error("invalid or undefined activity mode");

      // if (isEmpty(appointmentData.details.activityType))
      //   throw new Error("invalid or undefined activity type");

      let result = {
        ...appointmentData,

        participantOneDetails: {
          name: participantOneData.name,
          category: participantOneData.category,
          contact: participantOneData.email,
          gender: participantOneData.gender,
          status: participantOneData.status
        },
        participantTwoDetails: {
          name: participantTwoData.name,
          category: participantTwoData.category,
          contact: participantTwoData.email,
          gender: participantTwoData.gender,
          status: participantTwoData.status
        },
        sendTo: sendTo,
        actor: this.actor
      };
      // console.log("result at validator app", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async isValidArticleData() {
    try {
      let appointmentData = await articleService.getArticleByArticleId(
        this.notificatonID
      );
      // console.log("appointment data", this);
      if (isEmpty(appointmentData))
        throw new Error("no such appointment created");

      let result = {
        ...appointmentData[0],
        sendTo: this.sendTo,
        actor: this.actor
      };
      // console.log("result at validator app", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async isValidSurveyData() {
    try {
      let surveyData = await SURVEY_SERVICE({
        _id: this.notificatonID
      }).get();
      // console.log("appointment data", this);
      if (isEmpty(surveyData)) throw new Error("no such survey created");

      let sendTo;

      sendTo = this.sendTo;
      // surveyData.participantOne.toString() == this.sendTo.toString()
      //   ? "participantOne"
      //   : "participantTwo";

      let result = {
        ...surveyData[0],

        sendTo: sendTo,
        actor: this.actor
      };
      // console.log("result at validator app", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async isValidPatientDischargeData() {
    let payload = !isEmpty(arguments) ? arguments[0] : { ...{}, ...this.data };
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
    try {
      let appointmentData = await eventServices.getEventById(
        this.notificatonID
      );
      // console.log("appointment data", this);
      if (isEmpty(appointmentData))
        throw new Error("no such appointment created");

      if (
        isEmpty(appointmentData.eventCategory) ||
        appointmentData.eventCategory.toLowerCase() != ADVERSE_EVENT
      )
        throw new Error("event doesn't belong to appointment category");

      if (isEmpty(appointmentData.participantOne))
        throw new Error("no participant one data");
      if (isEmpty(appointmentData.participantTwo))
        throw new Error("no participant two data");
      let sendTo;

      let participantOneData = await userServices.getUser({
        _id: appointmentData.participantOne
      });

      let participantTwoData = await userServices.getUser({
        _id: appointmentData.participantTwo
      });
      if (!isEmpty(this.sendTo)) {
        // if (
        //   [
        //     appointmentData.participantOne.toString(),
        //     appointmentData.participantTwo.toString()
        //   ].indexOf(this.sendTo.toString()) == -1
        // )
        //   throw new Error("user is not participant for this appointment");
        sendTo = this.sendTo;
        // appointmentData.participantOne.toString() == this.sendTo.toString()
        //   ? "participantOne"
        //   : "participantTwo";
      }

      let result = {
        ...appointmentData,

        sendTo: sendTo,
        actor: this.actor
      };
      // console.log("result at validator app", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async isValidVitalsData() {
    let medicalConditionData = await medicalConditionService.getMedicalDetailsForId(
      this.notificatonID
    );
    // console.log("appointment data", this);
    if (isEmpty(medicalConditionData))
      throw new Error("no such survey created");

    let sendTo;

    sendTo = this.sendTo;
    // medicalConditionData.participantOne.toString() == this.sendTo.toString()
    //   ? "participantOne"
    //   : "participantTwo";

    let result = {
      ...medicalConditionData[0],

      sendTo: sendTo,
      actor: this.actor
    };
    // console.log("result at validator app", result);
    return result;
  }

  async isValidBasicData() {
    let medicalConditionData = await medicalConditionService.getMedicalDetailsForId(
      this.notificatonID
    );
    // console.log("appointment data", this);
    if (isEmpty(medicalConditionData))
      throw new Error("no such survey created");

    let sendTo;

    sendTo = this.sendTo;
    // medicalConditionData.participantOne.toString() == this.sendTo.toString()
    //   ? "participantOne"
    //   : "participantTwo";

    let result = {
      ...medicalConditionData[0],

      sendTo: sendTo,
      actor: this.actor
    };
    // console.log("result at validator app", result);
    return result;
  }

  async isValidClinicalReadingData() {
    let medicalConditionData = await medicalConditionService.getMedicalDetailsForId(
      this.notificatonID
    );
    // console.log("appointment data", this);
    if (isEmpty(medicalConditionData))
      throw new Error("no such survey created");

    let sendTo;

    sendTo = this.sendTo;
    // medicalConditionData.participantOne.toString() == this.sendTo.toString()
    //   ? "participantOne"
    //   : "participantTwo";

    let result = {
      ...medicalConditionData[0],

      sendTo: sendTo,
      actor: this.actor
    };
    // console.log("result at validator app", result);
    return result;
  }

  async isValidMedicationData() {
    let medicalConditionData = await medicationService.getMedicationById(
      this.notificatonID
    );
    // console.log("appointment data", this);
    if (isEmpty(medicalConditionData))
      throw new Error("no such survey created");

    let sendTo;

    sendTo = this.sendTo;
    // medicalConditionData.participantOne.toString() == this.sendTo.toString()
    //   ? "participantOne"
    //   : "participantTwo";

    let result = {
      ...medicalConditionData[0],

      sendTo: sendTo,
      actor: this.actor
    };
    // console.log("result at validator app", result);
    return result;
  }

  async isValidPrescriptionData() {
    let payload = !isEmpty(arguments) ? arguments[0] : { ...{}, ...this.data };
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
    let payload = !isEmpty(arguments) ? arguments[0] : { ...{}, ...this.data };
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

  async isValidHospitalisationData() {
    let result;
    try {
      let hospitalozationData = await hospitalizationService.getHospitalizationById(
        this.notificatonID
      );
      // console.log("appointment data", this);
      if (isEmpty(hospitalozationData))
        throw new Error("no such survey created");

      let sendTo;

      sendTo = this.sendTo;
      // hospitalozationData.participantOne.toString() == this.sendTo.toString()
      //   ? "participantOne"
      //   : "participantTwo";

      result = {
        ...hospitalozationData,

        sendTo: sendTo,
        actor: this.actor
      };
      // console.log("result at validator app", result);
      return result;
    } catch (error) {
      console.log("error========================= :", error);
      result = false;
      return result;
    }
  }

  async isValidBenefitPlanData() {
    let result;
    try {
      let benefitPlanData = await benefitService.getBenefitPlanById(
        this.notificatonID
      );
      // console.log("appointment data", this);
      if (isEmpty(benefitPlanData)) throw new Error("no such survey created");

      let sendTo;

      sendTo = this.sendTo;
      // benefitPlanData.participantOne.toString() == this.sendTo.toString()
      //   ? "participantOne"
      //   : "participantTwo";

      result = {
        ...benefitPlanData,

        sendTo: sendTo,
        actor: this.actor
      };
      // console.log("result at validator app", result);
      return result;
    } catch (error) {
      console.log("error========================= :", error);
      result = false;
      return result;
    }
  }

  async isValidCharityAppliedData() {
    let result;
    try {
      const charityAppliedData = await charityAppliedservice.getContributionRequest(
        this.notificatonID
      );
      // console.log("appointment data", this);
      if (isEmpty(charityAppliedData))
        throw new Error("no such survey created");

      let sendTo;

      sendTo = this.sendTo;
      // benefitPlanData.participantOne.toString() == this.sendTo.toString()
      //   ? "participantOne"
      //   : "participantTwo";

      result = {
        ...charityAppliedData,

        sendTo: sendTo,
        actor: this.actor
      };
      // console.log("result at validator app", result);
      return result;
    } catch (error) {
      console.log("error========================= :", error);
      result = false;
      return result;
    }
  }

  async isValidDispensationData() {
    let result;
    try {
      const dispensationData = await dispensationService.getDispensationById(
        this.notificatonID
      );
      // console.log("appointment data", this);
      if (isEmpty(dispensationData)) throw new Error("no such survey created");

      let sendTo;

      sendTo = this.sendTo;
      // benefitPlanData.participantOne.toString() == this.sendTo.toString()
      //   ? "participantOne"
      //   : "participantTwo";

      result = {
        ...dispensationData,

        sendTo: sendTo,
        actor: this.actor
      };
      // console.log("result at validator app", result);
      return result;
    } catch (error) {
      console.log("error========================= :", error);
      result = false;
      return result;
    }
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
      case MEDICATION_REMINDER:
        return await this.isValidMedicationReminderData(notificatonID);
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
      case BASIC:
        return await this.isValidBasicData(notificatonID);
      case CLINICAL_READING:
        return await this.isValidClinicalReadingData(notificatonID);
      case MEDICATION:
        return await this.isValidMedicationData(notificatonID);
      case PROGRAM:
        return await this.isValidProgramData(notificatonID);
      case HOSPITALISATION:
        return await this.isValidHospitalisationData(notificatonID);
      case BENEFIT_DOCS_VERIFIED:
        return await this.isValidBenefitPlanData(notificatonID);
      case CHARITY_APPROVAL:
        return await this.isValidCharityAppliedData(notificatonID);
      case MRL_GENERATION:
        return await this.isValidDispensationData(notificatonID);
      default:
        throw new Error("invalid notification type");
    }
  }
}

module.exports = data => new Validator(data);
