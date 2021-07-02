import Controller from "../../index";
import moment from "moment";

import {
  EVENT_STATUS,
  EVENT_TYPE,
  REPEAT_TYPE,
  // DAYS_MOBILE,
  MEDICATION_TIMING,
  DOSE_AMOUNT,
  DOSE_UNIT,
  CUSTOM_REPEAT_OPTIONS,
  // MEDICINE_FORM_TYPE,
  USER_CATEGORY,
  NOTIFICATION_STAGES, DAYS, MEDICINE_FORMULATION,
  WHEN_TO_TAKE_ABBREVATIONS
} from "../../../../constant";
import Log from "../../../../libs/log";
// import { Proxy_Sdk } from "../../proxySdk";
import medicineService from "../../../services/medicine/medicine.service";
import {
  getCarePlanAppointmentIds,
  getCarePlanMedicationIds,
  getCarePlanSeverityDetails
} from "../../carePlans/carePlanHelper";
import MedicationJob from "../../../JobSdk/Medications/observer";
import NotificationSdk from "../../../NotificationSdk";

// SERVICES...
import doctorService from "../../../services/doctor/doctor.service";
import queueService from "../../../services/awsQueue/queue.service";
import ScheduleEventService from "../../../services/scheduleEvents/scheduleEvent.service";
import medicationReminderService from "../../../services/medicationReminder/mReminder.service";
import carePlanService from "../../../services/carePlan/carePlan.service";
import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";
import userPreferenceService from "../../../services/userPreferences/userPreference.service";

// WRAPPERS...
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";
import MobileMReminderWrapper from "../../../ApiWrapper/mobile/medicationReminder";
import MedicineApiWrapper from "../../../ApiWrapper/mobile/medicine";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import MedicationWrapper from "../../../ApiWrapper/mobile/medicationReminder";
import UserPreferenceWrapper from "../../../ApiWrapper/mobile/userPreference";

import * as medicationHelper from "../../medicationReminder/medicationHelper";

const FILE_NAME = "MOBILE - MEDICATION REMINDER CONTROLLER";
const Logger = new Log(FILE_NAME);

const KEY_REPEAT_TYPE = "repeat_type";
const KEY_DAYS = "days";
const KEY_TIMING = "timings";
const KEY_DOSE = "dose";
const KEY_UNIT = "dose_unit";
const KEY_CUSTOM_REPEAT_OPTIONS = "custom_repeat_options";
const KEY_MEDICINE_TYPE = "medicine_type";

class MobileMReminderController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    try {
      const { body, userDetails, params: { patient_id } = {} } = req;
      // todo: get patient_id from url
      const {
        start_date,
        end_date,
        repeat,
        repeat_days = [],
        repeat_interval = 0,
        medicine_id,
        medicine_type,
        quantity,
        strength,
        unit,
        when_to_take,
        medication_stage = "",
        description,
        start_time,
        critical = false,
        care_plan_id = null
      } = body;
      const {
        userId,
        userData: { category } = {},
        userCategoryData: { basic_info: { full_name = "" } = {} } = {}
      } = userDetails || {};

      // const {text: doseUnit} = DOSE_UNIT[unit] || {};
      // const {text, time} = MEDICATION_TIMING[when_to_take] || {};
      // const whenToTake = `${text}(${time})`;

      const repeatDays = repeat_days.map(day => day.substring(0, 3));

      // const medicineDetails = await medicineService.getMedicineByData({id: medicine_id});

      // const medicineWrapper = new MedicineApiWrapper(medicineDetails);
      // const medicine = "test medicine";

      const dataToSave = {
        participant_id: patient_id, // todo: patient_id
        organizer_type: category,
        organizer_id: userId,
        medicine_id,
        description,
        start_date,
        end_date,
        details: {
          medicine_id,
          medicine_type,
          start_time: start_time ? start_time : moment(),
          end_time: start_time ? start_time : moment(),
          repeat: REPEAT_TYPE[repeat] || "weekly",
          repeat_days: repeatDays,
          repeat_interval,
          quantity,
          strength,
          unit,
          when_to_take,
          medication_stage,
          critical
        }
      };

      const mReminderDetails = await medicationReminderService.addMReminder(
        dataToSave
      );

      const mReminderApiWrapper = await MobileMReminderWrapper(
        mReminderDetails
      );

      if (care_plan_id) {
        const data_to_create = {
          care_plan_id,
          medication_id: mReminderDetails.get("id")
        };

        let newMedication = await carePlanMedicationService.addCarePlanMedication(
          data_to_create
        );
      }

      // to update later
      const patient = await PatientWrapper(null, patient_id);

      let categoryData = null;
      if (category === USER_CATEGORY.DOCTOR) {
        const doctor = await doctorService.getDoctorByData({ user_id: userId });
        categoryData = await DoctorWrapper(doctor);
      }

      const eventData = {
        participants: [userId, patient.getUserId()],
        actor: {
          id: userId,
          details: {
            name: categoryData.getName(),
            category
          }
        },
        medicationId: mReminderApiWrapper.getMReminderId(),
        event_id: mReminderApiWrapper.getMReminderId()
      };

      let details = mReminderDetails.getBasicInfo.details;
      details = { ...details, ...eventData };

      const eventScheduleData = {
        patient_id: patient.getUserId(),
        type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: mReminderDetails.getId,
        details,
        status: EVENT_STATUS.SCHEDULED,
        start_date,
        end_date,
        when_to_take,
        // participant_one: patient.getUserId(),
        // participant_two: userId
      };

      const QueueService = new queueService();

      const sqsResponse = await QueueService.sendMessage(
        eventScheduleData
      );

      Logger.debug("sqsResponse ---> ", sqsResponse);

      const medicationJob = MedicationJob.execute(
        EVENT_STATUS.SCHEDULED,
        eventData
      );
      await NotificationSdk.execute(medicationJob);

      Logger.debug("medicationJob ---> ", medicationJob.getInAppTemplate());

      return this.raiseSuccess(
        res,
        200,
        {
          ...mReminderApiWrapper.getBasicInfo()
        },
        "medication reminder added successfully"
      );

      // await Proxy_Sdk.scheduleEvent({data: eventScheduleData});
    } catch (error) {
      console.log("Add m-reminder error ----> ", error);
      return this.raiseServerError(
        res,
        500,
        error.message,
        "something went wrong"
      );
    }
  };

  createCarePlanMedication = async (req, res) => {
    try {
      const { body, userDetails, params: { patient_id } = {} } = req;

      // todo: get patient_id from url
      const {
        start_date,
        end_date,
        repeat,
        repeat_days,
        repeat_interval = 0,
        medicine_id,
        medicine_type,
        quantity,
        strength,
        unit,
        when_to_take,
        medication_stage = "",
        description,
        start_time,
        critical = false,
        care_plan_id = 0,
        when_to_take_abbr= null
      } = body;
      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryData: { basic_info: { full_name = "" } = {} } = {}
      } = userDetails || {};

      const medicineDetails = await medicineService.getMedicineById(
        medicine_id
      );

      const medicineApiWrapper = await MedicineApiWrapper(medicineDetails);
      
      const dataToSave = {
        participant_id: patient_id, // todo: patient_id
        organizer_type: category,
        organizer_id: userId,
        medicine_id,
        description,
        start_date,
        end_date,
        details: {
          medicine_id,
          medicine_type,
          start_time: start_time ? start_time : moment(),
          end_time: start_time ? start_time : moment(),
          repeat,
          repeat_days,
          repeat_interval,
          quantity,
          strength,
          unit,
          when_to_take,
          when_to_take_abbr,
          medication_stage,
          critical
        }
      };
      
      const mReminderDetails = await medicationReminderService.addMReminder(
        dataToSave
      );

      let carePlanApiData = {};

      if (care_plan_id) {
        const data_to_create = {
          care_plan_id,
          medication_id: mReminderDetails.get("id")
        };

        const newMedication = await carePlanMedicationService.addCarePlanMedication(
          data_to_create
        );
        const carePlan = await carePlanService.getCarePlanById(care_plan_id);

        const carePlanAppointmentIds = await getCarePlanAppointmentIds(
          care_plan_id
        );
        const carePlanMedicationIds = await getCarePlanMedicationIds(
          care_plan_id
        );
        const carePlanSeverityDetails = await getCarePlanSeverityDetails(
          care_plan_id
        );
        const carePlanApiWrapper = await CarePlanWrapper(carePlan);

        carePlanApiData[carePlanApiWrapper.getCarePlanId()] = {
          ...(await carePlanApiWrapper.getAllInfo()),
          ...carePlanSeverityDetails,
          carePlanMedicationIds,
          carePlanAppointmentIds
        };
      }

      // to update later
      const patient = await PatientWrapper(null, patient_id);

      let categoryData = null;
      if (category === USER_CATEGORY.DOCTOR) {
        const doctor = await doctorService.getDoctorByData({ user_id: userId });
        categoryData = await DoctorWrapper(doctor);
      }

      const eventData = {
        participants: [userId, patient.getUserId()],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: {
            name: categoryData.getName(),
            category
          }
        },
        medicationId: mReminderDetails.get("id"),
        event_id: mReminderDetails.get("id"),
      };

      let details = mReminderDetails.getBasicInfo.details;
      details = { ...details, ...eventData };

      const when_to_take_abbr_int = when_to_take_abbr? parseInt(when_to_take_abbr, 10): when_to_take_abbr;
      if(when_to_take_abbr_int !== WHEN_TO_TAKE_ABBREVATIONS.SOS) {
        const eventScheduleData = {
          patient_id: patient.getUserId(),
          type: EVENT_TYPE.MEDICATION_REMINDER,
          event_id: mReminderDetails.getId,
          details,
          status: EVENT_STATUS.SCHEDULED,
          start_date,
          end_date,
          when_to_take,
          participants: [userId, patient.getUserId()],
          actor: {
            id: userId,
            user_role_id: userRoleId,
            details: { name: full_name, category }
          },
          // participant_one: patient.getUserId(),
          // participant_two: userId
        };
  
        const QueueService = new queueService();
        const sqsResponse = await QueueService.sendMessage(eventScheduleData);
      }

      const medicationJob = MedicationJob.execute(
        EVENT_STATUS.SCHEDULED,
        eventData
      );
      await NotificationSdk.execute(medicationJob);

      return this.raiseSuccess(
        res,
        200,
        {
          care_plans: { ...carePlanApiData },
          medications: {
            [mReminderDetails.getId]: {
              basic_info: {
                ...mReminderDetails.getBasicInfo
              }
            }
          },
          medicines: {
            [medicineApiWrapper.getMedicineId()]: {
              ...medicineApiWrapper.getBasicInfo()
            }
          }
        },
        "medication reminder added successfully"
      );

      // await Proxy_Sdk.scheduleEvent({data: eventScheduleData});
    } catch (error) {
      Logger.debug("Add medication error", error);
      return this.raiseServerError(
        res,
      );
    }
  };

  getMedicationDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { patient_id } = {}, userDetails: { userId } = {} } = req;
      Logger.info(`params: patient_id : ${patient_id}`);

      // if (!parseInt(patient_id)) {
      //   return raiseClientError(
      //       res,
      //       422,
      //       {},
      //       "Please select valid patient to continue"
      //   );
      // }
      let timings = {};


      if(parseInt(patient_id) !== 0) {
        const patient = await PatientWrapper(null, patient_id);
        const timingPreference = await userPreferenceService.getPreferenceByData({
          user_id: patient.getUserId()
        });
        const options = await UserPreferenceWrapper(timingPreference);
        const { timings: userTimings = {} } = options.getAllDetails();

        const medicationTimings = medicationHelper.getTimings(userTimings);

        medicationTimings.sort((activityA, activityB) => {
          const { time: a } = activityA || {};
          const { time: b } = activityB || {};
          if (moment(a).isBefore(moment(b))) return -1;

          if (moment(a).isAfter(moment(b))) return 1;
        });

        medicationTimings.forEach((timing, index) => {
          timings[`${index + 1}`] = timing;
        });
      } else {
        timings = MEDICATION_TIMING;
      }

      const medicationReminderDetails = {
        [KEY_REPEAT_TYPE]: REPEAT_TYPE,
        [KEY_DAYS]: DAYS,
        [KEY_TIMING]: timings,
        [KEY_DOSE]: DOSE_AMOUNT,
        [KEY_UNIT]: DOSE_UNIT,
        [KEY_CUSTOM_REPEAT_OPTIONS]: CUSTOM_REPEAT_OPTIONS,
        [KEY_MEDICINE_TYPE]: MEDICINE_FORMULATION
      };
      return raiseSuccess(
        res,
        200,
        {
          ...medicationReminderDetails
        },
        "create medication basic details"
      );
    } catch (error) {
      console.log("Get m-reminder details error ----> ", error);
      return raiseServerError(res, 500, error.message, "something went wrong");
    }
  };

  getMedicationForId = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;

      const medicationDetails = await medicationReminderService.getMedicationsForParticipant(
        { participant_id: id }
      );

      // console.log("712367132 medicationDetails --> ", medicationDetails);
      // Logger.debug("medication details", medicationDetails);

      let medicationApiData = {};
      let scheduleEventApiData = {};
      let medicineId = [];

      for (const medication of medicationDetails) {
        const medicationWrapper = await MobileMReminderWrapper(medication);
        const {
          medications,
          schedule_events
        } = await medicationWrapper.getReferenceInfo();
        medicationApiData = { ...medicationApiData, ...medications };
        scheduleEventApiData = { ...scheduleEventApiData, ...schedule_events };
        medicineId.push(medicationWrapper.getMedicineId());
      }

      Logger.debug("medicineId", medicationDetails);

      const medicineData = await medicineService.getMedicineById({
        id: medicineId
      });

      let medicineApiData = {};

      if (medicineData !== null) {
        const medicineWrapper = await MedicineApiWrapper(medicineData);
        medicineApiData[
          medicineWrapper.getMedicineId()
        ] = medicineWrapper.getBasicInfo();
      }

      Logger.debug("medicineData", medicineData);

      return raiseSuccess(
        res,
        200,
        {
          medications: {
            ...medicationApiData
          },
          medicines: {
            ...medicineApiData
          },
          schedule_events: {
            ...scheduleEventApiData
          }
        },
        "Medications fetched successfully"
      );
    } catch (error) {
      Logger.debug("500 error ", error);
      return raiseServerError(res);
    }
  };

  update = async (req, res) => {
    try {
      const { body, userDetails, params: { id } = {} } = req;
      // todo: get patient_id from url
      const {
        start_date,
        end_date,
        repeat,
        repeat_days,
        repeat_interval = 0,
        medicine_id,
        medicine_type,
        quantity,
        strength,
        unit,
        when_to_take,
        when_to_take_abbr,
        medication_stage = "",
        description,
        start_time,
        participant_id,
        critical = false
      } = body;
      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryData: { basic_info: { full_name } = {} } = {}
      } = userDetails || {};

      const dataToSave = {
        participant_id, // todo: patient_id
        organizer_type: category,
        organizer_id: userId,
        medicine_id,
        description,
        start_date,
        end_date,
        details: {
          medicine_id,
          medicine_type,
          start_time: start_time ? start_time : moment(),
          end_time: start_time ? start_time : moment(),
          repeat,
          repeat_days,
          repeat_interval,
          quantity,
          strength,
          unit,
          when_to_take,
          when_to_take_abbr,
          medication_stage,
          critical
        }
      };

      const mReminderDetails = await medicationReminderService.updateMedication(
        dataToSave,
        id
      );

      const updatedMedicationDetails = await medicationReminderService.getMedication(
        { id }
      );

      const medicationApiDetails = await MobileMReminderWrapper(
        updatedMedicationDetails
      );

      // 1. delete previous medications
      const scheduleEventService = new ScheduleEventService();
      await scheduleEventService.deleteBatch({
        event_id: id,
        event_type: EVENT_TYPE.MEDICATION_REMINDER
      });

      const patient = await PatientWrapper(null, participant_id);

      // 2. update new sqs message
      const eventScheduleData = {
        patient_id: patient.getUserId(),
        type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: medicationApiDetails.getMReminderId(),
        details: medicationApiDetails.getDetails(),
        status: EVENT_STATUS.SCHEDULED,
        start_date,
        end_date,
        when_to_take,
        participants: [userId, patient.getUserId()],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category }
        },
        // participant_one: patient.getUserId(),
        // participant_two: userId
      };

      const when_to_take_abbr_int = when_to_take_abbr? parseInt(when_to_take_abbr, 10): when_to_take_abbr;
      if(when_to_take_abbr_int !== WHEN_TO_TAKE_ABBREVATIONS.SOS) {
        const QueueService = new queueService();
        await QueueService.sendMessage(eventScheduleData);
      }


      const medicationJob = MedicationJob.execute(
        NOTIFICATION_STAGES.UPDATE,
        eventScheduleData
      );
      await NotificationSdk.execute(medicationJob);

      return this.raiseSuccess(
        res,
        200,
        {
          ...(await medicationApiDetails.getReferenceInfo())
        },
        "Medication updated successfully"
      );
    } catch (error) {
      Logger.debug("update m-reminder error", error);
      return this.raiseServerError(res);
    }
  };

  delete = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        params: { id } = {},
        userDetails: {
          userId,
          userRoleId,
          userData: { category } = {},
          userCategoryData: { basic_info: { full_name } = {} } = {}
        } = {}
      } = req;
      const medication = await MedicationWrapper(null, id);
      const carePlanMedicationDetails = await carePlanMedicationService.deleteCarePlanMedicationByMedicationId(
        id
      );

      const medicationDetails = await medicationReminderService.deleteMedication(
        id
      );

      const scheduleEventService = new ScheduleEventService();
      await scheduleEventService.deleteBatch({
        event_id: id,
        event_type: EVENT_TYPE.MEDICATION_REMINDER
      });

      const patient = await PatientWrapper(null, medication.getParticipant());

      const eventScheduleData = {
        type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: medication.getMReminderId(),
        details: medication.getDetails(),
        participants: [userId, patient.getUserId()],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category }
        },
      };

      const medicationJob = MedicationJob.execute(
        NOTIFICATION_STAGES.DELETE,
        eventScheduleData
      );
      await NotificationSdk.execute(medicationJob);

      return raiseSuccess(res, 200, {}, "Medication deleted successfully");
    } catch (error) {
      Logger.debug("delete m-reminder error", error);
      return raiseServerError(res);
    }
  };

  getMedicationEventsStatus = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { patient_id } = {} } = req;

      const medicationDetails = await medicationReminderService.getMedicationsForParticipant(
        { participant_id: patient_id }
      );

      let medicationScheduleEventResponse = {};

      for (const medication of medicationDetails) {
        const medicationWrapper = await MobileMReminderWrapper(medication);
        const { schedule_events } = await medicationWrapper.getReferenceInfo();

        const eventIds = Object.keys(schedule_events);
        let medicationEventRunRate = [];
        for (const eventId of eventIds) {
          const {
            [eventId]: { status = null }
          } = schedule_events;
          medicationEventRunRate.push(status);
        }

        medicationScheduleEventResponse = {
          ...medicationScheduleEventResponse,
          ...{ [medicationWrapper.getMReminderId()]: medicationEventRunRate }
        };
      }

      Logger.debug(
        "medicationScheduleEventResponse: ",
        medicationScheduleEventResponse
      );

      return raiseSuccess(
        res,
        200,
        {
          medication_event_status: {
            ...medicationScheduleEventResponse
          }
        },
        "Medications status fetched successfully"
      );
    } catch (error) {
      Logger.debug("getMedicationEventsStatus 500 error: ", error);
      return raiseServerError(res);
    }
  };
}

export default new MobileMReminderController();
