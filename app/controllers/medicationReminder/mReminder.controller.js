import Controller from "../index";
import moment from "moment";
import medicationReminderService from "../../services/medicationReminder/mReminder.service";
import medicineService from "../../services/medicine/medicine.service";
import carePlanMedicationService from "../../services/carePlanMedication/carePlanMedication.service";
import MedicationWrapper from "../../ApiWrapper/web/medicationReminder";
import MedicineWrapper from "../../ApiWrapper/web/medicine";
import carePlanService from "../../services/carePlan/carePlan.service";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import {
  CUSTOM_REPEAT_OPTIONS,
  DAYS,
  DOSE_AMOUNT,
  DOSE_UNIT,
  EVENT_STATUS,
  EVENT_TYPE,
  MEDICATION_TIMING,
  REPEAT_TYPE,
  MEDICINE_FORM_TYPE
} from "../../../constant";
import Log from "../../../libs/log";
import {getCarePlanAppointmentIds,getCarePlanMedicationIds,getCarePlanSeverityDetails} from '../carePlans/carePlanHelper'
import {RRule} from "rrule";
import EventSchedule from "../../eventSchedules";

const FILE_NAME = "WEB - MEDICATION REMINDER CONTROLLER";
const Logger = new Log(FILE_NAME);

const KEY_REPEAT_TYPE = "repeat_type";
const KEY_DAYS = "days";
const KEY_TIMING = "timings";
const KEY_DOSE = "dose";
const KEY_UNIT = "dose_unit";
const KEY_CUSTOM_REPEAT_OPTIONS = "custom_repeat_options";
const KEY_MEDICINE_TYPE = "medicine_type";

const medicationReminderDetails = {
  [KEY_REPEAT_TYPE]: REPEAT_TYPE,
  [KEY_DAYS]: DAYS,
  [KEY_TIMING]: MEDICATION_TIMING,
  [KEY_DOSE]: DOSE_AMOUNT,
  [KEY_UNIT]: DOSE_UNIT,
  [KEY_CUSTOM_REPEAT_OPTIONS]: CUSTOM_REPEAT_OPTIONS,
  [KEY_MEDICINE_TYPE]: MEDICINE_FORM_TYPE
};

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
        critical = false
      } = body;
      const { userId, userData: { category } = {} } = userDetails || {};

      const medicineDetails = await medicineService.getMedicineById(medicine_id);

      console.log("medicineDetails **********--------> ",
        description,
        start_time);

      const medicineApiWrapper = await MedicineWrapper(medicineDetails);

      const dataToSave = {
        participant_id: patient_id, // todo: patient_id
        organizer_type: category,
        organizer_id: userId,
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
          medication_stage,
          critical
        }
      };

      Logger.debug("startdate ---> ", moment(start_time).utc().toDate());
      const rrule = new RRule({
        freq: RRule.WEEKLY,
        dtstart: moment(start_time).utc().toDate(),
        until: moment(start_time).add(6,'months').utc().toDate()
      });

      Logger.debug("rrule ----> ", rrule.all());

      const mReminderDetails = await medicationReminderService.addMReminder(
        dataToSave
      );

      // const eventScheduleData = {
      //   event_type: EVENT_TYPE.MEDICATION_REMINDER,
      //   event_id: mReminderDetails.id,
      //   data: mReminderDetails.getBasicInfo,
      //   status: EVENT_STATUS.PENDING,
      //   start_time,
      //   end_time: start_time
      // };

      EventSchedule.create({
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: mReminderDetails.getId,
        details: mReminderDetails.getBasicInfo,
        status: EVENT_STATUS.SCHEDULED,
        start_date,
        end_date,
      });

      return this.raiseSuccess(
        res,
        200,
        {
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
      console.log("Add m-reminder error ----> ", error);
      return this.raiseServerError(res, 500, error.message, "something went wrong");
    }
  };

  createCarePlanMedication = async (req, res) => {
    try {
      const { body, userDetails, params: { patient_id,carePlanId:care_plan_id=0 } = {} } = req;

      console.log("medicineDetails **********--------> ",care_plan_id,typeof(care_plan_id));
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
        critical = false
      } = body;
      const { userId, userData: { category } = {} } = userDetails || {};

      const medicineDetails = await medicineService.getMedicineById(medicine_id);


      const medicineApiWrapper = await MedicineWrapper(medicineDetails);

      const dataToSave = {
        participant_id: patient_id, // todo: patient_id
        organizer_type: category,
        organizer_id: userId,
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
          medication_stage,
          critical
        }
      };

      const mReminderDetails = await medicationReminderService.addMReminder(
        dataToSave
      );

      const data_to_create = {
        care_plan_id:parseInt(care_plan_id),
        medication_id: mReminderDetails.get('id')
    }

    let newMedication = await carePlanMedicationService.addCarePlanMedication(data_to_create);



    let carePlan= await carePlanService.getCarePlanById(care_plan_id);

    let carePlanAppointmentIds= await getCarePlanAppointmentIds(care_plan_id);
    let carePlanMedicationIds = await getCarePlanMedicationIds(care_plan_id);
    let carePlanSeverityDetails = await getCarePlanSeverityDetails(care_plan_id);
    const carePlanApiWrapper = await CarePlanWrapper(carePlan);
    let carePlanApiData = {};

    carePlanApiData[
      carePlanApiWrapper.getCarePlanId()
    ] = {...carePlanApiWrapper.getBasicInfo(),...carePlanSeverityDetails,medication_ids:carePlanMedicationIds,appointment_ids:carePlanAppointmentIds};


      // const eventScheduleData = {
      //   event_type: EVENT_TYPE.MEDICATION_REMINDER,
      //   event_id: mReminderDetails.id,
      //   data: mReminderDetails.getBasicInfo,
      //   status: EVENT_STATUS.PENDING,
      //   start_time,
      //   end_time: start_time
      // };

      EventSchedule.create({
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: mReminderDetails.getId,
        details: mReminderDetails.getBasicInfo.details,
        status: EVENT_STATUS.SCHEDULED,
        start_date,
        end_date,
        when_to_take
      });

      return this.raiseSuccess(
        res,
        200,
        {
          care_plans: {...carePlanApiData},
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
      console.log("Add m-reminder error ----> ", error);
      return this.raiseServerError(res, 500, error.message, "something went wrong");
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
        medication_stage = "",
        description,
        start_time,
        participant_id,
          critical = false
      } = body;
      const { userId, userData: { category } = {} } = userDetails || {};

      const medicineDetails = await medicineService.getMedicineById(medicine_id);

      // Logger.debug("medicineDetails --> ", medicineDetails);

      const medicineApiWrapper = await MedicineWrapper(medicineDetails);

      const dataToSave = {
        participant_id, // todo: patient_id
        organizer_type: category,
        organizer_id: userId,
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
          medication_stage,
          critical
        }
      };

      const mReminderDetails = await medicationReminderService.updateMedication(
        dataToSave,
        id
      );


      const updatedMedicationDetails = await medicationReminderService.getMedication({ participant_id });

      // Logger.debug("updatedMedicationDetails --> ", updatedMedicationDetails);

      const medicationApiDetails = await MedicationWrapper(updatedMedicationDetails);

      // const eventScheduleData = {
      //   event_type: EVENT_TYPE.MEDICATION_REMINDER,
      //   event_id: mReminderDetails.id,
      //   data: mReminderDetails.getBasicInfo,
      //   status: EVENT_STATUS.PENDING,
      //   start_time,
      //   end_time: start_time
      // };

      return this.raiseSuccess(
        res,
        200,
        {
          medications: {
            [medicationApiDetails.getMReminderId()]: {
              ...medicationApiDetails.getBasicInfo()
            }
          },
          medicines: {
            [medicineApiWrapper.getMedicineId()]: {
              ...medicineApiWrapper.getBasicInfo()
            }
          }
        },
        "medication reminder updated successfully"
      );

      // await Proxy_Sdk.scheduleEvent({data: eventScheduleData});
    } catch (error) {
      console.log("update m-reminder error ----> ", error);
      return this.raiseServerError(res, 500, error.message, "something went wrong");
    }
  };

  getMedicationDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      // Logger.debug("test", medicationReminderDetails);
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

      const medicationDetails = await medicationReminderService.getMedicationsForParticipant({ participant_id: id });

      // console.log("712367132 medicationDetails --> ", medicationDetails);
      // Logger.debug("medication details", medicationDetails);

      let medicationApiData = {};

      // await medicationDetails.forEach(async medication => {
        for(let medication of medicationDetails){
        const medicationWrapper = await MedicationWrapper(medication);
        medicationApiData[medicationWrapper.getMReminderId()] = medicationWrapper.getBasicInfo();
      // });
        }

      return raiseSuccess(
        res,
        200,
        {
          medications: {
            ...medicationApiData
          }
        },
        "medications fetched successfully"
      );
    } catch (error) {
      return raiseServerError(res);
    }
  };

  delete = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;

      const carePlanMedicationDetails= await carePlanMedicationService.deleteCarePlanMedicationByMedicationId(id);

      const medicationDetails = await medicationReminderService.deleteMedication(id);

      // console.log("712367132 medicationDetails --> ", medicationDetails);
      // Logger.debug("medication details", medicationDetails);

      return raiseSuccess(
        res,
        200,
        {},
        "medication deleted successfully"
      );
    } catch (error) {
      return raiseServerError(res);
    }
  };
}

export default new MReminderController();