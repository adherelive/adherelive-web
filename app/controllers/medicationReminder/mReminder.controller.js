import Controller from "../index";

import moment from "moment";

// Services
import userPreferenceService from "../../services/userPreferences/userPreference.service";
import medicationReminderService from "../../services/medicationReminder/mReminder.service";
import medicineService from "../../services/medicine/medicine.service";
import carePlanMedicationService from "../../services/carePlanMedication/carePlanMedication.service";

import carePlanService from "../../services/carePlan/carePlan.service";
import queueService from "../../services/awsQueue/queue.service";
import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";
import EventService from "../../services/scheduleEvents/scheduleEvent.service";

// Wrappers
import MedicationWrapper from "../../apiWrapper/web/medicationReminder";
import MedicineWrapper from "../../apiWrapper/web/medicine";
import CarePlanWrapper from "../../apiWrapper/web/carePlan";
import PatientWrapper from "../../apiWrapper/web/patient";

import UserPreferenceWrapper from "../../apiWrapper/web/userPreference";
import EventWrapper from "../../apiWrapper/common/scheduleEvents";

import * as medicationHelper from "./medication.helper";

import {
  CUSTOM_REPEAT_OPTIONS,
  DAYS,
  DOSE_AMOUNT,
  DOSE_UNIT,
  EVENT_STATUS,
  EVENT_TYPE,
  MEDICATION_TIMING,
  MEDICINE_FORMULATION,
  NOTIFICATION_STAGES,
  REPEAT_TYPE,
  WHEN_TO_TAKE_ABBREVATIONS,
} from "../../../constant";
import Log from "../../../libs/log";
import {
  getCarePlanAppointmentIds,
  getCarePlanMedicationIds,
  getCarePlanSeverityDetails,
} from "../carePlans/carePlan.helper";
import { RRule } from "rrule";
import MedicationJob from "../../jobSdk/Medications/observer";
import NotificationSdk from "../../notificationSdk";

const FILE_NAME = "WEB - MEDICATION REMINDER CONTROLLER";
const Logger = new Log(FILE_NAME);

const KEY_REPEAT_TYPE = "repeat_type";
const KEY_DAYS = "days";
const KEY_TIMING = "timings";
const KEY_DOSE = "dose";
const KEY_UNIT = "dose_unit";
const KEY_CUSTOM_REPEAT_OPTIONS = "custom_repeat_options";
const KEY_MEDICINE_TYPE = "medicine_type";

class MReminderController extends Controller {
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
      } = body;
      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryData: { basic_info: { full_name = "" } = {} } = {},
      } = userDetails || {};

      const medicineDetails = await medicineService.getMedicineById(
        medicine_id
      );

      const medicineApiWrapper = await MedicineWrapper(medicineDetails);

      const dataToSave = {
        participant_id: patient_id, // todo: patient_id
        organizer_type: category,
        organizer_id: userId,
        description,
        start_date,
        end_date,
        medicine_id,
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
          medication_stage,
          critical,
        },
      };

      const rrule = new RRule({
        freq: RRule.WEEKLY,
        dtstart: moment(start_time).utc().toDate(),
        until: moment(start_time).add(6, "months").utc().toDate(),
      });

      const mReminderDetails = await medicationReminderService.addMReminder(
        dataToSave
      );

      const patient = await PatientWrapper(null, patient_id);
      const { user_role_id: patientRoleId } = await patient.getAllInfo();

      const eventScheduleData = {
        patient_id: patient.getUserId(),
        type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: mReminderDetails.getId,
        details: mReminderDetails.getBasicInfo.details,
        status: EVENT_STATUS.SCHEDULED,
        start_date,
        end_date,
        when_to_take,
        participants: [userRoleId, patientRoleId],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
        // participant_one: patient.getUserId(),
        // participant_two: userId
      };

      const QueueService = new queueService();

      const sqsResponse = await QueueService.sendMessage(eventScheduleData);

      Logger.debug("sqsResponse ---> ", sqsResponse);

      return this.raiseSuccess(
        res,
        200,
        {
          medications: {
            [mReminderDetails.getId]: {
              basic_info: {
                ...mReminderDetails.getBasicInfo,
              },
            },
          },
          medicines: {
            [medicineApiWrapper.getMedicineId()]: {
              ...medicineApiWrapper.getBasicInfo(),
            },
          },
        },
        "Medication Reminder added successfully"
      );
    } catch (error) {
      return this.raiseServerError(res);
    }
  };

  createCarePlanMedication = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        body,
        userDetails,
        params: { patient_id, carePlanId: care_plan_id = 0 } = {},
      } = req;

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
        critical = false,
      } = body;

      const patient_temp = await PatientWrapper(null, patient_id);
      const { care_plan_id: care_plan_id_temp } =
        await patient_temp.getAllInfo();

      let flag_temp = true;
      const eachCareplan_temp = await CarePlanWrapper(null, care_plan_id_temp);
      const { medication_ids: medication_ids_temp } =
        await eachCareplan_temp.getAllInfo();

      for (let eachMId of medication_ids_temp) {
        const medicationWrapper_temp = await MedicationWrapper(null, eachMId);
        const basicInfoTemp = await medicationWrapper_temp.getBasicInfo();
        const {
          basic_info: {
            details: { medicine_id: medicine_id_temp = "" } = {},
          } = {},
        } = basicInfoTemp;
        if (medicine_id_temp === medicine_id) {
          flag_temp = false;
          break;
        }
      }

      if (flag_temp === false) {
        return raiseClientError(
          res,
          422,
          {},
          "Medication already added for the patient"
        );
      }

      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryData: { basic_info: { full_name = "" } = {} } = {},
      } = userDetails || {};

      const dataToSave = {
        participant_id: patient_id,
        organizer_type: category,
        organizer_id: userId,
        medicine_id,

        start_date,
        end_date,
        details: {
          medicine_id,
          description,
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
          critical,
        },
      };

      const mReminderDetails = await medicationReminderService.addMReminder(
        dataToSave
      );

      const medication = await MedicationWrapper(mReminderDetails);

      const data_to_create = {
        care_plan_id,
        medication_id: medication.getMReminderId(),
      };

      let newMedication = await carePlanMedicationService.addCarePlanMedication(
        data_to_create
      );

      let carePlan = await carePlanService.getCarePlanById(care_plan_id);

      let carePlanAppointmentIds = await getCarePlanAppointmentIds(
        care_plan_id
      );
      let carePlanMedicationIds = await getCarePlanMedicationIds(care_plan_id);
      let carePlanSeverityDetails = await getCarePlanSeverityDetails(
        care_plan_id
      );
      const carePlanApiWrapper = await CarePlanWrapper(carePlan);
      let carePlanApiData = {};

      carePlanApiData[carePlanApiWrapper.getCarePlanId()] = {
        ...(await carePlanApiWrapper.getAllInfo()),
        ...carePlanSeverityDetails,
        medication_ids: carePlanMedicationIds,
        appointment_ids: carePlanAppointmentIds,
      };

      const patient = await PatientWrapper(null, patient_id);
      const { user_role_id: patientRoleId } = await patient.getAllInfo();

      const when_to_take_abbr_int = when_to_take_abbr
        ? parseInt(when_to_take_abbr, 10)
        : when_to_take_abbr;

      const eventScheduleData = {
        patient_id: patient.getUserId(),
        type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: medication.getMReminderId(),
        details: medication.getDetails(),
        status: EVENT_STATUS.SCHEDULED,
        start_date,
        end_date,
        when_to_take,
        participants: [userRoleId, patientRoleId],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
        // participant_one: patient.getUserId(),
        // participant_two: userId
      };

      if (when_to_take_abbr_int !== WHEN_TO_TAKE_ABBREVATIONS.SOS) {
        const QueueService = new queueService();
        await QueueService.sendMessage(eventScheduleData);
      }

      const medicationJob = MedicationJob.execute(
        EVENT_STATUS.SCHEDULED,
        eventScheduleData
      );
      await NotificationSdk.execute(medicationJob);

      const medicine = await MedicineWrapper(null, medicine_id);

      return raiseSuccess(
        res,
        200,
        {
          care_plans: { ...carePlanApiData },
          ...(await medication.getAllInfo()),
          medicines: {
            [medicine.getMedicineId()]: medicine.getBasicInfo(),
          },
        },
        "Medication added successfully"
      );
    } catch (error) {
      Logger.debug("Add m-reminder error ---> ", error);
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
        when_to_take_abbr = null,
        medication_stage = "",
        description,
        start_time,
        participant_id,
        critical = false,
      } = body;
      const {
        userId,
        userRoleId,
        userData: { category } = {},
        userCategoryData: { basic_info: { full_name } = {} } = {},
      } = userDetails || {};

      const medicineDetails = await medicineService.getMedicineById(
        medicine_id
      );

      const medicineApiWrapper = await MedicineWrapper(medicineDetails);

      const dataToSave = {
        participant_id, // todo: patient_id
        organizer_type: category,
        organizer_id: userId,
        medicine_id,

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
          critical,
          description,
        },
      };

      const mReminderDetails = await medicationReminderService.updateMedication(
        dataToSave,
        id
      );

      const updatedMedicationDetails =
        await medicationReminderService.getMedication({ id });

      const medicationApiDetails = await MedicationWrapper(
        updatedMedicationDetails
      );

      const patient = await PatientWrapper(null, participant_id);
      const { user_role_id: patientRoleId } = await patient.getAllInfo();

      // 1. delete previous created events
      const scheduleEventService = new ScheduleEventService();
      await scheduleEventService.deleteBatch({
        event_id: id,
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
      });

      // 2. send sqs message to create new
      const eventScheduleData = {
        patient_id: patient.getUserId(),
        type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: medicationApiDetails.getMReminderId(),
        details: medicationApiDetails.getDetails(),
        status: EVENT_STATUS.SCHEDULED,
        start_date,
        end_date,
        when_to_take,
        participants: [userRoleId, patientRoleId],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
        // participant_one: patient.getUserId(),
        // participant_two: userId
      };

      const when_to_take_abbr_int = when_to_take_abbr
        ? parseInt(when_to_take_abbr, 10)
        : when_to_take_abbr;
      if (when_to_take_abbr_int !== WHEN_TO_TAKE_ABBREVATIONS.SOS) {
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
          medications: {
            [medicationApiDetails.getMReminderId()]: {
              ...medicationApiDetails.getBasicInfo(),
            },
          },
          medicines: {
            [medicineApiWrapper.getMedicineId()]: {
              ...medicineApiWrapper.getBasicInfo(),
            },
          },
        },
        "medication reminder updated successfully"
      );

      // await Proxy_Sdk.scheduleEvent({data: eventScheduleData});
    } catch (error) {
      return this.raiseServerError(res);
    }
  };

  getMedicationDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      // Logger.debug("test", medicationReminderDetails);
      const { params: { patient_id } = {}, userDetails: { userId } = {} } = req;
      Logger.info(`params: patient_id : ${patient_id}`);

      // if (!parseInt(patient_id)) {
      //   return raiseClientError(
      //     res,
      //     422,
      //     {},
      //     "Please select valid patient to continue"
      //   );
      // }

      let timings = {};

      if (parseInt(patient_id)) {
        const patient = await PatientWrapper(null, patient_id);
        const timingPreference =
          await userPreferenceService.getPreferenceByData({
            user_id: patient.getUserId(),
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
        [KEY_MEDICINE_TYPE]: MEDICINE_FORMULATION,
      };

      return raiseSuccess(
        res,
        200,
        {
          ...medicationReminderDetails,
        },
        "create medication basic details"
      );
    } catch (error) {
      Logger.debug("Get m-reminder details error ---> ", error);
      return raiseServerError(res);
    }
  };

  getMedicationForId = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;

      const medicationDetails =
        await medicationReminderService.getMedicationsForParticipant({
          participant_id: id,
        });

      let medicationApiData = {};

      let event_ids = [];
      let medicine_ids = [];
      for (let medication of medicationDetails) {
        const medicationWrapper = await MedicationWrapper(medication);
        const { medications } = await medicationWrapper.getAllInfoNew();
        medicationApiData = { ...medicationApiData, ...medications };
        event_ids.push(medicationWrapper.getMReminderId());
        medicine_ids.push(medicationWrapper.getMedicineId());
      }
      const currentDate = moment().endOf("day").utc().toDate();

      let eventScheduleService = new ScheduleEventService();

      let scheduleEvents = await eventScheduleService.getAllPreviousByDataM({
        event_id: event_ids,
        date: currentDate,
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
      });
      let scheduleEventIds = [];
      let latestPendingEventId = {};
      // let remaining = 0;
      let total_count = {};
      let remaining = {};
      for (const events of scheduleEvents) {
        if (total_count[events["event_id"]])
          total_count[events["event_id"]] += 1;
        else total_count[events["event_id"]] = 1;

        const scheduleEvent = await EventWrapper(events);

        scheduleEventIds.push(scheduleEvent.getScheduleEventId());

        if (scheduleEvent.getStatus() !== EVENT_STATUS.COMPLETED) {
          if (!latestPendingEventId) {
            latestPendingEventId = scheduleEvent.getScheduleEventId();
          }
          if (remaining[events["event_id"]]) remaining[events["event_id"]] += 1;
          else remaining[events["event_id"]] = 1;
        }

        if (events["event_id"]) {
          medicationApiData[events["event_id"]]["remaining"] =
            remaining[events["event_id"]];
          medicationApiData[events["event_id"]]["total"] =
            total_count[events["event_id"]];
          medicationApiData[events["event_id"]]["upcoming_event_id"] =
            latestPendingEventId;
        }
      }

      let medicins = await medicineService.getMedicineByIds(medicine_ids);

      return raiseSuccess(
        res,
        200,
        {
          medications: {
            ...medicationApiData,
          },
          medicins,
        },
        "medications fetched successfully"
      );
    } catch (error) {
      console.log(error);
      return raiseServerError(res);
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
          userCategoryData: { basic_info: { full_name } = {} } = {},
        } = {},
      } = req;

      const medication = await MedicationWrapper(null, id);
      const carePlanMedicationDetails =
        await carePlanMedicationService.deleteCarePlanMedicationByMedicationId(
          id
        );

      const medicationDetails =
        await medicationReminderService.deleteMedication(id);

      // 1. delete previous created events
      const scheduleEventService = new ScheduleEventService();
      await scheduleEventService.deleteBatch({
        event_id: id,
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
      });

      const patient = await PatientWrapper(null, medication.getParticipant());

      const { user_role_id: patientRoleId } = await patient.getAllInfo();

      const eventScheduleData = {
        type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: medication.getMReminderId(),
        details: medication.getDetails(),
        participants: [userRoleId, patientRoleId],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
      };

      const medicationJob = MedicationJob.execute(
        NOTIFICATION_STAGES.DELETE,
        eventScheduleData
      );
      await NotificationSdk.execute(medicationJob);

      return raiseSuccess(res, 200, {}, "medication deleted successfully");
    } catch (error) {
      Logger.debug("deleteMedication error", error);
      return raiseServerError(res);
    }
  };

  // getAllMissedMedications = async (req, res) => {
  //   const { raiseSuccess, raiseServerError } = this;
  //   try {
  //     /*
  //      * flow:
  //      * get careplans for auth user (doctor)
  //      * from careplans, fetch all medication | appointment | vital ids
  //      *
  //      * for the same ids, fetch scheduleEvents based on event_id and event_type that are expired
  //      *
  //      * then proceed with the filter of critical and noncritical based on critical column in schedule events 0 -> false 1 -> true
  //      *
  //      * other:
  //      *   follow snake casing for response as followed across the apis
  //      *
  //      *
  //      * */

  //     const { body, userDetails } = req;

  //     const {
  //       userRoleId = null ,
  //       userId,
  //       userData: { category } = {},
  //       userCategoryData: { basic_info: { id: doctorId } = {} } = {}
  //     } = userDetails || {};

  //     let docAllCarePlanData = [];
  //     let medicationApiData = {};
  //     let flag = true;
  //     let criticalMedicationEventIds = [];
  //     let nonCriticalMedicationEventIds = [];
  //     const scheduleEventService = new ScheduleEventService();

  //     docAllCarePlanData = await carePlanService.getCarePlanByData({
  //       user_role_id : userRoleId
  //     });

  //     // Logger.debug("786756465789",docAllCarePlanData);

  //     for (let carePlan of docAllCarePlanData) {
  //       const carePlanApiWrapper = await CarePlanWrapper(carePlan);
  //       const { medication_ids } = await carePlanApiWrapper.getAllInfo();

  //       for (let mId of medication_ids) {
  //         // Logger.debug("87657898763545",medication_ids);

  //         let expiredMedicationsList = await scheduleEventService.getAllEventByData(
  //           {
  //             event_type: EVENT_TYPE.MEDICATION_REMINDER,
  //             status: EVENT_STATUS.EXPIRED,
  //             event_id: mId
  //           }
  //         );

  //         for (let medication of expiredMedicationsList) {
  //           const medicationEventWrapper = await EventWrapper(medication);
  //           // Logger.debug("8976756576890",medicationEventWrapper);

  //           if (medicationEventWrapper.getCriticalValue()) {
  //             if (
  //               !criticalMedicationEventIds.includes(
  //                 medicationEventWrapper.getEventId()
  //               )
  //             ) {
  //               criticalMedicationEventIds.push(
  //                 medicationEventWrapper.getEventId()
  //               );
  //             }
  //           } else {
  //             if (
  //               !nonCriticalMedicationEventIds.includes(
  //                 medicationEventWrapper.getEventId()
  //               )
  //             ) {
  //               nonCriticalMedicationEventIds.push(
  //                 medicationEventWrapper.getEventId()
  //               );
  //             }
  //           }

  //           medicationApiData[
  //             medicationEventWrapper.getEventId()
  //           ] = medicationEventWrapper.getDetails();
  //         }
  //       }
  //     }

  //     if (
  //       Object.keys(medicationApiData).length === 0 &&
  //       medicationApiData.constructor === Object
  //     ) {
  //       flag = false;
  //     }

  //     if (flag === true) {
  //       return raiseSuccess(
  //         res,
  //         200,
  //         {
  //           missed_medication_events: {
  //             ...medicationApiData
  //           },
  //           critical_medication_event_ids: criticalMedicationEventIds,
  //           non_critical_medication_event_ids: nonCriticalMedicationEventIds
  //         },
  //         `Missed medications fetched successfully`
  //       );
  //     } else {
  //       return raiseSuccess(res, 201, {}, "No Missed Medications");
  //     }
  //   } catch (error) {
  //     Logger.debug("getMedicationDetails 500 error ", error);
  //     return raiseServerError(res);
  //   }
  // };

  getMedicationResponseTimeline = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      Logger.debug("req.params medication id ---> ", req.params);
      const { params: { id } = {} } = req;
      const eventService = new EventService();

      const today = moment().utc().toISOString();

      const medication = await MedicationWrapper(null, id);

      const completeEvents = await eventService.getAllPassedByData({
        event_id: id,
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
        date: medication.getStartDate(),
        sort: "DESC",
      });

      let dateWiseMedicationData = {};

      const timelineDates = [];

      if (completeEvents.length > 0) {
        for (const scheduleEvent of completeEvents) {
          const event = await EventWrapper(scheduleEvent);
          if (dateWiseMedicationData.hasOwnProperty(event.getDate())) {
            dateWiseMedicationData[event.getDate()].push(event.getAllInfo());
          } else {
            dateWiseMedicationData[event.getDate()] = [];
            dateWiseMedicationData[event.getDate()].push(event.getAllInfo());
            timelineDates.push(event.getDate());
          }
        }

        return raiseSuccess(
          res,
          200,
          {
            medication_timeline: {
              ...dateWiseMedicationData,
            },
            medication_date_ids: timelineDates,
          },
          "Medication responses fetched successfully"
        );
      } else {
        return raiseSuccess(
          res,
          200,
          {},
          "No response updated yet for the medication"
        );
      }
    } catch (error) {
      Logger.debug("getMedicationResponse 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new MReminderController();
